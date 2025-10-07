'use client';

import Sidebar from '@/components/Sidebar';
import GestionFuentes from '@/components/GestionFuentes';

export default function FuentesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <GestionFuentes />
        </div>
      </main>
    </div>
  );
}
