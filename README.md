
# modelo.ai

## Overview

modelo.ai is a platform for managing and comparing responses from multiple AI models, enabling double-checked answers and similarity scoring. It consists of a FastAPI backend and a Next.js frontend, both containerized for easy deployment.

---

## Project Structure

```
modelaio/
├── backend/
│   ├── Dockerfile
│   ├── main.py
│   ├── req.txt
│   └── core/
│       ├── ModelControllers.py
│       ├── ResponseProcessor.py
│       ├── SimilarityModel.py
│       ├── types.py
│       └── tests/
├── frontend-next/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.mjs
│   ├── app/
│   ├── components/
│   └── src/
│       └── services/api.js
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

## Functionalities

- Query multiple AI models and compare their responses
- Calculate similarity scores between responses using sentence embeddings
- View, manage, and double-check answers in a modern web UI
- Easily add new models and API keys

---

## Quick Start (Docker Compose)

1. **Clone the repository:**
	```bash
	git clone https://github.com/yourusername/modelaio.git
	cd modelaio
	```

2. **Build and start all services:**
	```bash
	docker-compose up --build
	```
	- Backend: http://localhost:8000
	- Frontend: http://localhost:3000

---

## Manual Setup

### Backend (FastAPI)

1. **Install Python 3.10+ and pip**
2. **Install dependencies:**
	```bash
	cd backend
	pip install -r req.txt
	```
3. **Run the server:**
	```bash
	uvicorn main:app --host 0.0.0.0 --port 8000
	```

### Frontend (Next.js)

1. **Install Node.js (v18+) and npm**
2. **Install dependencies:**
	```bash
	cd frontend-next
	npm install
	```
3. **Set environment variable (optional):**
	```bash
	export NEXT_PUBLIC_API_URL=http://localhost:8000
	```
4. **Run the development server:**
	```bash
	npm run dev
	```
	- Access at http://localhost:3000

---

## Notes
- You can run backend and frontend independently or together via Docker Compose.
- Backend supports multiple AI providers via LiteLLM.
- For production, use Docker Compose or deploy containers separately.

