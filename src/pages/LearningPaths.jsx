import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft, ArrowRight, CheckCircle2, Circle, Lock, Trophy,
    Target, Shield, Cloud, Network, Database, Server, Code2,
    Flame, ChevronRight, Star,
} from 'lucide-react'

const PROGRESS_KEY = 'gcp-learning-paths-progress'
const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} } }
const saveProgress = (p) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))

const PATHS = [
    {
        id: 'ace-fast-track',
        title: 'ACE Certification Fast Track',
        subtitle: 'Prepare for the Associate Cloud Engineer exam',
        icon: Trophy,
        color: '#f59e0b',
        gradient: 'from-amber-500/20 to-orange-500/20',
        estimatedHours: 12,
        steps: [
            { id: 'services', label: 'Learn Core Services', description: 'Study 15+ GCP services, pricing, and use cases', to: '/services', type: 'learn' },
            { id: 'review', label: 'Flashcard Review', description: 'Master key concepts with spaced repetition', to: '/review', type: 'study' },
            { id: 'gcloud', label: 'GCloud CLI Basics', description: 'Practice essential gcloud, gsutil, and kubectl commands', to: '/gcloud-lab', type: 'lab' },
            { id: 'iam', label: 'IAM & Security', description: 'Understand roles, service accounts, and least privilege', to: '/iam-simulator', type: 'lab' },
            { id: 'compare', label: 'Compare Confusing Services', description: 'Learn when to use Cloud Run vs GKE vs App Engine, etc.', to: '/compare', type: 'learn' },
            { id: 'arch-quiz', label: 'Architecture Quizzes', description: 'Spot flaws in real-world architecture diagrams', to: '/arch-quiz', type: 'practice' },
            { id: 'timed', label: 'Timed Command Drills', description: 'Build muscle memory for common GCP commands', to: '/timed-drills', type: 'practice' },
            { id: 'exam', label: 'Practice Exam', description: 'Take a full timed mock exam', to: '/exam', type: 'exam' },
        ],
    },
    {
        id: 'networking-pro',
        title: 'Networking Specialist',
        subtitle: 'Master VPCs, firewalls, load balancing, and DNS',
        icon: Network,
        color: '#a855f7',
        gradient: 'from-purple-500/20 to-violet-500/20',
        estimatedHours: 8,
        steps: [
            { id: 'net-services', label: 'Networking Services Overview', description: 'Study VPC, Cloud DNS, Cloud NAT, and Load Balancing', to: '/services', type: 'learn' },
            { id: 'network-lab', label: 'Networking Lab', description: 'Hands-on with DNS, firewalls, and diagnostics', to: '/network-lab', type: 'lab' },
            { id: 'tf-networking', label: 'Terraform VPC Lab', description: 'Build VPCs and firewall rules with infrastructure-as-code', to: '/terraform-lab', type: 'lab' },
            { id: 'troubleshoot', label: 'Network Troubleshooting', description: 'Diagnose firewall misconfigs and connectivity issues', to: '/troubleshooting', type: 'practice' },
            { id: 'arch-quiz-net', label: 'Architecture Review', description: 'Identify networking flaws in architecture diagrams', to: '/arch-quiz', type: 'practice' },
            { id: 'project', label: 'Build a Multi-Tier Network', description: 'Complete a full networking project end-to-end', to: '/projects', type: 'project' },
        ],
    },
    {
        id: 'security-specialist',
        title: 'Security & IAM Expert',
        subtitle: 'Become proficient in GCP identity, access, and security',
        icon: Shield,
        color: '#10b981',
        gradient: 'from-emerald-500/20 to-teal-500/20',
        estimatedHours: 6,
        steps: [
            { id: 'iam-learn', label: 'IAM Fundamentals', description: 'Understand roles, policies, and the resource hierarchy', to: '/services', type: 'learn' },
            { id: 'iam-sim', label: 'IAM Policy Simulator', description: 'Practice least-privilege assignments and conditions', to: '/iam-simulator', type: 'lab' },
            { id: 'gcloud-iam', label: 'GCloud IAM Commands', description: 'Master service account and IAM CLI operations', to: '/gcloud-lab', type: 'lab' },
            { id: 'troubleshoot-sec', label: 'Security Troubleshooting', description: 'Diagnose 403 errors, missing permissions, and misconfigs', to: '/troubleshooting', type: 'practice' },
            { id: 'timed-iam', label: 'IAM Command Drills', description: 'Rapid-fire IAM commands under time pressure', to: '/timed-drills', type: 'practice' },
        ],
    },
    {
        id: 'infra-as-code',
        title: 'Infrastructure as Code',
        subtitle: 'Provision and manage GCP resources with Terraform',
        icon: Code2,
        color: '#7c3aed',
        gradient: 'from-violet-500/20 to-indigo-500/20',
        estimatedHours: 7,
        steps: [
            { id: 'tf-basics', label: 'Terraform Basics', description: 'Learn providers, resources, variables, and outputs', to: '/terraform-lab', type: 'lab' },
            { id: 'tf-compute', label: 'Compute with Terraform', description: 'Provision VMs, templates, and managed instance groups', to: '/terraform-lab', type: 'lab' },
            { id: 'tf-network', label: 'Networking with Terraform', description: 'Create VPCs, subnets, and firewall rules in HCL', to: '/terraform-lab', type: 'lab' },
            { id: 'tf-serverless', label: 'Serverless with Terraform', description: 'Deploy Cloud Run and Cloud Functions', to: '/terraform-lab', type: 'lab' },
            { id: 'project-tf', label: 'Full IaC Project', description: 'Build a complete project using only Terraform', to: '/projects', type: 'project' },
        ],
    },
    {
        id: 'compute-mastery',
        title: 'Compute & Containers',
        subtitle: 'From VMs to Kubernetes to serverless',
        icon: Server,
        color: '#4285f4',
        gradient: 'from-blue-500/20 to-cyan-500/20',
        estimatedHours: 10,
        steps: [
            { id: 'compute-learn', label: 'Compute Services', description: 'Compare Compute Engine, GKE, Cloud Run, and App Engine', to: '/compare', type: 'learn' },
            { id: 'linux', label: 'Linux Fundamentals', description: 'Essential Linux commands for VM management', to: '/linux-lab', type: 'lab' },
            { id: 'gcloud-compute', label: 'GCloud Compute Commands', description: 'Create, manage, and SSH into VMs via CLI', to: '/gcloud-lab', type: 'lab' },
            { id: 'tf-compute-2', label: 'Terraform for Compute', description: 'Provision VMs and instance groups with IaC', to: '/terraform-lab', type: 'lab' },
            { id: 'k8s-drills', label: 'Kubernetes Drills', description: 'kubectl commands under time pressure', to: '/timed-drills', type: 'practice' },
            { id: 'troubleshoot-vm', label: 'VM Troubleshooting', description: 'Diagnose startup failures and connectivity issues', to: '/troubleshooting', type: 'practice' },
            { id: 'arch-compute', label: 'Architecture Quiz', description: 'Fix scaling and availability flaws', to: '/arch-quiz', type: 'practice' },
        ],
    },
]

const TYPE_BADGES = {
    learn: { label: 'Study', color: '#00d4ff', bg: 'bg-[#00d4ff]/10' },
    study: { label: 'Review', color: '#7c3aed', bg: 'bg-[#7c3aed]/10' },
    lab: { label: 'Lab', color: '#10b981', bg: 'bg-[#10b981]/10' },
    practice: { label: 'Practice', color: '#f59e0b', bg: 'bg-[#f59e0b]/10' },
    exam: { label: 'Exam', color: '#f43f5e', bg: 'bg-[#f43f5e]/10' },
    project: { label: 'Project', color: '#7c3aed', bg: 'bg-[#7c3aed]/10' },
}

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function LearningPaths() {
    const [selectedPath, setSelectedPath] = useState(null)
    const [progress, setProgress] = useState(getProgress)

    const path = selectedPath ? PATHS.find((p) => p.id === selectedPath) : null

    function toggleStep(pathId, stepId) {
        const p = getProgress()
        if (!p[pathId]) p[pathId] = []
        if (p[pathId].includes(stepId)) {
            p[pathId] = p[pathId].filter((s) => s !== stepId)
        } else {
            p[pathId].push(stepId)
        }
        saveProgress(p)
        setProgress(p)
    }

    // ─── Path Selection ───
    if (!selectedPath) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
                <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 glow-cyan">
                        <Target className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                            Learning <span className="gradient-text-cyan">Paths</span>
                        </h1>
                        <p className="text-nebula-muted text-sm">Guided journeys to master GCP skills</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {PATHS.map((p) => {
                        const completed = progress[p.id]?.length || 0
                        const pct = Math.round((completed / p.steps.length) * 100)
                        return (
                            <motion.button
                                key={p.id}
                                variants={fadeUp}
                                initial="initial"
                                animate="animate"
                                whileHover={{ y: -3 }}
                                onClick={() => setSelectedPath(p.id)}
                                className="glass-card rounded-2xl p-5 sm:p-6 text-left cursor-pointer border-0 w-full transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: p.color + '15', border: `1px solid ${p.color}25` }}
                                    >
                                        <p.icon className="w-5 h-5" style={{ color: p.color }} />
                                    </div>
                                    {pct === 100 && <Star className="w-5 h-5 text-neon-amber" />}
                                </div>
                                <h3 className="text-base font-bold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{p.title}</h3>
                                <p className="text-xs text-nebula-muted mb-4 leading-relaxed">{p.subtitle}</p>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] text-nebula-dim">{p.steps.length} steps · ~{p.estimatedHours}h</span>
                                    <span className="text-[10px] font-mono" style={{ color: p.color }}>{pct}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-nebula-deep overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        )
    }

    // ─── Path Detail ───
    const completedSteps = progress[path.id] || []
    const pct = Math.round((completedSteps.length / path.steps.length) * 100)

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
            <button onClick={() => setSelectedPath(null)} className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 cursor-pointer bg-transparent border-0 transition-colors">
                <ArrowLeft className="w-4 h-4" /> All Paths
            </button>

            <div className="flex items-center gap-3 mb-6">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: path.color + '15', border: `1px solid ${path.color}25` }}
                >
                    <path.icon className="w-6 h-6" style={{ color: path.color }} />
                </div>
                <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{path.title}</h1>
                    <p className="text-sm text-nebula-muted">{path.subtitle}</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="glass-card-static rounded-xl p-4 mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-nebula-muted">{completedSteps.length}/{path.steps.length} completed</span>
                    <span className="text-sm font-bold font-mono" style={{ color: path.color }}>{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-nebula-deep overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: path.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
                {path.steps.map((step, i) => {
                    const isComplete = completedSteps.includes(step.id)
                    const badge = TYPE_BADGES[step.type] || TYPE_BADGES.learn
                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`glass-card rounded-xl p-4 flex items-start gap-3 transition-all ${isComplete ? 'opacity-80' : ''}`}
                        >
                            {/* Step number + check */}
                            <button
                                onClick={() => toggleStep(path.id, step.id)}
                                className="mt-0.5 cursor-pointer bg-transparent border-0 p-0 shrink-0"
                                aria-label={isComplete ? 'Mark incomplete' : 'Mark complete'}
                            >
                                {isComplete ? (
                                    <CheckCircle2 className="w-5 h-5 text-neon-emerald" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-nebula-dim flex items-center justify-center">
                                        <span className="text-[9px] text-nebula-dim font-mono">{i + 1}</span>
                                    </div>
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className={`text-sm font-bold ${isComplete ? 'text-nebula-muted line-through' : 'text-nebula-text'}`}>{step.label}</h3>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${badge.bg} font-medium`} style={{ color: badge.color }}>{badge.label}</span>
                                </div>
                                <p className="text-xs text-nebula-muted">{step.description}</p>
                            </div>

                            <Link
                                to={step.to}
                                className="shrink-0 mt-1 p-1.5 rounded-lg hover:bg-nebula-surface/50 text-nebula-dim hover:text-neon-cyan no-underline transition-colors"
                                title={`Go to ${step.label}`}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    )
                })}
            </div>

            {pct === 100 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 text-center glass-card-static rounded-2xl p-6"
                >
                    <Star className="w-10 h-10 text-neon-amber mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Path Complete!</h2>
                    <p className="text-sm text-nebula-muted">You've completed all steps in {path.title}. Well done! 🎉</p>
                </motion.div>
            )}
        </div>
    )
}
