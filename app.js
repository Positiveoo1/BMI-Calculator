const unitToggle = document.getElementById('unitToggle');
const metricInputs = document.getElementById('metricInputs');
const imperialInputs = document.getElementById('imperialInputs');

const heightCm = document.getElementById('heightCm');
const weightKg = document.getElementById('weightKg');
const heightFt = document.getElementById('heightFt');
const heightIn = document.getElementById('heightIn');
const weightLbs = document.getElementById('weightLbs');

const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const errorMsg = document.getElementById('errorMsg');
const resultDiv = document.getElementById('result');
const bmiValue = document.getElementById('bmiValue');
const condition = document.getElementById('condition');
const idealRange = document.getElementById('idealRange');

const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeModal = document.querySelector('.close');
const historyList = document.getElementById('historyList');
const noHistoryMsg = document.getElementById('noHistory');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');


unitToggle.addEventListener('change', () => {
    if (unitToggle.checked) {
        metricInputs.classList.add('hidden');
        imperialInputs.classList.remove('hidden');
    } else {
        imperialInputs.classList.add('hidden');
        metricInputs.classList.remove('hidden');
    }
    clearAll();
});

function clearAll() {
    heightCm.value = '';
    weightKg.value = '';
    heightFt.value = '';
    heightIn.value = '';
    weightLbs.value = '';

    resultDiv.classList.add('hidden');
    errorMsg.classList.add('hidden');
    resultDiv.className = 'hidden'; 
}

clearBtn.addEventListener('click', clearAll);

clearHistoryBtn.addEventListener('click', () => {
    if (!confirm('Are you sure you want to clear all BMI history?')) return;

    localStorage.removeItem('bmiHistory');
    historyList.innerHTML = '';
    noHistoryMsg.classList.remove('hidden');
});


loadHistory();

historyBtn.addEventListener('click', () => {
    loadHistory(); 
    historyModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    historyModal.classList.remove('active');
});

historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.classList.remove('active');
    }
});

calculateBtn.addEventListener('click', () => {
    errorMsg.classList.add('hidden');
    resultDiv.classList.add('hidden');

    let heightMeters, weightKgVal;
    const unit = unitToggle.checked ? 'imperial' : 'metric';

    if (unit === 'metric') {
        const h = parseFloat(heightCm.value);
        const w = parseFloat(weightKg.value);

        if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
            showError("Please enter valid positive values for height (cm) and weight (kg).");
            return;
        }

        heightMeters = h / 100;
        weightKgVal = w;
    } else {
        const ft = parseFloat(heightFt.value);
        const inches = parseFloat(heightIn.value) || 0;
        const lbs = parseFloat(weightLbs.value);

        if (isNaN(ft) || isNaN(lbs) || ft < 0 || lbs <= 0 || inches < 0) {
            showError("Please enter valid height (feet/inches) and weight (lbs).");
            return;
        }

        const totalInches = ft * 12 + inches;
        heightMeters = totalInches * 0.0254;
        weightKgVal = lbs * 0.453592;      
    }

    const bmi = weightKgVal / (heightMeters * heightMeters);
    const bmiFixed = bmi.toFixed(2);

    bmiValue.textContent = `Your BMI is: ${bmiFixed}`;

    let category, colorClass;
    if (bmi < 18.5) {
        category = "Underweight";
        colorClass = "underweight";
    } else if (bmi <= 24.9) {
        category = "Normal weight";
        colorClass = "normal";
    } else if (bmi <= 29.9) {
        category = "Overweight";
        colorClass = "overweight";
    } else {
        category = "Obesity";
        colorClass = "obese";
    }

    condition.textContent = `Category: ${category}`;
    condition.style.fontWeight = "bold";

    const minWeight = (18.5 * heightMeters * heightMeters).toFixed(1);
    const maxWeight = (24.9 * heightMeters * heightMeters).toFixed(1);
    const minLbs = Math.round(minWeight * 2.20462);
    const maxLbs = Math.round(maxWeight * 2.20462);

    idealRange.textContent = `Healthy weight range: ${minWeight} – ${maxWeight} kg (${minLbs} – ${maxLbs} lbs)`;

    resultDiv.className = colorClass;
    resultDiv.classList.remove('hidden');

    const entry = {
        date: new Date().toLocaleString(),
        bmi: bmiFixed,
        category,
        height: unit === 'metric' ? `${heightCm.value} cm` : `${heightFt.value || 0}'${heightIn.value || 0}"`,
        weight: unit === 'metric' ? `${weightKg.value} kg` : `${weightLbs.value} lbs`
    };

    saveToHistory(entry);
});

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

function saveToHistory(entry) {
    let history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    history.unshift(entry); 
    if (history.length > 10) history.pop(); 
    localStorage.setItem('bmiHistory', JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    historyList.innerHTML = '';

    if (history.length === 0) {
        noHistoryMsg.classList.remove('hidden');
        return;
    }

    noHistoryMsg.classList.add('hidden');

    history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.date}</strong><br>
            BMI: <strong>${item.bmi}</strong> (${item.category})<br>
            Height: ${item.height} • Weight: ${item.weight}
        `;
        historyList.appendChild(li);
    });
}