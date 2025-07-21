import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import {
  defineBlock,
  defineButton,
  defineCategory,
  defineDynamicCategory,
} from '../utils';

const pinCreate = defineButton(
  { text: 'ピン変数の作成…', callbackkey: 'mpblockly_pin_create' },
  (button) => {
    Blockly.Variables.createVariableButtonHandler(
      button.getTargetWorkspace(),
      undefined,
      'MpblocklyPin',
    );
  },
);

const pinSet = defineBlock(
  {
    type: 'mpblockly_pin_set',
    inputs: {
      ID: {
        shadow: {
          type: 'text',
          fields: {
            TEXT: 'LED',
          },
        },
      },
    },
  },
  (type) => {
    Blockly.defineBlocksWithJsonArray([
      {
        type,
        message0: 'ピン %1 に ID %2 を割り当てる',
        args0: [
          {
            type: 'field_variable',
            name: 'PIN',
            variable: 'led',
            variableTypes: ['MpblocklyPin'],
            defaultType: 'MpblocklyPin',
          },
          {
            type: 'input_value',
            name: 'ID',
            check: ['Number', 'String'],
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 15,
      },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
      const pin = generator.getVariableName(block.getFieldValue('PIN'));
      const id = generator.valueToCode(block, 'ID', Order.ATOMIC);

      generator.provideFunction_(
        'mpblockly_import_pin',
        'from machine import Pin',
      );

      return `${pin} = Pin(${id}, Pin.OUT)\n`;
    };
  },
);

const pinSetValue = defineBlock({ type: 'mpblockly_pin_set_value' }, (type) => {
  Blockly.defineBlocksWithJsonArray([
    {
      type,
      message0: 'ピン %1 を %2 に',
      args0: [
        {
          type: 'field_variable',
          name: 'PIN',
          variable: 'led',
          variableTypes: ['MpblocklyPin'],
          defaultType: 'MpblocklyPin',
        },
        {
          type: 'field_dropdown',
          name: 'VALUE',
          options: [
            ['オン', 'ON'],
            ['オフ', 'OFF'],
          ],
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 15,
    },
  ]);

  pythonGenerator.forBlock[type] = (block, generator) => {
    const pin = generator.getVariableName(block.getFieldValue('PIN'));
    const value = block.getFieldValue('VALUE');

    return `${pin}.value(${value === 'ON' ? 'True' : 'False'})\n`;
  };
});

export default defineCategory({ name: 'ピン' }, [
  pinCreate,
  pinSet,
  pinSetValue,
]);
