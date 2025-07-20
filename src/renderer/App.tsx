import toolbox from './blockly';
import { BlocklyEditor } from './components/BlocklyEditor';
import { Header } from './components/Header';

export function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100dvw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <Header />
      <div style={{ flex: 1 }}>
        <BlocklyEditor options={{ toolbox }} />
      </div>
    </div>
  );
}
