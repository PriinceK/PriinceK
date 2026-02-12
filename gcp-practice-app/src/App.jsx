import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import DayAsList from './pages/DayAsList'
import DayAsScenario from './pages/DayAsScenario'
import ChallengesList from './pages/ChallengesList'
import ChallengeDetail from './pages/ChallengeDetail'
import ArchitectureCanvas from './pages/ArchitectureCanvas'

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
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}
