import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { CreateSurvey } from './pages/CreateSurvey'
import { SurveyPreview } from './pages/SurveyPreview'
import { SurveyResults } from './pages/SurveyResults'
import { TakeSurvey } from './pages/TakeSurvey'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateSurvey />} />
            <Route path="/edit/:id" element={<CreateSurvey />} />
            <Route path="/preview/:id" element={<SurveyPreview />} />
            <Route path="/results/:id" element={<SurveyResults />} />
            <Route path="/s/:id" element={<TakeSurvey />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App