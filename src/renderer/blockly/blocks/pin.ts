import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { defineBlock, defineCategory } from '../utils';

const definePin = defineBlock({ type: 'mpblockly_define_pin' }, (type) => {
  Blockly.defineBlocksWithJsonArray([
    {
      type,
      message0: 'ピンID %1 に %2 という名前をつける',
      args0: [
        {
          type: 'input_value',
          name: 'ID',
          check: ['Number', 'String'],
        },
        {
          type: 'field_input',
          name: 'NAME',
          text: 'led',
        },
      ],
      previousStatement: null,
      nextStatement: null,
    },
  ]);

  pythonGenerator.forBlock[type] = (block, generator) => {
    const id = generator.valueToCode(block, 'ID', Order.ATOMIC);
    const name = block.getFieldValue('NAME');

    generator.provideFunction_(
      'mpblockly_import_pin',
      'from machine import Pin',
    );

    return `${name} = Pin(${id}, Pin.OUT)\n`;
  };
});

const setValuePin = defineBlock({ type: 'mpblockly_set_value_pin' }, (type) => {
  Blockly.defineBlocksWithJsonArray([
    {
      type,
      message0: 'ピン %1 を %2 に',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'led',
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
    },
  ]);

  pythonGenerator.forBlock[type] = (block) => {
    const name = block.getFieldValue('NAME');
    const value = block.getFieldValue('VALUE');

    return `${name}.value(${value === 'ON' ? 'True' : 'False'})\n`;
  };
});

export default defineCategory({ name: 'ピン' }, [definePin, setValuePin]);
