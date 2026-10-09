# Evident.ai

### Enterprise ESG Verification & Audit Platform

Evident.ai is a full-stack ESG reporting and verification platform designed to improve the **trust, traceability, and auditability of Environmental, Social, and Governance (ESG) disclosures**.

The platform allows organizations to submit ESG disclosures, attach supporting evidence, verify reported values against independent sources, perform automated validation, generate cryptographic proofs, anchor disclosure integrity to the Ethereum blockchain, and route submissions through an auditor-controlled verification workflow.

---

## 🚀 Live Application

**Live Demo:** https://evident-ai-frontend.onrender.com

**GitHub:** Bushra-Mahek/evident.ai

---

## 📌 Why Evident.ai?

Organizations increasingly rely on ESG data for:

- Regulatory reporting
- Sustainability disclosures
- Investor decision-making
- Corporate governance
- Supply-chain transparency
- Sustainability ratings
- Internal compliance and audits

However, ESG data can be difficult to verify because information may originate from multiple systems, documents, reporting teams, and external sources.

Traditional workflows often rely heavily on:

- Manually submitted spreadsheets
- Documents stored separately from reported values
- Manual verification
- Repeated reconciliation
- Limited audit traceability
- Centralized records that can be modified without an independently verifiable integrity proof

Evident.ai addresses this problem by combining:

**Structured ESG data + evidence + automated validation + independent cross-verification + cryptographic integrity + blockchain anchoring + human audit**

---

# 🎯 Core Objectives

Evident.ai is designed around five major objectives:

### 1. Data Integrity

Ensure that ESG disclosures are represented as structured, traceable records rather than isolated documents.

### 2. Evidence-Based Reporting

Associate reported ESG values with supporting evidence documents.

### 3. Independent Verification

Compare reported values against independent data sources before submission.

### 4. Tamper-Evident Auditability

Generate SHA-256 hashes and Merkle roots representing the integrity of disclosure data and anchor the resulting proof on Ethereum.

### 5. Controlled Governance

Provide role-based workflows so that companies, auditors, regulators, and administrators have different responsibilities and permissions.

---

# 🏗️ System Architecture

```text
                         ┌───────────────────────┐
                         │      User Browser     │
                         │    React / Vite       │
                         └───────────┬───────────┘
                                     │
                                     │ HTTPS / REST API
                                     ▼
                         ┌───────────────────────┐
                         │     Node / Express    │
                         │       Backend         │
                         └───────────┬───────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
        ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐
        │ PostgreSQL     │  │ AWS S3         │  │ External        │
        │ Neon           │  │ Private Docs   │  │ Verification    │
        └────────────────┘  └────────────────┘  │ Providers       │
                                                └─────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │ SHA-256 / Merkle │
                            │      Tree        │
                            └────────┬─────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │ Ethereum Sepolia │
                            │ Blockchain       │
                            └──────────────────┘
🧩 Technology Stack

Frontend
- React
- Vite
- React Router
- Axios
- CSS

Backend
- Node.js
- Express.js
- PostgreSQL
- pg
- JWT authentication
- bcrypt
- REST APIs

Security
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Password hashing
- Protected routes
- Private document storage
- Signed S3 URLs

Data Integrity
- SHA-256
- Merkle Trees
- Merkle Roots

Blockchain
- Ethereum Sepolia
- Solidity smart contract
- Alchemy RPC
- Blockchain transaction anchoring

Cloud Infrastructure
- Render
- Neon PostgreSQL
- AWS S3

👥 Role-Based Access Control
Evident.ai supports four application roles.

Role	Responsibilities
COMPANY_USER	Create, edit, submit, and track company disclosures
AUDITOR	Review submitted disclosures and verify or reject them
REGULATOR	Read-only access to disclosures, evidence, and verification information
ADMIN	Manage users, companies, and operational audit information


Privileged operations are protected using backend authorization rather than relying only on frontend visibility.
🔄 ESG Disclosure Workflow
The primary disclosure lifecycle is:
Company User
     │
     ▼
Create Draft
     │
     ▼
Enter ESG Data
     │
     ▼
Attach Evidence
     │
     ▼
Cross-Source Verification
     │
     ▼
Automated Validation
     │
     ▼
Submit Disclosure
     │
     ▼
Generate Merkle Root
     │
     ▼
Anchor Integrity Proof
on Ethereum Sepolia
     │
     ▼
UNDER_REVIEW
     │
     ├───────────────┐
     │               │
     ▼               ▼
  VERIFY           REJECT
     │               │
     ▼               ▼
 VERIFIED          DRAFT
                     │
                     ▼
                Edit / Resubmit

A rejected disclosure can be corrected and resubmitted for another audit cycle.

🔍 Cross-Source Verification
Before a disclosure is submitted, reported ESG values can be compared against independent sources.
The system evaluates:
Company Reported Value
          │
          ▼
Independent Source
          │
          ▼
Comparison + Tolerance Check
          │
          ▼
VERIFIED / MISMATCH

A mismatch prevents the disclosure from progressing until the reported information is corrected.
This creates an additional verification layer before human audit.

✅ Automated Validation
Evident.ai performs automated checks before submission.
Validation includes checks such as:
- Data completeness
- Evidence completeness
- Numeric validity
- Non-negative values
- Unit consistency
- Reporting period validity
- Evidence association
- Calculation consistency
- Cross-field consistency
- Anomaly detection rules
The validation engine produces structured validation results that can be reviewed by auditors.

📄 Evidence Management
Supporting ESG documents are stored using private AWS S3 storage.
The platform associates evidence with the relevant disclosure and maintains document metadata and integrity information.
Documents are not intended to be publicly accessible.
Access is controlled through authenticated application workflows and signed URLs.

🔐 Cryptographic Integrity
Evident.ai uses SHA-256 hashing to represent the integrity of disclosure-related data.
Multiple disclosure records can be represented through a Merkle Tree.
                Merkle Root
                    │
          ┌─────────┴─────────┐
          │                   │
       Hash AB             Hash CD
       /     \             /     \
      A       B           C       D

The resulting Merkle Root provides a compact cryptographic representation of the underlying disclosure data.
⛓️ Blockchain Anchoring
The generated Merkle Root can be anchored to the Ethereum Sepolia test network.
The blockchain stores the integrity proof rather than the underlying private ESG documents.
This provides an independently verifiable timestamped reference for the disclosure state.
Conceptually:
ESG Disclosure
      │
      ▼
Canonical Data
      │
      ▼
SHA-256 Hashes
      │
      ▼
Merkle Tree
      │
      ▼
Merkle Root
      │
      ▼
Ethereum Sepolia

🧾 Audit Trail
The platform records important workflow transitions and audit activities.
Examples include:
- Disclosure creation
- Disclosure updates
- Evidence uploads
- Submission
- Verification
- Rejection
- Blockchain anchoring
- Certificate generation
The audit history allows reviewers to understand how a disclosure progressed through the verification lifecycle.

🏢 Industry Applications
Evident.ai can serve as a foundation for ESG verification workflows in areas such as:
Corporate Sustainability Reporting
Organizations can structure and validate sustainability disclosures before publishing or submitting them.
ESG Auditing
Auditors can review reported values, evidence, validation results, and blockchain integrity proofs from a centralized workspace.
Regulatory Oversight
Regulators can access read-only disclosure and verification information without modifying company records.
Supply Chain ESG
The architecture can be extended to verify sustainability claims across multiple suppliers and organizational entities.
Investor Due Diligence
Verified and traceable ESG information can provide stronger confidence for organizations evaluating sustainability performance.
Compliance Workflows
Structured evidence, validation results, audit logs, and immutable integrity proofs can support compliance-oriented workflows.

🛡️ Security Model
Evident.ai follows several security principles:
- JWT authentication
- Password hashing
- Role-based authorization
- Protected API routes
- Private S3 document storage
- Signed document URLs
- Environment-based secret management
- Cryptographic hashing
- Blockchain-based integrity anchoring
Secrets and credentials are intentionally excluded from source control.
Production credentials are configured through deployment environment variables.

evident.ai/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── s3.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── disclosureController.js
│   │   ├── verificationController.js
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   └── ...
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   ├── companyModel.js
│   │   ├── disclosureModel.js
│   │   ├── dataPointModel.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── disclosureRoutes.js
│   │   ├── verificationRoutes.js
│   │   └── ...
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── disclosureService.js
│   │   ├── verificationService.js
│   │   ├── validationService.js
│   │   ├── blockchainService.js
│   │   ├── certificateService.js
│   │   ├── crossVerification/
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── merkle.js
│   │   └── ...
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
├── LICENSE
└── README.md

⚙️ Local Development
Prerequisites
Install:
- Node.js
- npm
- PostgreSQL
- Git
You will also need the required environment variables for the backend and frontend.
1. Clone the Repository
git clone <repository-url>
cd evident.ai

2. Configure Backend
Create:
backend/.env

Configure the required database, authentication, AWS, and blockchain environment variables.
Never commit .env files to GitHub.
3. Start the Backend
Open a terminal:
cd backend
npm install
npm run dev

The backend runs locally on:
http://localhost:5000

4. Start the Frontend
Open another terminal:
cd frontend
npm install
npm run dev

Vite will provide the local frontend URL.

🌐 Production Deployment
The production architecture uses:
React/Vite
     │
     ▼
Render Static Site
     │
     ▼
Render Node/Express API
     │
     ├── Neon PostgreSQL
     ├── AWS S3
     └── Ethereum Sepolia

Environment-specific configuration is supplied through deployment environment variables rather than committing secrets to the repository.

## Screenshots
<img width="1920" height="1080" alt="Screenshot (911)" src="https://github.com/user-attachments/assets/9bfbc9af-aab1-48d7-be5a-1a5c15354c8b" />

<img width="1920" height="1080" alt="Screenshot (912)" src="https://github.com/user-attachments/assets/8b13bcd1-38ea-49aa-bbca-bd1c82d91daa" />

<img width="1920" height="1080" alt="Screenshot (914)" src="https://github.com/user-attachments/assets/74e131e2-2373-4b04-b45f-45ee4b9a14e0" />


🔮 Future Roadmap
Evident.ai is designed as a foundation that can be extended beyond deterministic verification workflows.
Planned future capabilities include:
Agentic AI for Evidence Processing
AI agents can assist with:
- Evidence document analysis
- Evidence-to-metric mapping
- Document consistency checks
- Missing evidence detection
- Automated evidence extraction
- Cross-source investigation
- Audit preparation
The goal is to move from:
Human manually collects
→ Human manually checks
→ Human manually prepares audit

toward:
AI Agent
   ↓
Collect evidence
   ↓
Extract relevant information
   ↓
Cross-check sources
   ↓
Identify inconsistencies
   ↓
Prepare audit findings
   ↓
Human Auditor
   ↓
Final decision

AI will assist the auditor rather than replace the governance and approval process.

🧠 Future System Design
Future iterations can introduce:
- Agentic AI workflows
- Event-driven architecture
- Asynchronous processing
- Queue-based evidence processing
- Advanced anomaly detection
- More external verification providers
- Advanced ESG standards integration
- Multi-organization workflows
- Scalable cloud infrastructure
- Enhanced observability
- Distributed verification workflows
The current architecture intentionally provides a foundation for these extensions.

🎓 Project Motivation
Evident.ai was developed to explore how modern software engineering, cryptography, blockchain, cloud infrastructure, and automated verification can be combined to improve trust in ESG reporting.
The project focuses on a practical engineering principle:
Important business data should be traceable, verifiable, and supported by evidence.

Rather than storing ESG information only as conventional database records, Evident.ai combines structured data, evidence, validation, cryptographic integrity, and controlled human verification into a single workflow.

👩‍💻 Author
Bushra Mahek
Computer Science & Engineering
