import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;

            // We need to decode the token or fetch user details. 
            // For now, let's fetch user details using the token.
            // But wait, the backend /me endpoint exists!

            // First, set the token temporarily to use it in the next request
            localStorage.setItem('token', token);

            const userResponse = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            login(userResponse.data, token);
            toast.success('Logged in successfully!');
            navigate('/polls');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed');
            localStorage.removeItem('token'); // Cleanup if failed
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Or{' '}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        create a new account
                    </Link>
                </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                    id="email"
                    type="email"
                    label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                />
                <Input
                    id="password"
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                />
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
        </div>
    );
};

export default Login;
