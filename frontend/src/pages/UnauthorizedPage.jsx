import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => {
    return (
        <div className="hero min-h-[60vh]">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <ShieldAlert className="mx-auto text-error" size={64}/>
                    <h1 className="text-5xl font-bold mt-4">Access Denied</h1>
                    <p className="py-6">You do not have permission to view this page. Your current role does not grant access.</p>
                    <Link to="/" className="btn btn-primary">Go to Homepage</Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;