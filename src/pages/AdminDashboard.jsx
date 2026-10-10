import React from 'react';
import { adminFetchDashboardStats } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ShoppingBag, IndianRupee, Package, Clock, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sublabel, color }) {
  return (
    <Card className="border-2 border-gray-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: adminFetchDashboardStats,
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#8B6F47]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Order and sales overview</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={ShoppingBag}
              label="Total Orders"
              value={stats.totalOrders}
              sublabel={`${stats.todayOrders} today, ${stats.monthOrders} this month`}
              color="bg-[#D97757]"
            />
            <StatCard
              icon={IndianRupee}
              label="Total Revenue (Paid)"
              value={`₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              sublabel={`₹${stats.monthRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} this month`}
              color="bg-green-600"
            />
            <StatCard
              icon={Clock}
              label="Pending Fulfillment"
              value={stats.pendingFulfillment}
              sublabel="Orders awaiting dispatch"
              color="bg-amber-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Order Value"
              value={stats.totalOrders > 0
                ? `₹${(stats.totalRevenue / stats.totalOrders).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                : '—'}
              sublabel="Based on paid orders"
              color="bg-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#8B6F47]">Order Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats.statusCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <Badge className="capitalize bg-gray-100 text-gray-700 hover:bg-gray-100">{status}</Badge>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#8B6F47]">Payment Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats.paymentCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <Badge className="capitalize bg-gray-100 text-gray-700 hover:bg-gray-100">{status}</Badge>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-[#8B6F47]">Recent Orders</CardTitle>
                <Button asChild variant="ghost" className="text-[#D97757] hover:text-[#C55E3F] hover:bg-[#FFF8F0]">
                  <Link to={createPageUrl('AdminOrders')}>
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-[#D97757]/30 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      to={`${createPageUrl('AdminOrderDetail')}?id=${order.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#FFF8F0] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FFF8F0] flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-[#D97757]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.order_number || order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">{order.customer_name} — {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#D97757]">₹{parseFloat(order.total).toLocaleString('en-IN', { minimumFractionDigits: 0 })}</p>
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 capitalize text-xs">{order.status}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}
