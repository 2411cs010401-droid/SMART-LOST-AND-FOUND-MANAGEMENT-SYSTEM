import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, setCurrentUser } = useContext(UserContext);
    const [adminUser, setAdminUser] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [activeNav, setActiveNav] = useState('Home');

    // 🛡️ THE GATEKEEPER FUNCTION: Protects dashboard routes
    const handleProtectedRoute = (route) => {
        if (isLoggedIn) {
            navigate(route);
        } else {
            alert("Security Notice: Please Sign In or Register to access the network dashboard.");
            navigate('/login');
        }
    };

    const handleNavClick = (itemName) => {
        setActiveNav(itemName);
        switch(itemName) {
            case 'Home': 
                navigate('/'); 
                break;
            case 'Search Items': 
                // Uses the gatekeeper instead of navigating directly!
                handleProtectedRoute('/dashboard'); 
                break;
            case 'How It Works': 
                window.scrollTo({ top: 800, behavior: 'smooth' }); 
                break;
            case 'About':
                navigate('/info', { state: { title: itemName } }); 
                break;
            default: 
                break;
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        navigate('/');
    };

    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (adminUser.trim().toLowerCase() === 'admin' && adminPassword === 'admin123') {
            window.open('/admin', '_blank', 'noopener,noreferrer');
            setShowAdminLogin(false);
            setAdminPassword('');
        } else {
            alert('Invalid admin credentials. Use username admin and password admin123.');
        }
    };

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '60px' }}>
            
            {/* Navigation Bar */}
            <nav style={navStyle}>
                <div style={{ fontWeight: '900', fontSize: '1.8rem', color: '#0f4c3a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '2rem' }}>🌐</span> Findr
                </div>
                <div style={{ display: 'flex', gap: '30px' }}>
                    {['Home', 'How It Works', 'Search Items', 'About'].map(item => (
                        <span key={item} onClick={() => handleNavClick(item)} style={activeNav === item ? navLinkActiveStyle : navLinkStyle}>
                            <span style={activeNav === item ? navIconActiveStyle : navIconStyle}>{getNavIcon(item)}</span>
                            {item}
                        </span>
                    ))}
                </div>
                <div>
                    {isLoggedIn ? (
                        <>
                            <button onClick={() => navigate('/dashboard')} style={btnSecondary}>My Dashboard</button>
                            <button onClick={handleLogout} style={btnPrimary}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} style={btnSecondary}>Login</button>
                            <button onClick={() => setShowAdminLogin(!showAdminLogin)} style={showAdminLogin ? btnNavActive : btnSecondary}>Admin</button>
                            <button onClick={() => navigate('/register')} style={btnPrimary}>Register</button>
                        </>
                    )}
                </div>
                {showAdminLogin && !isLoggedIn && (
                    <form onSubmit={handleAdminLogin} style={adminDropdownStyle}>
                        <strong style={{ color: '#0f4c3a' }}>Admin Login</strong>
                        <input value={adminUser} onChange={(e) => setAdminUser(e.target.value)} placeholder="Username: admin" style={adminInputStyle} />
                        <input value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Password: admin123" type="password" style={adminInputStyle} />
                        <button type="submit" style={adminButtonStyle}>Open Admin</button>
                    </form>
                )}
            </nav>

            {/* 3D Glassmorphism Hero Section */}
            <div style={hero3DStyle}>
                <div style={glassCardStyle}>
                    <h1 style={{ fontSize: '3.8rem', color: 'white', marginBottom: '25px', lineHeight: '1.1', fontWeight: '900', textShadow: '2px 4px 10px rgba(0,0,0,0.3)' }}>
                        Lost Something? Found Something?<br />
                        <span style={{ color: '#f39c12' }}>Reconnect Items Using AI.</span>
                    </h1>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                        {/* THESE BUTTONS ARE NOW SECURED */}
                        <button onClick={() => handleProtectedRoute('/dashboard')} style={btnAction}>🔍 Report Lost Item</button>
                        <button onClick={() => handleProtectedRoute('/dashboard')} style={btnAction}>🎒 Report Found Item</button>
                        <button onClick={() => handleProtectedRoute('/dashboard')} style={btnSearch}>🔎 Search Items</button>
                    </div>
                </div>
            </div>

            {/* Workflow Section */}
            <div style={{ padding: '60px 50px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem', color: '#2d3748', fontWeight: '800' }}>How The Network Operates</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '25px', flexWrap: 'wrap' }}>
                    <div style={pillarStyle}><div style={badgeStyle}>Pillar 1</div><h3>👤 User</h3><p>Report and track items securely.</p></div>
                    <div style={arrowStyle}>➔</div>
                    <div style={pillarStyle}><div style={badgeStyle}>Pillar 2</div><h3>🤖 AI System</h3><p>Automatic background matching.</p></div>
                    <div style={arrowStyle}>➔</div>
                    <div style={pillarStyle}><div style={badgeStyle}>Pillar 3</div><h3>🛡️ Admin</h3><p>Cryptographic verification.</p></div>
                </div>
            </div>
        </div>
    );
};

const hero3DStyle = { margin: '40px 50px', padding: '80px 50px', textAlign: 'center', borderRadius: '24px', background: 'linear-gradient(135deg, #0f4c3a 0%, #1a362b 50%, #0d2b20 100%)', boxShadow: '0 25px 50px -12px rgba(15, 76, 58, 0.5), inset 0 2px 4px rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' };
const glassCardStyle = { position: 'relative', zIndex: 2, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' };
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px 50px', backgroundColor: 'white', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
const navLinkStyle = { cursor: 'pointer', color: '#4a5568', fontWeight: '600', padding: '8px 12px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid transparent', transition: 'all 0.2s ease' };
const navLinkActiveStyle = { ...navLinkStyle, color: '#0f4c3a', backgroundColor: '#e8f3f0', border: '1px solid #0f4c3a' };
const navIconStyle = { width: '26px', height: '26px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' };
const navIconActiveStyle = { ...navIconStyle, backgroundColor: '#0f4c3a', color: 'white' };
const btnPrimary = { padding: '12px 24px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginLeft: '15px', fontWeight: 'bold' };
const btnSecondary = { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#4a5568', fontSize: '1rem' };
const btnNavActive = { ...btnSecondary, color: '#0f4c3a', backgroundColor: '#e8f3f0', padding: '10px 14px', borderRadius: '10px', border: '1px solid #0f4c3a' };
const btnAction = { padding: '16px 28px', backgroundColor: '#f39c12', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 8px 20px rgba(243, 156, 18, 0.4)' };
const btnSearch = { padding: '16px 28px', backgroundColor: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', backdropFilter: 'blur(5px)' };
const adminDropdownStyle = { position: 'absolute', top: '74px', right: '50px', zIndex: 10, padding: '16px', backgroundColor: 'white', borderRadius: '14px', border: '1px solid #dbe3ea', boxShadow: '0 18px 35px rgba(15, 76, 58, 0.18)', display: 'grid', gap: '10px', minWidth: '260px' };
const adminInputStyle = { padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' };
const adminButtonStyle = { padding: '12px 20px', backgroundColor: '#0f4c3a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '900', boxShadow: '0 8px 18px rgba(15, 76, 58, 0.22)' };
const pillarStyle = { width: '280px', padding: '40px 30px', backgroundColor: 'white', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' };
const badgeStyle = { backgroundColor: '#e8f3f0', color: '#0f4c3a', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '900', marginBottom: '15px', display: 'inline-block' };
const arrowStyle = { fontSize: '2rem', color: '#cbd5e0' };

const getNavIcon = (itemName) => {
    const icons = {
        Home: '🏠',
        'How It Works': '⚙️',
        'Search Items': '🔍',
        About: 'ℹ️'
    };

    return icons[itemName] || '•';
};

export default LandingPage;
