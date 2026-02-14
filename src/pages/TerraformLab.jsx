import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, CheckCircle2, Circle, ChevronRight, Copy, Check,
    FileCode2, Lightbulb, RotateCcw, Eye, EyeOff,
} from 'lucide-react'

const PROGRESS_KEY = 'gcp-terraform-lab-progress'
const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} } }
const saveProgress = (p) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))

const TERRAFORM_LESSONS = [
    {
        id: 'tf-basics',
        title: 'Terraform Basics',
        icon: '📝',
        difficulty: 'Beginner',
        description: 'Learn provider configuration, resources, variables, and outputs.',
        exercises: [
            {
                title: 'Configure the Google Provider',
                instruction: 'Write a Terraform provider block for Google Cloud with project and region.',
                template: `# Configure the Google Cloud provider
provider "google" {
  # TODO: Set the project ID
  
  # TODO: Set the default region
  
}`,
                solution: `provider "google" {
  project = "my-gcp-project"
  region  = "us-central1"
}`,
                hints: ['Use "project" and "region" arguments', 'Project should be a string like "my-gcp-project"'],
                concepts: ['provider', 'project', 'region'],
            },
            {
                title: 'Create a GCS Bucket',
                instruction: 'Define a Cloud Storage bucket resource with versioning enabled.',
                template: `# Create a Cloud Storage bucket
resource "google_storage_bucket" "data_bucket" {
  # TODO: Set the bucket name
  
  # TODO: Set location to "US"
  
  # TODO: Enable versioning
  
}`,
                solution: `resource "google_storage_bucket" "data_bucket" {
  name     = "my-project-data-bucket"
  location = "US"

  versioning {
    enabled = true
  }
}`,
                hints: ['Use name, location, and versioning block', 'Versioning is a nested block with enabled = true'],
                concepts: ['resource', 'google_storage_bucket', 'versioning'],
            },
            {
                title: 'Define Variables and Outputs',
                instruction: 'Create a variable for project ID and an output for the bucket URL.',
                template: `# Define a variable for the project ID
variable "project_id" {
  # TODO: Add description and type
  
}

# Output the bucket self_link
output "bucket_url" {
  # TODO: Reference the bucket self_link
  
}`,
                solution: `variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

output "bucket_url" {
  value       = google_storage_bucket.data_bucket.self_link
  description = "The URI of the bucket"
}`,
                hints: ['Variables use description and type arguments', 'Outputs reference resources with resource_type.resource_name.attribute'],
                concepts: ['variable', 'output', 'reference'],
            },
        ],
    },
    {
        id: 'tf-compute',
        title: 'Compute Engine with Terraform',
        icon: '💻',
        difficulty: 'Intermediate',
        description: 'Provision VMs, instance templates, and managed instance groups.',
        exercises: [
            {
                title: 'Create a Compute Instance',
                instruction: 'Define a Compute Engine VM with network configuration.',
                template: `resource "google_compute_instance" "web_server" {
  # TODO: Set name and machine_type
  
  # TODO: Set zone
  
  boot_disk {
    initialize_params {
      # TODO: Set the image
      
    }
  }

  network_interface {
    # TODO: Set network and add access_config for external IP
    
  }
}`,
                solution: `resource "google_compute_instance" "web_server" {
  name         = "web-server"
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
    }
  }

  network_interface {
    network = "default"
    access_config {}  # Ephemeral external IP
  }
}`,
                hints: ['Machine type examples: e2-micro, e2-medium, n2-standard-4', 'Image format: project/family, e.g. debian-cloud/debian-12', 'Empty access_config {} gives an ephemeral external IP'],
                concepts: ['google_compute_instance', 'boot_disk', 'network_interface'],
            },
            {
                title: 'Create an Instance Template + MIG',
                instruction: 'Define an instance template and a managed instance group with autoscaling.',
                template: `resource "google_compute_instance_template" "web_template" {
  # TODO: Set name_prefix and machine_type
  
  disk {
    # TODO: Set source_image
    
  }
  
  network_interface {
    network = "default"
  }
}

resource "google_compute_instance_group_manager" "web_mig" {
  # TODO: Set name and base_instance_name
  
  # TODO: Set zone and target_size
  
  version {
    # TODO: Reference the instance template
    
  }
}`,
                solution: `resource "google_compute_instance_template" "web_template" {
  name_prefix  = "web-"
  machine_type = "e2-medium"

  disk {
    source_image = "debian-cloud/debian-12"
    auto_delete  = true
    boot         = true
  }

  network_interface {
    network = "default"
  }
}

resource "google_compute_instance_group_manager" "web_mig" {
  name               = "web-mig"
  base_instance_name = "web"
  zone               = "us-central1-a"
  target_size        = 3

  version {
    instance_template = google_compute_instance_template.web_template.id
  }
}`,
                hints: ['Use name_prefix instead of name for templates (allows recreation)', 'Reference templates with resource_type.name.id', 'target_size sets the desired number of instances'],
                concepts: ['instance_template', 'instance_group_manager', 'autoscaling'],
            },
        ],
    },
    {
        id: 'tf-networking',
        title: 'VPC Networking with Terraform',
        icon: '🌐',
        difficulty: 'Intermediate',
        description: 'Build VPC networks, subnets, firewall rules, and Cloud NAT.',
        exercises: [
            {
                title: 'Create VPC with Custom Subnets',
                instruction: 'Define a custom VPC with application and database subnets.',
                template: `resource "google_compute_network" "vpc" {
  # TODO: Set name and auto_create_subnetworks
  
}

resource "google_compute_subnetwork" "app_subnet" {
  # TODO: Set name, network reference, ip_cidr_range, region
  
}

resource "google_compute_subnetwork" "db_subnet" {
  # TODO: Set name, network reference, ip_cidr_range, region
  
}`,
                solution: `resource "google_compute_network" "vpc" {
  name                    = "prod-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "app_subnet" {
  name          = "app-subnet"
  network       = google_compute_network.vpc.id
  ip_cidr_range = "10.1.0.0/24"
  region        = "us-central1"
}

resource "google_compute_subnetwork" "db_subnet" {
  name          = "db-subnet"
  network       = google_compute_network.vpc.id
  ip_cidr_range = "10.2.0.0/24"
  region        = "us-central1"
}`,
                hints: ['Set auto_create_subnetworks = false for custom VPCs', 'Reference VPC with google_compute_network.vpc.id', 'Subnets need ip_cidr_range and region'],
                concepts: ['google_compute_network', 'google_compute_subnetwork', 'custom_vpc'],
            },
            {
                title: 'Create Firewall Rules',
                instruction: 'Add firewall rules allowing HTTP, HTTPS, and SSH.',
                template: `resource "google_compute_firewall" "allow_http" {
  # TODO: Set name, network, allow block, source_ranges
  
}

resource "google_compute_firewall" "allow_ssh" {
  # TODO: Set name, network, allow block, source_ranges, target_tags
  
}`,
                solution: `resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = google_compute_network.vpc.id

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["web-server"]
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-ssh"
  network = google_compute_network.vpc.id

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["ssh-allowed"]
}`,
                hints: ['allow block has protocol and ports arguments', 'Use source_ranges for allowed source IPs', 'Use target_tags to restrict which VMs the rule applies to'],
                concepts: ['google_compute_firewall', 'allow_block', 'target_tags'],
            },
        ],
    },
    {
        id: 'tf-serverless',
        title: 'Cloud Run & Cloud Functions',
        icon: '⚡',
        difficulty: 'Advanced',
        description: 'Deploy serverless workloads with Terraform.',
        exercises: [
            {
                title: 'Deploy Cloud Run Service',
                instruction: 'Create a Cloud Run service with auto-scaling configuration.',
                template: `resource "google_cloud_run_v2_service" "api" {
  # TODO: Set name, location, and template

}`,
                solution: `resource "google_cloud_run_v2_service" "api" {
  name     = "api-service"
  location = "us-central1"

  template {
    containers {
      image = "gcr.io/my-project/api:v1"
      ports {
        container_port = 8080
      }
      resources {
        limits = {
          cpu    = "2"
          memory = "1Gi"
        }
      }
    }
    scaling {
      min_instance_count = 1
      max_instance_count = 10
    }
  }
}`,
                hints: ['Use google_cloud_run_v2_service for latest API', 'Template contains containers and scaling blocks', 'Containers need image, ports, and resources'],
                concepts: ['google_cloud_run_v2_service', 'scaling', 'container_resources'],
            },
        ],
    },
]

export default function TerraformLab() {
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [currentExercise, setCurrentExercise] = useState(0)
    const [code, setCode] = useState('')
    const [showSolution, setShowSolution] = useState(false)
    const [progress, setProgress] = useState(getProgress)
    const [copiedCode, setCopiedCode] = useState(false)
    const textareaRef = useRef(null)

    const lesson = selectedLesson ? TERRAFORM_LESSONS.find((l) => l.id === selectedLesson) : null
    const exercise = lesson ? lesson.exercises[currentExercise] : null

    useEffect(() => {
        if (exercise) {
            setCode(exercise.template)
            setShowSolution(false)
        }
    }, [selectedLesson, currentExercise])

    function selectLesson(id) {
        setSelectedLesson(id)
        setCurrentExercise(0)
    }

    function markComplete() {
        const p = getProgress()
        if (!p[selectedLesson]) p[selectedLesson] = { completed: [] }
        if (!p[selectedLesson].completed.includes(currentExercise)) {
            p[selectedLesson].completed.push(currentExercise)
        }
        saveProgress(p)
        setProgress(p)
    }

    function copyCode(text) {
        navigator.clipboard.writeText(text)
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
    }

    function reset() {
        const p = getProgress()
        delete p[selectedLesson]
        saveProgress(p)
        setProgress(p)
    }

    // ─── Lesson List ───
    if (!selectedLesson) {
        const totalExercises = TERRAFORM_LESSONS.reduce((a, l) => a + l.exercises.length, 0)
        const totalCompleted = Object.values(progress).reduce((a, l) => a + (l.completed?.length || 0), 0)
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center border border-neon-purple/20 glow-purple">
                        <FileCode2 className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                            Terraform <span className="gradient-text-cyan">Lab</span>
                        </h1>
                        <p className="text-nebula-muted text-sm">Write infrastructure-as-code for GCP resources</p>
                    </div>
                </div>

                <div className="glass-card-static rounded-xl p-4 mb-8 mt-6 flex items-center justify-between">
                    <span className="text-sm text-nebula-muted">{totalCompleted}/{totalExercises} exercises completed</span>
                    <div className="w-32 h-2 rounded-full bg-nebula-deep overflow-hidden">
                        <div className="h-full rounded-full bg-neon-purple" style={{ width: `${(totalCompleted / totalExercises) * 100}%` }} />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    {TERRAFORM_LESSONS.map((l) => {
                        const completed = progress[l.id]?.completed?.length || 0
                        const dc = DIFF_COLORS[l.difficulty] || DIFF_COLORS.Beginner
                        return (
                            <motion.button
                                key={l.id}
                                whileHover={{ y: -2 }}
                                onClick={() => selectLesson(l.id)}
                                className="glass-card rounded-xl p-5 text-left cursor-pointer border-0 w-full transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-2xl">{l.icon}</span>
                                    {completed === l.exercises.length && <CheckCircle2 className="w-5 h-5 text-neon-emerald" />}
                                </div>
                                <h3 className="text-base font-bold text-nebula-text mb-1">{l.title}</h3>
                                <p className="text-xs text-nebula-muted mb-3">{l.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${dc.bg} ${dc.text} border ${dc.border}`}>{l.difficulty}</span>
                                    <span className="text-[10px] text-nebula-dim font-mono">{completed}/{l.exercises.length}</span>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        )
    }

    // ─── Exercise Detail ───
    const isComplete = progress[selectedLesson]?.completed?.includes(currentExercise)

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <button onClick={() => setSelectedLesson(null)} className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 cursor-pointer bg-transparent border-0 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Lessons
            </button>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{exercise.title}</h1>
                    <p className="text-sm text-nebula-muted">{exercise.instruction}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-nebula-dim">Exercise {currentExercise + 1}/{lesson.exercises.length}</span>
                    <button onClick={reset} className="text-nebula-dim hover:text-nebula-muted text-xs cursor-pointer bg-transparent border-0">
                        <RotateCcw className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 mb-6">
                {/* Editor */}
                <div className="glass-card-static rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-nebula-border">
                        <span className="text-xs font-medium text-nebula-muted">main.tf</span>
                        <button onClick={() => copyCode(code)} className="text-nebula-dim hover:text-nebula-muted cursor-pointer bg-transparent border-0">
                            {copiedCode ? <Check className="w-3.5 h-3.5 text-neon-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-80 p-4 bg-[#0a0e1a] text-nebula-text font-mono text-xs leading-relaxed resize-none border-0 outline-none"
                        spellCheck={false}
                    />
                </div>

                {/* Solution / Hints */}
                <div className="space-y-4">
                    {/* Hints */}
                    <div className="glass-card-static rounded-xl p-4">
                        <h3 className="text-xs font-semibold text-nebula-muted uppercase mb-3 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-neon-amber" /> Hints
                        </h3>
                        <ul className="space-y-2">
                            {exercise.hints.map((hint, i) => (
                                <li key={i} className="text-xs text-nebula-muted flex items-start gap-2">
                                    <span className="text-neon-amber">•</span> {hint}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Concepts */}
                    <div className="glass-card-static rounded-xl p-4">
                        <h3 className="text-xs font-semibold text-nebula-muted uppercase mb-3">Key Concepts</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {exercise.concepts.map((c) => (
                                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">{c}</span>
                            ))}
                        </div>
                    </div>

                    {/* Solution toggle */}
                    <div className="glass-card-static rounded-xl overflow-hidden">
                        <button
                            onClick={() => setShowSolution(!showSolution)}
                            className="w-full px-4 py-3 flex items-center justify-between cursor-pointer bg-transparent border-0 text-left"
                        >
                            <span className="text-xs font-semibold text-nebula-muted flex items-center gap-1">
                                {showSolution ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {showSolution ? 'Hide' : 'Show'} Solution
                            </span>
                        </button>
                        <AnimatePresence>
                            {showSolution && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                    <pre className="px-4 pb-4 text-xs font-mono text-neon-emerald/80 whitespace-pre-wrap">
                                        {exercise.solution}
                                    </pre>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={markComplete}
                    disabled={isComplete}
                    className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border transition-all ${isComplete
                            ? 'bg-neon-emerald/10 border-neon-emerald/25 text-neon-emerald'
                            : 'bg-neon-cyan/10 border-neon-cyan/25 text-neon-cyan hover:bg-neon-cyan/20'
                        }`}
                >
                    {isComplete ? '✓ Completed' : 'Mark as Complete'}
                </button>

                {currentExercise < lesson.exercises.length - 1 && (
                    <button
                        onClick={() => setCurrentExercise(currentExercise + 1)}
                        className="px-4 py-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan text-sm font-medium cursor-pointer hover:bg-neon-cyan/20 transition-colors flex items-center gap-1"
                    >
                        Next Exercise <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

const DIFF_COLORS = {
    Beginner: { bg: 'bg-neon-emerald/10', text: 'text-neon-emerald', border: 'border-neon-emerald/20' },
    Intermediate: { bg: 'bg-neon-amber/10', text: 'text-neon-amber', border: 'border-neon-amber/20' },
    Advanced: { bg: 'bg-neon-rose/10', text: 'text-neon-rose', border: 'border-neon-rose/20' },
}
