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
            message0: '%1 のエンコーダの角度を読み取る',
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


export default defineCategory({ name: 'モーター' }, [readEncoderDegree]);
