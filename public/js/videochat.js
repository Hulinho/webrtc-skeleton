const peerConnection = new RTCPeerConnection(JSON.parse(ice_config));
const remoteVideo = document.querySelector('#remoteVideo');

init();

async function init() {
    socket.emit('room', {room: room});
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
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit('video-chat-room', {answer: answer});
        } catch (error) {
            console.error(error);
        }
    }

    if (msg.answer) {
        try {
            const remoteDesc = new RTCSessionDescription(msg.answer);
            await peerConnection.setRemoteDescription(remoteDesc);
        } catch (error) {
            console.error(error);
        }
    }

    if (msg.iceCandidate) {
        try {
            await peerConnection.addIceCandidate(msg.iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});

peerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
        socket.emit('video-chat-room', {iceCandidate: event.candidate});

    }
});

peerConnection.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
        // Peers connected!
        document.querySelector('#remoteVideo').style.display = "inline-block";
        console.log('Peers connected!');
    }
});

peerConnection.addEventListener('track', async (event) => {
    const remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;
    remoteStream.addTrack(event.track);
});

remoteVideo.onresize = function() {
    if(remoteVideo.videoWidth > remoteVideo.videoHeight) {
        remoteVideo.style.width = '100%';
        remoteVideo.style.maxHeight = '100%';
    } else {
        remoteVideo.style.maxWidth = '100%';
        remoteVideo.style.height = '100%';
    }
};
