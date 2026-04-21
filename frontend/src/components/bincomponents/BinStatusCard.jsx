// src/components/bins/BinStatusCard.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setFull,
  setEmpty,
  updateLastEmptied,
  clearBin,
} from '../../store/binSlice';
import { Clock, MapPin, Trash2 } from 'lucide-react';

export default function BinStatusCard() {
  const dispatch = useDispatch();
  const { binData } = useSelector((state) => state.bin);

  if (!binData.id) {
    return (
      <div className="text-center text-gray-500 p-6">
        No bin selected.
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg max-w-md mx-auto">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">Bin #{binData.id}</h2>
          <button
            onClick={() => dispatch(clearBin())}
            className="btn btn-ghost btn-sm text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <p className="flex items-center mt-2">
          <MapPin className="mr-2 h-5 w-5 text-green-600" />
          <span className="font-medium">Location:</span>
          <span className="ml-1">{binData.location}</span>
        </p>

        <p className="flex items-center mt-2">
          <span className="font-medium">Status:</span>
          <span
            className={`badge ml-2 ${
              binData.status === 'full' ? 'badge-error' : 'badge-success'
            }`}
          >
            {binData.status.toUpperCase()}
          </span>
        </p>

        <p className="flex items-center mt-2 text-sm text-gray-600">
          <Clock className="mr-2 h-5 w-5" />
          <span className="font-medium">Last Emptied:</span>
          <span className="ml-1">
            {binData.lastEmptied
              ? new Date(binData.lastEmptied).toLocaleString()
              : 'Never'}
          </span>
        </p>

        <div className="card-actions justify-end mt-4 space-x-2">
          <button
            onClick={() => dispatch(setFull())}
            className="btn btn-error btn-sm"
          >
            Mark Full
          </button>
          <button
            onClick={() => dispatch(setEmpty())}
            className="btn btn-success btn-sm"
          >
            Mark Empty
          </button>
          <button
            onClick={() =>
              dispatch(updateLastEmptied(new Date().toISOString()))
            }
            className="btn btn-outline btn-sm"
          >
            Update Time
          </button>
        </div>
      </div>
    </div>
  );
}
