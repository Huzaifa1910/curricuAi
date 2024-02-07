let s = 0
const startRecognitionButton = document.getElementById('startRecognition');
// const stopRecognitionButton = document.getElementById('stopRecognition');

let recognitionActive = false;
let speechRecognition;
startRecognitionButton.addEventListener('click', startSpeechRecognition);

// stopRecognitionButton.addEventListener('click', stopSpeechRecognition);
var stream
async function startSpeechRecognition() {
    try {
        if (!recognitionActive) {
            startRecognitionButton.classList.add('recording'); // Add recording class
            startRecognitionButton.removeEventListener('click', startSpeechRecognition);
            startRecognitionButton.addEventListener('click', stopSpeechRecognition);
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            
            const audioContext = new AudioContext();
            const audioInput = audioContext.createMediaStreamSource(stream);

            speechRecognition = new webkitSpeechRecognition();
            speechRecognition.lang = 'en-US';

            speechRecognition.onresult = function (event) {
                const transcript = event.results[0][0].transcript;
                console.log('Recognized: ', transcript);
                getCompletion(transcript)
                
                stopSpeechRecognition()
                // Send the transcript to your API
                // sendToApi(transcript);
            };

            speechRecognition.onerror = function (event) {
                stopSpeechRecognition()
                console.error('Speech recognition error: ', event.error);

            };

            audioInput.connect(audioContext.destination);
            speechRecognition.start();
            recognitionActive = true;
        }
    } catch (error) {
        console.error('Error accessing microphone: ', error);
    }
}

function stopSpeechRecognition() {
    console.log("stopped outside")
    if (recognitionActive && speechRecognition) {
        speechRecognition.stop();
        setTimeout(() => {
            // Stop the stream after a delay
            const existingTracks = stream.getTracks();
            existingTracks.forEach(track => track.stop());

            recognitionActive = false;
        }, 3000);
        // audioContext.close();
        console.log("stopped isnide")
        startRecognitionButton.classList.remove('recording'); // Remove recording class
        startRecognitionButton.removeEventListener('click', stopSpeechRecognition);
        startRecognitionButton.addEventListener('click', startSpeechRecognition);
    }
}

