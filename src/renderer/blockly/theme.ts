import * as Blockly from 'blockly/core';
import { defineTheme } from './utils';

export default defineTheme({
  name: 'mpblockly',
  base: Blockly.Themes.Classic,
  blockStyles: {
    logic_blocks: {
      colourPrimary: '#4a148c',
    },
  },
});
