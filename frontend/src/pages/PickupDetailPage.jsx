// src/pages/PickupDetailPage.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent, fetchPickups } from '../store/pickupSlice';
import PickupItemDetail from '../components/pickupcomponents/PickupItems'; // hypothetical detailed component

export default function PickupDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { list, current } = useSelector((s) => s.pickup);

  useEffect(() => {
    if (!list.length) {
      dispatch(fetchPickups());
    } else {
      const found = list.find((p) => String(p.id) === id);
      if (found) dispatch(setCurrent(found));
    }
  }, [dispatch, id, list]);

  if (!current || current.id !== Number(id)) {
    return <p className="text-center text-gray-500 mt-6">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Pickup Detail — #{id}</h1>
      <PickupItemDetail pickup={current} />
    </div>
  );
}
