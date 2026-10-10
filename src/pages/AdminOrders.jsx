import React, { useState } from 'react';
import { adminFetchOrders } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Search, Download, ShoppingBag, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['all', 'pending', 'paid', 'failed', 'refunded', 'cod'];
const FULFILLMENT_OPTIONS = ['all', 'pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];
function formatCurrency(val) {
  return `₹${parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function exportOrdersCSV(orders) {
  const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Phone', 'Pincode', 'Status', 'Payment Status', 'Fulfillment Status', 'Subtotal', 'Packing', 'Delivery', 'Total', 'Items'];
  const rows = orders.map((o) => [
    o.order_number || o.id.slice(0, 8),
    new Date(o.created_at).toLocaleString('en-IN'),
    o.customer_name,
    o.customer_email,
    o.customer_phone || '',
    o.customer_pincode || '',
    o.status,
    o.payment_status,
    o.fulfillment_status,
    o.subtotal,
    o.packing_charge || 0,
    o.delivery_charge || 0,
    o.total,
    `${o.item_count || ''}`,
  ]);
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders', search, statusFilter, paymentFilter, fulfillmentFilter, sortBy, sortDir],
    queryFn: () => adminFetchOrders({
      search,
      status: statusFilter,
      paymentStatus: paymentFilter,
      fulfillmentStatus: fulfillmentFilter,
      sortBy,
      sortDir,
    }),
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#8B6F47]">Orders</h1>
            <p className="text-gray-500 mt-1">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
          </div>
          <Button
            onClick={() => exportOrdersCSV(orders)}
            disabled={orders.length === 0}
            className="bg-[#D97757] hover:bg-[#C55E3F] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by order no., name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-2 border-gray-200 focus:border-[#D97757]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 border-2 border-gray-200">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full sm:w-40 border-2 border-gray-200">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s === 'all' ? 'All Payments' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={fulfillmentFilter} onValueChange={setFulfillmentFilter}>
            <SelectTrigger className="w-full sm:w-40 border-2 border-gray-200">
              <SelectValue placeholder="Fulfillment" />
            </SelectTrigger>
            <SelectContent>
              {FULFILLMENT_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s === 'all' ? 'All Fulfillment' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-[#D97757]/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {search || statusFilter !== 'all' || paymentFilter !== 'all' || fulfillmentFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Orders will appear here once customers start purchasing.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button onClick={() => toggleSort('order_number')} className="flex items-center gap-1 hover:text-[#D97757]">
                    Order No.
                    {sortBy === 'order_number' && (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                  </button>
                </TableHead>
                <TableHead>
                  <button onClick={() => toggleSort('customer_name')} className="flex items-center gap-1 hover:text-[#D97757]">
                    Customer
                    {sortBy === 'customer_name' && (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                  </button>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Payment</TableHead>
                <TableHead className="text-center">Fulfillment</TableHead>
                <TableHead className="text-right">
                  <button onClick={() => toggleSort('total')} className="flex items-center gap-1 ml-auto hover:text-[#D97757]">
                    Total
                    {sortBy === 'total' && (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                  </button>
                </TableHead>
                <TableHead>
                  <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-[#D97757]">
                    Date
                    {sortBy === 'created_at' && (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-[#FFF8F0]"
                  onClick={() => navigate(`${createPageUrl('AdminOrderDetail')}?id=${order.id}`)}
                >
                    <TableCell className="font-medium text-[#D97757]">{order.order_number || order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="capitalize bg-gray-100 text-gray-700 hover:bg-gray-100">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                        order.payment_status === 'failed' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                        order.payment_status === 'refunded' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                        'bg-gray-100 text-gray-600 hover:bg-gray-100'
                      }>{order.payment_status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="capitalize bg-gray-100 text-gray-600 hover:bg-gray-100">{order.fulfillment_status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-[#D97757]">{formatCurrency(order.total)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </AdminLayout>
  );
}
