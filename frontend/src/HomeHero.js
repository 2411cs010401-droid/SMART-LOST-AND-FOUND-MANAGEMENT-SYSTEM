import React from 'react';

const HomeHero = () => {
    return (
        <div style={{ 
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
            backgroundColor: '#f8faf9', 
            minHeight: '100vh',
            paddingBottom: '60px'
        }}>
            
            {/* TOP PREMIUM NAVIGATION BAR */}
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 50px',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #eaeaea',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '1.4rem', color: '#0f4c3a', cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.6rem' }}>🌐</span> Findr
                </div>

                {/* Core Navigation Links */}
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <span style={navLinkStyle}>Home</span>
                    <span style={navLinkStyle}>How It Works</span>
                    <span style={navLinkStyle}>Search Items</span>
                    <span style={navLinkStyle}>Leaderboard</span>
                    <span style={navLinkStyle}>About Us</span>
                    <span style={navLinkStyle}>Contact</span>
                </div>

                {/* Auth Actions */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: '#555', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}>Login</button>
                    <button style={{ padding: '10px 20px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}>Register</button>
                </div>
            </nav>

            {/* DRIBBLBLE-STYLE HERO SECTION */}
            <div style={{ 
                backgroundColor: '#0f4c3a',
                margin: '40px 50px 20px 50px',
                borderRadius: '24px',
                padding: '60px 80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'white',
                boxShadow: '0 15px 35px rgba(15, 76, 58, 0.15)'
            }}>
                <div style={{ flex: 1, paddingRight: '50px', maxWidth: '650px' }}>
                    <h1 style={{ fontSize: '3.6rem', margin: '0 0 25px 0', lineHeight: '1.1', fontWeight: '800' }}>
                        Lost Something?<br />Let's Help You Find It.
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: '#a8d5c4', marginBottom: '45px', lineHeight: '1.6', fontWeight: '400' }}>
                        Searched everywhere? Don't stress. Post, search, or report lost and found items in minutes. Reconnect with what matters using our cryptographically secure architecture.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button style={primaryBtnStyle}>Report an Item</button>
                        <button style={secondaryBtnStyle}>Browse Lost Items</button>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ fontSize: '8rem', textShadow: '0 15px 30px rgba(0,0,0,0.3)', animation: 'float 3s ease-in-out infinite' }}>
                        🔍 📦
                    </div>
                </div>
            </div>

            {/* THE SYSTEM WORKFLOW ARROW ORDER SECTION */}
            <div style={{ margin: '60px 50px 0 50px' }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.6rem', fontWeight: '700', paddingLeft: '5px' }}>
                    How The Network Operates
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    
                    {/* PILLAR 1 */}
                    <div style={pillarStyle}>
                        <div style={badgeStyle}>Pillar 1: Submission</div>
                        <div style={iconStyle}>👤</div>
                        <h3 style={titleStyle}>User (Owner/Finder)</h3>
                        <p style={descStyle}>
                            The public ecosystem interface where citizens log found items, report losses, and securely submit distinctive proof records.
                        </p>
                    </div>

                    <div style={arrowStyle}>➔</div>

                    {/* PILLAR 2 */}
                    <div style={pillarStyle}>
                        <div style={badgeStyle}>Pillar 2: Matching</div>
                        <div style={iconStyle}>🤖</div>
                        <h3 style={titleStyle}>AI Background Service</h3>
                        <p style={descStyle}>
                            An autonomous backend scanning service executing automated pattern exploration to cross-reference logs instantly.
                        </p>
                    </div>

                    <div style={arrowStyle}>➔</div>

                    {/* PILLAR 3 */}
                    <div style={pillarStyle}>
                        <div style={badgeStyle}>Pillar 3: Integrity</div>
                        <div style={iconStyle}>🛡️</div>
                        <h3 style={titleStyle}>Admin Console</h3>
                        <p style={descStyle}>
                            The secure internal gatekeeper verifying matching cryptographic SHA-256 signatures before dispatching email alerts.
                        </p>
                    </div>

                </div>
            </div>
            
        </div>
    );
};

// --- REUSABLE INTERFACE STYLES ---

const navLinkStyle = {
    color: '#555',
    fontWeight: '500',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
};

const primaryBtnStyle = {
    padding: '16px 32px',
    backgroundColor: '#f39c12', 
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(243, 156, 18, 0.3)'
};

const secondaryBtnStyle = {
    padding: '16px 32px',
    backgroundColor: 'white',
    color: '#0f4c3a',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const pillarStyle = {
    flex: 1,
    minWidth: '260px',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '18px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #eaeaea',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
};

const badgeStyle = {
    backgroundColor: '#e8f3f0',
    color: '#0f4c3a',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginBottom: '18px'
};

const iconStyle = {
    fontSize: '2rem',
    marginBottom: '10px'
};

const titleStyle = { 
    margin: '0 0 12px 0', 
    color: '#2c3e50', 
    fontSize: '1.25rem',
    fontWeight: '700'
};

const descStyle = { 
    margin: 0, 
    color: '#7f8c8d', 
    lineHeight: '1.6', 
    fontSize: '0.9rem' 
};

const arrowStyle = {
    fontSize: '1.8rem',
    color: '#bdc3c7',
    fontWeight: 'bold'
};

export default HomeHero;