'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password);
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: '100vh',
                backgroundColor: '#ffffff'
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6">
                        <div className="card shadow-lg border-0 rounded-4 p-5" style={{ minHeight: '520px' }}>
                            {/* Logo */}
                            <div className="text-center mb-4">
                                <Image src="/image/logo.webp" alt="Logo" width={160} height={40} priority />
                            </div>
                            {/* Header without background */}
                            <div className="text-center py-3">
                                <h3 className="fw-semibold mb-2">Welcome Back</h3>
                                <p className="text-muted mb-0">Sign in to your account</p>
                            </div>

                            <div className="card-body px-3 py-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg rounded-3"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg rounded-3"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="remember" />
                                            <label className="form-check-label" htmlFor="remember">
                                                Remember me
                                            </label>
                                        </div>

                                        <Link href="/forgot-password" className="text-decoration-none text-primary">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <button type="submit" className="btn w-100 fw-bold py-3 rounded-3 text-white theme-button-orange fs-5">
                                        Sign In
                                    </button>

                                    <div className="text-center mt-4">
                                        <span className="text-muted">Don’t have an account?</span>
                                        <Link
                                            href="/register"
                                            className="fw-semibold text-decoration-none ms-2"
                                            style={{ color: '#f0831e' }}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
