import React, { useState } from 'react';
import axios from 'axios';

const SubmitClaim = () => {
    const [proof, setProof] = useState('');
    const [email, setEmail] = useState(''); // New Email State variable
    const [selectedItem, setSelectedItem] = useState('1'); 

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newClaim = {
            proofProvided: proof,
            claimerEmail: email, // Sending the user's input email
            status: 'PENDING',
            itemId: parseInt(selectedItem), 
            claimerId: Math.floor(Math.random() * 100) + 1 
        };

        axios.post('http://localhost:8080/api/claims', newClaim)
            .then(response => {
                alert("Claim successfully logged into the system!");
                setProof(''); 
                setEmail('');
                window.location.reload(); 
            })
            .catch(error => {
                console.error("Submission error:", error);
                alert("Failed to submit claim.");
            });
    };

    return (
        <div style={{ padding: '25px', fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <h2 style={{ marginTop: 0, color: '#2c3e50', fontSize: '1.4rem' }}>📝 Public Lost Item Recovery Form</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Select Lost Item Category:</label>
                    <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: '#fff' }}>
                        <option value="1">Laptop / Electronics</option>
                        <option value="2">Books / Documents</option>
                        <option value="3">Wallets / Keys</option>
                        <option value="4">Bags / Clothing</option>
                    </select>
                </div>

                {/* NEW EMAIL BOX FOR GENERAL PUBLIC */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Your Email Address:</label>
                    <input 
                        type="email" 
                        placeholder="Enter your personal email (e.g., name@gmail.com)" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Provide Distinct Identification Proof:</label>
                    <input type="text" placeholder="E.g., Serial number, distinctive marks, contents inside..." value={proof} onChange={(e) => setProof(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }} required />
                </div>

                <button type="submit" style={{ padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                    Submit Security Claim
                </button>
            </form>
        </div>
    );
};

export default SubmitClaim;