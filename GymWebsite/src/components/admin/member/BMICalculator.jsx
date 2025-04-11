import React, { useState, useEffect } from "react";

const BMICalculator = ({ weight, height }) => {
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(2));

      if (bmiValue < 18.5) setCategory("Underweight");
      else if (bmiValue < 25) setCategory("Normal weight");
      else if (bmiValue < 30) setCategory("Overweight");
      else setCategory("Obese");
    }
  }, [weight, height]);

  if (!weight || !height) return null;

  return (
    <div className="bg-white p-4 mt-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">BMI Calculator</h3>
      <p><span className="font-medium">Weight:</span> {weight} kg</p>
      <p><span className="font-medium">Height:</span> {height} cm</p>
      <p><span className="font-medium">BMI:</span> {bmi}</p>
      <p><span className="font-medium">Category:</span> {category}</p>
    </div>
  );
};

export default BMICalculator;
