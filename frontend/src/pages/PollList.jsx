import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';

const PollList = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await api.get('/polls');
                setPolls(response.data);
            } catch (error) {
                console.error('Error fetching polls:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading polls...</div>;
    }

    return (
        <div className="px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">All Polls</h1>
                <Link to="/polls/create">
                    <Button variant="primary">Create New Poll</Button>
                </Link>
            </div>

            {polls.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No polls found. Be the first to create one!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {polls.map((poll) => (
                        <div key={poll._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                                    {poll.title}
                                </h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>Total Votes: {poll.options.reduce((acc, curr) => acc + curr.votes, 0)}</p>
                                </div>
                                <div className="mt-5">
                                    <Link to={`/polls/${poll._id}`}>
                                        <Button variant="outline" className="w-full">
                                            View Poll
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PollList;
