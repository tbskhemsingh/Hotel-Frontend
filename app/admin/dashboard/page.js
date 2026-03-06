'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import React from 'react';

const Page = () => {
    useAuthGuard(['Admin', 'Editor', 'Viewer']);

    return (
        <div className="card shadow-sm mb-5 bg-white rounded-2">
            <div className="card-body">
                {/* <h5 className="card-title">Dashboard</h5> */}
                <p className="card-text">Welcome to the admin dashboard!</p>
            </div>
        </div>
    );
};

export default Page;
