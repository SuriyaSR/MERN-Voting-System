import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import Button from '../components/Button';
import { TrashIcon } from '@heroicons/react/24/outline';

const MyPolls = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyPolls();
    }, []);

    const fetchMyPolls = async () => {
        try {
            const response = await api.get('/polls/myPolls');
            setPolls(response.data);
        } catch (error) {
            console.error('Error fetching my polls:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this poll?')) return;

        try {
            await api.delete(`/polls/${id}`);
            toast.success('Poll deleted successfully');
            setPolls(polls.filter(poll => poll._id !== id));
        } catch (error) {
            toast.error('Failed to delete poll');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading your polls...</div>;
    }

    return (
        <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Polls</h1>

            {polls.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">You haven't created any polls yet.</p>
                    <Link to="/polls/create" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
                        Create one now &rarr;
                    </Link>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {polls.map((poll) => (
                            <li key={poll._id}>
                                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-medium text-indigo-600 truncate">
                                            <Link to={`/polls/${poll._id}`}>{poll.title}</Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Votes: {poll.options.reduce((acc, curr) => acc + curr.votes, 0)}
                                        </p>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex space-x-4">
                                        <Link to={`/polls/${poll._id}/results`}>
                                            <Button variant="secondary" className="text-sm">Results</Button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(poll._id)}
                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MyPolls;
