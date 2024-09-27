const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-btn');
const context = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({video: { facingMode: { exact: "environment" } } })
    .then(stream => {
        video.srcObject = stream;
        video.play()
    })
    .catch(error => {
        console.error('Error accessing the camera: ', error);
    });

captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL('image/png').split(',')[1];

    fetch('/extract-text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imgData })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('extracted-text').innerText = data.text;
    })
    .catch(error => {
        console.error('Error:', error);
    });

    navigator.mediaDevices.getUserMedia({video: { facingMode: { exact: "environment" } } })
    .then(stream => {
        video.srcObject = stream;
        video.play()
    })
    
});
