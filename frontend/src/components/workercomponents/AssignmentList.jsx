
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPickups,
  completePickup,
  assignPickup,
} from '../../store/pickupSlice';
import AssignModal from '../pickupcomponents/AssignModal';
import { ClipboardList, CheckCircle2, Repeat } from 'lucide-react';

export default function AssignmentList() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.pickup);
  const { user } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchPickups());
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center text-red-600 mt-10">
        Error loading assignments: {error}
      </div>
    );
  }

  // Filter to assigned pickups
  const assignments = list.filter((p) => p.status === 'assigned');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Assigned Pickups</h1>

      {assignments.length === 0 ? (
        <p className="text-gray-500">No current assignments.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Bin</th>
                <th>Requester</th>
                <th>Scheduled For</th>
                <th>Worker</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>#{p.binId}</td>
                  <td>{p.requester}</td>
                  <td>{new Date(p.requestedDate).toLocaleString()}</td>
                  <td>{p.assignedToName || p.assignedTo}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => dispatch(completePickup(p.id))}
                      title="Mark Complete"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setSelected(p);
                        setIsModalOpen(true);
                      }}
                      title="Reassign"
                    >
                      <Repeat className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selected && (
        <AssignModal
          pickup={selected}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
