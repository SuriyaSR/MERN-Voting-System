import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';

const PollResults = () => {
    const { id } = useParams();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get(`/polls/${id}/results`);
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    if (loading) return <div className="text-center py-10">Loading results...</div>;
    if (!results) return <div className="text-center py-10">Poll not found</div>;

    const totalVotes = results.results.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{results.title}</h1>
            <p className="text-gray-500 mb-8">Total Votes: {totalVotes}</p>

            <div className="space-y-6">
                {results.results.map((option, index) => {
                    const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);

                    return (
                        <div key={index}>
                            <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
                                <span>{option.option}</span>
                                <span>{percentage}% ({option.votes} votes)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
                <Link to="/polls">
                    <Button variant="outline">Back to Polls</Button>
                </Link>
            </div>
        </div>
    );
};

export default PollResults;
