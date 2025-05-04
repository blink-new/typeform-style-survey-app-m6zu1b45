import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { SurveyEditor } from './pages/SurveyEditor';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<SurveyEditor />} />
            <Route path="/edit/:id" element={<SurveyEditor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;