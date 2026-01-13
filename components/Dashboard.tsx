
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MaintenanceTask } from '../types';

const MOCK_DATA: MaintenanceTask[] = [
  { id: '1', part: 'Engine Oil', health: 85, lastService: '2023-11-10', nextService: '2024-05-10' },
  { id: '2', part: 'Brake Pads', health: 45, lastService: '2023-08-15', nextService: '2024-02-15' },
  { id: '3', part: 'Tires', health: 70, lastService: '2023-12-01', nextService: '2024-06-01' },
  { id: '4', part: 'Battery', health: 92, lastService: '2024-01-05', nextService: '2026-01-05' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Overall Health</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-green-400 font-orbitron">82%</span>
            <span className="text-green-900 bg-green-400/20 px-2 py-0.5 rounded text-xs mb-1">Excellent</span>
          </div>
          <div className="mt-4 w-full bg-gray-800 h-2 rounded-full">
            <div className="bg-green-400 h-full rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Active Alerts</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-yellow-400 font-orbitron">1</span>
            <span className="text-yellow-900 bg-yellow-400/20 px-2 py-0.5 rounded text-xs mb-1">Requires Attention</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">Brake wear detected - Schedule inspection soon.</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Mileage</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-blue-400 font-orbitron">42,501</span>
            <span className="text-blue-400/20 text-xs mb-1">km</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">+1,200km from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span>🛡️</span> Parts Health Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="part" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#374151'}}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Bar dataKey="health" radius={[4, 4, 0, 0]}>
                  {MOCK_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.health > 80 ? '#4ade80' : entry.health > 50 ? '#60a5fa' : '#facc15'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>📅</span> Upcoming Service
          </h3>
          <div className="space-y-4">
            {MOCK_DATA.filter(t => t.health < 90).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                <div>
                  <div className="font-semibold text-white">{task.part}</div>
                  <div className="text-xs text-gray-400">Due: {task.nextService}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  task.health < 50 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {task.health}% Left
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
            Book Service Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
