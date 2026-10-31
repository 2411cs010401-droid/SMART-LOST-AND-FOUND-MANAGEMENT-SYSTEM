import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const AnalyticsChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/claims')
            .then(response => {
                const claims = response.data;
                
                // Data Analyst Logic: Grouping and Counting
                let verifiedCount = 0;
                let pendingCount = 0;

                claims.forEach(claim => {
                    if (claim.status === 'VERIFIED') verifiedCount++;
                    else pendingCount++;
                });

                // Format data for Recharts
                setChartData([
                    { name: 'Pending Claims', total: pendingCount, fill: '#ffc658' },
                    { name: 'Verified (Recovered)', total: verifiedCount, fill: '#82ca9d' }
                ]);
            })
            .catch(error => console.error("Error fetching analytics:", error));
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f9f9f9', borderRadius: '10px', marginBottom: '20px' }}>
            <h2>📊 Real-Time Recovery Analytics</h2>
            <div style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" animationDuration={1500} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsChart;