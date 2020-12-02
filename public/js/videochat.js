const peerConnection = new RTCPeerConnection(JSON.parse(ice_config));

init();

async function init() {
    socket.emit('room', {room: room});
    document.getElementById('rv-container').style.display = "none";

    try {
        const localVideo = document.querySelector('#localVideo');
        const localStream = await navigator.mediaDevices.getUserMedia({ 'video': true, 'audio': true });
        localVideo.srcObject = localStream;
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    } catch (error) {
        console.error(error);
    }

    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('video-chat-room', {offer: offer});
    } catch (error) {
        console.error(error);
    }
}


socket.on('message', async (msg) => {
    if(msg.too_many_users) {
        document.getElementById('remoteVideo').style.display = "none";
        alert("Not connected! Max 2 users in 1 room!");
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
        document.getElementById('rv-container').style.display = "block";
        console.log('Peers connected!');
    }
});

peerConnection.addEventListener('track', async (event) => {
    const remoteStream = new MediaStream();
    const remoteVideo = document.querySelector('#remoteVideo');
    remoteVideo.srcObject = remoteStream;
    remoteStream.addTrack(event.track);
});
