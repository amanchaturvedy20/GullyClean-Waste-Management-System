
import React from 'react';
import { ClipboardList, Clock, User, CheckCircle2, Repeat } from 'lucide-react';

export default function AssignmentCard({
  pickup,
  onComplete,
  onReassign,
  showActions = true,
}) {
  return (
    <div className="card bg-base-100 shadow-md mb-4">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title flex items-center">
            <ClipboardList className="mr-2 h-5 w-5 text-green-600" />
            Pickup #{pickup.id}
          </h2>
          <div className="badge badge-info">{pickup.status.toUpperCase()}</div>
        </div>

        <p className="flex items-center mt-2">
          <span className="font-medium mr-1">Bin:</span>#{pickup.binId}
        </p>

        <p className="flex items-center mt-2">
          <Clock className="mr-1 h-4 w-4 text-gray-600" />
          {new Date(pickup.requestedDate).toLocaleString()}
        </p>

        {pickup.requester && (
          <p className="flex items-center mt-2">
            <User className="mr-1 h-4 w-4 text-gray-600" />
            {pickup.requester}
          </p>
        )}

        {showActions && (
          <div className="card-actions justify-end mt-4 space-x-2">
            {onComplete && (
              <button
                onClick={() => onComplete(pickup.id)}
                className="btn btn-success btn-sm"
                title="Mark Complete"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
            )}
            {onReassign && (
              <button
                onClick={() => onReassign(pickup)}
                className="btn btn-outline btn-sm"
                title="Reassign"
              >
                <Repeat className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
