// app/login/page.tsx
'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../_contexts/AuthContext';

export default function LoginPage() {
    const { login, error } = useContext(AuthContext); // Access error from AuthContext
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !password) {
            setIsLoading(false);
            return;
        }


        try {
            await login(email, password);
            // Redirection is handled within the AuthContext's login function
        } catch (err: any) {
            setEmail('');
            setPassword('');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex p-0">
            {/* Left Column */}
            <div className="hidden md:flex md:w-1/2 bg-git-blue text-white flex-col items-center justify-center">
                {/* Company Logo */}
                <img
                    src="/images/logo/a2p-red.png" // Replace with your logo path
                    alt="A2P Energy Logo"
                    className="h-32 w-auto mb-4"
                />
                {/* Company Name */}
                <h1 className="text-4xl font-extrabold">A2P Energy Solution Pvt Ltd</h1>
                <p className="mt-2 text-lg">Empowering Sustainable Solutions</p>
            </div>

            {/* Right Column */}
            <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100 p-8">
                <div className="w-full max-w-md">
                    <h1
                        className="tracking-tight text-gray-800 text-4xl font-sans font-medium pb-4 text-center"
                        style={{ boxShadow: '0 4px 4px -4px rgba(0, 0, 0, 0.3)' }}
                    >
                        Sign In
                    </h1>

                    <p className="text-center text-gray-600 mb-8 pt-4">
                       Enter your email and password to login
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-md shadow-sm">
                            <div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-md 
                                 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-600 
                                 focus:border-indigo-500 sm:text-lg text-slate-900"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mt-4">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-md 
                                 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 
                                 focus:border-indigo-500 sm:text-lg text-slate-900"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className={`w-full flex justify-center py-3 px-4 border border-transparent text-lg 
                               font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                               ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up today
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
