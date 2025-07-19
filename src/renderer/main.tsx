import * as Blockly from 'blockly/core';
import * as Ja from 'blockly/msg/ja';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

import 'blockly/blocks';

import './main.css';

Blockly.setLocale(Ja.default ?? Ja);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
