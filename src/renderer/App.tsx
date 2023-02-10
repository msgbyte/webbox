import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Allotment } from 'allotment';
import { SideTree } from './components/SideTree';
import { WebContent } from './components/WebContent';

function Main() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Allotment>
        <Allotment.Pane preferredSize={240} minSize={240}>
          <SideTree />
        </Allotment.Pane>

        <Allotment.Pane>
          <WebContent />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
