'use client';

import { useAuthentication } from '@/providers/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuthentication();

  return (
    <div className="shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
      <div className="space-y-4">
        <div className="p-4 bg-card rounded-lg">
          <h3 className="font-medium text-blue-900">
            Welcome, {user?.firstName} {user?.lastName}!
          </h3>
          <p className="text-blue-700">You are successfully authenticated.</p>
        </div>

        <div className="bg-card grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-900">Quick Stats</h4>
            <p className="text-gray-600 mt-2">Your account is active and ready to use.</p>
          </div>

          <div className="bg-card p-4 bg-white border rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-900">Recent Activity</h4>
            <p className="text-gray-600 mt-2">You logged in successfully.</p>
          </div>

          <div className="bg-card p-4 bg-white border rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-900">Next Steps</h4>
            <p className="text-gray-600 mt-2">Explore your dashboard features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
