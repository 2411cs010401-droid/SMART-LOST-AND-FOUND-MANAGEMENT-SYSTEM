import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { calculateAiMatch } from '../utils/aiMatcher';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { allReports, setAllReports } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('Admin Dashboard');

    const lostReports = allReports.filter(item => item.type === 'LOST');
    const foundReports = allReports.filter(item => item.type === 'FOUND');
    const aiMatches = lostReports
        .map(lostItem => {
            const bestMatch = foundReports
                .map(foundItem => ({ foundItem, match: calculateAiMatch(lostItem, foundItem) }))
                .filter(result => result.match.isMatch)
                .sort((first, second) => second.match.score - first.match.score)[0];

            return bestMatch ? { lostItem, foundItem: bestMatch.foundItem, score: bestMatch.match.score, reasons: bestMatch.match.reasons } : null;
        })
        .filter(Boolean);
    const pendingReports = lostReports.filter(item => item.status === 'Pending Verification');

    const uniqueUsers = new Set(allReports.map(item => item.reporterEmail)).size;

    const adminMenu = [
        { name: 'Admin Dashboard', icon: '📊' },
        { name: 'User Management', icon: '👥' },
        { name: 'Lost Reports', icon: '📦' },
        { name: 'Found Reports', icon: '🎁' },
        { name: 'Claims', icon: '⚖️' },
        { name: 'Analytics', icon: '📈' },
        { name: 'Logout', icon: '🚪' }
    ];

    const handleNav = (name) => {
        if (name === 'Logout') navigate('/');
        else setActiveTab(name);
    };

    const updateReportStatus = (lostId, foundId, status) => {
        setAllReports(allReports.map(item => {
            if (item.id === lostId) {
                return { ...item, status };
            }

            if (item.id === foundId && status === 'Approved') {
                return { ...item, status: 'Matched' };
            }

            return item;
        }));
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: "'Segoe UI', sans-serif" }}>
            <div style={{ width: '260px', backgroundColor: '#0f4c3a', color: 'white', padding: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '30px' }}>🛡️ Admin Portal</h2>
                {adminMenu.map(item => (
                    <div key={item.name} onClick={() => handleNav(item.name)}
                        style={{ padding: '15px', cursor: 'pointer', borderRadius: '8px', marginBottom: '10px', backgroundColor: activeTab === item.name ? '#1a6b52' : 'transparent', fontWeight: 'bold' }}>
                        {item.icon} {item.name}
                    </div>
                ))}
            </div>

            <div style={{ flex: 1, padding: '40px' }}>
                <h1>{activeTab}</h1>

                {activeTab === 'Admin Dashboard' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '30px' }}>
                            <AdminCard title="Total Users" value={uniqueUsers} />
                            <AdminCard title="Lost Reports" value={lostReports.length} />
                            <AdminCard title="Found Reports" value={foundReports.length} />
                            <AdminCard title="AI Matches" value={aiMatches.length} />
                            <AdminCard title="Pending Cases" value={pendingReports.length} />
                        </div>
                        <MatchPanel matches={aiMatches} onVerify={updateReportStatus} />
                    </>
                )}

                {activeTab === 'User Management' && (
                    <ReportTable
                        title="Users Who Submitted Reports"
                        reports={allReports}
                        columns={['Reporter', 'Email', 'Latest Item', 'Type']}
                        renderRow={(item) => [
                            item.reporterName,
                            item.reporterEmail,
                            item.name,
                            item.type
                        ]}
                    />
                )}

                {activeTab === 'Lost Reports' && (
                    <ReportTable title="Lost Item Reports" reports={lostReports} />
                )}

                {activeTab === 'Found Reports' && (
                    <ReportTable title="Found Item Reports" reports={foundReports} />
                )}

                {activeTab === 'Claims' && (
                    <MatchPanel matches={aiMatches} onVerify={updateReportStatus} />
                )}

                {activeTab === 'Analytics' && (
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <h3>Recovery Analytics</h3>
                        <p>Total reports: <strong>{allReports.length}</strong></p>
                        <p>Lost to found match rate: <strong>{lostReports.length ? Math.round((aiMatches.length / lostReports.length) * 100) : 0}%</strong></p>
                        <p>Admin should review every AI match before approving handover.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const AdminCard = ({ title, value }) => (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{title}</p>
        <h2 style={{ margin: '10px 0 0 0', fontSize: '2rem' }}>{value}</h2>
    </div>
);

const ReportTable = ({ title, reports, columns, renderRow }) => {
    const tableColumns = columns || ['ID', 'Item', 'Category', 'Location', 'Reporter', 'Date', 'Status'];

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3>{title}</h3>
            {reports.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No records available yet.</p>
            ) : (
                <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee' }}>
                            {tableColumns.map(column => <th key={column} style={thStyle}>{column}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(item => {
                            const cells = renderRow ? renderRow(item) : [
                                item.id,
                                item.name,
                                item.category,
                                item.location,
                                item.reporterEmail,
                                item.date,
                                item.status
                            ];

                            return (
                                <tr key={`${item.id}-${item.type}`}>
                                    {cells.map((cell, index) => <td key={index} style={tdStyle}>{cell}</td>)}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const MatchPanel = ({ matches, onVerify }) => (
    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h3>AI Machine Matching Engine</h3>
        {matches.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No lost/found item matches yet. Add one lost report and one similar found report to see this work.</p>
        ) : (
            matches.map(match => (
                <div key={`${match.lostItem.id}-${match.foundItem.id}`} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: '20px', alignItems: 'center', borderTop: '1px solid #e5e7eb', padding: '18px 0' }}>
                    <div>
                        <h4 style={{ margin: '0 0 6px 0', color: '#ef4444' }}>Lost User</h4>
                        <p style={matchText}>{match.lostItem.name} ({match.lostItem.category})</p>
                        <p style={mutedText}>{match.lostItem.reporterEmail}</p>
                        <p style={mutedText}>{match.lostItem.location}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '72px', height: '72px', margin: '0 auto 8px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>
                            {match.score}%
                        </div>
                        <strong>Match</strong>
                        <p style={{ margin: '8px 0', color: '#64748b', fontSize: '0.75rem' }}>Name {match.reasons.name} + Location {match.reasons.location} + Category {match.reasons.category}</p>
                        {onVerify && match.lostItem.status === 'Pending Verification' && (
                            <div style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
                                <button onClick={() => onVerify(match.lostItem.id, match.foundItem.id, 'Approved')} style={verifyBtnStyle}>Approve</button>
                                <button onClick={() => onVerify(match.lostItem.id, match.foundItem.id, 'Rejected')} style={rejectBtnStyle}>Reject</button>
                            </div>
                        )}
                        {match.lostItem.status !== 'Pending Verification' && (
                            <span style={{ display: 'inline-block', marginTop: '10px', padding: '6px 10px', borderRadius: '999px', backgroundColor: match.lostItem.status === 'Approved' ? '#dcfce7' : '#fee2e2', color: match.lostItem.status === 'Approved' ? '#166534' : '#991b1b', fontWeight: '900', fontSize: '0.78rem' }}>{match.lostItem.status}</span>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h4 style={{ margin: '0 0 6px 0', color: '#10b981' }}>Found User</h4>
                        <p style={matchText}>{match.foundItem.name} ({match.foundItem.category})</p>
                        <p style={mutedText}>{match.foundItem.reporterEmail}</p>
                        <p style={mutedText}>{match.foundItem.location}</p>
                    </div>
                </div>
            ))
        )}
    </div>
);

const thStyle = { padding: '10px', textAlign: 'left' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #f1f5f9' };
const matchText = { margin: '0 0 4px 0', fontWeight: 'bold' };
const mutedText = { margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.9rem' };
const verifyBtnStyle = { border: 'none', backgroundColor: '#0f4c3a', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900' };
const rejectBtnStyle = { border: 'none', backgroundColor: '#ef4444', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900' };

export default AdminDashboard;
