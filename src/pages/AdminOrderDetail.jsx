import React, { useState, useEffect } from 'react';
import { adminFetchOrderById, adminFetchOrderItems, adminUpdateOrderStatus } from '@/lib/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Mail, Phone, MapPin, Instagram, Save, AlertCircle, User, Hash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['pending', 'paid', 'failed', 'refunded', 'cod'];
const FULFILLMENT_OPTIONS = ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];

function formatCurrency(val) {
  return `₹${parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AdminOrderDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('id');

  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [fulfillmentStatus, setFulfillmentStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: () => adminFetchOrderById(orderId),
    enabled: !!orderId,
  });

  const { data: items = [] } = useQuery({
    queryKey: ['admin-order-items', orderId],
    queryFn: () => adminFetchOrderItems(orderId),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setPaymentStatus(order.payment_status);
      setFulfillmentStatus(order.fulfillment_status);
      setNotes(order.notes || '');
    }
  }, [order?.id]);

  const updateMutation = useMutation({
    mutationFn: () => adminUpdateOrderStatus(orderId, { status, paymentStatus, fulfillmentStatus, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      setSaveSuccess(true);
      setSaveError(null);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err) => {
      setSaveError(err.message || 'Failed to update order.');
      setSaveSuccess(false);
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-[#D97757]/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Order not found</h2>
          <Button onClick={() => navigate(createPageUrl('AdminOrders'))} className="bg-[#D97757] hover:bg-[#C55E3F] text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl('AdminOrders'))}
        className="mb-6 text-[#D97757] hover:text-[#C55E3F] hover:bg-[#FFF8F0]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-[#8B6F47]">{order.order_number || `Order ${order.id.slice(0, 8)}`}</h1>
          <Badge className="capitalize bg-gray-100 text-gray-700 hover:bg-gray-100">{order.status}</Badge>
        </div>
        <p className="text-gray-500">
          Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#8B6F47]">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id || index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                    {item.variations && Object.keys(item.variations).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(item.variations).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs border-[#D97757] text-[#D97757]">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {item.customization_preference && (
                      <p className="text-xs text-gray-500 italic mt-1">Note: {item.customization_preference}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Qty: {item.quantity}</span>
                      <span>Price: {formatCurrency(item.price)}</span>
                      <span className="font-semibold text-[#D97757]">Line Total: {formatCurrency(item.line_total)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Packing Charge</span>
                  <span className="font-semibold">{formatCurrency(order.packing_charge)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold">{formatCurrency(order.delivery_charge)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#8B6F47]">Total</span>
                  <span className="text-[#D97757]">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#8B6F47]">Customer & Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D97757]" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D97757]" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <Link to={`${createPageUrl('AdminCustomers')}?email=${order.customer_email}`} className="font-medium text-[#D97757] hover:underline">
                      {order.customer_email}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D97757]" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.customer_phone || '—'}</p>
                  </div>
                </div>
                {order.customer_instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-[#D97757]" />
                    <div>
                      <p className="text-xs text-gray-500">Instagram</p>
                      <p className="font-medium text-gray-900">{order.customer_instagram}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#D97757]" />
                  <div>
                    <p className="text-xs text-gray-500">Pincode</p>
                    <p className="font-medium text-gray-900">{order.customer_pincode || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D97757] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Delivery Address</p>
                  <p className="font-medium text-gray-900 whitespace-pre-wrap">{order.delivery_address || '—'}</p>
                </div>
              </div>
              {order.customer_note && (
                <div className="bg-[#FFF8F0] rounded-lg p-3 border border-[#D97757]/20">
                  <p className="text-xs text-gray-500 mb-1">Customer Note</p>
                  <p className="text-sm text-gray-700">{order.customer_note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Update Panel */}
        <div>
          <Card className="border-2 border-gray-200 sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg text-[#8B6F47]">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {saveError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{saveError}</AlertDescription>
                </Alert>
              )}
              {saveSuccess && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <AlertDescription>Order updated successfully.</AlertDescription>
                </Alert>
              )}

              <div>
                <Label className="mb-1.5 block">Order Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="border-2 border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger className="border-2 border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block">Fulfillment Status</Label>
                <Select value={fulfillmentStatus} onValueChange={setFulfillmentStatus}>
                  <SelectTrigger className="border-2 border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FULFILLMENT_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="mb-1.5 block">Admin Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes (not visible to customer)..."
                  className="border-2 border-gray-200 focus:border-[#D97757]"
                  rows={3}
                />
              </div>

              <Button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending}
                className="w-full bg-[#D97757] hover:bg-[#C55E3F] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
