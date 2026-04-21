import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBinById } from '../store/binSlice';
import BinDetails from '../components/bincomponents/BinDetails';
import Spinner from '../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

const BinDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentBin, status, error } = useSelector((state) => state.bin);

    useEffect(() => {
        dispatch(fetchBinById(id));
    }, [id, dispatch]);

    return (
        <div>
            <div className="mb-8">
                <Link to="/bins" className="btn btn-ghost">
                    <ArrowLeft size={16}/> Back to All Bins
                </Link>
            </div>

            {status === 'loading' && <Spinner />}
            {status === 'failed' && <div className="text-center text-red-500">{error}</div>}
            {status === 'succeeded' && currentBin && <BinDetails bin={currentBin} />}
        </div>
    );
};

export default BinDetailPage;