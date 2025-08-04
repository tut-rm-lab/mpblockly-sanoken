import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { defineBlock, defineCategory } from '../utils.js';

const timeSleep = defineBlock({
  type: 'mpblockly_time_sleep',
  inputs: {
    SECOND: {
      shadow: {
        type: 'math_number',
        fields: {
          NUM: 1,
        },
      },
    },
  },
}, (type) => {
  Blockly.defineBlocksWithJsonArray([
    {
      type,
      message0: '%1 秒待機',
      args0: [
        {
          type: 'input_value',
          name: 'SECOND',
          check: 'Number',
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 165,
    },
  ]);

  pythonGenerator.forBlock[type] = (block, generator) => {
    const seconds = generator.valueToCode(block, 'SECOND', Order.ATOMIC);
    generator.provideFunction_('mpblockly_import_time', 'import time');
    return `time.sleep(${seconds})\n`;
  };
});

const timeSleepMs = defineBlock(
  {
    type: 'mpblockly_time_sleep_ms',
    inputs: {
      MILLIS: {
        shadow: {
          type: 'math_number',
          fields: {
            NUM: 1000,
          },
        },
      },
    },
  },
  (type) => {
    Blockly.defineBlocksWithJsonArray([
      {
        type,
        message0: '%1 ミリ秒待機',
        args0: [
          {
            type: 'input_value',
            name: 'MILLIS',
            check: 'Number',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 165,
      },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
      const ms = generator.valueToCode(block, 'MILLIS', Order.ATOMIC);
      generator.provideFunction_('mpblockly_import_time', 'import time');
      return `time.sleep_ms(${ms})\n`;
    };
  });

const timeSleepUs = defineBlock(
  {
    type: 'mpblockly_time_sleep_us',
    inputs: {
      MICRO: {
        shadow: {
          type: 'math_number',
          fields: {
            NUM: 1000,
          },
        },
      },
    },
  },
  (type) => {
    Blockly.defineBlocksWithJsonArray([
      {
        type,
        message0: '%1 マイクロ秒待機',
        args0: [
          {
            type: 'input_value',
            name: 'MICRO',
            check: 'Number',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 165,
      },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
      const us = generator.valueToCode(block, 'MICRO', Order.ATOMIC);
      generator.provideFunction_('mpblockly_import_time', 'import time');
      return `time.sleep_us(${us})\n`;
    };
  });

export default defineCategory({ name: '時刻' }, [timeSleep, timeSleepMs, timeSleepUs]);
