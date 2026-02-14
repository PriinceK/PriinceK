import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Search, Copy, Check, Terminal, Cloud, Database,
    Shield, Network, Server, HardDrive, Zap, X, BookOpen,
} from 'lucide-react'

const CATEGORIES = [
    {
        id: 'compute',
        label: 'Compute',
        icon: Server,
        color: '#4285f4',
        commands: [
            { cmd: 'gcloud compute instances create NAME --machine-type=TYPE --zone=ZONE', desc: 'Create a VM instance', tags: ['vm', 'create'] },
            { cmd: 'gcloud compute instances list', desc: 'List all VM instances', tags: ['vm', 'list'] },
            { cmd: 'gcloud compute instances describe NAME --zone=ZONE', desc: 'Show details of a VM', tags: ['vm', 'describe'] },
            { cmd: 'gcloud compute instances stop NAME --zone=ZONE', desc: 'Stop a running VM', tags: ['vm', 'stop'] },
            { cmd: 'gcloud compute instances start NAME --zone=ZONE', desc: 'Start a stopped VM', tags: ['vm', 'start'] },
            { cmd: 'gcloud compute instances delete NAME --zone=ZONE', desc: 'Delete a VM', tags: ['vm', 'delete'] },
            { cmd: 'gcloud compute ssh NAME --zone=ZONE', desc: 'SSH into a VM', tags: ['vm', 'ssh'] },
            { cmd: 'gcloud compute scp FILE VM:~/DEST --zone=ZONE', desc: 'Copy file to VM', tags: ['vm', 'scp', 'copy'] },
            { cmd: 'gcloud compute images list', desc: 'List available VM images', tags: ['images'] },
            { cmd: 'gcloud compute machine-types list --zones=ZONE', desc: 'List machine types', tags: ['machine-types'] },
            { cmd: 'gcloud compute disks create NAME --size=SIZE --zone=ZONE', desc: 'Create a persistent disk', tags: ['disk', 'create'] },
            { cmd: 'gcloud compute snapshots create NAME --source-disk=DISK', desc: 'Snapshot a disk', tags: ['snapshot', 'disk'] },
        ],
    },
    {
        id: 'storage',
        label: 'Cloud Storage',
        icon: HardDrive,
        color: '#34a853',
        commands: [
            { cmd: 'gsutil mb -l LOCATION gs://BUCKET', desc: 'Create a bucket', tags: ['bucket', 'create'] },
            { cmd: 'gsutil ls', desc: 'List all buckets', tags: ['bucket', 'list'] },
            { cmd: 'gsutil ls gs://BUCKET', desc: 'List objects in a bucket', tags: ['objects', 'list'] },
            { cmd: 'gsutil cp FILE gs://BUCKET/', desc: 'Upload a file', tags: ['upload', 'copy'] },
            { cmd: 'gsutil cp gs://BUCKET/FILE .', desc: 'Download a file', tags: ['download', 'copy'] },
            { cmd: 'gsutil rsync -r LOCAL gs://BUCKET/DIR', desc: 'Sync a directory', tags: ['sync', 'rsync'] },
            { cmd: 'gsutil rm gs://BUCKET/FILE', desc: 'Delete an object', tags: ['delete', 'remove'] },
            { cmd: 'gsutil rb gs://BUCKET', desc: 'Delete a bucket', tags: ['bucket', 'delete'] },
            { cmd: 'gsutil iam ch allUsers:objectViewer gs://BUCKET', desc: 'Make bucket public', tags: ['iam', 'public'] },
            { cmd: 'gsutil versioning set on gs://BUCKET', desc: 'Enable versioning', tags: ['versioning'] },
            { cmd: 'gsutil lifecycle set POLICY.json gs://BUCKET', desc: 'Set lifecycle rules', tags: ['lifecycle'] },
        ],
    },
    {
        id: 'iam',
        label: 'IAM & Security',
        icon: Shield,
        color: '#ea4335',
        commands: [
            { cmd: 'gcloud projects get-iam-policy PROJECT', desc: 'View project IAM policy', tags: ['policy', 'view'] },
            { cmd: 'gcloud projects add-iam-policy-binding PROJECT --member=MEMBER --role=ROLE', desc: 'Grant a role', tags: ['bind', 'grant', 'role'] },
            { cmd: 'gcloud projects remove-iam-policy-binding PROJECT --member=MEMBER --role=ROLE', desc: 'Revoke a role', tags: ['unbind', 'revoke', 'role'] },
            { cmd: 'gcloud iam service-accounts create NAME --display-name=DISPLAY', desc: 'Create service account', tags: ['sa', 'create'] },
            { cmd: 'gcloud iam service-accounts list', desc: 'List service accounts', tags: ['sa', 'list'] },
            { cmd: 'gcloud iam service-accounts keys create KEY.json --iam-account=SA_EMAIL', desc: 'Create SA key', tags: ['sa', 'key'] },
            { cmd: 'gcloud iam roles list', desc: 'List predefined roles', tags: ['roles'] },
            { cmd: 'gcloud iam roles describe ROLE', desc: 'Describe a role\'s permissions', tags: ['roles', 'describe'] },
        ],
    },
    {
        id: 'kubernetes',
        label: 'GKE / kubectl',
        icon: Cloud,
        color: '#4285f4',
        commands: [
            { cmd: 'gcloud container clusters create-auto NAME --region=REGION', desc: 'Create Autopilot cluster', tags: ['gke', 'create'] },
            { cmd: 'gcloud container clusters get-credentials NAME --region=REGION', desc: 'Configure kubeconfig', tags: ['gke', 'credentials'] },
            { cmd: 'gcloud container clusters list', desc: 'List GKE clusters', tags: ['gke', 'list'] },
            { cmd: 'kubectl get pods', desc: 'List pods', tags: ['pods', 'list'] },
            { cmd: 'kubectl get deployments', desc: 'List deployments', tags: ['deployments'] },
            { cmd: 'kubectl get services', desc: 'List services', tags: ['services'] },
            { cmd: 'kubectl describe pod POD', desc: 'Describe a pod', tags: ['pods', 'describe'] },
            { cmd: 'kubectl logs POD', desc: 'View pod logs', tags: ['pods', 'logs'] },
            { cmd: 'kubectl apply -f FILE.yaml', desc: 'Apply a manifest', tags: ['apply', 'yaml'] },
            { cmd: 'kubectl scale deployment NAME --replicas=N', desc: 'Scale a deployment', tags: ['scale', 'replicas'] },
            { cmd: 'kubectl rollout restart deployment NAME', desc: 'Rolling restart', tags: ['rollout', 'restart'] },
            { cmd: 'kubectl create namespace NAME', desc: 'Create a namespace', tags: ['namespace', 'create'] },
            { cmd: 'kubectl exec -it POD -- /bin/bash', desc: 'Exec into a pod', tags: ['exec', 'shell'] },
        ],
    },
    {
        id: 'serverless',
        label: 'Serverless',
        icon: Zap,
        color: '#fbbc04',
        commands: [
            { cmd: 'gcloud run deploy NAME --image=IMAGE --region=REGION', desc: 'Deploy Cloud Run service', tags: ['run', 'deploy'] },
            { cmd: 'gcloud run services list', desc: 'List Cloud Run services', tags: ['run', 'list'] },
            { cmd: 'gcloud run services update NAME --max-instances=N', desc: 'Update service settings', tags: ['run', 'update'] },
            { cmd: 'gcloud run services delete NAME --region=REGION', desc: 'Delete a Cloud Run service', tags: ['run', 'delete'] },
            { cmd: 'gcloud functions deploy NAME --runtime=RUNTIME --trigger-http', desc: 'Deploy Cloud Function', tags: ['functions', 'deploy'] },
            { cmd: 'gcloud functions logs read NAME', desc: 'View function logs', tags: ['functions', 'logs'] },
            { cmd: 'gcloud functions delete NAME', desc: 'Delete a function', tags: ['functions', 'delete'] },
        ],
    },
    {
        id: 'networking',
        label: 'Networking',
        icon: Network,
        color: '#a855f7',
        commands: [
            { cmd: 'gcloud compute networks create NAME --subnet-mode=custom', desc: 'Create a VPC', tags: ['vpc', 'create'] },
            { cmd: 'gcloud compute networks subnets create NAME --network=NET --range=CIDR --region=REGION', desc: 'Create a subnet', tags: ['subnet', 'create'] },
            { cmd: 'gcloud compute firewall-rules create NAME --network=NET --allow=PROTO:PORT', desc: 'Create firewall rule', tags: ['firewall', 'create'] },
            { cmd: 'gcloud compute firewall-rules list', desc: 'List firewall rules', tags: ['firewall', 'list'] },
            { cmd: 'gcloud compute addresses create NAME --region=REGION', desc: 'Reserve static IP', tags: ['ip', 'static'] },
            { cmd: 'gcloud dns managed-zones create NAME --dns-name=DOMAIN --description=DESC', desc: 'Create DNS zone', tags: ['dns', 'zone'] },
            { cmd: 'gcloud compute routers create NAME --network=NET --region=REGION', desc: 'Create Cloud Router', tags: ['router'] },
            { cmd: 'gcloud compute routers nats create NAME --router=ROUTER --nat-all-subnet-ip-ranges --auto-allocate-nat-external-ips', desc: 'Create Cloud NAT', tags: ['nat'] },
        ],
    },
    {
        id: 'project',
        label: 'Project & Config',
        icon: Terminal,
        color: '#00d4ff',
        commands: [
            { cmd: 'gcloud config set project PROJECT_ID', desc: 'Set active project', tags: ['config', 'project'] },
            { cmd: 'gcloud config list', desc: 'View current config', tags: ['config', 'view'] },
            { cmd: 'gcloud projects list', desc: 'List all projects', tags: ['projects', 'list'] },
            { cmd: 'gcloud services enable SERVICE', desc: 'Enable an API', tags: ['api', 'enable'] },
            { cmd: 'gcloud services list --enabled', desc: 'List enabled APIs', tags: ['api', 'list'] },
            { cmd: 'gcloud auth login', desc: 'Authenticate with Google', tags: ['auth', 'login'] },
            { cmd: 'gcloud auth application-default login', desc: 'Set application default credentials', tags: ['auth', 'adc'] },
            { cmd: 'gcloud config set compute/zone ZONE', desc: 'Set default zone', tags: ['config', 'zone'] },
            { cmd: 'gcloud config set compute/region REGION', desc: 'Set default region', tags: ['config', 'region'] },
        ],
    },
]

export default function CommandCheatSheet() {
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState(null)
    const [copiedCmd, setCopiedCmd] = useState(null)

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim()
        return CATEGORIES
            .filter((cat) => !activeCategory || cat.id === activeCategory)
            .map((cat) => ({
                ...cat,
                commands: cat.commands.filter(
                    (c) => !q || c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q))
                ),
            }))
            .filter((cat) => cat.commands.length > 0)
    }, [search, activeCategory])

    const totalCommands = CATEGORIES.reduce((a, c) => a + c.commands.length, 0)
    const shownCommands = filtered.reduce((a, c) => a + c.commands.length, 0)

    function copyCommand(cmd) {
        navigator.clipboard.writeText(cmd)
        setCopiedCmd(cmd)
        setTimeout(() => setCopiedCmd(null), 2000)
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
            <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>

            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-neon-emerald/10 flex items-center justify-center border border-neon-emerald/20 glow-emerald">
                    <BookOpen className="w-6 h-6 text-neon-emerald" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                        Command <span className="gradient-text-emerald">Cheat Sheet</span>
                    </h1>
                    <p className="text-nebula-muted text-sm">{totalCommands} essential GCP commands at your fingertips</p>
                </div>
            </div>

            {/* Search */}
            <div className="glass-card-static rounded-xl p-3 mt-6 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-dim" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search commands... (e.g. 'firewall', 'create', 'kubectl')"
                        className="w-full pl-10 pr-10 py-2.5 bg-nebula-deep/70 border border-nebula-border rounded-lg text-sm text-nebula-text placeholder:text-nebula-dim outline-none focus:border-neon-cyan/50 transition-colors"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-nebula-dim hover:text-nebula-muted cursor-pointer bg-transparent border-0">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${!activeCategory ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan' : 'bg-transparent border-nebula-border text-nebula-dim hover:text-nebula-muted'}`}
                >
                    All ({totalCommands})
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all flex items-center gap-1.5 ${activeCategory === cat.id ? 'border-opacity-30 text-opacity-100' : 'bg-transparent border-nebula-border text-nebula-dim hover:text-nebula-muted'}`}
                        style={activeCategory === cat.id ? { backgroundColor: cat.color + '15', borderColor: cat.color + '40', color: cat.color } : {}}
                    >
                        <cat.icon className="w-3 h-3" />
                        {cat.label}
                    </button>
                ))}
            </div>

            {search && (
                <p className="text-xs text-nebula-dim mb-4">{shownCommands} command{shownCommands !== 1 ? 's' : ''} found</p>
            )}

            {/* Command sections */}
            <div className="space-y-6">
                {filtered.map((cat) => (
                    <motion.div key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center gap-2 mb-3">
                            <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                            <h2 className="text-sm font-semibold text-nebula-text">{cat.label}</h2>
                            <span className="text-[10px] text-nebula-dim">· {cat.commands.length} commands</span>
                        </div>
                        <div className="space-y-1.5">
                            {cat.commands.map((c) => (
                                <div
                                    key={c.cmd}
                                    className="group flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-nebula-surface/30 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <code className="text-xs font-mono text-neon-cyan break-all leading-relaxed">{c.cmd}</code>
                                        <p className="text-[11px] text-nebula-muted mt-0.5">{c.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => copyCommand(c.cmd)}
                                        className="shrink-0 mt-1 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-nebula-surface text-nebula-dim hover:text-neon-cyan cursor-pointer bg-transparent border-0 transition-all"
                                        title="Copy command"
                                    >
                                        {copiedCmd === c.cmd ? <Check className="w-3.5 h-3.5 text-neon-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <Search className="w-8 h-8 text-nebula-dim mx-auto mb-3" />
                    <p className="text-nebula-muted text-sm">No commands match "{search}"</p>
                    <button onClick={() => { setSearch(''); setActiveCategory(null) }} className="text-neon-cyan text-xs mt-2 cursor-pointer bg-transparent border-0 hover:underline">Clear filters</button>
                </div>
            )}
        </div>
    )
}
