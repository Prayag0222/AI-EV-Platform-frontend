⚡ AI-EV Core — Full-Stack EV SaaS Platform
This is a full-stack, enterprise-grade SaaS platform built to handle Electric Vehicle (EV) charging grid management, live station telemetry tracking, and maintenance dispatching.

Instead of building a basic, generic app, my brother and I built a decoupled architecture: a type-safe Node.js/Express backend completely separated from a high-performance Next.js frontend. The entire system communicates securely over cross-origin ports using cryptographic tokens and strict security guardrails.


🏗️ The System Architecture
Our codebase is split into two distinct ecosystems that run side-by-side:

The Frontend Client (Port 3000): Built with Next.js using React 19, TypeScript, and Tailwind CSS. It handles all dynamic layouts, instant form validation, and role-based interface switching.

The Backend Engine (Port 5000): Built with Node.js and Express running modern ES Modules ("type": "module"). It handles authentication, secure cookie minting, and talks directly to a PostgreSQL database through Prisma ORM.

🗺️ How the Auth & Session Flow Works Under the Hood
To prevent hackers from messing with user sessions, we built a Stateless Token Passport System wrapped in a bulletproof security layer. Here is the exact path data takes from the millisecond a user clicks "Sign In":



[ NEXT.JS LOGIN UI ] ➔ User submits credentials via our custom Tailwind Form
       │
       ▼ HTTP POST /api/auth/login (Payload: email, password)
[ EXPRESS BACKEND ]  ➔ Queries PostgreSQL via Prisma ➔ Audits Bcrypt Hash ➔ Mints JWT Payload
       │
       ▼ Set-Cookie Header (authToken=xyz; HttpOnly; Secure; SameSite=Lax)
[ BROWSER COOKIE JAR ] ➔ Automatically locks cookie into isolated browser memory space
       │
       ▼ Frontend Client Router Push
[ DASHBOARD LANDING ] ➔ Viewport navigates to http://localhost:3000/dashboard/owner
       │
       ▼ Automated React useEffect Hook Execution
[ BACKGROUND FETCH ] ➔ Fires GET http://localhost:5000/api/auth/me (with credentials: 'include')
       │
       ▼ Browser automatically appends 'authToken' Cookie to request headers
[ BACKEND MIDDLEWARE ]➔ verifySession intercepts ➔ Cryptographically decodes JWT ➔ next()
       │
       ▼ HTTP 200 OK Response (Payload: authenticated: true, user: { id, email, role })
[ UNLOCKED INTERFACE ]➔ State updates; UI dynamically renders Owner or Technician layout panel

Why This Setup is Solid:

1. The HttpOnly Shield (Anti-XSS): We don't store session tokens in localStorage. LocalStorage can be stolen by malicious JavaScript running on the page. By locking the JWT inside an HttpOnly cookie, the browser completely hides the token from frontend JavaScript. Scripts cannot read or touch it.

2. The Background Handshake: Since JavaScript can't touch the cookie, we pass credentials: 'include' on all frontend fetches. This commands the web browser to silently bundle the cookie into the network request background headers automatically.

3. The Airport Security Line (Middleware): Our protected routes don't check sessions manually. We built a centralized Express middleware guard (verifySession). Every request stops there first. If the token's cryptographic signature matches our private JWT_SECRET, the guard saves the decoded user data right onto the request timeline (req.user) and calls next() to let them through. If it's missing or faked, the conveyor belt stops dead.


📡 API Endpoint Registry
All backend authentication routes are grouped under the /api/auth entryway.

1. User Account Registration
Path: POST /api/auth/signup

Access: Public

Payload: { name, email, password, role }

Action: Hashes the plain text password using Bcrypt and commits a new record to PostgreSQL via Prisma.

2. Session Authentication (Login)
Path: POST /api/auth/login

Access: Public

Payload: { email, password }

Action: Verifies database records, signs a JWT carrying the user's id, email, and role, and drops it as a secure cookie into the browser.

3. Verify Active Session Status
Path: GET /api/auth/me

Access: Private (Requires Active Cookie Passport)

Mandatory Header Config: credentials: 'include'



🎨 Role-Based Access Control (RBAC) Client RoutingOn the frontend, we are running a Conditional Layout Panel pattern inside src/app/dashboard/owner/page.tsx. Instead of making duplicate files, the page loads a single verification frame, speaks to the /me endpoint, and uses a client-side switch statement to completely transform the user interface based on database clearance:User RoleRendered UI EnvironmentAccessible FeaturesOWNERExecutive Operations CenterFull financial revenue grids, global live grid telemetry, and connected station counters.TECHNICIANMaintenance Bay DashboardInfrastructure fault codes, assigned hardware repair tickets, and core temperature monitors.UnauthorizedSession TerminationInstantly triggers an automatic kick-out via router.push('/login').




🚀 Engineering Journal: Hurdles I Faced & How I Crushed Them
This is the raw breakdown of the real-world bugs, syntax crashes, and architectural blockades my team and I ran into while building this out, along with the exact engineering logic we used to solve them.

1. The "Invisible Cookie" & CORS Handshake Block
The Problem: Login was succeeding perfectly, but the moment the frontend pushed the user to the dashboard, the page instantly kicked them back out to login. The console showed a continuous loop of 401 Unauthorized errors.

The Investigation: I opened up the browser developer tools and checked the Storage tab. The backend was saying it dropped the cookie, but the browser cookie jar was completely empty. Because the frontend runs on port 3000 and the backend runs on port 5000, the browser was treating this cross-origin request as a security risk and throwing the cookie away.

The Fix: I went into the backend master server file and tightly configured our CORS middleware rules to explicitly authorize origin: 'http://localhost:3000' and set credentials: true. Then, on the frontend login page and dashboard fetch handlers, I injected credentials: 'include'. This forced the browser to accept the cookie cross-origin and pass it silently in the background.

2. The TypeScript / ESM Module Syntax Crash
The Problem: The absolute second I upgraded our authentication middleware file to use strict TypeScript files (authMiddleware.ts), the backend development server completely crashed with a nasty error: SyntaxError: The requested module 'express' does not provide an export named 'NextFunction'.

The Investigation: Our backend project runs on modern Node.js ES Modules ("type": "module"). Express is written in JavaScript. Types like NextFunction, Request, and Response are pure TypeScript structures—they don't exist as actual running code inside the plain JavaScript Express package. The Node environment was crashing because it was searching for physical code that wasn't there.

The Fix: I established a strict type boundary inside the file's import block by using the import type explicit keyword:

TypeScript
import type { Request, Response, NextFunction } from 'express';
This tells the compiler to use those names strictly for code autocomplete and static analysis, and completely wipe them out of the final compiled JavaScript runtime file. The crash instantly vanished.

3. The Invalid Token Cryptographic Typo
The Problem: The middleware extractor was finally working and pulling the cookie string out of the incoming network headers perfectly, but the jwt.verify() module was continuously failing, jumping straight into our catch block, and screaming an "Invalid Token" error.

The Investigation: I wrote console logging flags across both repositories to check the token payload string. The secret keys (JWT_SECRET) matched perfectly. The issue was a tiny formatting typo deep inside our controller's login function where the payload was signed. The token format didn't map onto what the middleware was trying to read.

The Fix: I tracked down the mismatch inside the backend controller file, synchronized the structure to match our authMiddleware.ts data card contract, cleared the old stale cookies out of the browser history, and the system instantly completed a flawless full-stack handshake.