// src/pages/AssignmentPage.jsx
import React from 'react';
import AssignmentList from '../components/workercomponents/AssignmentList';

export default function AssignmentPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Assigned Pickups</h1>
      <AssignmentList />
    </div>
  );
}
