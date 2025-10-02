from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

class BMICalculator:
    @staticmethod
    def calculate_bmi(weight, height, unit_system):
        """Calculate BMI based on weight, height, and unit system"""
        try:
            if unit_system == 'metric':
                # BMI = weight(kg) / (height(m) ^ 2)
                bmi = weight / ((height / 100) ** 2)
            else:
                # BMI = (weight(lbs) / (height(in) ^ 2)) * 703
                bmi = (weight / (height ** 2)) * 703
            
            return round(bmi, 1)
        except ZeroDivisionError:
            return None
    
    @staticmethod
    def get_bmi_category(bmi):
        """Get BMI category based on calculated BMI value"""
        if bmi is None:
            return "Invalid input"
        
        if bmi < 18.5:
            return "Underweight"
        elif 18.5 <= bmi < 25:
            return "Normal weight"
        elif 25 <= bmi < 30:
            return "Overweight"
        else:
            return "Obese"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        
        weight = float(data.get('weight'))
        height = float(data.get('height'))
        unit_system = data.get('unit_system', 'metric')
        
        # Validate inputs
        if weight <= 0 or height <= 0:
            return jsonify({
                'error': 'Weight and height must be positive numbers'
            }), 400
        
        # Calculate BMI
        bmi = BMICalculator.calculate_bmi(weight, height, unit_system)
        
        if bmi is None:
            return jsonify({
                'error': 'Invalid calculation'
            }), 400
        
        # Get BMI category
        category = BMICalculator.get_bmi_category(bmi)
        
        return jsonify({
            'bmi': bmi,
            'category': category,
            'unit_system': unit_system
        })
    
    except (ValueError, TypeError):
        return jsonify({
            'error': 'Please enter valid numbers for weight and height'
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500

if __name__== '_main_':
    app.run(debug=True, host='0.0.0.0', port=5000)