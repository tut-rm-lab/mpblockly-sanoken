import type * as Blockly from 'blockly/core';
import { atom } from 'jotai';

export const blocklyWorkspaceAtom = atom<Blockly.Workspace>();

export const blocklyCodeAtom = atom('');

export const tabIndexAtom = atom(0);
