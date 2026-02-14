import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft, Flame, CheckCircle2, XCircle, Trophy, Star,
    RefreshCw, Terminal, ChevronRight, Calendar,
} from 'lucide-react'
import Confetti from '../components/Confetti'

const PROGRESS_KEY = 'gcp-daily-challenge'
const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} } }
const saveProgress = (p) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))

const DAILY_QUESTIONS = [
    { type: 'command', prompt: 'Write the gcloud command to list all VM instances', answer: 'gcloud compute instances list', keywords: ['compute', 'instances', 'list'] },
    { type: 'concept', prompt: 'What is the maximum number of VPCs per project by default?', options: ['5', '10', '15', '25'], correct: 2 },
    { type: 'command', prompt: 'Write the command to create a GKE Autopilot cluster named "prod" in us-central1', answer: 'gcloud container clusters create-auto prod --region=us-central1', keywords: ['container', 'clusters', 'create-auto', 'prod'] },
    { type: 'concept', prompt: 'Which GCP service is best for running stateless containers without managing infrastructure?', options: ['Compute Engine', 'GKE', 'Cloud Run', 'App Engine'], correct: 2 },
    { type: 'command', prompt: 'Write the gsutil command to copy file.txt to bucket my-bucket', answer: 'gsutil cp file.txt gs://my-bucket/', keywords: ['gsutil', 'cp', 'file.txt', 'my-bucket'] },
    { type: 'concept', prompt: 'What IAM role should you grant for read-only access to Cloud Storage objects?', options: ['roles/storage.admin', 'roles/storage.objectViewer', 'roles/storage.objectCreator', 'roles/viewer'], correct: 1 },
    { type: 'command', prompt: 'Write the command to SSH into instance "web-1" in zone us-central1-a', answer: 'gcloud compute ssh web-1 --zone=us-central1-a', keywords: ['compute', 'ssh', 'web-1', 'us-central1-a'] },
    { type: 'concept', prompt: 'Which network tier offers the lowest cost for egress traffic in GCP?', options: ['Premium Tier', 'Standard Tier', 'Both are the same', 'Free Tier'], correct: 1 },
    { type: 'command', prompt: 'Write the command to deploy a Cloud Run service named "api" from image gcr.io/myproject/api:v1', answer: 'gcloud run deploy api --image=gcr.io/myproject/api:v1', keywords: ['run', 'deploy', 'api', 'image'] },
    { type: 'concept', prompt: 'What is the default scope of a firewall rule in GCP?', options: ['Subnet', 'Region', 'VPC Network', 'Project'], correct: 2 },
    { type: 'command', prompt: 'Write the kubectl command to scale deployment "web" to 5 replicas', answer: 'kubectl scale deployment web --replicas=5', keywords: ['kubectl', 'scale', 'deployment', 'replicas'] },
    { type: 'concept', prompt: 'Which service provides managed relational databases in GCP?', options: ['BigQuery', 'Cloud SQL', 'Firestore', 'Bigtable'], correct: 1 },
    { type: 'command', prompt: 'Create a firewall rule named "allow-ssh" allowing TCP:22 from all sources', answer: 'gcloud compute firewall-rules create allow-ssh --allow=tcp:22 --source-ranges=0.0.0.0/0', keywords: ['firewall-rules', 'create', 'allow-ssh', 'tcp:22'] },
    { type: 'concept', prompt: 'What does Cloud NAT provide?', options: ['DNS resolution', 'Outbound internet for private VMs', 'Inbound load balancing', 'VPN tunneling'], correct: 1 },
    { type: 'command', prompt: 'Enable the Cloud Run API for the current project', answer: 'gcloud services enable run.googleapis.com', keywords: ['services', 'enable', 'run'] },
    { type: 'concept', prompt: 'In GCP resource hierarchy, what is the top-level container?', options: ['Project', 'Folder', 'Organization', 'Billing Account'], correct: 2 },
    { type: 'command', prompt: 'Write the command to create a service account named "deployer"', answer: 'gcloud iam service-accounts create deployer', keywords: ['iam', 'service-accounts', 'create', 'deployer'] },
    { type: 'concept', prompt: 'Which GKE mode automatically manages node infrastructure?', options: ['Standard', 'Autopilot', 'Serverless', 'Managed'], correct: 1 },
    { type: 'command', prompt: 'Set the default compute zone to us-east1-b', answer: 'gcloud config set compute/zone us-east1-b', keywords: ['config', 'set', 'compute/zone'] },
    { type: 'concept', prompt: 'What is the SLA for a regional Cloud SQL instance?', options: ['99.0%', '99.5%', '99.95%', '99.99%'], correct: 2 },
    { type: 'command', prompt: 'List all enabled APIs in the current project', answer: 'gcloud services list --enabled', keywords: ['services', 'list', 'enabled'] },
    { type: 'concept', prompt: 'Which load balancer type is best for HTTP/HTTPS traffic?', options: ['TCP Proxy', 'Network Load Balancer', 'Application Load Balancer', 'Internal Load Balancer'], correct: 2 },
    { type: 'command', prompt: 'Create a Cloud Storage bucket named "logs-archive" in the US', answer: 'gsutil mb -l US gs://logs-archive', keywords: ['gsutil', 'mb', 'logs-archive'] },
    { type: 'concept', prompt: 'What type of IP address is automatically ephemeral in GCP?', options: ['Internal', 'External', 'Both', 'Neither'], correct: 1 },
    { type: 'command', prompt: 'Describe the IAM policy for project "my-project"', answer: 'gcloud projects get-iam-policy my-project', keywords: ['projects', 'get-iam-policy'] },
    { type: 'concept', prompt: 'Which storage class is cheapest for data accessed less than once a year?', options: ['Standard', 'Nearline', 'Coldline', 'Archive'], correct: 3 },
    { type: 'command', prompt: 'View logs for Cloud Function "processOrders"', answer: 'gcloud functions logs read processOrders', keywords: ['functions', 'logs', 'read'] },
    { type: 'concept', prompt: 'What is the minimum number of zones for a regional GKE cluster?', options: ['1', '2', '3', '4'], correct: 2 },
    { type: 'command', prompt: 'Create a persistent disk named "data-disk" of size 100GB in us-central1-a', answer: 'gcloud compute disks create data-disk --size=100GB --zone=us-central1-a', keywords: ['compute', 'disks', 'create', 'data-disk', '100'] },
    { type: 'concept', prompt: 'VPC peering allows connectivity between VPCs. Is it transitive?', options: ['Yes, always', 'No, never transitive', 'Only within the same project', 'Only with Shared VPC'], correct: 1 },
]

function getDayIndex() {
    const now = new Date()
    const start = new Date(2024, 0, 1)
    return Math.floor((now - start) / 86400000) % DAILY_QUESTIONS.length
}

function checkCommand(input, question) {
    const normalized = input.trim().toLowerCase()
    const matchCount = question.keywords.filter((kw) => normalized.includes(kw.toLowerCase())).length
    return matchCount >= Math.ceil(question.keywords.length * 0.6)
}

export default function DailyChallenge() {
    const todayIdx = getDayIndex()
    const question = DAILY_QUESTIONS[todayIdx]

    const [progress, setProgress] = useState(getProgress)
    const [input, setInput] = useState('')
    const [selectedOption, setSelectedOption] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

    const today = new Date().toISOString().split('T')[0]
    const alreadyDone = progress.lastDate === today
    const streak = progress.streak || 0

    useEffect(() => {
        if (alreadyDone) {
            setSubmitted(true)
            if (question.type === 'concept') setSelectedOption(progress.lastAnswer)
            else setInput(progress.lastAnswer || '')
        }
    }, [])

    function handleSubmit() {
        setSubmitted(true)
        let correct = false
        if (question.type === 'command') {
            correct = checkCommand(input, question)
        } else {
            correct = selectedOption === question.correct
        }

        const p = getProgress()
        const wasYesterday = p.lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]
        p.lastDate = today
        p.lastAnswer = question.type === 'concept' ? selectedOption : input
        p.lastCorrect = correct
        p.totalDone = (p.totalDone || 0) + 1
        p.totalCorrect = (p.totalCorrect || 0) + (correct ? 1 : 0)
        p.streak = wasYesterday || p.streak === 0 ? (p.streak || 0) + 1 : 1
        saveProgress(p)
        setProgress(p)

        if (correct) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3500)
        }
    }

    const isCorrect = question.type === 'command' ? checkCommand(input, question) : selectedOption === question.correct

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
            <Confetti active={showConfetti} />

            <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>

            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-neon-rose/10 flex items-center justify-center border border-neon-rose/20">
                    <Flame className="w-6 h-6 text-neon-rose" />
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                        Daily <span className="gradient-text-warm">Challenge</span>
                    </h1>
                    <p className="text-nebula-muted text-sm">One question per day. Keep your streak alive!</p>
                </div>
            </div>

            {/* Streak & Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-card-static rounded-xl p-4 text-center">
                    <Flame className="w-5 h-5 text-neon-amber mx-auto mb-1" />
                    <div className="text-2xl font-bold text-nebula-text font-mono">{progress.streak || 0}</div>
                    <div className="text-[10px] text-nebula-muted">Day Streak</div>
                </div>
                <div className="glass-card-static rounded-xl p-4 text-center">
                    <Trophy className="w-5 h-5 text-neon-cyan mx-auto mb-1" />
                    <div className="text-2xl font-bold text-nebula-text font-mono">{progress.totalDone || 0}</div>
                    <div className="text-[10px] text-nebula-muted">Completed</div>
                </div>
                <div className="glass-card-static rounded-xl p-4 text-center">
                    <Star className="w-5 h-5 text-neon-emerald mx-auto mb-1" />
                    <div className="text-2xl font-bold text-nebula-text font-mono">
                        {progress.totalDone ? Math.round((progress.totalCorrect / progress.totalDone) * 100) : 0}%
                    </div>
                    <div className="text-[10px] text-nebula-muted">Accuracy</div>
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-static rounded-2xl p-6 sm:p-8 mb-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-nebula-dim" />
                    <span className="text-xs text-nebula-dim">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-neon-rose/10 text-neon-rose font-medium ml-2">
                        {question.type === 'command' ? 'Command' : 'Concept'}
                    </span>
                </div>

                <p className="text-lg text-nebula-text font-medium leading-relaxed mb-6">{question.prompt}</p>

                {question.type === 'command' ? (
                    <div className="rounded-xl bg-[#0a0e1a] p-4 border border-nebula-border">
                        <div className="flex items-start">
                            <span className="text-neon-emerald font-mono text-sm shrink-0">$ </span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={submitted}
                                className="flex-1 bg-transparent border-0 outline-none text-nebula-text font-mono text-sm caret-neon-cyan ml-1"
                                placeholder="Type the command..."
                                autoComplete="off"
                                onKeyDown={(e) => { if (e.key === 'Enter' && !submitted) handleSubmit() }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {question.options.map((opt, i) => {
                            const isSelected = selectedOption === i
                            const showResult = submitted
                            const isCorrectOption = i === question.correct
                            let borderClass = 'border-nebula-border hover:border-nebula-muted/40'
                            if (showResult && isCorrectOption) borderClass = 'border-neon-emerald/50 bg-neon-emerald/5'
                            else if (showResult && isSelected && !isCorrectOption) borderClass = 'border-neon-rose/50 bg-neon-rose/5'
                            else if (isSelected) borderClass = 'border-neon-cyan/50 bg-neon-cyan/5'

                            return (
                                <button
                                    key={i}
                                    onClick={() => !submitted && setSelectedOption(i)}
                                    disabled={submitted}
                                    className={`w-full text-left px-4 py-3 rounded-xl border ${borderClass} text-sm text-nebula-text cursor-pointer bg-transparent transition-all flex items-center gap-3`}
                                >
                                    <span className="w-6 h-6 rounded-full border border-nebula-dim flex items-center justify-center text-[10px] font-mono text-nebula-dim shrink-0">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                    {showResult && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-neon-emerald ml-auto shrink-0" />}
                                    {showResult && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-neon-rose ml-auto shrink-0" />}
                                </button>
                            )
                        })}
                    </div>
                )}
            </motion.div>

            {/* Submit / Result */}
            {!submitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={question.type === 'command' ? !input.trim() : selectedOption === null}
                    className="btn-neon w-full py-3 rounded-xl text-sm font-medium disabled:opacity-40"
                >
                    Submit Answer
                </button>
            ) : (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`rounded-xl p-4 mb-4 ${isCorrect ? 'bg-neon-emerald/10 border border-neon-emerald/25' : 'bg-neon-rose/10 border border-neon-rose/25'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            {isCorrect ? <CheckCircle2 className="w-5 h-5 text-neon-emerald" /> : <XCircle className="w-5 h-5 text-neon-rose" />}
                            <span className="text-sm font-bold text-nebula-text">{isCorrect ? 'Correct! 🎉' : 'Not quite'}</span>
                        </div>
                        {question.type === 'command' && (
                            <p className="text-xs text-nebula-muted font-mono mt-1">Expected: <code className="text-neon-cyan">{question.answer}</code></p>
                        )}
                    </div>
                    <p className="text-center text-xs text-nebula-dim">Come back tomorrow for a new challenge!</p>
                </motion.div>
            )}
        </div>
    )
}
