import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InternshipList() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/internships');
                if (response.data && Array.isArray(response.data)) {
                    setInternships(response.data);
                } else {
                    setError('Invalid data format received');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch internships');
                setLoading(false);
                console.error('Error fetching internships:', err);
            }
        };

        fetchInternships();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!internships || internships.length === 0) return <div>No internships found</div>;

    return (
        <div className="internship-list">
            {internships.map((internship) => (
                <div key={internship._id || Math.random()} className="internship-card">
                    <h3>{internship?.title || 'No Title'}</h3>
                    <p>{internship?.company || 'No Company'}</p>
                    <p>Location: {internship?.location || 'Not specified'}</p>
                    <p>Duration: {internship?.duration || 'Not specified'}</p>
                    <p>Stipend: {internship?.stipend || 'Not specified'}</p>
                    <p>Profile: {internship?.profile || 'Not specified'}</p>
                </div>
            ))}
        </div>
    );
}

export default InternshipList;