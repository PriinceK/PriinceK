import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Timer, Trophy, RotateCcw, Zap, CheckCircle2,
    XCircle, ChevronRight, Star, Target,
} from 'lucide-react'

const DRILL_SETS = [
    {
        id: 'compute', title: 'Compute Engine', icon: '💻', color: '#4285f4',
        drills: [
            { prompt: 'Create a VM named "web-1" with machine type e2-medium in us-central1-a', answer: 'gcloud compute instances create web-1 --machine-type=e2-medium --zone=us-central1-a', keywords: ['compute', 'instances', 'create', 'web-1', 'e2-medium', 'us-central1-a'] },
            { prompt: 'List all running instances', answer: 'gcloud compute instances list', keywords: ['compute', 'instances', 'list'] },
            { prompt: 'SSH into instance "web-1" in zone us-central1-a', answer: 'gcloud compute ssh web-1 --zone=us-central1-a', keywords: ['compute', 'ssh', 'web-1', 'us-central1-a'] },
            { prompt: 'Stop instance "web-1" in us-central1-a', answer: 'gcloud compute instances stop web-1 --zone=us-central1-a', keywords: ['compute', 'instances', 'stop', 'web-1'] },
            { prompt: 'Delete instance "web-1" in us-central1-a', answer: 'gcloud compute instances delete web-1 --zone=us-central1-a', keywords: ['compute', 'instances', 'delete', 'web-1'] },
            { prompt: 'Create a firewall rule allowing TCP:80 from any source', answer: 'gcloud compute firewall-rules create allow-http --allow=tcp:80 --source-ranges=0.0.0.0/0', keywords: ['firewall-rules', 'create', 'allow', 'tcp:80'] },
        ],
    },
    {
        id: 'storage', title: 'Cloud Storage', icon: '🪣', color: '#34a853',
        drills: [
            { prompt: 'Create a bucket named "my-data-bucket" in US', answer: 'gsutil mb -l US gs://my-data-bucket', keywords: ['gsutil', 'mb', 'my-data-bucket'] },
            { prompt: 'List all buckets in the project', answer: 'gsutil ls', keywords: ['gsutil', 'ls'] },
            { prompt: 'Copy a local file "data.csv" to the bucket', answer: 'gsutil cp data.csv gs://my-data-bucket/', keywords: ['gsutil', 'cp', 'data.csv', 'my-data-bucket'] },
            { prompt: 'Make bucket "my-data-bucket" publicly readable', answer: 'gsutil iam ch allUsers:objectViewer gs://my-data-bucket', keywords: ['gsutil', 'iam', 'ch', 'allUsers'] },
            { prompt: 'Enable versioning on "my-data-bucket"', answer: 'gsutil versioning set on gs://my-data-bucket', keywords: ['gsutil', 'versioning', 'set', 'on'] },
            { prompt: 'Sync a local directory to the bucket', answer: 'gsutil rsync -r ./local-dir gs://my-data-bucket/backup', keywords: ['gsutil', 'rsync'] },
        ],
    },
    {
        id: 'iam', title: 'IAM & Service Accounts', icon: '🔐', color: '#ea4335',
        drills: [
            { prompt: 'List all IAM bindings on the current project', answer: 'gcloud projects get-iam-policy my-project', keywords: ['projects', 'get-iam-policy'] },
            { prompt: 'Create a service account named "app-sa"', answer: 'gcloud iam service-accounts create app-sa --display-name="App Service Account"', keywords: ['iam', 'service-accounts', 'create', 'app-sa'] },
            { prompt: 'Grant Storage Object Viewer role to app-sa on the project', answer: 'gcloud projects add-iam-policy-binding my-project --member=serviceAccount:app-sa@my-project.iam.gserviceaccount.com --role=roles/storage.objectViewer', keywords: ['add-iam-policy-binding', 'serviceAccount', 'storage.objectViewer'] },
            { prompt: 'List all service accounts in the project', answer: 'gcloud iam service-accounts list', keywords: ['iam', 'service-accounts', 'list'] },
            { prompt: 'Create a key for service account "app-sa"', answer: 'gcloud iam service-accounts keys create key.json --iam-account=app-sa@my-project.iam.gserviceaccount.com', keywords: ['service-accounts', 'keys', 'create'] },
        ],
    },
    {
        id: 'kubernetes', title: 'GKE / kubectl', icon: '☸️', color: '#4285f4',
        drills: [
            { prompt: 'Create a GKE Autopilot cluster named "prod" in us-central1', answer: 'gcloud container clusters create-auto prod --region=us-central1', keywords: ['container', 'clusters', 'create-auto', 'prod'] },
            { prompt: 'Get credentials for cluster "prod"', answer: 'gcloud container clusters get-credentials prod --region=us-central1', keywords: ['get-credentials', 'prod'] },
            { prompt: 'List all pods in the default namespace', answer: 'kubectl get pods', keywords: ['kubectl', 'get', 'pods'] },
            { prompt: 'Scale deployment "web" to 5 replicas', answer: 'kubectl scale deployment web --replicas=5', keywords: ['kubectl', 'scale', 'deployment', 'replicas'] },
            { prompt: 'View logs of pod "web-pod-abc"', answer: 'kubectl logs web-pod-abc', keywords: ['kubectl', 'logs'] },
            { prompt: 'Create a namespace called "staging"', answer: 'kubectl create namespace staging', keywords: ['kubectl', 'create', 'namespace', 'staging'] },
        ],
    },
    {
        id: 'serverless', title: 'Serverless (Run/Functions)', icon: '⚡', color: '#fbbc04',
        drills: [
            { prompt: 'Deploy a Cloud Run service from image gcr.io/project/app:v1', answer: 'gcloud run deploy app --image=gcr.io/project/app:v1 --region=us-central1 --allow-unauthenticated', keywords: ['run', 'deploy', 'image'] },
            { prompt: 'List all Cloud Run services', answer: 'gcloud run services list', keywords: ['run', 'services', 'list'] },
            { prompt: 'Update Cloud Run service "api" to set max instances to 10', answer: 'gcloud run services update api --max-instances=10 --region=us-central1', keywords: ['run', 'services', 'update', 'max-instances'] },
            { prompt: 'Deploy a Cloud Function from current directory triggered by HTTP', answer: 'gcloud functions deploy myFunction --runtime=nodejs20 --trigger-http --allow-unauthenticated', keywords: ['functions', 'deploy', 'trigger-http'] },
            { prompt: 'View logs for Cloud Function "myFunction"', answer: 'gcloud functions logs read myFunction', keywords: ['functions', 'logs', 'read'] },
        ],
    },
]

const PROGRESS_KEY = 'gcp-timed-drills-progress'
const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} } }
const saveProgress = (p) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))

function checkAnswer(input, drill) {
    const normalized = input.trim().toLowerCase()
    const matchCount = drill.keywords.filter((kw) => normalized.includes(kw.toLowerCase())).length
    return matchCount >= Math.ceil(drill.keywords.length * 0.6)
}

export default function TimedDrills() {
    const [selectedSet, setSelectedSet] = useState(null)
    const [currentDrill, setCurrentDrill] = useState(0)
    const [input, setInput] = useState('')
    const [timeLeft, setTimeLeft] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [results, setResults] = useState([])
    const [showAnswer, setShowAnswer] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [progress, setProgress] = useState(getProgress)
    const inputRef = useRef(null)
    const timerRef = useRef(null)

    const set = selectedSet ? DRILL_SETS.find((s) => s.id === selectedSet) : null
    const drill = set ? set.drills[currentDrill] : null
    const DRILL_TIME = 45

    const stopTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        setIsActive(false)
    }, [])

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000)
            return () => clearInterval(timerRef.current)
        }
        if (timeLeft === 0 && isActive) {
            handleSubmit(true)
        }
    }, [isActive, timeLeft])

    useEffect(() => { if (isActive) inputRef.current?.focus() }, [currentDrill, isActive])

    function startDrill(id) {
        setSelectedSet(id)
        setCurrentDrill(0)
        setResults([])
        setInput('')
        setShowAnswer(false)
        setSubmitted(false)
        setTimeLeft(DRILL_TIME)
        setIsActive(true)
    }

    function handleSubmit(timedOut = false) {
        stopTimer()
        setSubmitted(true)
        const correct = timedOut ? false : checkAnswer(input, drill)
        setResults([...results, { drillIdx: currentDrill, answer: input, correct, timedOut, timeUsed: DRILL_TIME - timeLeft }])
    }

    function nextDrill() {
        if (currentDrill < set.drills.length - 1) {
            setCurrentDrill(currentDrill + 1)
            setInput('')
            setShowAnswer(false)
            setSubmitted(false)
            setTimeLeft(DRILL_TIME)
            setIsActive(true)
        } else {
            stopTimer()
            const correctCount = results.length > 0 ? results.filter((r) => r.correct).length + (submitted && checkAnswer(input, drill) ? 1 : 0) : 0
            const p = getProgress()
            p[selectedSet] = { score: correctCount, total: set.drills.length, bestTime: results.reduce((a, r) => a + r.timeUsed, 0) }
            saveProgress(p); setProgress(p)
        }
    }

    if (!selectedSet || (!isActive && results.length === set?.drills.length)) {
        if (selectedSet && results.length === set?.drills.length) {
            const correctCount = results.filter((r) => r.correct).length
            const totalTime = results.reduce((a, r) => a + r.timeUsed, 0)
            return (
                <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                    <Trophy className="w-12 h-12 text-neon-amber mx-auto mb-4" />
                    <h1 className="text-2xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Drill Complete!</h1>
                    <p className="text-lg text-neon-cyan font-bold mb-1">{correctCount}/{set.drills.length} correct</p>
                    <p className="text-sm text-nebula-muted mb-6">Total time: {totalTime}s | Avg: {(totalTime / set.drills.length).toFixed(1)}s per command</p>
                    <div className="space-y-2 text-left max-w-lg mx-auto mb-6">
                        {results.map((r, i) => (
                            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${r.correct ? 'bg-neon-emerald/10' : 'bg-neon-rose/10'}`}>
                                {r.correct ? <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0" /> : <XCircle className="w-4 h-4 text-neon-rose shrink-0" />}
                                <span className="text-xs text-nebula-text flex-1">{set.drills[r.drillIdx].prompt}</span>
                                <span className="text-[10px] text-nebula-dim">{r.timeUsed}s</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => startDrill(selectedSet)} className="btn-neon px-5 py-2 rounded-xl text-sm">Retry</button>
                        <button onClick={() => setSelectedSet(null)} className="px-5 py-2 rounded-xl bg-nebula-surface border border-nebula-border text-nebula-muted text-sm cursor-pointer hover:text-nebula-text transition-colors">Back</button>
                    </div>
                </div>
            )
        }

        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-neon-amber/10 flex items-center justify-center border border-neon-amber/20">
                        <Zap className="w-6 h-6 text-neon-amber" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                            Timed <span className="gradient-text-warm">Drills</span>
                        </h1>
                        <p className="text-nebula-muted text-sm">Race against the clock to type GCP commands from memory</p>
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {DRILL_SETS.map((s) => {
                        const p = progress[s.id]
                        return (
                            <motion.button key={s.id} whileHover={{ y: -2 }} onClick={() => startDrill(s.id)}
                                className="glass-card rounded-xl p-5 text-left cursor-pointer border-0 w-full transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-2xl">{s.icon}</span>
                                    {p && <span className="text-[10px] font-mono text-neon-emerald">{p.score}/{p.total}</span>}
                                </div>
                                <h3 className="text-base font-bold text-nebula-text mb-1">{s.title}</h3>
                                <p className="text-xs text-nebula-muted">{s.drills.length} commands · {DRILL_TIME}s per command</p>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        )
    }

    // Active drill
    const timerPct = (timeLeft / DRILL_TIME) * 100
    const timerColor = timeLeft > 15 ? '#00d4ff' : timeLeft > 5 ? '#facc15' : '#f43f5e'

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-nebula-muted">Drill {currentDrill + 1}/{set.drills.length}</span>
                <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" style={{ color: timerColor }} />
                    <span className="text-lg font-mono font-bold" style={{ color: timerColor }}>{timeLeft}s</span>
                </div>
            </div>

            <div className="w-full h-1.5 rounded-full bg-nebula-deep mb-8 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: timerColor, width: `${timerPct}%` }} />
            </div>

            <div className="glass-card-static rounded-2xl p-6 mb-6 text-center">
                <Target className="w-6 h-6 text-neon-cyan mx-auto mb-3" />
                <p className="text-lg text-nebula-text font-medium leading-relaxed">{drill.prompt}</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (!submitted) handleSubmit() }}>
                <div className="rounded-xl bg-[#0a0e1a] p-4 mb-4 border border-nebula-border">
                    <div className="flex items-start">
                        <span className="text-neon-emerald font-mono text-sm shrink-0">$ </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={submitted}
                            className="flex-1 bg-transparent border-0 outline-none text-nebula-text font-mono text-sm caret-neon-cyan ml-1"
                            placeholder="Type the command..."
                            autoComplete="off"
                            autoCorrect="off"
                        />
                    </div>
                </div>
                {!submitted && (
                    <button type="submit" className="btn-neon w-full py-3 rounded-xl text-sm font-medium">
                        Submit Answer
                    </button>
                )}
            </form>

            {submitted && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
                    <div className={`rounded-xl p-4 ${checkAnswer(input, drill) ? 'bg-neon-emerald/10 border border-neon-emerald/25' : 'bg-neon-rose/10 border border-neon-rose/25'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            {checkAnswer(input, drill) ? <CheckCircle2 className="w-5 h-5 text-neon-emerald" /> : <XCircle className="w-5 h-5 text-neon-rose" />}
                            <span className="text-sm font-bold text-nebula-text">{checkAnswer(input, drill) ? 'Correct!' : 'Not quite'}</span>
                        </div>
                        <p className="text-xs text-nebula-muted font-mono">Expected: <code className="text-neon-cyan">{drill.answer}</code></p>
                    </div>
                    <button onClick={nextDrill} className="btn-neon w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                        {currentDrill < set.drills.length - 1 ? 'Next Command' : 'View Results'} <ChevronRight className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </div>
    )
}
