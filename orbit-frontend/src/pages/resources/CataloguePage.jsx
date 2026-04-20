import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const CataloguePage = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/resources');
            setResources(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch resources');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Resource Catalogue</h1>
            {loading && <p>Loading resources...</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default CataloguePage;
