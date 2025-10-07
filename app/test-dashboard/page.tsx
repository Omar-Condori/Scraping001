'use client';

import Sidebar from '@/components/Sidebar';
import DashboardTest from '@/components/DashboardTest';

export default function DashboardTestPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <DashboardTest />
        </div>
      </main>
    </div>
  );
}
