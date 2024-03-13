const btn = document.getElementById('btn');
const bmi = document.getElementById('bmi');
const condition = document.getElementById('condition');
btn.addEventListener('click', () => {
    const height = document.getElementById('height').value / 100;
    const weight = document.getElementById('weight').value ;
    const bmiValue = weight / (height * height);
bmi.innerText = `Your BMI is: ${bmiValue.toFixed(2)}`;

if (bmiValue < 18.5) {
    condition.innerText = "Under weight";
  } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
    condition.innerText = "Normal weight";
  } else if (bmiValue >= 25 && bmiValue <= 29.9) {
    condition.innerText = "Overweight";
  } else if (bmiValue >= 30) {
    condition.innerText = "Obesity";
  }

})
