import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { defineBlock, defineCategory } from '../../utils.js';

type GrovePortKey = 'Grove1' | 'Grove2' | 'Grove3';
type GrovePort = { i2c: string; sda: string; scl: string; adc: string };
type GrovePorts = Record<GrovePortKey, GrovePort>;

type TRSPortKey = 'TRS1' | 'TRS2';
type TRSPort = { digital: string };
type TRSPorts = Record<TRSPortKey, TRSPort>;

const trsPorts: TRSPorts = {
    TRS1: {
        digital: "1"
    },
    TRS2: {
        digital: "0"
    }
};

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

const readLimitSwitch = defineBlock({ type: 'mpblockly_read_limit_switch' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '%1 のリミットスイッチの状態を読み取る',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'TRS_PORT',
                    options: [
                        ['TRS1', 'TRS1'],
                        ['TRS2', 'TRS2'],
                    ],
                },
            ],
            output: 'Boolean',
            colour: 15,
            tooltip: 'リミットスイッチが押されている時に真を返します。',
        },
    ]);
    pythonGenerator.forBlock[type] = (block, generator) => {
        const port = block.getFieldValue('TRS_PORT');
        const trsPort = trsPorts[port as TRSPortKey];
        const digital = trsPort.digital;

        generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin');
        generator.provideFunction_(`mpblockly_${port}_digital_input_instance`, `${port}_digital_input = Pin(${digital}, Pin.IN, Pin.PULL_UP)`);
        const code = `not ${port}_digital_input.value()`;
        return [code, Order.FUNCTION_CALL];
    };
});

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

        generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin');
        generator.provideFunction_('mpblockly_import_i2c', 'from machine import I2C',);
        generator.provideFunction_('mpblockly_import_vl53l0x', 'from vl53l0x_safe import VL53L0X_safe');
        generator.provideFunction_(`mpblockly_${port}_i2c_instance`, `${port}_i2c = I2C(${i2c}, sda=Pin(${sda}), scl=Pin(${scl}))`);
        generator.provideFunction_(`mpblockly_${port}_i2c_short_pin`, `${port}_i2c_short_pin = Pin(${adc}, Pin.IN)`);
        generator.provideFunction_(`mpblockly_${port}_vl53l0x_instance`, `${port}_vl53 = VL53L0X_safe(${port}_i2c)`);
        const code = `${port}_vl53.read()`;
        return [code, Order.FUNCTION_CALL];
    };
});

const readReflectiveSensorADC = defineBlock({ type: 'mpblockly_read_reflective_sensor_adc' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '%1 のラインセンサのADC値を読み取る',
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
            tooltip: 'ラインセンサのADC値を10bit範囲(0-1023)で返します。',
        },
    ]);
    pythonGenerator.forBlock[type] = (block, generator) => {
        const port = block.getFieldValue('GROVE_PORT');
        const grovePort = grovePorts[port as GrovePortKey];
        const sda = grovePort.sda;
        const scl = grovePort.scl;
        const adc = grovePort.adc;
        const i2c = grovePort.i2c;

        generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin');
        generator.provideFunction_('mpblockly_import_adc', 'from machine import ADC');
        generator.provideFunction_(`mpblockly_${port}_adc_instance`, `${port}_adc = ADC(Pin(${adc}))`);
        generator.provideFunction_(`mpblockly_${port}_adc_short_pin`, `${port}_short_pin = Pin(${scl}, Pin.IN)`);
        const code = `${port}_adc.read_u16() >> 6`;
        return [code, Order.FUNCTION_CALL];
    };
});

const readReflectiveSensorDigital = defineBlock({ type: 'mpblockly_read_reflective_sensor_digital' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '%1 のラインセンサのデジタル値を読み取る',
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
            output: 'Boolean',
            colour: 15,
            tooltip: 'センサのLEDが点灯時に真を返します。',
        },
    ]);
    pythonGenerator.forBlock[type] = (block, generator) => {
        const port = block.getFieldValue('GROVE_PORT');
        const grovePort = grovePorts[port as GrovePortKey];
        const sda = grovePort.sda;
        const scl = grovePort.scl;
        const adc = grovePort.adc;
        const i2c = grovePort.i2c;

        generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin');
        generator.provideFunction_(`mpblockly_${port}_digital_input_instance`, `${port}_digital_input = Pin(${sda}, Pin.IN, Pin.PULL_UP)`);
        const code = `not ${port}_digital_input.value()`;
        return [code, Order.FUNCTION_CALL];
    };
});

export default defineCategory({ name: 'センサ' }, [readLimitSwitch, readToFSensorMillimeters, readReflectiveSensorADC, readReflectiveSensorDigital]);
