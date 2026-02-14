import { Calendar, Trophy, Layout, BookOpen, Brain, RotateCcw, GraduationCap, GitCompareArrows, DollarSign, Terminal, Network, Flame, Star, Zap, Award, Crown, Target, Rocket, Shield, Sparkles, Medal, TrendingUp, Clock, Eye, Layers, Cpu } from 'lucide-react'

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started', color: '#00d4ff' },
  { id: 'scenarios', label: 'Scenarios', color: '#f59e0b' },
  { id: 'challenges', label: 'Challenges', color: '#10b981' },
  { id: 'learning', label: 'Learning', color: '#7c3aed' },
  { id: 'mastery', label: 'Mastery', color: '#f43f5e' },
  { id: 'streaks', label: 'Streaks & Dedication', color: '#ff6d00' },
  { id: 'labs', label: 'Labs', color: '#34a853' },
]

export const ACHIEVEMENTS = [
  // Getting Started
  { id: 'first-scenario', category: 'getting-started', icon: Calendar, title: 'First Steps', description: 'Complete your first scenario', points: 10, check: (p) => Object.keys(p.scenarios || {}).length >= 1 },
  { id: 'first-challenge', category: 'getting-started', icon: Trophy, title: 'Challenger', description: 'Complete your first architecture challenge', points: 10, check: (p) => Object.keys(p.challenges || {}).length >= 1 },
  { id: 'first-canvas', category: 'getting-started', icon: Layout, title: 'Architect', description: 'Save your first canvas design', points: 10, check: (p) => (p.canvasDesignsSaved || 0) >= 1 },
  { id: 'first-review', category: 'getting-started', icon: RotateCcw, title: 'Student', description: 'Review your first flashcard', points: 10, check: (p) => Object.keys(p.flashcards || {}).length >= 1 },
  { id: 'first-exam', category: 'getting-started', icon: GraduationCap, title: 'Test Taker', description: 'Complete your first practice exam', points: 10, check: (p) => (p.examHistory || []).length >= 1 },

  // Scenarios
  { id: 'scenario-3', category: 'scenarios', icon: Calendar, title: 'Day Shifter', description: 'Complete 3 different scenarios', points: 25, check: (p) => Object.keys(p.scenarios || {}).length >= 3 },
  { id: 'scenario-all', category: 'scenarios', icon: Star, title: 'Full Rotation', description: 'Complete all 5 scenarios', points: 50, check: (p) => Object.keys(p.scenarios || {}).length >= 5 },
  { id: 'scenario-a-grade', category: 'scenarios', icon: Award, title: 'Grade A Engineer', description: 'Score an A or higher on any scenario', points: 30, check: (p) => Object.values(p.scenarios || {}).some((s) => (s.percentage || 0) >= 85) },
  { id: 'scenario-a-plus', category: 'scenarios', icon: Crown, title: 'Perfect Engineer', description: 'Score an A+ on any scenario', points: 50, check: (p) => Object.values(p.scenarios || {}).some((s) => (s.percentage || 0) >= 95) },
  { id: 'scenario-all-a', category: 'scenarios', icon: Sparkles, title: 'Cloud Legend', description: 'Score A or higher on all scenarios', points: 100, check: (p) => { const s = p.scenarios || {}; return Object.keys(s).length >= 5 && Object.values(s).every((v) => (v.percentage || 0) >= 85) } },

  // Challenges
  { id: 'challenge-2', category: 'challenges', icon: Trophy, title: 'Problem Solver', description: 'Complete 2 architecture challenges', points: 25, check: (p) => Object.keys(p.challenges || {}).length >= 2 },
  { id: 'challenge-all', category: 'challenges', icon: Target, title: 'Master Builder', description: 'Complete all 4 challenges', points: 50, check: (p) => Object.keys(p.challenges || {}).length >= 4 },
  { id: 'challenge-80', category: 'challenges', icon: Medal, title: 'High Scorer', description: 'Score 80%+ on any challenge', points: 30, check: (p) => Object.values(p.challenges || {}).some((c) => (c.percentage || 0) >= 80) },
  { id: 'challenge-perfect', category: 'challenges', icon: Crown, title: 'Perfect Architect', description: 'Score 100% on any challenge', points: 75, check: (p) => Object.values(p.challenges || {}).some((c) => (c.percentage || 0) >= 100) },

  // Learning
  { id: 'review-10', category: 'learning', icon: RotateCcw, title: 'Card Collector', description: 'Review 10 flashcards', points: 15, check: (p) => Object.keys(p.flashcards || {}).length >= 10 },
  { id: 'review-50', category: 'learning', icon: RotateCcw, title: 'Knowledge Seeker', description: 'Review 50 flashcards', points: 30, check: (p) => Object.keys(p.flashcards || {}).length >= 50 },
  { id: 'review-all', category: 'learning', icon: Brain, title: 'Encyclopedia Brain', description: 'Review all flashcards at least once', points: 50, check: (p) => Object.keys(p.flashcards || {}).length >= 100 },
  { id: 'custom-card', category: 'learning', icon: BookOpen, title: 'Note Maker', description: 'Create a custom flashcard', points: 15, check: (p) => (p.customFlashcards || []).length >= 1 },
  { id: 'exam-pass', category: 'learning', icon: GraduationCap, title: 'Passing Grade', description: 'Score 70%+ on a practice exam', points: 30, check: (p) => (p.examHistory || []).some((e) => (e.score || 0) >= 70) },
  { id: 'exam-ace', category: 'learning', icon: Zap, title: 'Ace the Exam', description: 'Score 90%+ on a practice exam', points: 50, check: (p) => (p.examHistory || []).some((e) => (e.score || 0) >= 90) },
  { id: 'exam-5', category: 'learning', icon: GraduationCap, title: 'Exam Veteran', description: 'Complete 5 practice exams', points: 40, check: (p) => (p.examHistory || []).length >= 5 },

  // Mastery
  { id: 'domain-70', category: 'mastery', icon: TrendingUp, title: 'Domain Expert', description: 'Reach 70%+ in any knowledge domain', points: 25, check: (p) => Object.values(p.domainScores || {}).some((d) => d.total > 0 && (d.correct / d.total) >= 0.7) },
  { id: 'domain-all-50', category: 'mastery', icon: Shield, title: 'Well Rounded', description: 'Reach 50%+ in all 8 domains', points: 75, check: (p) => { const ds = p.domainScores || {}; const domains = ['compute', 'storage', 'networking', 'security', 'data', 'ai', 'devops', 'serverless']; return domains.every((d) => ds[d] && ds[d].total > 0 && (ds[d].correct / ds[d].total) >= 0.5) } },
  { id: 'domain-all-80', category: 'mastery', icon: Crown, title: 'Cloud Master', description: 'Reach 80%+ in all 8 domains', points: 150, check: (p) => { const ds = p.domainScores || {}; const domains = ['compute', 'storage', 'networking', 'security', 'data', 'ai', 'devops', 'serverless']; return domains.every((d) => ds[d] && ds[d].total > 0 && (ds[d].correct / ds[d].total) >= 0.8) } },
  { id: 'compare-3', category: 'mastery', icon: GitCompareArrows, title: 'Comparator', description: 'View 3 service comparisons', points: 15, check: (p) => (p.comparisonsViewed || 0) >= 3 },
  { id: 'cost-lab-2', category: 'mastery', icon: DollarSign, title: 'Cost Optimizer', description: 'Complete 2 cost optimization labs', points: 30, check: (p) => (p.costLabsCompleted || 0) >= 2 },

  // Streaks & Dedication
  { id: 'streak-3', category: 'streaks', icon: Flame, title: 'Getting Warm', description: 'Maintain a 3-day study streak', points: 15, check: (p) => (p.streak?.current || 0) >= 3 },
  { id: 'streak-7', category: 'streaks', icon: Flame, title: 'On Fire', description: 'Maintain a 7-day study streak', points: 30, check: (p) => (p.streak?.current || 0) >= 7 },
  { id: 'streak-14', category: 'streaks', icon: Flame, title: 'Unstoppable', description: 'Maintain a 14-day study streak', points: 50, check: (p) => (p.streak?.current || 0) >= 14 },
  { id: 'streak-30', category: 'streaks', icon: Rocket, title: 'Cloud Warrior', description: 'Maintain a 30-day study streak', points: 100, check: (p) => (p.streak?.current || 0) >= 30 },

  // Labs
  { id: 'linux-5', category: 'labs', icon: Terminal, title: 'Terminal Novice', description: 'Complete 5 Linux lessons', points: 20, check: (p) => Object.keys(p.linuxLessons || {}).filter((k) => p.linuxLessons[k]).length >= 5 },
  { id: 'linux-15', category: 'labs', icon: Terminal, title: 'Shell Hacker', description: 'Complete 15 Linux lessons', points: 40, check: (p) => Object.keys(p.linuxLessons || {}).filter((k) => p.linuxLessons[k]).length >= 15 },
  { id: 'linux-all', category: 'labs', icon: Cpu, title: 'Linux Master', description: 'Complete all Linux lessons', points: 75, check: (p) => Object.keys(p.linuxLessons || {}).filter((k) => p.linuxLessons[k]).length >= 30 },
  { id: 'network-5', category: 'labs', icon: Network, title: 'Network Cadet', description: 'Complete 5 networking lessons', points: 20, check: (p) => Object.keys(p.networkLessons || {}).filter((k) => p.networkLessons[k]).length >= 5 },
  { id: 'network-all', category: 'labs', icon: Layers, title: 'Network Engineer', description: 'Complete all networking lessons', points: 50, check: (p) => Object.keys(p.networkLessons || {}).filter((k) => p.networkLessons[k]).length >= 10 },
]

export function checkAchievements(progress) {
  const unlocked = progress.achievements || {}
  const newlyUnlocked = []

  for (const achievement of ACHIEVEMENTS) {
    if (unlocked[achievement.id]) continue
    try {
      if (achievement.check(progress)) {
        newlyUnlocked.push(achievement)
      }
    } catch {
      // skip if check fails
    }
  }

  return newlyUnlocked
}

export function getTotalPoints(progress) {
  const unlocked = progress.achievements || {}
  return ACHIEVEMENTS.filter((a) => unlocked[a.id]).reduce((sum, a) => sum + a.points, 0)
}

export function getMaxPoints() {
  return ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0)
}
