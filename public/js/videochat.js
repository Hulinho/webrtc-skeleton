const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
const peerConnection = new RTCPeerConnection(configuration);
const localVideo = document.querySelector('video#localVideo');
const contstraints = {
    'video': true,
    'audio': false,
};
const remoteVideo = document.querySelector('#remoteVideo');
const remoteStream = new MediaStream();
remoteVideo.srcObject = remoteStream;
socket.emit('room', {room: room});

(async () => {
    try {
        const localStream = await navigator.mediaDevices.getUserMedia(contstraints);
        localVideo.srcObject = localStream;
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('video-chat-room', {offer: offer});
    } catch (error) {
        console.error('Error opening video camera.', error);
    }
})();

socket.on('message', async (msg) => {
    document.getElementById('remoteVideo').style.display = "inline-block";
    console.log(msg);
    if(msg.too_many_users) {
        document.getElementById('remoteVideo').style.display = "none";
        document.getElementById('rv-container').innerText = 'Too many users!';
        return false;
    }
    if (msg.offer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('video-chat-room', {answer: answer});
    }

    if (msg.answer) {
        const remoteDesc = new RTCSessionDescription(msg.answer);
        await peerConnection.setRemoteDescription(remoteDesc);
    }

    // Listen for remote ICE candidates and add them to the local RTCPeerConnection
    if (msg.iceCandidate) {
        try {
            await peerConnection.addIceCandidate(msg.iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});

// Listen for local ICE candidates on the local RTCPeerConnection
peerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
        socket.emit('video-chat-room', {iceCandidate: event.candidate});

    }
});

// Listen for connectionstatechange on the local RTCPeerConnection
peerConnection.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
        // Peers connected!
        console.log('Peers connected!');
    }
});

peerConnection.addEventListener('track', async (event) => {
    remoteStream.addTrack(event.track);
});
