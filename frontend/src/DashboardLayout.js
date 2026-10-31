import React, { useState } from 'react';

const DashboardLayout = ({ children }) => {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const menuItems = [
        { name: 'Dashboard', icon: '🏠' },
        { name: 'Report Lost Item', icon: '📦' },
        { name: 'Report Found Item', icon: '🎁' },
        { name: 'Search Items', icon: '🔍' },
        { name: 'AI Matches', icon: '🤖' },
        { name: 'My Lost Reports', icon: '📄' },
        { name: 'My Found Reports', icon: '📄' },
        { name: 'Claims', icon: '🙋' },
        { name: 'Notifications', icon: '🔔' },
        { name: 'Rewards', icon: '🏆' },
        { name: 'Profile', icon: '👤' },
        { name: 'Settings', icon: '⚙️' }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            
            {/* SIDEBAR NAVIGATION */}
            <div style={{ 
                width: '260px', 
                backgroundColor: '#ffffff', 
                borderRight: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 0'
            }}>
                <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
                    <h2 style={{ margin: 0, color: '#0f4c3a', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🌐</span> Findr
                    </h2>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {menuItems.map((item) => (
                        <div 
                            key={item.name}
                            onClick={() => setActiveItem(item.name)}
                            style={{
                                padding: '12px 20px',
                                margin: '4px 15px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                backgroundColor: activeItem === item.name ? '#e8f3f0' : 'transparent',
                                color: activeItem === item.name ? '#0f4c3a' : '#555',
                                fontWeight: activeItem === item.name ? 'bold' : 'normal',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* LOGOUT BUTTON AT THE BOTTOM */}
                <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
                    <div style={{
                        padding: '12px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        color: '#e74c3c',
                        fontWeight: 'bold',
                    }}>
                        <span style={{ fontSize: '1.2rem' }}>🚪</span>
                        <span>Logout</span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {children}
            </div>
            
        </div>
    );
};

export default DashboardLayout;