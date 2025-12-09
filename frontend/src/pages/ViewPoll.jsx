import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import Button from '../components/Button';
import useAuthStore from '../store/authStore';

const ViewPoll = () => {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await api.get(`/polls/${id}`);
                setPoll(response.data);
            } catch (error) {
                toast.error('Failed to load poll');
                navigate('/polls');
            } finally {
                setLoading(false);
            }
        };
        fetchPoll();
    }, [id, navigate]);

    const handleVote = async () => {
        if (selectedOption === null) {
            toast.error('Please select an option');
            return;
        }

        setVoting(true);
        try {
            await api.post(`/polls/${id}/vote`, { optionIndex: selectedOption });
            toast.success('Vote cast successfully!');
            navigate(`/polls/${id}/results`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to vote');
        } finally {
            setVoting(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading poll...</div>;
    if (!poll) return null;

    // Check if user has already voted (client-side check for UX, server enforces it)
    const hasVoted = poll.voters.includes(user?._id) || poll.voters.some(v => v === user?._id);

    if (hasVoted) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">You have already voted!</h2>
                <p className="text-gray-600 mb-6">You can only vote once per poll.</p>
                <Link to={`/polls/${id}/results`}>
                    <Button variant="primary">View Results</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{poll.title}</h1>

            <div className="space-y-4 mb-8">
                {poll.options.map((option, index) => (
                    <div
                        key={index}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedOption === index
                                ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        onClick={() => setSelectedOption(index)}
                    >
                        <input
                            type="radio"
                            name="poll-option"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            checked={selectedOption === index}
                            onChange={() => setSelectedOption(index)}
                        />
                        <span className="ml-3 font-medium text-gray-900">{option.text}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-4">
                <Link to={`/polls/${id}/results`}>
                    <Button variant="secondary">View Results</Button>
                </Link>
                <Button onClick={handleVote} disabled={voting || selectedOption === null}>
                    {voting ? 'Submitting...' : 'Vote Now'}
                </Button>
            </div>
        </div>
    );
};

export default ViewPoll;
