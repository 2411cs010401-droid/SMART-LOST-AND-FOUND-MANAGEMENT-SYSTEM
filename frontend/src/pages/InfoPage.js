import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const InfoPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Safely extract the title passed from LandingPage
    const title = location.state?.title || "Page";

    const renderContent = () => {
        switch(title) {
            case 'About':
                return <p>Findr is a secure, AI-powered platform designed to help communities reconnect with their lost items through cryptographic verification.</p>;
            case 'Contact':
                return <p>Reach out to our support team at: <strong>support@findr-network.com</strong></p>;
            case 'Leaderboard':
                return (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#0f4c3a', color: 'white' }}>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Rank</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>User</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Items Returned</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>1</td><td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Shaik Nayab Rasool</td><td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>45</td></tr>
                            <tr><td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>2</td><td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Alex Johnson</td><td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>38</td></tr>
                            <tr><td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>3</td><td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Maria Garcia</td><td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>32</td></tr>
                        </tbody>
                    </table>
                );
            default:
                return <p>Content for {title} is coming soon!</p>;
        }
    };

    return (
        <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#f8faf9', minHeight: '100vh' }}>
            <h1 style={{ color: '#0f4c3a', fontSize: '2.5rem' }}>{title}</h1>
            <div style={{ margin: '30px auto', maxWidth: '600px', fontSize: '1.2rem', color: '#4a5568', lineHeight: '1.6' }}>
                {renderContent()}
            </div>
            <button 
                onClick={() => navigate('/')} 
                style={{ padding: '12px 25px', backgroundColor: '#0f4c3a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}
            >
                Return Home
            </button>
        </div>
    );
};

// THIS IS THE CRITICAL LINE THAT WAS MISSING
export default InfoPage;