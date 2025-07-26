import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { defineBlock, defineButton, defineCategory } from '../utils.js';

const pwmCreate = defineButton(
  { text: 'PWM変数の作成…', callbackkey: 'mpblockly_pwm_create' },
  (button) => {
    Blockly.Variables.createVariableButtonHandler(
      button.getTargetWorkspace(),
      undefined,
      'MpblocklyPwm',
    );
  },
);

const pwmSet = defineBlock(
  {
    type: 'mpblockly_pwm_set',
  },
  (type) => {
    Blockly.defineBlocksWithJsonArray([
      {
        type,
        message0: '%1 HzのPWM %2 をピン %3 に割り当てる',
        args0: [
          {
            type: 'field_number',
            name: 'FREQ',
            value: 1000,
            min: 0,
            precision: 1,
          },
          {
            type: 'field_variable',
            name: 'PWM',
            variable: 'pwm',
            variableTypes: ['MpblocklyPwm'],
            defaultType: 'MpblocklyPwm',
          },
          {
            type: 'field_variable',
            name: 'PIN',
            variable: 'led',
            variableTypes: ['MpblocklyPin'],
            defaultType: 'MpblocklyPin',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 330,
      },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
      const pwm = generator.getVariableName(block.getFieldValue('PWM'));
      const pin = generator.getVariableName(block.getFieldValue('PIN'));
      const freq = block.getFieldValue('FREQ');

      generator.provideFunction_(
        'mpblockly_import_pwm',
        'from machine import PWM',
      );

      return `${pwm} = PWM(${pin}, freq=${freq})\n`;
    };
  },
);

const pwmSetDuty = defineBlock(
  {
    type: 'mpblockly_pwm_set_duty',
    inputs: {
      DUTY: {
        shadow: {
          type: 'math_number',
          fields: {
            NUM: 65535,
          },
        },
      },
    },
  },
  (type) => {
    Blockly.defineBlocksWithJsonArray([
      {
        type,
        message0: 'PWM %1 のデューティ比を %2 に',
        args0: [
          {
            type: 'field_variable',
            name: 'PWM',
            variable: 'pwm',
            variableTypes: ['MpblocklyPwm'],
            defaultType: 'MpblocklyPwm',
          },
          {
            type: 'input_value',
            name: 'DUTY',
            check: 'Number',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 330,
      },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
      const pwm = generator.getVariableName(block.getFieldValue('PWM'));
      const duty = generator.valueToCode(block, 'DUTY', Order.ATOMIC);

      return `${pwm}.duty_u16(int(${duty}))\n`;
    };
  },
);

export default defineCategory({ name: 'PWM' }, [pwmCreate, pwmSet, pwmSetDuty]);
