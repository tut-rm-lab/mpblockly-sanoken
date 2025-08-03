import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { defineBlock, defineCategory } from '../../utils.js';

type GrovePortKey = 'Grove1' | 'Grove2' | 'Grove3';
type GrovePort = { i2c: string; sda: string; scl: string; adc: string };
type GrovePorts = Record<GrovePortKey, GrovePort>;

const grovePorts: GrovePorts = {
    Grove1: {
        i2c: "1",
        sda: "14",
        scl: "15",
        adc: "26"
    },
    Grove2: {
        i2c: "1",
        sda: "10",
        scl: "11",
        adc: "27"
    },
    Grove3: {
        i2c: "1",
        sda: "18",
        scl: "19",
        adc: "28"
    }
};

const readToFSensorMillimeters = defineBlock({ type: 'mpblockly_read_tof_sensor' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '%1 の距離センサの値をミリメートルの単位で読み取る',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'GROVE_PORT',
                    options: [
                        ['Grove1', 'Grove1'],
                        ['Grove2', 'Grove2'],
                        ['Grove3', 'Grove3'],
                    ],
                },
            ],
            output: 'Number',
            colour: 15,
        },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
        const port = block.getFieldValue('GROVE_PORT');
        const grovePort = grovePorts[port as GrovePortKey];
        const sda = grovePort.sda;
        const scl = grovePort.scl;
        const adc = grovePort.adc;
        const i2c = grovePort.i2c;

        generator.provideFunction_('mpblockly_import_i2c', 'from machine import Pin, I2C',);
        generator.provideFunction_('mpblockly_import_vl53l0x', 'from vl53l0x_safe import VL53L0X_safe');
        generator.provideFunction_('mpblockly_i2c_instance', `i2c = I2C(${i2c}, sda=Pin(${sda}), scl=Pin(${scl}))`);
        generator.provideFunction_('mpblockly_i2c_short_pin', `i2c_short_pin = Pin(${adc}, Pin.IN)`);
        generator.provideFunction_('mpblockly_vl53l0x_instance', `vl53 = VL53L0X_safe(i2c)`);
        const code = `vl53.read()`;
        return [code, Order.FUNCTION_CALL];
    };
});

export default defineCategory({ name: 'センサ' }, [readToFSensorMillimeters]);
