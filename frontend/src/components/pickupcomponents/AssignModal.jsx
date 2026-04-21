// src/components/pickups/AssignModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignPickup, fetchPickups } from '../../store/pickupSlice';

export default function AssignModal({ pickup, onClose }) {
  const dispatch = useDispatch();
  const { list: workers } = useSelector((state) => state.auth.workersSlice || { list: [] });
  const [workerId, setWorkerId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  // Optionally load workers list if not already fetched
  useEffect(() => {
    if (!workers.length) {
      dispatch(fetchWorkers()); // implement in your auth or workers slice
    }
  }, [workers.length, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(assignPickup({
        pickupId: pickup.id,
        workerId,
        scheduleDate,
      })).unwrap();
      // Refresh pickups list if needed
      dispatch(fetchPickups());
      onClose();
    } catch (err) {
      console.error('Assignment failed:', err);
    }
  };

  return (
    <>
    <input type="checkbox" id="assign-modal" className="modal-toggle" checked readOnly />
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Assign Pickup #{pickup.id}</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label" htmlFor="worker">
              <span className="label-text">Select Worker</span>
            </label>
            <select
              id="worker"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              required
              className="select select-bordered w-full"
            >
              <option value="" disabled>Choose a worker</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="scheduleDate">
              <span className="label-text">Schedule Date & Time</span>
            </label>
            <input
              type="datetime-local"
              id="scheduleDate"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
   </>
  );
}
