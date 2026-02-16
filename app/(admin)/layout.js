// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AdminLayout({ children }) {
//     const router = useRouter();

//     useEffect(() => {
//         const token = localStorage.getItem('adminToken');
//         console.log(token);
//         const role = localStorage.getItem('adminRole');

//         const allowedRoles = ['Admin', 'Editor', 'Viewer'];

//         if (!token) {
//             router.replace('/auth/login');
//             return;
//         }

//         if (!allowedRoles.includes(role)) {
//             router.replace('/');
//             return;
//         }
//     }, []);

//     return <>{children}</>;
// }

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const role = localStorage.getItem('adminRole');

        if (!token) {
            router.replace('/auth/login');
            return;
        }

        if (!['Admin', 'Editor', 'Viewer'].includes(role)) {
            router.replace('/');
            return;
        }
    }, []);

    return <>{children}</>;
}
