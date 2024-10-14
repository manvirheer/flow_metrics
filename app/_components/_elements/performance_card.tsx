import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import Image from 'next/image';
import Link from 'next/link';

export default function PerformanceCard() {
  // State for performance metrics card
  const [metricsTimeframe, setMetricsTimeframe] = useState('Daily');

  // Example data for the performance metrics
  const performanceMetricsData = {
    Daily: [
      { metric: 'Average Incoming Stock GCV', value: '4,200 Kcal/Kg', change: '+3%' },
      { metric: 'Ash Dispatched', value: '1,500 Kg', change: '-1%' },
      { metric: 'Steam to Fuel (S/F) Ratio', value: '2.5 MT/MT', change: '+2%' },
      { metric: 'Boiler Efficiency', value: '82%', change: '+1%' },
    ],
    Weekly: [
      { metric: 'Average Incoming Stock GCV', value: '4,150 Kcal/Kg', change: '+2%' },
      { metric: 'Ash Dispatched', value: '9,000 Kg', change: '-0.5%' },
      { metric: 'Steam to Fuel (S/F) Ratio', value: '2.45 MT/MT', change: '+1%' },
      { metric: 'Boiler Efficiency', value: '81%', change: '+0.5%' },
    ],
    Yearly: [
      { metric: 'Average Incoming Stock GCV', value: '4,100 Kcal/Kg', change: '+1%' },
      { metric: 'Ash Dispatched', value: '110,000 Kg', change: '-2%' },
      { metric: 'Steam to Fuel (S/F) Ratio', value: '2.4 MT/MT', change: '+1.5%' },
      { metric: 'Boiler Efficiency', value: '80%', change: '+1%' },
    ],
  };

  const currentMetricsData = performanceMetricsData[metricsTimeframe as keyof typeof performanceMetricsData];

  return (
    <div className="grid bg-gray-100 grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen pb-20 gap-16 sm:p-20 text-gray-900 font-sans">
      {/* Main Stats and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-4/5">
        {/* Shift Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Performance Metrics</h2>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Metrics Overview</h3>
            <select
              value={metricsTimeframe}
              onChange={(e) => setMetricsTimeframe(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-gray-700"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          {currentMetricsData.map((metricData, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-100 rounded-md p-4 mb-2">
              <div>
                <p className="font-semibold">{metricData.metric}</p>
                <p className="text-sm text-gray-600">{metricData.value}</p>
              </div>
              <div
                className={`flex items-center justify-center text-white px-3 py-1 rounded-full ${
                  metricData.change.includes('+') ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                <span>{metricData.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}