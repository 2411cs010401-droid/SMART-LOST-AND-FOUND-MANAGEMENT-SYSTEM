import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    // NEW: Pulling in setCurrentUser from the context
    const { setIsLoggedIn, setCurrentUser } = useContext(UserContext);
    
    const [isRegistering, setIsRegistering] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const endpoint = isRegistering ? '/api/users/register' : '/api/users/login';
            const response = await axios.post(`http://localhost:8080${endpoint}`, {
                fullName: isRegistering ? fullName : email.split('@')[0],
                email,
                password
            });

            const savedUser = response.data;
            const activeUser = {
                id: savedUser.id,
                name: savedUser.fullName,
                email: savedUser.email,
                trustScore: '99%',
                rewardPoints: 150
            };

            setCurrentUser(activeUser);
            setIsLoggedIn(true);

            const checkEmail = email.toLowerCase().trim();
            if (checkEmail.includes('admin')) {
                alert("Administrative Credentials Verified! Redirecting to secure panel...");
                navigate('/admin');
            } else {
                alert(`Authentication Successful! Welcome to the network.`);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Authentication error:", error);
            alert(isRegistering ? "Registration failed. Check backend/MySQL connection." : "Login failed. Register first or check your password.");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f4c3a 0%, #1a362b 100%)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ backgroundColor: '#e8f3f0', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>
                    🔒
                </div>
                <h2 style={{ color: '#2d3748', marginBottom: '10px', fontSize: '28px', fontWeight: '800' }}>
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p style={{ color: '#718096', marginBottom: '30px', fontSize: '14px', fontWeight: '500' }}>
                    Global Lost & Found Security Network
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {isRegistering && (
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            style={inputStyle}
                            required 
                        />
                    )}
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required 
                    />
                    
                    <button type="submit" style={{
                        background: 'linear-gradient(to right, #f39c12, #d68910)', color: 'white', padding: '14px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(243, 156, 18, 0.3)'
                    }}>
                        {isRegistering ? 'Sign Up' : 'Secure Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '25px', color: '#718096', fontSize: '14px' }}>
                    {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                    <span onClick={() => setIsRegistering(!isRegistering)} style={{ color: '#f39c12', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isRegistering ? 'Sign In' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
};

const inputStyle = { padding: '14px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', backgroundColor: '#f7fafc', outline: 'none', boxSizing: 'border-box', width: '100%' };

export default LoginPage;
