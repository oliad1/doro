# ![icon](https://github.com/user-attachments/assets/69bbb97c-9da4-42dc-8e21-6622172d6d4a)<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up-icon lucide-trending-up"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg> Doro

An automated grade tracker for 1700+ Waterloo courses

https://github.com/user-attachments/assets/56ed784b-ceb9-4056-ae98-c4f95f220f1d

<img alt="m4LGffCFVJ" src="https://github.com/user-attachments/assets/d4bc90c5-a7de-4415-97dd-28a8f34336dc" />
<br/><br/>
<img alt="fL6lRxH4b9" src="https://github.com/user-attachments/assets/3d856740-152a-4163-9dd5-94e6781a4a6f" />
<br/><br/>
<img alt="XquOlTyb0h" src="https://github.com/user-attachments/assets/3be461b0-4967-4e04-94d9-07f05fcba48f" />

## Architechture

**Frontend**: Next.js, TypeScript, Zustand, Zod

**Backend**: AWS EC2, Nginx, PM2, Node.js

**DB**: Supabase (Postgres)

**Scraping**: Python, BeautifulSoup, Gemini Parsed Output, Pydantic

<img alt="doro" src="https://github.com/user-attachments/assets/1ddd87c3-d1f6-4dc7-90e1-9bd53a009fe4" />

## Running locally

First, clone the repo

```bash
git clone https://github.com/oliad1/doro.git
cd doro
```

### Frontend

```bash
cd frontend
cp .env.example .env #fill in with env secrets
```

Next, run it with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend

```bash
cd backend
cp .env.example .env #fill in with env secrets
```

Next, run it with:

```bash
bun dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.
