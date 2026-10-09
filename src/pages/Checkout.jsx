import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, Package, Truck, Box, CreditCard, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const PACKING_CHARGE = 50;

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    instagram: "",
    address: "",
    note: ""
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (storedCart.length === 0) {
      navigate(createPageUrl("Cart"));
    }
    setCart(storedCart);
  }, [navigate]);

  const calculateMaxDimension = () => {
    let maxDimension = 0;
    cart.forEach(item => {
      if (item.dimensions) {
        const itemMax = Math.max(
          item.dimensions.length || 0,
          item.dimensions.width || 0,
          item.dimensions.height || 0
        );
        maxDimension = Math.max(maxDimension, itemMax);
      }
    });
    return maxDimension;
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const maxDimension = calculateMaxDimension();
  const deliveryCharge = maxDimension + 200;
  const total = subtotal + PACKING_CHARGE + deliveryCharge;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      return await base44.entities.Order.create(orderData);
    },
    onSuccess: (order) => {
      localStorage.setItem('pending_order', JSON.stringify({
        orderId: order.id,
        total: total,
        customerInfo: customerInfo
      }));
      
      navigate(createPageUrl("Payment"));
    },
    onError: (error) => {
      setError("Failed to create order. Please try again.");
      console.error("Order creation error:", error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    const orderData = {
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      customer_pincode: customerInfo.pincode,
      customer_instagram: customerInfo.instagram || "",
      delivery_address: customerInfo.address,
      customer_note: customerInfo.note || "",
      items: cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        variations: item.selectedVariations || {},
        dimensions: item.dimensions || {},
        customization_preference: item.customization_preference || ""
      })),
      subtotal: subtotal,
      packing_charge: PACKING_CHARGE,
      delivery_charge: deliveryCharge,
      total: total,
      status: "pending"
    };

    createOrderMutation.mutate(orderData);
  };

  const isFormValid = customerInfo.name && customerInfo.email && customerInfo.phone && customerInfo.pincode && customerInfo.address;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Cart"))}
        className="mb-6 text-[#D97757] hover:text-[#C55E3F] hover:bg-[#FFF8F0]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#8B6F47] mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your order and proceed to payment</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-[#8B6F47]">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      required
                      value={customerInfo.pincode}
                      onChange={(e) => setCustomerInfo({...customerInfo, pincode: e.target.value})}
                      className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                      placeholder="e.g., 400001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
                    <Input
                      id="instagram"
                      value={customerInfo.instagram}
                      onChange={(e) => setCustomerInfo({...customerInfo, instagram: e.target.value})}
                      className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                      placeholder="@yourusername"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    required
                    rows={4}
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  />
                </div>
                <div>
                  <Label htmlFor="note">Order Note (Optional)</Label>
                  <Textarea
                    id="note"
                    rows={3}
                    value={customerInfo.note}
                    onChange={(e) => setCustomerInfo({...customerInfo, note: e.target.value})}
                    placeholder="Any special instructions or messages for us..."
                    className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-[#8B6F47]">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item, index) => {
                  const mainImage = item.images && item.images.length > 0 ? item.images[0] : null;
                  
                  return (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6] flex-shrink-0">
                        {mainImage ? (
                          <img src={mainImage} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-[#D97757]/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        {Object.keys(item.selectedVariations || {}).length > 0 && (
                          <p className="text-sm text-gray-600">
                            {Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </p>
                        )}
                        {item.customization_preference && (
                          <p className="text-xs text-gray-500 italic mt-1">
                            Customization: {item.customization_preference}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#D97757]">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-2 border-gray-200 sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl text-[#8B6F47]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-[#D97757]" />
                      <span>Packing Charge</span>
                    </div>
                    <span className="font-semibold">₹{PACKING_CHARGE.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-start justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#D97757]" />
                      <div>
                        <div>Delivery Charge</div>
                        <div className="text-xs text-gray-500">
                          Max size: {maxDimension}cm + ₹200
                        </div>
                      </div>
                    </div>
                    <span className="font-semibold">₹{deliveryCharge.toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-xl font-bold text-[#8B6F47]">
                  <span>Total</span>
                  <span className="text-[#D97757]">₹{total.toFixed(2)}</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-semibold mb-1">Payment via UPI</p>
                      <p>You'll be redirected to complete payment via UPI</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={!isFormValid || createOrderMutation.isPending}
                  className="w-full bg-[#D97757] hover:bg-[#C55E3F] text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  {createOrderMutation.isPending ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}