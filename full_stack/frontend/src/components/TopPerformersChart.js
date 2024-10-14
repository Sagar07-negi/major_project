import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomXAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="end"
        fill="#666"
        dy={10} // Adjust vertical spacing
        dx={30}
        fontSize={12} // Adjust font size here
      >
        {payload.value}
      </text>
    </g>
  );
};

const TopPerformersChart = ({ topPerformers = [], title = "Top Performers", scoreType }) => {
  const data = topPerformers.map((performer) => ({
    name: performer.name,
    totalScore: performer.totalScore,
  }));

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={350}> {/* Increased height */}
        <BarChart data={data}>
          <XAxis dataKey="name" tick={<CustomXAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend 
            layout="horizontal" 
            verticalAlign="top" 
            align="right" 
            wrapperStyle={{ marginTop: '20px' }} // Adjust margin here
          />
          <Bar 
            dataKey="totalScore" 
            fill="#2980b9" 
            animationDuration={500} 
            name={scoreType.charAt(0).toUpperCase() + scoreType.slice(1) + " Score"}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopPerformersChart;
