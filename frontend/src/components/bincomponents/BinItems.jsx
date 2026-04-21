// src/components/bins/BinItems.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function BinItems() {
  const { bins } = useSelector((state) => state.bin);

  if (!bins || bins.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No bins available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {bins.map((bin) => (
        <div
          key={bin.id}
          className="card bg-base-100 shadow hover:shadow-lg transition"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-lg">Bin #{bin.id}</h2>
              <button
                className="btn btn-ghost btn-sm text-red-500"
                onClick={() => {
                  /* dispatch remove or open a modal */
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <p className="flex items-center">
              <span className="font-medium mr-2">Location:</span>
              <span>{bin.location || "Unknown"}</span>
            </p>

            <p className="flex items-center mt-2">
              <span className="font-medium mr-2">Status:</span>
              <span
                className={`badge ${
                  bin.status === "full" ? "badge-error" : "badge-success"
                }`}
              >
                {bin.status.toUpperCase()}
              </span>
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Last Emptied:{" "}
              {bin.lastEmptied
                ? new Date(bin.lastEmptied).toLocaleString()
                : "Never"}
            </p>

            <div className="card-actions justify-end mt-4">
              <Link
                to={`/bins/${bin.id}`}
                className="btn btn-primary btn-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
