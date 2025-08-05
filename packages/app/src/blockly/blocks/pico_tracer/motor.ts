import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { defineBlock, defineCategory } from '../../utils.js';

type MotorPortKey = 'Motor1' | 'Motor2' | 'Motor3' | 'Motor4';
type MotorPort = { pin_A: string; pin_B: string; };
type MotorPorts = Record<MotorPortKey, MotorPort>;

const motorPorts: MotorPorts = {
    Motor1: { pin_A: "2", pin_B: "3" },
    Motor2: { pin_A: "4", pin_B: "5" },
    Motor3: { pin_A: "20", pin_B: "21" },
    Motor4: { pin_A: "6", pin_B: "7" }
};

const readEncoderDegree = defineBlock({ type: 'mpblockly_read_encoder_degree' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '%1 のエンコーダ角度(Degree)',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'MOTOR_PORT',
                    options: [
                        ['Motor1', 'Motor1'],
                        ['Motor2', 'Motor2'],
                        ['Motor3', 'Motor3'],
                        ['Motor4', 'Motor4'],
                    ],
                },
            ],
            output: 'Number',
            colour: 15,
            tooltip: '時計回りが正の角度、反時計回りが負の角度として、プログラム開始時を0度としたエンコーダの角度を返します。(分解能0.5度)',
        },
    ]);
    pythonGenerator.forBlock[type] = (block, generator) => {
        const port = block.getFieldValue('MOTOR_PORT');
        const motorPort = motorPorts[port as MotorPortKey];
        const pin_A = motorPort.pin_A;
        const pin_B = motorPort.pin_B;

        generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin');
        generator.provideFunction_('mpblockly_import_encoder', 'from encoder import Encoder\nfrom encoder_helper import EncoderHelper');
        generator.provideFunction_(`mpblockly_${port}_encoder_instance`, `${port}_encoder = EncoderHelper(Encoder(sm_id=0, pin_a=Pin(${pin_A}), pin_b=Pin(${pin_B}), ppr=180))`);
        const code = `${port}_encoder.get_angle()`;
        return [code, Order.FUNCTION_CALL];
    };
});

const readMotorCurrent = defineBlock({ type: 'mpblockly_read_motor_current' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '%1 の電流(mA)',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'MOTOR_PORT',
                    options: [
                        ['Motor1', '0'],
                        ['Motor2', '1'],
                        ['Motor3', '2'],
                        ['Motor4', '3'],
                    ],
                },
            ],
            output: 'Number',
            colour: 15,
            tooltip: 'モーターの電流を返します。(絶対値)',
        },
    ]);
    pythonGenerator.forBlock[type] = (block, generator) => {
        const port = block.getFieldValue('MOTOR_PORT');

        generator.provideFunction_('mpblockly_import_thread', 'import _thread');
        generator.provideFunction_('mpblockly_import_motor_control', 'import motor_control');
        generator.provideFunction_(`mpblockly_motor_instance`, `_thread.start_new_thread(motor_control.uart_worker, ())`);
        const code = `motor_control.get_motor_current(${port})`;
        return [code, Order.FUNCTION_CALL];
    };
});

const setMotorPower = defineBlock({
    type: 'mpblockly_set_motor_power',
    inputs: {
        POWER: {
            shadow: {
                type: 'math_number',
                fields: {
                    NUM: 0,
                },
            },
        },
    }
}, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '%1 の出力を %2 %に設定',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'MOTOR_PORT',
                    options: [
                        ['Motor1', '0'],
                        ['Motor2', '1'],
                        ['Motor3', '2'],
                        ['Motor4', '3'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'POWER',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 15,
            tooltip: '時計回りが正 -100%から100%',
        },
    ]);
    pythonGenerator.forBlock[type] = (block, generator) => {
        const port = block.getFieldValue('MOTOR_PORT');
        const power = generator.valueToCode(block, 'POWER', Order.ATOMIC);

        generator.provideFunction_('mpblockly_import_thread', 'import _thread');
        generator.provideFunction_('mpblockly_import_motor_control', 'import motor_control');
        generator.provideFunction_(`mpblockly_motor_instance`, `_thread.start_new_thread(motor_control.uart_worker, ())`);
        return `motor_control.set_motor_command(${port}, ${power}, False)\n`;
    };
});

const setMotorBrake = defineBlock({ type: 'mpblockly_set_motor_brake' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '%1 をブレーキ',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'MOTOR_PORT',
                    options: [
                        ['Motor1', '0'],
                        ['Motor2', '1'],
                        ['Motor3', '2'],
                        ['Motor4', '3'],
                    ],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 15,
            tooltip: '指定したモーターにブレーキをかけます。',
        },
    ]);
    pythonGenerator.forBlock[type] = (block, generator) => {
        const port = block.getFieldValue('MOTOR_PORT');

        generator.provideFunction_('mpblockly_import_thread', 'import _thread');
        generator.provideFunction_('mpblockly_import_motor_control', 'import motor_control');
        generator.provideFunction_(`mpblockly_motor_instance`, `_thread.start_new_thread(motor_control.uart_worker, ())`);
        return `motor_control.set_motor_command(${port}, 0, False)\n`;
    };
});

const setMotorCoast = defineBlock({ type: 'mpblockly_set_motor_coast' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '%1 をフリーにする',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'MOTOR_PORT',
                    options: [
                        ['Motor1', '0'],
                        ['Motor2', '1'],
                        ['Motor3', '2'],
                        ['Motor4', '3'],
                    ],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 15,
            tooltip: '指定したモーターの電源を切り、フリーにします。',
        },
    ]);
    pythonGenerator.forBlock[type] = (block, generator) => {
        const port = block.getFieldValue('MOTOR_PORT');

        generator.provideFunction_('mpblockly_import_thread', 'import _thread');
        generator.provideFunction_('mpblockly_import_motor_control', 'import motor_control');
        generator.provideFunction_(`mpblockly_motor_instance`, `_thread.start_new_thread(motor_control.uart_worker, ())`);
        return `motor_control.set_motor_command(${port}, 0, True)\n`;
    };
});


export default defineCategory({ name: 'モーター' }, [readEncoderDegree, readMotorCurrent, setMotorPower, setMotorBrake, setMotorCoast]);
