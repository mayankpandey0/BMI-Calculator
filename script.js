document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bmiForm');
    const unitRadios = document.querySelectorAll('input[name="unit_system"]');
    const weightLabel = document.getElementById('weightLabel');
    const heightLabel = document.getElementById('heightLabel');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');

    // Update labels based on unit system
    unitRadios.forEach(radio => {
        radio.addEventListener('change', updateLabels);
    });

    function updateLabels() {
        const unitSystem = document.querySelector('input[name="unit_system"]:checked').value;
        
        if (unitSystem === 'metric') {
            weightLabel.textContent = 'Weight (kg):';
            heightLabel.textContent = 'Height (cm):';
            weightInput.placeholder = 'Enter weight in kg';
            heightInput.placeholder = 'Enter height in cm';
        } else {
            weightLabel.textContent = 'Weight (lbs):';
            heightLabel.textContent = 'Height (inches):';
            weightInput.placeholder = 'Enter weight in lbs';
            heightInput.placeholder = 'Enter height in inches';
        }
        
        // Clear inputs and results when switching units
        weightInput.value = '';
        heightInput.value = '';
        hideResults();
        hideError();
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBMI();
    });

    function calculateBMI() {
        const formData = new FormData(form);
        const data = {
            weight: parseFloat(weightInput.value),
            height: parseFloat(heightInput.value),
            unit_system: formData.get('unit_system')
        };

        // Basic client-side validation
        if (!data.weight || !data.height || data.weight <= 0 || data.height <= 0) {
            showError('Please enter valid positive numbers for weight and height');
            return;
        }

        // Send request to backend
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
            } else {
                displayResults(data);
            }
        })
        .catch(error => {
            showError('An error occurred while calculating BMI. Please try again.');
            console.error('Error:', error);
        });
    }

    function displayResults(data) {
        hideError();
        
        bmiValue.textContent = data.bmi;
        
        // Set category with appropriate class
        bmiCategory.textContent = data.category;
        bmiCategory.className = 'bmi-category ' + getCategoryClass(data.category);
        
        resultDiv.classList.remove('hidden');
        
        // Scroll to results
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function getCategoryClass(category) {
        const categoryMap = {
            'Underweight': 'underweight',
            'Normal weight': 'normal',
            'Overweight': 'overweight',
            'Obese': 'obese'
        };
        return categoryMap[category] || '';
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        hideResults();
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideError() {
        errorDiv.classList.add('hidden');
    }

    function hideResults() {
        resultDiv.classList.add('hidden');
    }

    // Initialize labels
    updateLabels();
});