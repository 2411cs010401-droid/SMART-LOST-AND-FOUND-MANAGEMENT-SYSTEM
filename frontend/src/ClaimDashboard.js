import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClaimDashboard = () => {
    const [claims, setClaims] = useState([]);
    const [secrets, setSecrets] = useState({}); // Keep tracking codes per item row
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/claims')
            .then(response => {
                setClaims(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching claims:", error);
                setLoading(false);
            });
    }, []);

    const handleSecretChange = (id, value) => {
        setSecrets(prev => ({ ...prev, [id]: value }));
    };

    const verifyClaim = (id) => {
        const secretCode = secrets[id] || "";
        
        // FIXED: Wrapping the passkey into a clean object instead of sending a raw string
        axios.post(`http://localhost:8080/api/claims/verify/${id}`, { providedSecret: secretCode })
        .then(res => {
            alert(res.data);
            window.location.reload();
        })
        .catch(err => {
            console.error(err);
            alert("Cryptographic Match Failed! Verification code invalid.");
        });
    };

    if (loading) return <h3 style={{ textAlign: 'center', fontFamily: 'Arial' }}>Syncing database rows...</h3>;

    return (
        <div style={{ 
            padding: '25px', 
            fontFamily: 'Arial, sans-serif', 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #eaeaea'
        }}>
            <h2 style={{ marginTop: 0, color: '#2c3e50', fontSize: '1.4rem' }}>⚙️ Administrative Verification Console</h2>
            {claims.length === 0 ? (
                <p style={{ color: '#7f8c8d' }}>No active claims registered in database.</p>
            ) : (
                claims.map(claim => (
                    <div key={claim.id} style={{ 
                        borderBottom: '1px solid #f1f1f1', 
                        padding: '15px 0', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '8px' 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>CLAIM RECORD #{claim.id}</span>
                            <span style={{ 
                                padding: '4px 10px', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem', 
                                fontWeight: 'bold',
                                backgroundColor: claim.status === 'VERIFIED' ? '#e8f8f5' : '#fef9e7',
                                color: claim.status === 'VERIFIED' ? '#2ecc71' : '#f39c12',
                                marginLeft: 'auto'
                            }}>
                                {claim.status}
                            </span>
                        </div>
                        <p style={{ margin: '5px 0', color: '#34495e', fontSize: '0.95rem' }}>
                            <strong>Proof:</strong> {claim.proofProvided}
                        </p>
                        <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '0.85rem' }}>
                            Target Item ID: <strong>{claim.itemId}</strong> | Claimer Reference: <strong>{claim.claimerId}</strong>
                        </p>
                        
                        {claim.status !== 'VERIFIED' && (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Enter Cryptographic Passkey" 
                                    value={secrets[claim.id] || ""}
                                    onChange={(e) => handleSecretChange(claim.id, e.target.value)} 
                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 }}
                                />
                                <button onClick={() => verifyClaim(claim.id)} style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: '#2ecc71', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}>
                                    Execute Verification
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ClaimDashboard;