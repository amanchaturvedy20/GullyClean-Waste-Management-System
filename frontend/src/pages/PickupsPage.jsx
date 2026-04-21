import React from 'react';
import PickupList from '../components/pickupcomponents/PickupList';

const PickupsPage = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">All Pickup Requests</h1>
            <PickupList />
        </div>
    );
};

export default PickupsPage;