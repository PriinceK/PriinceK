import { Link } from 'react-router-dom'
import {
    Terminal, Cloud, Network, FileCode2, DollarSign,
    GraduationCap, Zap, Shield, RotateCcw, Flame,
    BookOpen, Brain, GitCompareArrows, Target,
    Github, Heart,
} from 'lucide-react'

const COLUMNS = [
    {
        title: 'Labs',
        links: [
            { to: '/linux-lab', label: 'Linux Fundamentals', icon: Terminal },
            { to: '/gcloud-lab', label: 'GCloud CLI', icon: Cloud },
            { to: '/network-lab', label: 'Networking', icon: Network },
            { to: '/terraform-lab', label: 'Terraform', icon: FileCode2 },
            { to: '/cost-labs', label: 'Cost Labs', icon: DollarSign },
        ],
    },
    {
        title: 'Practice',
        links: [
            { to: '/exam', label: 'Exam Simulator', icon: GraduationCap },
            { to: '/timed-drills', label: 'Timed Drills', icon: Zap },
            { to: '/daily-challenge', label: 'Daily Challenge', icon: Flame },
            { to: '/iam-simulator', label: 'IAM Simulator', icon: Shield },
            { to: '/review', label: 'Review Cards', icon: RotateCcw },
        ],
    },
    {
        title: 'Study',
        links: [
            { to: '/services', label: 'Service Encyclopedia', icon: BookOpen },
            { to: '/learning-paths', label: 'Learning Paths', icon: Target },
            { to: '/cheat-sheet', label: 'Command Cheat Sheet', icon: Terminal },
            { to: '/knowledge-map', label: 'Knowledge Map', icon: Brain },
            { to: '/compare', label: 'Compare Services', icon: GitCompareArrows },
        ],
    },
]

export default function Footer() {
    return (
        <footer className="relative z-10 mt-16 border-t border-nebula-border/30">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10">
                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-nebula-dim mb-3">{col.title}</h4>
                            <ul className="space-y-2 list-none p-0 m-0">
                                {col.links.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className="flex items-center gap-2 text-sm text-nebula-muted hover:text-neon-cyan no-underline transition-colors"
                                        >
                                            <link.icon className="w-3.5 h-3.5 opacity-50" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-nebula-border/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-nebula-dim">
                        <Cloud className="w-4 h-4 text-neon-cyan" />
                        <span className="font-bold text-nebula-muted" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>GCP Lab</span>
                        <span className="hidden sm:inline">·</span>
                        <span className="hidden sm:inline">Built for GCP certification prep</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-nebula-dim">
                        <span className="flex items-center gap-1">
                            Made with <Heart className="w-3 h-3 text-neon-rose" /> for cloud learners
                        </span>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-neon-cyan transition-colors"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
