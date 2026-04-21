import React from 'react';
import WorkerDashboard from '../components/workercomponents/WorkerDashboard';

const WorkerDashboardPage = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Your Assignments</h1>
            <WorkerDashboard />
        </div>
    );
};

export default WorkerDashboardPage;