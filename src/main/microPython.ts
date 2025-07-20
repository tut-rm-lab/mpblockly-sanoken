import { setTimeout } from 'node:timers/promises';
import { SerialPort } from 'serialport';

export class MicroPython {
  #port: SerialPort | null = null;

  async connect() {
    for (const { vendorId, productId, path } of await SerialPort.list()) {
      if (vendorId != null && productId != null) {
        this.#port = new SerialPort({ path, baudRate: 115200 });
        return;
      }
    }
    throw new Error('no device found');
  }

  disconnect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.#getPort().close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  async enterRawRepl(): Promise<void> {
    await this.#write(Buffer.from([0x0d, 0x03]));
    await this.#flush();
    await this.#write(Buffer.from([0x0d, 0x01]));
    await this.#readUntil(Buffer.from('raw REPL; CTRL-B to exit\r\n>', 'utf8'));
    await this.#write(Buffer.from([0x04]));
    await this.#readUntil(Buffer.from('soft reboot\r\n', 'utf8'));
    await this.#readUntil(Buffer.from('raw REPL; CTRL-B to exit\r\n>', 'utf8'));
  }

  async exec(command: string): Promise<string> {
    {
      await this.#write(Buffer.from([0x05, 0x41, 0x01]));
      const data = await this.#read(2);
      if (!data.equals(Buffer.from([0x52, 0x01]))) {
        throw new Error('could not enter raw repl');
      }
    }

    {
      const commandBytes = Buffer.from(command);
      const data = await this.#read(2);
      const windowSize = data.readUInt16LE();
      let windowRemain = windowSize;
      let i = 0;

      while (i < commandBytes.length) {
        while (windowRemain === 0 || this.#getPort().readableLength) {
          const data = await this.#read(1);
          if (data[0] === 0x01) {
            windowRemain += windowSize;
          } else if (data[0] === 0x04) {
            await this.#write(Buffer.from([0x04]));
          } else {
            throw new Error(`unexpected read during raw paste: ${data}`);
          }
        }

        const b = commandBytes.subarray(
          i,
          Math.min(i + windowRemain, commandBytes.length),
        );
        await this.#write(b);
        windowRemain -= b.length;
        i += b.length;
      }

      await this.#write(Buffer.from([0x04]));
      await this.#readUntil(Buffer.from([0x04]));
    }

    {
      const data = await this.#readUntil(Buffer.from([0x04]));
      const dataStr = data.subarray(0, data.length - 1).toString('utf8');
      const dataErr = await this.#readUntil(Buffer.from([0x04]));
      const dataErrStr = dataErr
        .subarray(0, dataErr.length - 1)
        .toString('utf8');
      if (dataErrStr) {
        throw new Error(dataErrStr);
      }
      return dataStr;
    }
  }

  async #read(size: number, timeout = 10000): Promise<Buffer> {
    const data = [];
    const start = performance.now();

    while (true) {
      if (data.length === size) {
        return Buffer.concat(data);
      }
      const newData = this.#getPort().read(1);
      if (newData instanceof Buffer) {
        data.push(newData);
      } else {
        if (performance.now() - start > timeout) {
          throw new Error('timeout');
        }
        await setTimeout(10);
      }
    }
  }

  async #readUntil(ending: Buffer, timeout = 10000): Promise<Buffer> {
    const data = [];
    const start = performance.now();

    while (true) {
      const buf = Buffer.concat(data);
      if (buf.subarray(buf.length - ending.length).equals(ending)) {
        return buf;
      }
      const newData = this.#getPort().read(1);
      if (newData instanceof Buffer) {
        data.push(newData);
      } else {
        if (performance.now() - start > timeout) {
          throw new Error('timeout');
        }
        await setTimeout(10);
      }
    }
  }

  async #write(data: Buffer): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.#getPort().write(data, 'utf8', (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    await new Promise<void>((resolve, reject) => {
      this.#getPort().drain((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  #flush(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.#getPort().flush((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  #getPort(): SerialPort {
    if (!this.#port) {
      throw new Error('not connected');
    }
    return this.#port;
  }
}

export async function writeFileToMicroPython(dest: string, data: string) {
  const microPython = new MicroPython();
  await microPython.connect();
  await microPython.enterRawRepl();

  await microPython.exec(
    `import json
f=open('${dest}','wb')
f.write(json.loads(r'${JSON.stringify(data)}'))
f.close()`,
  );

  await microPython.disconnect();
}

export async function resetMicroPython() {
  const microPython = new MicroPython();
  await microPython.connect();
  await microPython.enterRawRepl();
  microPython
    .exec(
      `import machine
machine.reset()`,
    )
    .catch(() => {});
}
