// Teachable Machine Model URL
// 아래 주소를 본인이 만든 Teachable Machine 모델 주소로 교체하세요.
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/bj6en9V9/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model
async function loadModel() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (e) {
        console.error("Model failed to load", e);
        alert("모델을 불러오는데 실패했습니다. URL을 확인해주세요.");
    }
}

// Image Upload Handling
const imageInput = document.getElementById('image-input');
const faceImage = document.getElementById('face-image');
const uploadLabel = document.querySelector('.upload-label');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('result-section');

imageInput.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            faceImage.src = event.target.result;
            faceImage.style.display = 'block';
            uploadLabel.style.display = 'none';
            
            // Start Prediction
            await runPrediction(faceImage);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Webcam Handling
const webcamBtn = document.getElementById('webcam-btn');
let isWebcamStarted = false;

webcamBtn.addEventListener('click', async () => {
    if (isWebcamStarted) return;
    
    loading.style.display = 'block';
    uploadLabel.style.display = 'none';
    
    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    
    try {
        await webcam.setup();
        await webcam.play();
        isWebcamStarted = true;
        loading.style.display = 'none';
        document.getElementById('webcam-container').appendChild(webcam.canvas);
        webcamBtn.style.display = 'none';
        
        window.requestAnimationFrame(loop);
    } catch (e) {
        console.error("Webcam failed", e);
        alert("카메라를 켤 수 없습니다.");
        loading.style.display = 'none';
        uploadLabel.style.display = 'block';
    }
});

async function loop() {
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(loop);
}

// Prediction Logic
async function runPrediction(imageElement) {
    loading.style.display = 'block';
    resultSection.style.display = 'none';
    
    if (!model) await loadModel();
    
    const prediction = await model.predict(imageElement);
    displayResults(prediction);
    
    loading.style.display = 'none';
    resultSection.style.display = 'block';
}

async function predict(canvasElement) {
    if (!model) await loadModel();
    const prediction = await model.predict(canvasElement);
    displayResults(prediction);
    resultSection.style.display = 'block';
}

function displayResults(prediction) {
    labelContainer = document.getElementById('label-container');
    labelContainer.innerHTML = '';
    
    // Sort predictions by probability
    prediction.sort((a, b) => b.probability - a.probability);
    
    for (let i = 0; i < maxPredictions; i++) {
        const category = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barHtml = `
            <div class="prediction-bar">
                <div class="label-text">
                    <span>${category}</span>
                    <span>${probability}%</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${probability}%"></div>
                </div>
            </div>
        `;
        labelContainer.innerHTML += barHtml;
    }
}

// Initialize Model on load
window.onload = loadModel;
