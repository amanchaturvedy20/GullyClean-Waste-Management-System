// src/components/charts/LineChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * @param {Object[]} data
 * @param {string} data[].name  – label for the X‑axis (e.g., date string)
 * @param {number} data[].value – numeric value to plot
 * @param {string} lineColor     – CSS color string for the line (optional)
 */
export default function SimpleLineChart({ data = [], lineColor = '#8884d8' }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot />
      </LineChart>
    </ResponsiveContainer>
  );
}
