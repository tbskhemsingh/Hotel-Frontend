'use client';

import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import Header from './_layout_components/Header';
import Footer from './_layout_components/Footer';

export default function UserLayout({ children }) {
    // const router = useRouter();

    // useEffect(() => {
    //     const token = localStorage.getItem('adminToken');
    //     const role = localStorage.getItem('adminRole');

    //     if (!token) {
    //         router.replace('/auth/login');
    //         return;
    //     }

    //     if (!['Admin', 'Editor', 'Viewer'].includes(role)) {
    //         router.replace('/');
    //         return;
    //     }
    // }, []);

    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    );
}
