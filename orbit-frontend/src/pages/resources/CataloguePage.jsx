import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const CataloguePage = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async (search = '') => {
        try {
            setLoading(true);
            const url = search ? `/api/resources?search=${encodeURIComponent(search)}` : '/api/resources';
            const response = await axiosInstance.get(url);
            setResources(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch resources');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchResources(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        fetchResources('');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resource Catalogue</h1>
                    <p className="text-sm text-gray-500 mt-1">Browse and book campus facilities and equipment.</p>
                </div>
                
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search resources..." 
                        className="px-4 py-2 border rounded-lg flex-1 min-w-[250px] shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors">
                        Search
                    </button>
                    {searchTerm && (
                        <button type="button" onClick={handleClearSearch} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors">
                            Clear
                        </button>
                    )}
                </form>
            </div>

            {loading && (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-100">
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && resources.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No resources found matching your criteria.</p>
                </div>
            )}

            {!loading && !error && resources.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {resources.map(resource => (
                        <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                            {resource.imageUrl ? (
                                <img src={resource.imageUrl} alt={resource.name} className="w-full h-40 object-cover" />
                            ) : (
                                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                            )}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{resource.name}</h3>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${resource.availabilityStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {resource.availabilityStatus}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">{resource.description || 'No description available.'}</p>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-xs text-gray-500">
                                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        <span>{resource.location}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        <span>Capacity: {resource.capacity}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                        <span>Type: {resource.type}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                                        View
                                    </button>
                                    <button 
                                        className={`flex-1 text-sm font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm ${resource.availabilityStatus === 'ACTIVE' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                        disabled={resource.availabilityStatus !== 'ACTIVE'}
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CataloguePage;
