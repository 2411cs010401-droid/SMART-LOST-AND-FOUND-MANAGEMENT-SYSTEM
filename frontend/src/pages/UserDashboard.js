import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { calculateAiMatch, findBestAiMatch } from '../utils/aiMatcher';
import axios from 'axios';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, currentUser, setCurrentUser, allReports, setAllReports } = useContext(UserContext);
    
    // Now reads directly from the persistent session
    const activeUser = currentUser || { name: 'Current User', email: 'user@findr.com', trustScore: '99%' };
    
    // UI State
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [claimTab, setClaimTab] = useState('Pending');
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [latestNotification, setLatestNotification] = useState(null);

    // --- FUNCTIONAL DATA STATES ---
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [aiMatchStatus, setAiMatchStatus] = useState('PENDING');
    const [notifications, setNotifications] = useState([
        { id: 1, icon: '👋', title: 'Welcome to Findr', desc: 'Secure your items by registering them today.', time: 'Just now' }
    ]);

    // Categories List
    const categories = ['Electronics', 'Gadgets', 'Wallet', 'Documents', 'Keys', 'Bags & Backpacks', 'Clothing', 'Accessories', 'Other'];
    const myLostItems = allReports.filter(item => item.type === 'LOST' && item.reporterEmail === activeUser.email);
    const myFoundItems = allReports.filter(item => item.type === 'FOUND' && item.reporterEmail === activeUser.email);
    const allLostItems = allReports.filter(item => item.type === 'LOST');
    const allFoundItems = allReports.filter(item => item.type === 'FOUND');
    const currentAiMatch = myLostItems
        .map(lostItem => {
            const bestMatch = findBestAiMatch(lostItem, allFoundItems);
            return bestMatch ? { lostItem, foundItem: bestMatch.item, score: bestMatch.match.score, reasons: bestMatch.match.reasons } : null;
        })
        .filter(Boolean)[0] || myFoundItems
        .map(foundItem => {
            const bestMatch = allLostItems
                .map(lostItem => ({ lostItem, match: calculateAiMatch(lostItem, foundItem) }))
                .filter(result => result.match.isMatch)
                .sort((first, second) => second.match.score - first.match.score)[0];
            return bestMatch ? { lostItem: bestMatch.lostItem, foundItem, score: bestMatch.match.score, reasons: bestMatch.match.reasons } : null;
        })
        .filter(Boolean)[0];

    const theme = {
        bg: isDarkMode ? '#111827' : '#f4f7f6', sidebar: isDarkMode ? '#1f2937' : '#ffffff', card: isDarkMode ? '#1f2937' : '#ffffff', text: isDarkMode ? '#f9fafb' : '#111827', muted: isDarkMode ? '#9ca3af' : '#6b7280', border: isDarkMode ? '#374151' : '#e5e7eb', primary: isDarkMode ? '#14b8a6' : '#0f4c3a', accent: '#f39c12'
    };

    const userMenu = [
        { name: 'Dashboard', icon: '🏠' }, { name: 'Report Lost Item', icon: '📦' }, { name: 'Report Found Item', icon: '🎁' }, { name: 'Search Items', icon: '🔍' }, { name: 'AI Matches', icon: '🤖' }, { name: 'My Lost Reports', icon: '📄' }, { name: 'My Found Reports', icon: '📄' }, { name: 'Claims', icon: '🙋' }, { name: 'Notifications', icon: '🔔' }, { name: 'Rewards', icon: '🏆' }, { name: 'Profile', icon: '👤' }, { name: 'Settings', icon: '⚙️' }, { name: 'Help Center', icon: '❓'}
    ];

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        navigate('/');
    };

    const handleLostSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newItem = {
            id: 'TX-' + Math.floor(Math.random() * 9000 + 1000),
            type: 'LOST',
            name: formData.get('itemName'),
            brand: formData.get('brand'),
            category: formData.get('category'),
            location: formData.get('location'),
            date: new Date().toISOString().split('T')[0],
            status: 'Pending Verification',
            reporterName: activeUser.name,
            reporterEmail: activeUser.email
        };
        try {
            await axios.post('http://localhost:8080/api/items', {
                reporterName: activeUser.name,
                reporterEmail: activeUser.email,
                reportType: 'LOST',
                category: newItem.category,
                title: newItem.name,
                brand: newItem.brand,
                description: formData.get('description'),
                location: newItem.location,
                verificationSecret: formData.get('description')
            });

            setAllReports([newItem, ...allReports]);
            const reportNotification = { id: Date.now(), icon: '📦', title: 'Lost Report Logged', desc: `Your ${newItem.name} has been saved to MySQL and added to the AI scanner.`, time: 'Just now' };
            setNotifications([reportNotification, ...notifications]);
            setUnreadNotifications(unreadNotifications + 1);
            setLatestNotification(reportNotification);
            alert(`Lost report for ${newItem.name} saved in MySQL.`);
            setActiveTab('My Lost Reports');
            e.target.reset();
        } catch (error) {
            console.error("Lost report database error:", error);
            alert("Lost report was not saved. Check that Spring Boot and MySQL are running.");
        }
    };

    const handleFoundSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newItem = {
            id: 'FD-' + Math.floor(Math.random() * 9000 + 1000),
            type: 'FOUND',
            name: formData.get('itemName'),
            brand: formData.get('brand'),
            category: formData.get('category'),
            location: formData.get('location'),
            date: new Date().toISOString().split('T')[0],
            status: 'Secured',
            reporterName: activeUser.name,
            reporterEmail: activeUser.email
        };
        try {
            await axios.post('http://localhost:8080/api/items', {
                reporterName: activeUser.name,
                reporterEmail: activeUser.email,
                reportType: 'FOUND',
                category: newItem.category,
                title: newItem.name,
                brand: newItem.brand,
                description: formData.get('description'),
                location: newItem.location
            });

            setAllReports([newItem, ...allReports]);
            const reportNotification = { id: Date.now(), icon: '🎁', title: 'Found Item Logged', desc: `Thank you for reporting the ${newItem.name}. It was saved to MySQL.`, time: 'Just now' };
            setNotifications([reportNotification, ...notifications]);
            setUnreadNotifications(unreadNotifications + 1);
            setLatestNotification(reportNotification);
            alert(`Found item ${newItem.name} saved in MySQL.`);
            setActiveTab('My Found Reports');
            e.target.reset();
        } catch (error) {
            console.error("Found report database error:", error);
            alert("Found report was not saved. Check that Spring Boot and MySQL are running.");
        }
    };

    const handleAiAction = (action) => {
        setAiMatchStatus(action);
        alert(`Match has been ${action}! Admin system notified.`);
    };

    const handleMenuClick = (itemName) => {
        setActiveTab(itemName);
        if (itemName === 'Notifications') {
            setUnreadNotifications(0);
            setLatestNotification(null);
        }
    };

    const globalDatabase = allReports;
    const searchResults = globalDatabase.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        (searchCategory === '' || item.category === searchCategory)
    );
    const getSearchMatch = (item) => {
        if (item.type === 'LOST') {
            return findBestAiMatch(item, allFoundItems);
        }

        return allLostItems
            .map(lostItem => ({ item: lostItem, match: calculateAiMatch(lostItem, item) }))
            .filter(result => result.match.isMatch)
            .sort((first, second) => second.match.score - first.match.score)[0] || null;
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>
            <style>{`.hide-scroll::-webkit-scrollbar { display: none; } .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; } .smooth-transition { transition: all 0.3s ease; }`}</style>

            {/* SIDEBAR */}
            <div className="smooth-transition" style={{ width: '280px', backgroundColor: theme.sidebar, borderRight: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px' }}>
                    <h2 style={{ fontSize: '1.5rem', color: theme.primary, margin: '0 0 20px 0', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🌐</span> Findr Portal
                    </h2>
                    <div style={{ padding: '15px', backgroundColor: isDarkMode ? '#374151' : '#f3f4f6', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                        <div style={{ fontSize: '0.75rem', color: theme.primary, fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>LOGGED IN AS:</div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: theme.text, textTransform: 'capitalize' }}>{activeUser.name}</div>
                        <div style={{ fontSize: '0.85rem', color: theme.muted }}>{activeUser.email}</div>
                    </div>
                </div>

                {latestNotification && (
                    <div style={{ margin: '0 20px 12px', padding: '12px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', color: '#9a3412', fontWeight: '700', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span>{latestNotification.icon}</span>
                        <span style={{ fontSize: '0.85rem' }}>{latestNotification.title}</span>
                    </div>
                )}

                <div className="hide-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
                    {userMenu.map(item => (
                        <div key={item.name} onClick={() => handleMenuClick(item.name)}
                            style={{ padding: '12px 15px', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center', color: activeTab === item.name ? (isDarkMode ? '#fff' : theme.primary) : theme.muted, backgroundColor: activeTab === item.name ? (isDarkMode ? '#374151' : '#e8f3f0') : 'transparent', fontWeight: activeTab === item.name ? 'bold' : '500', borderRadius: '10px', marginBottom: '4px', transition: 'all 0.2s', border: activeTab === item.name ? `1px solid ${theme.primary}` : '1px solid transparent' }}>
                            <span style={{ fontSize: '1.2rem', width: '32px', height: '32px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: activeTab === item.name ? theme.primary : (isDarkMode ? '#374151' : '#f1f5f9'), color: activeTab === item.name ? 'white' : theme.text }}>{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.name}</span>
                            {item.name === 'Notifications' && unreadNotifications > 0 && (
                                <span style={{ minWidth: '22px', height: '22px', borderRadius: '999px', backgroundColor: '#ef4444', color: 'white', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>{unreadNotifications}</span>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ padding: '20px', borderTop: `1px solid ${theme.border}` }}>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        🚪 Sign Out
                    </button>
                </div>
            </div>

            {/* MAIN WORKSPACE CONTENT */}
            <div className="hide-scroll smooth-transition" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                
                {/* 1. DASHBOARD */}
                {activeTab === 'Dashboard' && (
                    <div>
                        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>Overview</h1>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                            <MetricCard title="Lost Items (Active)" value={myLostItems.length} color="#ef4444" theme={theme} />
                            <MetricCard title="Items Found" value={myFoundItems.length} color="#10b981" theme={theme} />
                            <MetricCard title="Pending Claims" value={myLostItems.length > 0 ? 1 : 0} color="#f59e0b" theme={theme} />
                            <MetricCard title="Reward Points" value="150" color="#8b5cf6" theme={theme} />
                        </div>
                    </div>
                )}

                {/* 2. REPORT LOST ITEM */}
                {activeTab === 'Report Lost Item' && (
                    <div style={{ maxWidth: '800px', padding: '40px', borderRadius: '16px', backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
                        <h2 style={{ color: '#ef4444', margin: '0 0 20px 0' }}>🔍 Report a Lost Belonging</h2>
                        <form onSubmit={handleLostSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input type="text" name="itemName" placeholder="Item Name" style={inputStyle(theme)} required />
                            <select name="category" style={inputStyle(theme)} required>
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <input type="text" name="brand" placeholder="Brand" style={inputStyle(theme)} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="text" placeholder="Primary Color" style={inputStyle(theme)} />
                                <input type="text" placeholder="Secondary Color" style={inputStyle(theme)} />
                            </div>
                            <input type="text" name="location" placeholder="Address" style={inputStyle(theme)} required />
                            <input type="date" style={inputStyle(theme)} />
                            
                            <textarea name="description" placeholder="Description & Hidden Verification Details..." style={{ ...inputStyle(theme), gridColumn: 'span 2', minHeight: '100px' }} required />
                            
                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button type="submit" style={{ ...btnStyle, backgroundColor: '#ef4444', width: '100%' }}>Submit Lost Report</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 3. REPORT FOUND ITEM */}
                {activeTab === 'Report Found Item' && (
                    <div style={{ maxWidth: '800px', padding: '40px', borderRadius: '16px', backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
                        <h2 style={{ color: '#10b981', margin: '0 0 20px 0' }}>🎒 Log a Found Item</h2>
                        <form onSubmit={handleFoundSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input type="text" name="itemName" placeholder="Item Name" style={inputStyle(theme)} required />
                            <select name="category" style={inputStyle(theme)} required>
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <input type="text" name="brand" placeholder="Brand (If visible)" style={inputStyle(theme)} />
                            <input type="text" placeholder="Primary Color" style={inputStyle(theme)} />
                            <input type="text" name="location" placeholder="Address" style={{ ...inputStyle(theme), gridColumn: 'span 2' }} required />
                            
                            <textarea name="description" placeholder="Condition & Description..." style={{ ...inputStyle(theme), gridColumn: 'span 2', minHeight: '100px' }} required />
                            
                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button type="submit" style={{ ...btnStyle, backgroundColor: '#10b981', width: '100%' }}>Submit Found Report</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 4. SEARCH ITEMS */}
                {activeTab === 'Search Items' && (
                    <div>
                        <h2>🔎 Global Network Search</h2>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <input type="text" placeholder="Search item name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle(theme), flex: 2 }} />
                            <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} style={{ ...inputStyle(theme), flex: 1 }}>
                                <option value="">All Categories</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                            {searchResults.length > 0 ? (
                                searchResults.map(item => {
                                    const matchedItem = getSearchMatch(item);

                                    return (
                                        <MockResultCard
                                            key={item.id}
                                            title={item.name}
                                            match={matchedItem ? `${matchedItem.match.score}% Match` : "System Logged"}
                                            location={item.location}
                                            reportType={item.type}
                                            theme={theme}
                                            onClick={matchedItem ? () => setActiveTab('AI Matches') : undefined}
                                        />
                                    );
                                })
                            ) : (
                                <p style={{ color: theme.muted }}>No items found in the current network logs. Submit a report to populate.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* 5. AI MATCHES */}
                {activeTab === 'AI Matches' && (
                    <div>
                        <h2>🤖 Cryptographic AI Engine</h2>
                        {(myLostItems.length > 0 || currentAiMatch) ? (
                            aiMatchStatus === 'PENDING' ? (
                                currentAiMatch ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.card, padding: '30px', borderRadius: '16px', border: `1px solid ${theme.border}`, gap: '30px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>Your Lost Item</h4>
                                            <p style={{ fontWeight: 'bold', margin: 0 }}>{currentAiMatch.lostItem.name}</p>
                                            <p style={{ color: theme.muted, fontSize: '0.9rem' }}>Reported: {currentAiMatch.lostItem.date}</p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 10px' }}>{currentAiMatch.score}%</div>
                                            <span style={{ fontWeight: 'bold', color: '#10b981' }}>Match</span>
                                            <p style={{ color: theme.muted, fontSize: '0.75rem', marginTop: '8px' }}>Name {currentAiMatch.reasons.name} + Location {currentAiMatch.reasons.location} + Category {currentAiMatch.reasons.category}</p>
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'right' }}>
                                            <h4 style={{ color: '#10b981', margin: '0 0 10px 0' }}>System Found Record</h4>
                                            <p style={{ fontWeight: 'bold', margin: 0 }}>{currentAiMatch.foundItem.name}</p>
                                            <p style={{ color: theme.muted, fontSize: '0.9rem' }}>Found at {currentAiMatch.foundItem.location}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'center' }}>
                                        <button onClick={() => handleAiAction('VERIFIED')} style={{ padding: '12px 30px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Verify Match</button>
                                        <button onClick={() => handleAiAction('REJECTED')} style={{ padding: '12px 30px', backgroundColor: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                                    </div>
                                </>
                                ) : (
                                    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                                        <h3>No found-item match yet.</h3>
                                        <p style={{ color: theme.muted }}>The AI scanner will show a match here when another user reports a similar found item.</p>
                                    </div>
                                )
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                                    <h3 style={{ color: aiMatchStatus === 'VERIFIED' ? '#10b981' : '#ef4444' }}>Match has been {aiMatchStatus}</h3>
                                    <p style={{ color: theme.muted }}>The system has logged your response and updated the database claims.</p>
                                    <button onClick={() => setAiMatchStatus('PENDING')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '8px', cursor: 'pointer' }}>Reset Demo</button>
                                </div>
                            )
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                                <h3>No matches available.</h3>
                                <p style={{ color: theme.muted }}>You need to submit a Lost Item report before the AI can scan for matches.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 6. MY LOST REPORTS */}
                {activeTab === 'My Lost Reports' && (
                    <div>
                        <h2>📄 My Lost Reports</h2>
                        <div style={{ overflowX: 'auto', backgroundColor: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: `2px solid ${theme.border}`, backgroundColor: isDarkMode ? '#374151' : '#f9fafb' }}>
                                        <th style={thStyle}>ID Hash</th><th style={thStyle}>Date</th><th style={thStyle}>Item Description</th><th style={thStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myLostItems.length > 0 ? myLostItems.map(item => (
                                        <tr key={item.id}><td style={tdStyle}>{item.id}</td><td style={tdStyle}>{item.date}</td><td style={tdStyle}>{item.name} ({item.category})</td><td style={{ ...tdStyle, color: '#f59e0b', fontWeight: 'bold' }}>{item.status}</td></tr>
                                    )) : <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: theme.muted }}>No lost items reported yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 7. MY FOUND REPORTS */}
                {activeTab === 'My Found Reports' && (
                    <div>
                        <h2>📄 My Found Reports</h2>
                        <div style={{ overflowX: 'auto', backgroundColor: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: `2px solid ${theme.border}`, backgroundColor: isDarkMode ? '#374151' : '#f9fafb' }}>
                                        <th style={thStyle}>ID Hash</th><th style={thStyle}>Date</th><th style={thStyle}>Item Description</th><th style={thStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myFoundItems.length > 0 ? myFoundItems.map(item => (
                                        <tr key={item.id}><td style={tdStyle}>{item.id}</td><td style={tdStyle}>{item.date}</td><td style={tdStyle}>{item.name} ({item.category})</td><td style={{ ...tdStyle, color: '#10b981', fontWeight: 'bold' }}>{item.status}</td></tr>
                                    )) : <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: theme.muted }}>No found items reported yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 8. CLAIMS */}
                {activeTab === 'Claims' && (
                    <div>
                        <h2>🙋 Active Verification Claims</h2>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            {['Pending', 'Under Review', 'Approved', 'Rejected'].map(tab => (
                                <button key={tab} onClick={() => setClaimTab(tab)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: claimTab === tab ? theme.primary : theme.card, color: claimTab === tab ? 'white' : theme.text }}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        {myLostItems.length > 0 ? (
                            myLostItems.map(item => (
                                <div key={item.id} style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '12px', border: `1px solid ${theme.border}`, marginBottom: '15px' }}>
                                    <h3 style={{ margin: '0 0 5px 0' }}>Claim for {item.name} ({item.id})</h3>
                                    <p style={{ margin: '0 0 15px 0', color: theme.muted }}>Status: {item.status} - {item.status === 'Pending Verification' ? 'Waiting for admin verification protocols.' : 'Admin has reviewed this case.'}</p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => alert('Proof noted. Admin can verify this case from Admin > Claims.')} style={{ ...btnStyle, padding: '8px 20px', backgroundColor: theme.primary }}>Upload Proof</button>
                                        <button style={{ ...btnStyle, padding: '8px 20px', backgroundColor: '#ef4444' }}>Cancel Claim</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: theme.muted }}>No claims active. Submit a lost item to initiate a claim.</p>
                        )}
                    </div>
                )}

                {/* 9. NOTIFICATIONS */}
                {activeTab === 'Notifications' && (
                    <div style={{ maxWidth: '600px' }}>
                        <h2>🔔 System Alerts</h2>
                        {notifications.map(notif => (
                            <div key={notif.id} style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}`, marginBottom: '15px' }}>
                                <div style={{ fontSize: '2rem' }}>{notif.icon}</div>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0' }}>{notif.title}</h4>
                                    <p style={{ margin: '0 0 5px 0', color: theme.muted, fontSize: '0.95rem' }}>{notif.desc}</p>
                                    <small style={{ color: theme.primary, fontWeight: 'bold' }}>{notif.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 10. REWARDS */}
                {activeTab === 'Rewards' && (
                    <div>
                        <h2>🏆 Achievements & Rewards</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                            <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '16px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem' }}>🌟</div>
                                <h1 style={{ fontSize: '3.5rem', color: theme.accent, margin: '0' }}>150</h1>
                                <p style={{ fontWeight: 'bold' }}>Current Points</p>
                                <p style={{ color: theme.muted }}>Leaderboard Rank: #14</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 11. PROFILE - RESTORED WITH DETAILED FIELDS */}
                {activeTab === 'Profile' && (
                    <div style={{ maxWidth: '800px' }}>
                        <h2>👤 User Identity</h2>
                        <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '16px', border: `1px solid ${theme.border}`, marginTop: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div><label style={labelStyle}>Full Name</label><input type="text" value={activeUser.name} readOnly style={inputStyle(theme)} /></div>
                                <div><label style={labelStyle}>Email Address</label><input type="text" value={activeUser.email} readOnly style={inputStyle(theme)} /></div>
                                <div><label style={labelStyle}>Phone Number</label><input type="text" placeholder="+91 XXX XXX XXXX" style={inputStyle(theme)} /></div>
                                <div><label style={labelStyle}>Department</label><input type="text" value="B.Tech" readOnly style={inputStyle(theme)} /></div>
                                <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>College / Institution</label><input type="text" value="Malla Reddy University" readOnly style={inputStyle(theme)} /></div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button style={{ ...btnStyle, backgroundColor: theme.primary }}>Edit Profile</button>
                                <button style={{ ...btnStyle, backgroundColor: theme.muted }}>Download QR Codes</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 12. SETTINGS - RESTORED WITH 4 OPTIONS */}
                {activeTab === 'Settings' && (
                    <div style={{ maxWidth: '600px' }}>
                        <h2>⚙️ Application Settings</h2>
                        <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                            <h4 style={{ margin: '0 0 20px 0' }}>Security & Notifications</h4>
                            <ToggleSetting label="Email Notifications" active={true} theme={theme} />
                            <ToggleSetting label="Push Notifications" active={false} theme={theme} />
                            <ToggleSetting label="Mail Authenticator 2FA Verification" active={true} theme={theme} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                <span style={{ fontWeight: '500' }}>Language Preference</span>
                                <select style={{...inputStyle(theme), width: 'auto'}}><option>English (US)</option><option>Spanish</option></select>
                            </div>
                        </div>
                    </div>
                )}

                {/* 13. HELP CENTER */}
                {activeTab === 'Help Center' && (
                    <div style={{ maxWidth: '700px' }}>
                        <h2>❓ Help & Support Center</h2>
                        <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '16px', border: `1px solid ${theme.border}`, marginBottom: '20px' }}>
                            <h3 style={{ marginTop: 0 }}>Frequently Asked Questions</h3>
                            <p style={{ fontWeight: 'bold', margin: '15px 0 5px 0' }}>Q: How does the AI match work?</p>
                            <p style={{ color: theme.muted, margin: 0 }}>A: The AI scans descriptions, colors, and locations to find overlaps between lost and found arrays.</p>
                            <p style={{ fontWeight: 'bold', margin: '15px 0 5px 0' }}>Q: What happens when a claim is approved?</p>
                            <p style={{ color: theme.muted, margin: 0 }}>A: You will receive an admin notification with instructions to retrieve your item.</p>
                        </div>
                        <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                            <h3 style={{ marginTop: 0 }}>Raise a Ticket</h3>
                            <input type="text" placeholder="Subject" style={{...inputStyle(theme), marginBottom: '15px'}} />
                            <textarea placeholder="Describe your issue..." style={{...inputStyle(theme), minHeight: '100px', marginBottom: '15px'}} />
                            <button style={{ ...btnStyle, backgroundColor: theme.primary }}>Submit Ticket</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---
const MetricCard = ({ title, value, color, theme }) => (
    <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}`, borderTop: `4px solid ${color}` }}>
        <p style={{ margin: 0, color: theme.muted, fontSize: '0.9rem', fontWeight: 'bold' }}>{title}</p>
        <h2 style={{ margin: '10px 0 0 0', fontSize: '2rem', color: theme.text }}>{value}</h2>
    </div>
);

const MockResultCard = ({ title, match, location, reportType, theme, onClick }) => (
    <div onClick={onClick} style={{ padding: '20px', backgroundColor: theme.card, borderRadius: '12px', border: `1px solid ${match.includes('Match') ? '#10b981' : theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: onClick ? 'pointer' : 'default', boxShadow: match.includes('Match') ? '0 12px 25px rgba(16, 185, 129, 0.12)' : 'none' }}>
        <div>
            <h3 style={{ margin: '0 0 5px 0', color: theme.text }}>{title}</h3>
            <p style={{ margin: '0', color: theme.muted, fontSize: '0.9rem' }}>📍 {location}</p>
            <p style={{ margin: '8px 0 0 0', color: reportType === 'LOST' ? '#ef4444' : '#10b981', fontSize: '0.8rem', fontWeight: '900' }}>{reportType === 'LOST' ? 'Lost Report' : 'Found Report'}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: match.includes('Match') ? '#10b981' : '#64748b', color: 'white', padding: '10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem' }}>{match}</div>
            {onClick && <div style={{ marginTop: '8px', color: '#10b981', fontWeight: '900', fontSize: '0.78rem' }}>Open AI Match</div>}
        </div>
    </div>
);

const ToggleSetting = ({ label, active, theme }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', marginBottom: '15px', borderBottom: `1px solid ${theme.border}` }}>
        <span style={{ fontWeight: '500' }}>{label}</span>
        <input type="checkbox" defaultChecked={active} style={{ width: '20px', height: '20px', accentColor: theme.primary }} />
    </div>
);


// --- CSS HELPERS ---
const inputStyle = (theme) => ({ padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '0.95rem', outline: 'none', backgroundColor: theme.bg, color: theme.text, width: '100%', boxSizing: 'border-box' });
const btnStyle = { padding: '14px 20px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const thStyle = { padding: '15px', textAlign: 'left', fontWeight: 'bold' };
const tdStyle = { padding: '15px' };
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem', color: '#6b7280' };

export default UserDashboard;
