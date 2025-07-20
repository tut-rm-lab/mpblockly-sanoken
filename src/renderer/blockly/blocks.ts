import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { block } from './utils';

export const toggleLed = block({ type: 'toggle_led' }, (type) => {
  Blockly.defineBlocksWithJsonArray([
    {
      type,
      message0: 'LEDをトグルする',
      previousStatement: null,
      nextStatement: null,
    },
  ]);
  pythonGenerator.forBlock[type] = (_block, generator) => {
    generator.provideFunction_('import_pin', 'from machine import Pin');
    generator.provideFunction_('define_led', 'led = Pin("LED", Pin.OUT)');
    return 'led.toggle()\n';
  };
});

export const sleepSeconds = block({ type: 'sleep_seconds' }, (type) => {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'sleep_seconds',
      message0: '%1 秒待つ',
      args0: [
        {
          type: 'field_number',
          name: 'SECONDS',
          value: 1,
          min: 0,
        },
      ],
      previousStatement: null,
      nextStatement: null,
    },
  ]);
  pythonGenerator.forBlock[type] = (block, generator) => {
    generator.provideFunction_('import_time', 'import time');
    const seconds = block.getFieldValue('SECONDS');
    return `time.sleep(${seconds})\n`;
  };
});
