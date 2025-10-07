'use client';

import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';

export default function HomePage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <Dashboard />
        </div>
      </main>
    </div>
  );
}