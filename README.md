User A    --->  Signaling Server  <---  User B
   |               |                 |
   |  Send Offer   |                 |
   | -------------->                 |
   |               |  Forward Offer   |
   |               | ----------------> 
   |               |                 |
   | Receive Answer                   |
   | <----------------                 |
   |               |  Forward Answer   |
   |               | ----------------> |
   |               |                 |
   |  ICE Candidates Exchange (Direct WebRTC P2P)  |






Component	Technology	Purpose
Frontend:	HTML, CSS, JavaScript (WebRTC API)	Captures video/audio, UI handling
Backend: (Signaling)	Node.js, Express.js, Socket.IO	Handles signaling & user connections
P2P Connection:	WebRTC, ICE, STUN/TURN	Establishes direct media transfer
STUN/TURN: Servers	Google STUN, Coturn (Self-hosted), Twilio TURN	NAT traversal for connectivity
