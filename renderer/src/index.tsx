import { App } from '@mpblockly/app';
import { createRoot } from 'react-dom/client';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './style.css';

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
