# Product Requirements Document (PRD)

## GCP Architecture Practice Lab

**Version:** 1.0
**Date:** 2026-02-12
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary

GCP Architecture Practice Lab is a cross-platform educational application (web + mobile) that helps cloud engineers and architects master Google Cloud Platform architecture design through interactive scenarios, hands-on challenges, and a free-form architecture canvas. Users learn by role-playing realistic daily scenarios, solving architecture design challenges with point-based scoring, and building cloud architectures visually.

### 1.2 Problem Statement

Cloud engineers preparing for GCP certifications or transitioning into cloud architecture roles lack hands-on, interactive tools to practice architectural decision-making. Existing study materials are predominantly passive (documentation, videos, flashcards) and fail to simulate the real-world decision context that architects face daily. There is no widely available tool that lets learners design, evaluate, and iterate on GCP architectures with immediate feedback.

### 1.3 Target Audience

| Segment | Description |
|---------|-------------|
| **Certification Candidates** | Engineers preparing for GCP Professional Cloud Architect or Associate Cloud Engineer exams |
| **Junior Cloud Engineers** | Engineers with 0-2 years of cloud experience building foundational architecture skills |
| **Platform/DevOps Engineers** | Engineers expanding their skillset into cloud architecture and design |
| **Team Leads & Managers** | Technical leaders evaluating team readiness or using the tool for training programs |

### 1.4 Success Metrics

| Metric | Target |
|--------|--------|
| Scenario completion rate | > 70% of started scenarios are completed |
| Challenge attempt rate | > 50% of users attempt at least 2 challenges |
| Canvas engagement | > 30% of users export at least one architecture design |
| Return usage | > 40% of users return within 7 days |
| Average score improvement | Users improve scenario scores by 20%+ on repeated attempts |

---

## 2. Tech Stack

### 2.1 Web Application

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.0 |
| Routing | React Router DOM | 6.30.3 |
| Build Tool | Vite | 7.3.1 |
| Styling | Tailwind CSS | 4.1.18 |
| Icons | Lucide React | 0.563.0 |
| State Management | React Hooks (local state) | — |
| Deployment | Static build (dist/) | — |

### 2.2 Mobile Application

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native (Expo) | 52.0.0 |
| Navigation | React Navigation | 7.0.0 |
| Animations | React Native Reanimated | 3.16.0 |
| Gestures | React Native Gesture Handler | 2.20.0 |
| Icons | @expo/vector-icons (Ionicons) | — |
| Target Platforms | iOS, Android | — |

### 2.3 Shared Data Layer

Both platforms consume identical static data modules:

- `src/data/challenges.js` — Architecture design challenges
- `src/data/scenarios.js` — Daily role-play scenarios
- `src/data/gcpServices.js` — GCP service catalog (34 services, 8 categories)

---

## 3. Features & Functional Requirements

### 3.1 Dashboard

**Purpose:** Central hub providing an overview and navigation to all learning modes.

| Requirement | Description | Priority |
|------------|-------------|----------|
| FR-DASH-01 | Display hero section introducing the platform | P0 |
| FR-DASH-02 | Show 3 feature cards linking to A Day As, Challenges, and Canvas | P0 |
| FR-DASH-03 | Rotate "Tip of the Day" from a pool of 8 GCP tips | P1 |
| FR-DASH-04 | Display quick stats: 31 total tasks, 4 challenges, 34 services | P1 |

---

### 3.2 A Day As (Scenario Mode)

**Purpose:** Immersive role-play scenarios where users act as cloud engineers solving real-world problems with multi-choice questions and detailed feedback.

#### 3.2.1 Scenario List Screen

| Requirement | Description | Priority |
|------------|-------------|----------|
| FR-SCEN-01 | List all 5 daily scenarios as cards | P0 |
| FR-SCEN-02 | Show difficulty badge, role, company, and briefing preview per card | P0 |
| FR-SCEN-03 | Display metadata: objective count, task count, max points | P1 |

#### 3.2.2 Scenario Detail Screen

| Requirement | Description | Priority |
|------------|-------------|----------|
| FR-SCEN-04 | **Briefing phase:** Present scenario context, role info, company background, and objectives before tasks begin | P0 |
| FR-SCEN-05 | **Task phase:** Present 6 multi-choice questions (4 options each, a-d) one at a time | P0 |
| FR-SCEN-06 | Each option carries 1-10 points and a detailed feedback explanation | P0 |
| FR-SCEN-07 | Show immediate feedback after each answer selection (no re-answering) | P0 |
| FR-SCEN-08 | Display a progress bar showing completed, current, and pending tasks | P1 |
| FR-SCEN-09 | **Results phase:** Show letter grade (A+ through D), total score, percentage, and detailed task-by-task review | P0 |
| FR-SCEN-10 | Results review highlights selected answer vs. best answer per task | P1 |

#### 3.2.3 Scenario Content

| ID | Scenario | Company | Difficulty | Tasks | Max Points |
|----|----------|---------|-----------|-------|------------|
| S1 | Startup Cloud Migration | FinLeap | Intermediate | 6 | 60 |
| S2 | E-Commerce Black Friday Prep | ShopWave | Advanced | 6 | 60 |
| S3 | Building a Data Analytics Platform | HealthMetrics | Advanced | 6 | 60 |
| S4 | Microservices Decomposition | TravelNow | Intermediate | 6 | 60 |
| S5 | Disaster Recovery Architecture | GlobalBank | Expert | 6 | 60 |

**Total:** 5 scenarios, 30 tasks, 300 possible points.

#### 3.2.4 Grading Scale

| Grade | Threshold |
|-------|-----------|
| A+ | >= 95% |
| A | >= 85% |
| B | >= 70% |
| C | >= 50% |
| D | < 50% |

---

### 3.3 Architecture Challenges

**Purpose:** Users select GCP services to design architectures that satisfy given requirements, then receive criteria-based scoring against a reference solution.

#### 3.3.1 Challenge List Screen

| Requirement | Description | Priority |
|------------|-------------|----------|
| FR-CHAL-01 | List all 4 challenges as cards with difficulty badge, category, description, requirements preview, and max points | P0 |
| FR-CHAL-02 | Color-code difficulty badges (Beginner=green, Intermediate=blue, Advanced=purple, Expert=red) | P1 |

#### 3.3.2 Challenge Detail Screen

| Requirement | Description | Priority |
|------------|-------------|----------|
| FR-CHAL-03 | Display full challenge description and 5-7 requirements | P0 |
| FR-CHAL-04 | Provide a searchable service picker with 34 GCP services, filterable by 8 categories | P0 |
| FR-CHAL-05 | Show selected services in a sidebar/list with removal capability | P0 |
| FR-CHAL-06 | Evaluate selected services against 7-9 criteria, each awarding 5-20 points based on whether required services are present | P0 |
| FR-CHAL-07 | Display score breakdown per criterion after submission | P0 |
| FR-CHAL-08 | Provide hints (4-5 per challenge) toggled via a hint button | P1 |
| FR-CHAL-09 | Show reference solution (recommended services + explanation) after evaluation | P1 |
| FR-CHAL-10 | Allow reset to retry the challenge | P1 |

#### 3.3.3 Challenge Content

| ID | Challenge | Difficulty | Category | Max Score |
|----|-----------|-----------|----------|-----------|
| C1 | Design a Scalable Web Application | Beginner | Web Architecture | 100 |
| C2 | Real-Time Data Processing Pipeline | Intermediate | Data Engineering | 100 |
| C3 | Multi-Region E-Commerce Platform | Advanced | E-Commerce | 100 |
| C4 | Machine Learning Operations | Advanced | ML/AI | 100 |

---

### 3.4 Architecture Canvas

**Purpose:** A free-form design tool where users visually compose GCP architectures by placing service nodes and drawing connections, with export functionality.

| Requirement | Description | Priority |
|------------|-------------|----------|
| FR-CANV-01 | Drag-and-drop GCP service nodes from a sidebar onto a canvas | P0 |
| FR-CANV-02 | Support a connection mode: click two nodes to draw a line between them | P0 |
| FR-CANV-03 | Delete nodes (X button) and connections (click line) | P0 |
| FR-CANV-04 | Zoom controls: 25% to 200% in discrete steps | P1 |
| FR-CANV-05 | Display service icons, labels, and category colors on each node | P1 |
| FR-CANV-06 | Custom project naming for exported designs | P1 |
| FR-CANV-07 | Export architecture as a JSON file containing nodes (service, category, position) and connections (from/to service names) | P0 |
| FR-CANV-08 | Status bar showing total services and connections count | P2 |

---

### 3.5 GCP Service Catalog

**Purpose:** Central reference data used across challenges, scenarios, and the canvas.

**34 services across 8 categories:**

| Category | Color | Services |
|----------|-------|----------|
| **Compute** | #4285f4 (Blue) | Compute Engine, GKE, App Engine, Cloud Run, Cloud Functions |
| **Storage & Databases** | #34a853 (Green) | Cloud Storage, Cloud SQL, Firestore, Cloud Bigtable, Cloud Spanner, Memorystore |
| **Networking** | #ea4335 (Red) | VPC, Cloud Load Balancing, Cloud CDN, Cloud DNS, Cloud Armor, Cloud NAT |
| **Security & Identity** | #fbbc04 (Yellow) | Cloud IAM, Cloud KMS, Secret Manager, Security Command Center |
| **Data Analytics** | #9c27b0 (Purple) | BigQuery, Dataflow, Dataproc, Pub/Sub, Cloud Composer |
| **AI & ML** | #ff6d00 (Orange) | Vertex AI, Vision AI, Natural Language AI |
| **DevOps & CI/CD** | #00bcd4 (Cyan) | Cloud Build, Artifact Registry, Cloud Deploy, Cloud Monitoring, Cloud Logging |
| **Serverless** | #e91e63 (Pink) | *(Cloud Run and Cloud Functions are cross-listed)* |

---

## 4. Data Models

### 4.1 Challenge

```
Challenge {
  id: string
  title: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  category: string
  description: string
  requirements: string[]
  hints: string[]
  evaluationCriteria: [{
    id: string
    label: string
    points: number
    services: string[]       // required services to earn points
  }]
  maxScore: number
  sampleSolution: {
    services: string[]
    explanation: string
  }
}
```

### 4.2 Scenario

```
Scenario {
  id: string
  title: string
  role: string
  company: string
  difficulty: string
  estimatedTasks: number
  briefing: string
  objectives: string[]
  tasks: [{
    id: string
    title: string
    description: string
    options: [{
      id: string             // a, b, c, d
      text: string
      points: number         // 1-10
      feedback: string
    }]
  }]
}
```

### 4.3 GCP Service

```
GCPService {
  id: string
  name: string
  category: string
  description: string
  icon: LucideIconComponent
}

ServiceCategory {
  id: string
  name: string
  color: string
  icon: LucideIconComponent
}
```

### 4.4 Canvas Architecture

```
CanvasNode {
  id: string
  serviceId: string
  service: GCPService
  x: number                  // pixel position
  y: number
  label: string
}

CanvasConnection {
  id: string
  from: string               // node ID
  to: string                 // node ID
}

ExportedDesign {
  name: string
  exportedAt: ISO8601
  nodes: [{ service, category, x, y, label }]
  connections: [{ from: serviceName, to: serviceName }]
}
```

---

## 5. Screens & Navigation

### 5.1 Web App Navigation

```
Navbar (sticky top)
├── Dashboard          /
├── A Day As           /scenarios
│   └── Scenario       /scenarios/:id
├── Challenges         /challenges
│   └── Challenge      /challenges/:id
└── Arch Canvas        /canvas
```

### 5.2 Mobile App Navigation

```
Bottom Tab Navigator
├── Dashboard Tab (Stack)
│   └── DashboardScreen
├── A Day As Tab (Stack)
│   ├── DayAsListScreen
│   └── DayAsScenarioScreen
├── Challenges Tab (Stack)
│   ├── ChallengesListScreen
│   └── ChallengeDetailScreen
└── Canvas Tab (Stack)
    └── CanvasScreen
```

---

## 6. UI & Design

### 6.1 Theme

- **Primary palette:** Dark background (#0f172a slate-900) with GCP brand colors for categories
- **Typography:** System fonts, monospace accents for technical content
- **Iconography:** Lucide React (web), Ionicons (mobile)
- **Design language:** Card-based layouts, color-coded badges, progress indicators

### 6.2 Responsive Behavior

| Breakpoint | Behavior |
|-----------|----------|
| Desktop (>1024px) | Full sidebar, multi-column grid, expanded canvas |
| Tablet (768-1024px) | Collapsed sidebar, 2-column grid |
| Mobile (<768px) | Icon-only navbar, single column, stacked cards |
| Native Mobile | Dedicated React Native screens via Expo |

---

## 7. Non-Functional Requirements

| Requirement | Specification |
|------------|---------------|
| **Performance** | First Contentful Paint < 1.5s (web), screen transitions < 300ms (mobile) |
| **Accessibility** | Color-coded elements have text labels; touch targets >= 44px (mobile) |
| **Offline capability** | All content is bundled statically; no network dependency for core features |
| **Browser support** | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |
| **Mobile support** | iOS 15+, Android 12+ via Expo |
| **Bundle size** | Web production build < 500KB gzipped |
| **State persistence** | Currently local/session only (no backend) |

---

## 8. Architecture

### 8.1 Current Architecture

```
┌──────────────────────────────────────────────┐
│                  Client Layer                 │
├──────────────────┬───────────────────────────┤
│    Web App       │      Mobile App           │
│  (React + Vite)  │  (React Native + Expo)    │
├──────────────────┴───────────────────────────┤
│              Shared Data Layer                │
│  challenges.js | scenarios.js | gcpServices.js│
├──────────────────────────────────────────────┤
│          Static Deployment (no backend)       │
│   Web: Vite build → static hosting           │
│   Mobile: Expo build → App Store / Play Store │
└──────────────────────────────────────────────┘
```

### 8.2 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No backend / API | All content is static; eliminates hosting cost and latency for an educational tool |
| Shared data files | Ensures content parity between web and mobile with zero synchronization overhead |
| Local state only | Simplifies architecture; no auth or database required for MVP |
| Vite for web builds | Fast HMR during development, optimized production bundles |
| Expo for mobile | Rapid cross-platform development without native build toolchains |

---

## 9. Future Roadmap

| Phase | Feature | Description |
|-------|---------|-------------|
| **v1.1** | Progress persistence | Save scores and completion state to localStorage / AsyncStorage |
| **v1.2** | Additional content | 5 more scenarios, 4 more challenges, expanded service catalog |
| **v1.3** | User accounts | Optional sign-in to sync progress across devices |
| **v1.4** | Leaderboard | Anonymous score comparison for scenarios and challenges |
| **v2.0** | AI-powered feedback | Use Vertex AI to provide natural language architecture reviews on canvas designs |
| **v2.1** | Collaborative canvas | Real-time multi-user architecture design sessions |
| **v2.2** | Custom scenario builder | Let users create and share their own scenarios |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content becomes outdated as GCP evolves | Users learn deprecated patterns | Quarterly content review cycle; version-date all scenarios |
| No progress persistence in v1.0 | Users lose scores on refresh/app close | Prioritize localStorage persistence in v1.1 |
| Static scoring may feel rigid | Users with valid alternative architectures score poorly | Add hints, show reference solutions, and plan AI-powered flexible evaluation for v2.0 |
| Mobile canvas UX limitations | Touch-based node placement less precise than mouse | Implement snap-to-grid and simplified connection UX for mobile |

---

## 11. Appendix

### A. Content Summary

| Content Type | Count |
|-------------|-------|
| Scenarios | 5 |
| Total scenario tasks | 30 |
| Architecture challenges | 4 |
| GCP services in catalog | 34 |
| Service categories | 8 |
| Tips of the day | 8 |
| Evaluation criteria (across all challenges) | ~32 |

### B. Scoring Summary

| Mode | Max Score | Scoring Method |
|------|-----------|---------------|
| Scenarios (each) | 60 pts | 6 tasks x 10 pts max per task |
| Scenarios (total) | 300 pts | 5 scenarios x 60 pts |
| Challenges (each) | 100 pts | 7-9 criteria x 5-20 pts each |
| Challenges (total) | 400 pts | 4 challenges x 100 pts |
| **Grand Total** | **700 pts** | All content combined |
