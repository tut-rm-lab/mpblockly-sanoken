import type * as Blockly from 'blockly/core';
import { atom } from 'jotai';

export const blocklyWorkspaceAtom = atom<Blockly.Workspace>();
