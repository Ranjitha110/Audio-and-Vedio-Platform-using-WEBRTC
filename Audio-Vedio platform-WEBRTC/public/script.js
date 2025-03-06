const socket = io("/");
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat__window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

let myVideoStream;

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    document.addEventListener("keydown", (e) => {
      if (e.which === 13 && chatInputBox.value != "") {
        socket.emit("message", chatInputBox.value);
        chatInputBox.value = "";
      }
    });

    socket.on("createMessage", (msg) => {
      let li = document.createElement("li");
      li.innerHTML = msg;
      all_messages.append(li);
      main__chat__window.scrollTop = main__chat__window.scrollHeight;
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, streams) => {
  var call = peer.call(userId, streams);
  var video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (videoEl, stream) => {
  videoEl.srcObject = stream;
  videoEl.addEventListener("loadedmetadata", () => {
    videoEl.play();
  });
  videoGrid.append(videoEl);

  let totalUsers = document.getElementsByTagName("video").length;
  if (totalUsers > 1) {
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName("video")[index].style.width =
        100 / totalUsers + "%";
    }
  }
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setPlayVideo = () => {
  document.getElementById("playPauseVideo").innerHTML = `
    <i class="unmute fa fa-pause-circle"></i>
    <span class="unmute">Resume Video</span>`;
};

const setStopVideo = () => {
  document.getElementById("playPauseVideo").innerHTML = `
    <i class="fa fa-video-camera"></i>
    <span class="">Pause Video</span>`;
};

const setUnmuteButton = () => {
  document.getElementById("muteButton").innerHTML = `
    <i class="unmute fa fa-microphone-slash"></i>
    <span class="unmute">Unmute</span>`;
};

const setMuteButton = () => {
  document.getElementById("muteButton").innerHTML = `
    <i class="fa fa-microphone"></i>
    <span>Mute</span>`;
};

// Leave Meeting Functionality

document.getElementById("leave-meeting").addEventListener("click", () => {
  console.log("Leaving meeting...");
  
  // Close the Peer connection
  if (peer) {
    peer.destroy();
  }
  
  // Disconnect from the socket
  socket.disconnect();

  // Stop all media streams (video/audio)
  if (myVideoStream) {
    myVideoStream.getTracks().forEach((track) => track.stop());
  }

  // Remove all videos from the grid
  videoGrid.innerHTML = "";

  // Redirect to home page
  window.location.href = "/";
});
