# Meetly — Real-Time Communication App

A full-stack MERN video conferencing and collaboration app built for CodeAlpha Task 4, adding **WebRTC** and **Socket.io** on top of the MERN skills you already have.

Tagline: *Connect. Collaborate. Create.*

---

## 1. Features

- Email/password authentication with JWT and bcrypt password hashing
- Create or join a meeting by room code
- Multi-user video calling (WebRTC, peer-to-peer)
- Mic on/off, camera on/off, screen sharing
- Real-time meeting chat
- Collaborative whiteboard (HTML Canvas + Socket.io)
- File sharing per meeting (Multer + MongoDB metadata)
- Dashboard with recent meetings
- Dark Emerald Glassmorphism UI, fully responsive

## 2. Technology Stack

**Frontend:** React, React Router DOM, Redux Toolkit, Axios, Socket.io-client, WebRTC browser APIs, HTML Canvas, plain CSS, Vite
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.io, JWT, bcryptjs, Multer, dotenv, CORS
**Database:** MongoDB Atlas

## 3. Architecture

```
                 SOCKET.IO
                     │
        Signaling / Chat / Whiteboard / Presence
                     │
       ┌─────────────┴─────────────┐
       │                           │
     User A                     User B
       │                           │
       └────────  WEBRTC  ─────────┘
              Audio + Video (peer-to-peer)
```

- **Socket.io** never carries video/audio. It only relays small JSON messages: WebRTC offers/answers/ICE candidates, chat messages, whiteboard strokes, and participant status.
- **WebRTC** handles the actual audio/video/screen-share media directly between browsers, using a public STUN server for NAT traversal.
- **Redux Toolkit** stores serializable application state (auth, meetings, uploaded-file metadata). `RTCPeerConnection` and `MediaStream` objects are **not** put in Redux — they live in a `useRef`/component-state inside `client/src/hooks/useWebRTC.js`, since they aren't serializable.
- **MongoDB/Mongoose** stores users, meetings, and file metadata (not the raw video, and not the file binaries — those sit in `server/uploads/`).

## 4. Folder Structure

```
Meetly/
├── server/            # Express + Socket.io API
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/socketHandlers.js
│   ├── seed/seed.js    # dummy data script
│   ├── uploads/
│   └── server.js
└── client/             # React + Vite app
    └── src/
        ├── app/store.js
        ├── components/
        ├── pages/
        ├── features/{auth,meetings,users}/
        ├── services/{api.js,socket.js}
        └── hooks/useWebRTC.js
```

## 5. How WebRTC Works Here

1. When you enter `/meeting/:roomId`, `useWebRTC` calls `getUserMedia()` to grab your camera/mic.
2. It joins the Socket.io room (`join-room`). The server tells you who's already there.
3. For each existing participant, your browser creates an `RTCPeerConnection`, makes an **offer**, and sends it through Socket.io.
4. The other browser replies with an **answer**; both sides exchange **ICE candidates** the same way.
5. Once connected, video/audio flows **directly between browsers** — Socket.io is no longer involved for media.
6. Screen sharing calls `getDisplayMedia()` and swaps the outgoing video track using `RTCRtpSender.replaceTrack()`, so you don't have to renegotiate the whole connection.

## 6. How Socket.io Is Used

| Purpose | Events |
|---|---|
| Presence | `join-room`, `existing-participants`, `user-joined`, `user-left`, `leave-room` |
| Signaling | `offer`, `answer`, `ice-candidate` |
| Media status | `camera-toggle`, `mic-toggle`, `screen-share-start`, `screen-share-stop` |
| Chat | `send-message`, `receive-message` |
| Whiteboard | `whiteboard-draw`, `whiteboard-clear` |

## 7. How Redux Toolkit Is Used

- `authSlice` — register/login/getCurrentUser via `createAsyncThunk`, persists the JWT to `localStorage`.
- `meetingSlice` — create/list/get meetings, and the file-upload thunk.
- `userSlice` — profile updates.

## 8. How Authentication Works

Register → password hashed with bcryptjs → saved to MongoDB → login compares hash → JWT issued → stored client-side → sent as `Authorization: Bearer <token>` on every API call → `authMiddleware.js` verifies it on protected routes.

## 9. How File Sharing Works

Browser → Axios (multipart/form-data) → Express route → Multer (validates type/size, saves to `server/uploads/`) → file metadata (`name`, `type`, `size`, `uploadedBy`, `meetingId`) saved in MongoDB. Files are listed and downloaded through a normal HTTP link — not sent over WebRTC data channels, keeping things simple for a student project.

## 10. How the Whiteboard Works

Each stroke is sent as `{startX, startY, endX, endY, color, lineWidth, tool}` — never the whole canvas image — so it stays light. Every other participant redraws that one line segment on their own canvas as it arrives.

## 11. Security Notes (be accurate about this in your viva)

- Passwords: hashed with bcryptjs, never stored in plain text.
- Auth: JWT-protected API routes.
- WebRTC media: encrypted in transit by WebRTC's standard transport (DTLS-SRTP) — this is built into the browser, not something this project implements itself.
- Socket.io: use `wss://` (secure WebSockets) automatically once you deploy behind HTTPS.
- Files: type and size are validated before saving.
- **This project does not implement custom end-to-end encryption** and does not claim to — don't state otherwise in your report.

---

## 12. MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user (username + password).
3. Under Network Access, allow your current IP (or `0.0.0.0/0` for local dev only).
4. Copy the connection string, e.g. `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/Meetly`.
5. Paste it into `server/.env` as `MONGO_URI`.

## 13. Environment Variables

**server/.env** (copy from `server/.env.example`):
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

**client/.env** (copy from `client/.env.example`):
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 14. Installation & Running the Application

Open two terminals.

**Terminal 1 — backend**
```bash
cd server
npm install
cp .env.example .env    # then fill in MONGO_URI and JWT_SECRET
npm run dev              # starts on http://localhost:5000
```

**Terminal 2 — frontend**
```bash
cd client
npm install
cp .env.example .env
npm run dev               # starts on http://localhost:5173
```

Open `http://localhost:5173` in **two different browser windows** (or one normal + one incognito) to test multi-user video calling on your own machine — you need two separate camera/mic-granting browser sessions to see two participants.

## 15. Dummy Data / Practice Mode

To avoid registering an account by hand every time you reset your database, a seed script creates a few practice users and meetings:

```bash
cd server
npm run seed
```

This creates:

| Name | Email | Password |
|---|---|---|
| Ava Torres | ava@example.com | Password123 |
| Liam Chen | liam@example.com | Password123 |
| Maya Singh | maya@example.com | Password123 |

...plus three sample meetings (`demo01`, `demo02`, `demo03`) already linked to those users, so the Dashboard's "Recent Meetings" list isn't empty on first run.

**How to practice the real-time features:**
1. Run `npm run seed`, then start both servers as above.
2. Log in as `ava@example.com` in one browser window.
3. Log in as `liam@example.com` in a second window (or incognito).
4. From Ava's Dashboard, click **Rejoin** on "Weekly Standup" (room `demo01`), or just type `demo01` into **Join Meeting** from Liam's dashboard.
5. Grant camera/mic permission in both windows. You should see both video tiles, be able to toggle mic/camera, share your screen, chat, draw on the whiteboard, and upload a file — and see it reflected instantly in the other window.
6. Re-run `npm run seed` any time to reset back to a clean practice state (it clears and re-creates users/meetings).

Note: seeding does **not** touch uploaded files on disk (`server/uploads/`) — delete that folder's contents manually if you want a fully clean slate.

## 16. Final Testing Checklist

**Authentication:** register works · login works · logout works · JWT protection works · passwords are hashed
**Meetings:** create meeting works · join meeting works · meeting ID works · multiple users can join · participants appear correctly
**WebRTC:** camera works · microphone works · remote video works · remote audio works · multiple participants work · camera toggle works · mic toggle works
**Screen Sharing:** starts · other participants see it · stops · camera resumes
**Socket.io:** join/leave events work · signaling works · chat works · whiteboard sync works · mic/camera status updates work
**File Sharing:** upload works · metadata stored · file appears in meeting · download works · validation works
**Whiteboard:** drawing works · eraser works · brush size works · clear works · syncs to other participants
**Redux:** store works · auth state works · meeting state works · createAsyncThunk used throughout
**UI:** splash screen works · responsive desktop/mobile · loading states · error states · no major console errors

---

## 17. Explaining This Project in a Viva

Keep it simple: *"MongoDB stores who you are and what meetings exist. Redux Toolkit holds that data on the frontend and talks to the backend through Axios. Socket.io is the messenger that tells browsers about each other and relays chat/whiteboard/status updates. WebRTC is the actual phone call — once two browsers know about each other via Socket.io, they connect directly and stream video/audio between themselves."* That one sentence covers the whole architecture diagram in section 3.
