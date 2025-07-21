import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { defineBlock, defineCategory } from '../utils';

console.log(Blockly.Themes.Classic);

const definePin = defineBlock({ type: 'mpblockly_define_pin' }, (type) => {
  Blockly.defineBlocksWithJsonArray([
    {
      type,
      message0: 'ピンID %1 に %2 という名前をつける',
      args0: [
        {
          type: 'field_input',
          name: 'ID',
          text: '"LED"',
        },
        {
          type: 'field_input',
          name: 'NAME',
          text: 'led',
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 225,
    },
  ]);

  pythonGenerator.forBlock[type] = (block, generator) => {
    const id = block.getFieldValue('ID');
    const name = block.getFieldValue('NAME');

    generator.provideFunction_(
      'mpblockly_import_pin',
      'from machine import Pin',
    );

    return `${name} = Pin(${id}, Pin.OUT)`;
  };
});

export const categoryPin = defineCategory({ name: 'ピン' }, [definePin]);
