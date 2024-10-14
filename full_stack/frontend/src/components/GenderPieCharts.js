
import React from "react"; 
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; 

// GenderPieChart component takes male, female, and other counts as props
const GenderPieChart = ({ maleCount, femaleCount, otherCount }) => {
  // Data for the pie chart
  const data = [
    { name: "Male", value: maleCount }, // Male count
    { name: "Female", value: femaleCount }, // Female count
    { name: "Other", value: otherCount }, // Other count
  ];

  // Define colors for each segment of the pie chart
  const COLORS = ["#2980b9", "#16a085", "#FF8042"];

  // Custom label function to display percentage inside pie segments
  const renderLabel = ({ value, percent }) => {
    return `${(percent * 100).toFixed(0)}%`; // Format percentage to whole number
  };

  return (
    <PieChart className="piechart" width={600} height={400}> {/* Set dimensions for the pie chart */}
      <Pie
        data={data} // Data for the pie chart
        cx={200} // X coordinate of the center of the pie
        cy={200} // Y coordinate of the center of the pie
        labelLine={false} // Disable label lines
        label={renderLabel} // Use custom label function
        outerRadius={80} // Radius of the outer edge of the pie
        dataKey="value" // Key to access the value for each segment
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} /> // Set color for each segment
        ))}
      </Pie>
      <Tooltip 
        formatter={(value) => [value, ""]} // Show only value in tooltip
      />
      <Legend 
        formatter={(value) => <span>{value}</span>} // Display names in legend
      />
    </PieChart>
  );
};

export default GenderPieChart; // Export the GenderPieChart component
