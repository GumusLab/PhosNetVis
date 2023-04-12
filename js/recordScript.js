let completeBlob = null
let recorder = null
let chunks = [];
let stream = null
async function startRecording() {
    try {
        chunks = []
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                mediaSource: 'screen',
                cursor: 'never',
                frameRate: 60,
                aspectRatio: 3
            },
        })
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.start();
        recorder.onstop = onstop
    } catch (error) {
        window.alert(error)
    }
}

async function stopScreen() {
    recorder.stop()
    stream.getTracks().forEach(function (track) {
        track.stop();
    });
}

function onstop() {
    completeBlob = new Blob(chunks, {
        type: chunks[0].type
    });
    let downloadButton = document.getElementById('downloadbtn');
    downloadButton.href = URL.createObjectURL(completeBlob);

    const d = new Date();
    let hour = String(d.getHours()).padStart(2, '0');
    let minutes = String(d.getMinutes()).padStart(2, '0');
    let seconds = String(d.getSeconds()).padStart(2, '0');
    filename = hour+"-"+minutes+"-"+seconds+"_PhosNetVis-Record";
    downloadButton.download = filename + '.mp4';
}

function downloadVideo(){
    let downloadButton = document.getElementById('downloadbtn');
    downloadButton.click()

}