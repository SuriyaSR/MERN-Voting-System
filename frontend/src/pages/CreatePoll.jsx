import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index) => {
        if (options.length <= 2) {
            toast.error('A poll must have at least 2 options');
            return;
        }
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!title.trim()) {
            toast.error('Please enter a poll title');
            return;
        }
        const validOptions = options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
            toast.error('Please provide at least 2 valid options');
            return;
        }

        setLoading(true);
        try {
            await api.post('/polls', { title, options: validOptions });
            toast.success('Poll created successfully!');
            navigate('/polls');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create poll');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Poll</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="title"
                    label="Poll Question"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., What is your favorite programming language?"
                    required
                />

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                className="flex-1"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                required
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="text-red-500 hover:text-red-700 p-2"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={addOption} className="flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" /> Add Option
                    </Button>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end">
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Poll'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreatePoll;
