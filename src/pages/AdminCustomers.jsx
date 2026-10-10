import React, { useState, useEffect } from 'react';
import { adminFetchCustomers, adminFetchOrdersByEmail } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Search, Users, ArrowLeft, Mail, Phone, MapPin, Instagram, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function formatCurrency(val) {
  return `₹${parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get('email');

  useEffect(() => {
    if (emailParam) setSelectedEmail(emailParam);
  }, [emailParam]);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers', search],
    queryFn: () => adminFetchCustomers({ search }),
  });

  const { data: customerOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-customer-orders', selectedEmail],
    queryFn: () => adminFetchOrdersByEmail(selectedEmail),
    enabled: !!selectedEmail,
  });

  const selectedCustomer = customers.find((c) => c.email === selectedEmail) ||
    customerOrders.length > 0 ? {
      name: customerOrders[0]?.customer_name || '',
      email: selectedEmail,
      phone: customerOrders[0]?.customer_phone || '',
      pincode: customerOrders[0]?.customer_pincode || '',
      instagram: customerOrders[0]?.customer_instagram || '',
      address: customerOrders[0]?.delivery_address || '',
    } : null;

  if (selectedEmail) {
    return (
      <AdminLayout>
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedEmail(null);
            window.history.replaceState(null, '', createPageUrl('AdminCustomers'));
          }}
          className="mb-6 text-[#D97757] hover:text-[#C55E3F] hover:bg-[#FFF8F0]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#8B6F47]">{selectedCustomer?.name || 'Customer'}</h1>
          <p className="text-gray-500 mt-1">{selectedEmail}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#8B6F47]">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D97757]" />
                <span className="text-sm text-gray-900">{selectedEmail}</span>
              </div>
              {selectedCustomer?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D97757]" />
                  <span className="text-sm text-gray-900">{selectedCustomer.phone}</span>
                </div>
              )}
              {selectedCustomer?.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#D97757]" />
                  <span className="text-sm text-gray-900">{selectedCustomer.instagram}</span>
                </div>
              )}
              {selectedCustomer?.pincode && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D97757]" />
                  <span className="text-sm text-gray-900">Pincode: {selectedCustomer.pincode}</span>
                </div>
              )}
              {selectedCustomer?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D97757] mt-1" />
                  <span className="text-sm text-gray-900 whitespace-pre-wrap">{selectedCustomer.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-[#8B6F47]">Order History ({customerOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : customerOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-[#D97757]/30 mx-auto mb-3" />
                    <p className="text-gray-500">No orders found for this customer.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
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
                            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#D97757]">{formatCurrency(order.total)}</p>
                          <div className="flex items-center gap-1 justify-end">
                            <Badge className="capitalize bg-gray-100 text-gray-600 hover:bg-gray-100 text-xs">{order.status}</Badge>
                            <Badge className="capitalize bg-gray-100 text-gray-600 hover:bg-gray-100 text-xs">{order.payment_status}</Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#8B6F47]">Customers</h1>
        <p className="text-gray-500 mt-1">{customers.length} {customers.length === 1 ? 'customer' : 'customers'}</p>

        <div className="relative w-full sm:w-80 mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, phone, Instagram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-2 border-gray-200 focus:border-[#D97757]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-[#D97757]/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers found</h3>
            <p className="text-gray-500">
              {search ? 'Try a different search.' : 'Customers will appear here once orders are placed.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.email}
                  className="cursor-pointer"
                  onClick={() => setSelectedEmail(customer.email)}
                >
                  <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                  <TableCell className="text-gray-600">{customer.email}</TableCell>
                  <TableCell className="text-gray-600">{customer.phone || '—'}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-[#FFF8F0] text-[#D97757] hover:bg-[#FFF8F0]">{customer.orderCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-[#D97757]">{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell className="text-sm text-gray-500">{new Date(customer.lastOrder).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </AdminLayout>
  );
}
