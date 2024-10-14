'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { useState } from 'react';

export default function Home() {

  const COLORS = ['#007BFF', '#28A745', '#FFC107'];

  // Data for main line graph
  const [timeframe, setTimeframe] = useState('Monthly');
  const lineGraphData = {
    Today: [
      { name: '06:00', fuel: 90, briquettes: 140, steam: 85 },
      { name: '14:00', fuel: 80, briquettes: 145, steam: 75 },
      { name: '22:00', fuel: 100, briquettes: 130, steam: 95 },
    ],
    Monthly: [
      { name: 'Week 1', fuel: 100, briquettes: 150, steam: 90 },
      { name: 'Week 2', fuel: 120, briquettes: 140, steam: 110 },
      { name: 'Week 3', fuel: 115, briquettes: 135, steam: 105 },
      { name: 'Week 4', fuel: 130, briquettes: 130, steam: 120 },
    ],
    Yearly: [
      { name: 'Jan', fuel: 120, briquettes: 150, steam: 115 },
      { name: 'Feb', fuel: 110, briquettes: 145, steam: 105 },
      { name: 'Mar', fuel: 130, briquettes: 140, steam: 125 },
      { name: 'Apr', fuel: 125, briquettes: 135, steam: 120 },
      { name: 'May', fuel: 135, briquettes: 130, steam: 130 },
      { name: 'Jun', fuel: 140, briquettes: 125, steam: 135 },
      { name: 'Jul', fuel: 145, briquettes: 120, steam: 140 },
      { name: 'Aug', fuel: 130, briquettes: 115, steam: 125 },
      { name: 'Sep', fuel: 125, briquettes: 110, steam: 120 },
      { name: 'Oct', fuel: 135, briquettes: 105, steam: 130 },
      { name: 'Nov', fuel: 140, briquettes: 100, steam: 135 },
      { name: 'Dec', fuel: 150, briquettes: 95, steam: 145 },
    ],
  };

  const currentData = lineGraphData[timeframe as keyof typeof lineGraphData];

  // Example data for shift information
  const currentShift = 'A';
  const shiftDetails = {
    A: {
      startTime: '06:00',
      endTime: '14:00',
      employees: [
        { id: 'E101', name: 'Sukhjinder Singh', class: 'Second Class' },
        { id: 'E102', name: 'Raghubeer Sharma', class: 'Fireman' },
      ],
      shipments: 0,
    },
    B: {
      startTime: '14:00',
      endTime: '22:00',
      employees: [
        { id: 'E103', name: 'Alice Brown', class: 'Second Class' },
        { id: 'E104', name: 'Bob White', class: 'Fireman' },
      ],
      shipments: 1,
    },
    C: {
      startTime: '22:00',
      endTime: '06:00',
      employees: [
        { id: 'E105', name: 'Charlie Green', class: 'Second Class' },
        { id: 'E106', name: 'Diana Black', class: 'Fireman' },
      ],
      shipments: 2,
    },
  };

  const shiftData = shiftDetails[currentShift];

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
      {/* Header Section */}
      <header className="w-full flex items-center justify-start p-2">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-800 border-b-4 border-blue-600 pb-2" style={{ boxShadow: '0 4px 4px -2px rgba(0, 0, 0, 0.3)' }}>
            Plant Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            A complete overview of boiler operations at the plant.
          </p>
        </div>
      </header>


      {/* Main Stats and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-4/5">
        {/* Main Line Chart with Selector */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-gray-800 col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Fuel, Briquettes, and Steam Metrics (Metric Tonnes)</h2>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-gray-700"
            >
              <option value="Today">Today</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={currentData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              aria-label="Line chart showing fuel consumption, briquettes in stock, and steam generation"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Line type="monotone" dataKey="fuel" stroke="#007BFF" strokeWidth={3} dot={{ r: 5 }} name="Fuel Consumption" />
              <Line type="monotone" dataKey="briquettes" stroke="#FFC107" strokeWidth={3} dot={{ r: 5 }} name="Briquettes In Stock" />
              <Line type="monotone" dataKey="steam" stroke="#28A745" strokeWidth={3} dot={{ r: 5 }} name="Steam Generation" />
            </LineChart>
          </ResponsiveContainer>
          <div className="border-t mt-4 pt-4 text-gray-500 text-sm">
            Data is represented in Metric Tonnes (MT).
          </div>
        </div>

        {/* Shift Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Current Shift Information</h2>
          <div className="border-b pb-4 mb-4">
            <p className="text-lg font-semibold">Shift: {currentShift}</p>
            <p className="text-md text-gray-600">Time: {shiftData.startTime} - {shiftData.endTime}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Boiler Operators</h3>
            {shiftData.employees.map((employee) => (
              <div key={employee.id} className="flex justify-between items-center bg-gray-100 rounded-md p-4 mb-2">
                <div>
                  <p className="font-semibold">{employee.name} (ID: {employee.id})</p>
                  <p className="text-sm text-gray-600">Class: {employee.class}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <p className="text-lg font-semibold">New Shipments: {shiftData.shipments}</p>
          </div>
        </div>

        {/* Performance Metrics Section */}
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
                className={`flex items-center justify-center text-white px-3 py-1 rounded-full ${metricData.change.includes('+') ? 'bg-green-500' : 'bg-red-500'
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