import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBins } from '../../store/binSlice';
import BinCard from './BinCard';
import Spinner from '../common/Spinner';
import { Search } from 'lucide-react';

const BinList = ({ limit }) => {
    const dispatch = useDispatch();
    const { bins, status, error } = useSelector((state) => state.bin);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchBins());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <Spinner />;
    }

    if (status === 'failed') {
        return <div className="text-center text-red-500">{error}</div>;
    }

    let filteredBins = bins;
    
    if (searchTerm) {
        filteredBins = filteredBins.filter(bin => 
            (bin.binId && bin.binId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (bin.location && bin.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    
    const displayBins = limit ? filteredBins.slice(0, limit) : filteredBins;

    return (
        <div>
            {!limit && (
                <div className="mb-8 max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by Bin ID or Location..."
                            className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            )}
            
            {displayBins.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayBins.map((bin) => (
                        <BinCard key={bin._id} bin={bin} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                        <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No bins found</h3>
                    <p className="text-neutral-500">
                        {searchTerm ? `We couldn't find any bins matching "${searchTerm}".` : "There are currently no bins available in the system."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BinList;