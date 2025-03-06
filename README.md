Overview


This project is a real-time audio and video communication platform built using WebRTC. It allows users to connect and communicate via peer-to-peer (P2P) connections without the need for third-party software. The application is designed for seamless video calling, audio streaming, and low-latency communication using WebRTC, Socket.IO, and Node.js for signaling.

Features

✅ Real-time video and audio communication
✅ Peer-to-peer (P2P) connection using WebRTC
✅ Signaling server using WebSockets (Socket.IO)
✅ STUN/TURN server integration for NAT traversal
✅ Low-latency and high-quality media streaming
✅ Responsive and user-friendly interface

Tech Stack

Frontend:  HTML, CSS, JavaScript (WebRTC API)
Backend: Node.js, Express.js, Socket.IO
Signaling Protocol: WebSockets
ICE Servers: Google STUN, Coturn (TURN)

How It Works

A user joins the platform and creates or joins a room.
The signaling server (Node.js + Socket.IO) helps users exchange connection details (SDP & ICE candidates).
Once signaling is complete, WebRTC establishes a peer-to-peer (P2P) connection for direct video/audio streaming.
The STUN/TURN server ensures connectivity even if users are behind NAT/firewalls.
