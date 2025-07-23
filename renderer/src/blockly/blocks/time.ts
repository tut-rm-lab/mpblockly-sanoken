import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { defineBlock, defineCategory } from '../utils';

const timeSleep = defineBlock({ type: 'mpblockly_time_sleep' }, (type) => {
  Blockly.defineBlocksWithJsonArray([
    {
      type,
      message0: '%1 秒待機する',
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
      colour: 165,
    },
  ]);

  pythonGenerator.forBlock[type] = (block, generator) => {
    const seconds = block.getFieldValue('SECONDS');

    generator.provideFunction_('mpblockly_import_time', 'import time');

    return `time.sleep(${seconds})\n`;
  };
});

export default defineCategory({ name: '時刻' }, [timeSleep]);
