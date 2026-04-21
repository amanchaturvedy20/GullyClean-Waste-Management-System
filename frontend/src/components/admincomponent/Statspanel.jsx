// src/components/admin/StatsPanel.jsx
import React from 'react';

/**
 * @param {Array<{ id: string, icon: React.ReactNode, value: number | string, label: string }>} stats
 */
export default function StatsPanel({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(({ id, icon, value, label }) => (
        <div key={id} className="card bg-base-100 shadow-md p-4 flex items-center space-x-4">
          <div className="icon text-3xl">{icon}</div>
          <div>
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
