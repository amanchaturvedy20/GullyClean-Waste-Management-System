// src/components/pickups/PickupItem.jsx
import React from 'react';
import { Clock, User, ClipboardList } from 'lucide-react';

export default function PickupItem({ pickup, onAssign, onView }) {
  return (
    <tr>
      <td className="px-4 py-2">{pickup.id}</td>
      <td className="px-4 py-2">#{pickup.binId}</td>
      <td className="px-4 py-2 flex items-center">
        <User className="w-4 h-4 mr-1 text-gray-600" />
        {pickup.requester}
      </td>
      <td className="px-4 py-2 flex items-center">
        <Clock className="w-4 h-4 mr-1 text-gray-600" />
        {new Date(pickup.requestedDate).toLocaleString()}
      </td>
      <td className="px-4 py-2">
        <span
          className={`badge ${
            pickup.status === 'pending'
              ? 'badge-warning'
              : pickup.status === 'assigned'
              ? 'badge-info'
              : 'badge-success'
          }`}
        >
          {pickup.status.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-2 space-x-2">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => onAssign(pickup)}
        >
          Assign
        </button>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => onView(pickup)}
        >
          View
        </button>
      </td>
    </tr>
  );
}
