import React from 'react';
import { useAuditStore } from './store/useAuditStore';
import { ComplianceCitadelScene } from './components/3d/ComplianceCitadelScene';
import { DashboardOverlay } from './components/ui/DashboardOverlay';
import { AuditTable } from './components/ui/AuditTable';
import { AnalyticsView } from './components/ui/AnalyticsView';

export default function App() {
  const viewMode = useAuditStore((state) => state.viewMode);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 font-sans relative">
      {viewMode === '3D' && (
        <main className="w-full h-full relative">
          {/* Interactive 3D Citadel Canvas */}
          <ComplianceCitadelScene />

          {/* 2D Glassmorphism HUD Overlay */}
          <DashboardOverlay />
        </main>
      )}

      {viewMode === 'TABLE' && <AuditTable />}

      {viewMode === 'ANALYTICS' && <AnalyticsView />}
    </div>
  );
}
