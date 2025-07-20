import type * as Blockly from 'blockly/core';
import { createContext } from 'react';

export const BlocklyWorkspaceContext =
  createContext<Blockly.WorkspaceSvg | null>(null);
