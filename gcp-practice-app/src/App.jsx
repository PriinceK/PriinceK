import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import DayAsList from './pages/DayAsList'
import DayAsScenario from './pages/DayAsScenario'
import ChallengesList from './pages/ChallengesList'
import ChallengeDetail from './pages/ChallengeDetail'
import ArchitectureCanvas from './pages/ArchitectureCanvas'
import KnowledgeMap from './pages/KnowledgeMap'
import ServiceCatalog from './pages/ServiceCatalog'
import ServiceDetail from './pages/ServiceDetail'
import ReviewDashboard from './pages/ReviewDashboard'
import ReviewSession from './pages/ReviewSession'
import ExamSetup from './pages/ExamSetup'
import ExamSession from './pages/ExamSession'
import ExamResults from './pages/ExamResults'
import CompareServices from './pages/CompareServices'
import ComparisonDetail from './pages/ComparisonDetail'
import CostLabsList from './pages/CostLabsList'
import CostLabDetail from './pages/CostLabDetail'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-nebula-deep relative">
      <div className="mesh-bg" />
      <div className="relative z-10">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="/day-as" element={<AnimatedPage><DayAsList /></AnimatedPage>} />
            <Route path="/day-as/:scenarioId" element={<AnimatedPage><DayAsScenario /></AnimatedPage>} />
            <Route path="/challenges" element={<AnimatedPage><ChallengesList /></AnimatedPage>} />
            <Route path="/challenges/:challengeId" element={<AnimatedPage><ChallengeDetail /></AnimatedPage>} />
            <Route path="/canvas" element={<ArchitectureCanvas />} />
            <Route path="/knowledge-map" element={<AnimatedPage><KnowledgeMap /></AnimatedPage>} />
            <Route path="/services" element={<AnimatedPage><ServiceCatalog /></AnimatedPage>} />
            <Route path="/services/:serviceId" element={<AnimatedPage><ServiceDetail /></AnimatedPage>} />
            <Route path="/review" element={<AnimatedPage><ReviewDashboard /></AnimatedPage>} />
            <Route path="/review/session" element={<AnimatedPage><ReviewSession /></AnimatedPage>} />
            <Route path="/exam" element={<AnimatedPage><ExamSetup /></AnimatedPage>} />
            <Route path="/exam/session" element={<AnimatedPage><ExamSession /></AnimatedPage>} />
            <Route path="/exam/results" element={<AnimatedPage><ExamResults /></AnimatedPage>} />
            <Route path="/compare" element={<AnimatedPage><CompareServices /></AnimatedPage>} />
            <Route path="/compare/:comparisonId" element={<AnimatedPage><ComparisonDetail /></AnimatedPage>} />
            <Route path="/cost-labs" element={<AnimatedPage><CostLabsList /></AnimatedPage>} />
            <Route path="/cost-labs/:labId" element={<AnimatedPage><CostLabDetail /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}
