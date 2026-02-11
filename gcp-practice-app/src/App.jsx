import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import DayAsList from './pages/DayAsList'
import DayAsScenario from './pages/DayAsScenario'
import ChallengesList from './pages/ChallengesList'
import ChallengeDetail from './pages/ChallengeDetail'
import ArchitectureCanvas from './pages/ArchitectureCanvas'

export default function App() {
  return (
    <div className="min-h-screen bg-gcp-darker">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/day-as" element={<DayAsList />} />
        <Route path="/day-as/:scenarioId" element={<DayAsScenario />} />
        <Route path="/challenges" element={<ChallengesList />} />
        <Route path="/challenges/:challengeId" element={<ChallengeDetail />} />
        <Route path="/canvas" element={<ArchitectureCanvas />} />
      </Routes>
    </div>
  )
}
