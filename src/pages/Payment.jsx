import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, Smartphone, Copy, MessageCircle, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const UPI_ID = "bhumikhokhani-1@okdfcbank";
const PAYEE_NAME = "Handmade By Bhumi";
const WHATSAPP_NUMBER = "918618872043";
const INSTAGRAM_HANDLE = "handmade.by.bhumi";

export default function Payment() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const pendingOrder = JSON.parse(localStorage.getItem('pending_order') || 'null');
    if (!pendingOrder) {
      navigate(createPageUrl("Home"));
      return;
    }
    setOrderData(pendingOrder);

    // Try to open UPI app automatically
    const transactionNote = `Order for ${pendingOrder.customerInfo.name}`;
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${pendingOrder.total}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    window.location.href = upiUrl;
  }, [navigate]);

  const handlePaymentComplete = () => {
    localStorage.removeItem('pending_order');
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    navigate(createPageUrl("OrderSuccess"));
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!orderData) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I have completed the payment for my order. Sending payment screenshot.')}`;
  const instagramUrl = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="border-2 border-[#D97757]">
        <CardHeader className="bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6]">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#D97757] rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center text-[#8B6F47]">
            Complete Your Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Amount to Pay</span>
              <span className="text-3xl font-bold text-[#D97757]">₹{orderData.total.toFixed(2)}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Pay to UPI ID:</p>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                <code className="text-lg font-mono text-[#8B6F47]">{UPI_ID}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyUPIId}
                  className="text-[#D97757] hover:bg-[#FFF8F0]"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions</h3>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Your UPI payment app should have opened automatically</li>
                  <li>If not, open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                  <li>Enter the UPI ID shown above or scan QR code if available</li>
                  <li>Enter the amount: ₹{orderData.total.toFixed(2)}</li>
                  <li>Complete the payment</li>
                  <li><strong>Take a screenshot of the payment confirmation</strong></li>
                  <li>Share the screenshot with us (see below)</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
            <h3 className="font-semibold text-green-900 mb-3 text-center">Share Payment Screenshot</h3>
            <p className="text-sm text-green-800 mb-4 text-center">
              Please share your payment confirmation screenshot with us to confirm your order
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  type="button"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Share on WhatsApp
                </Button>
              </a>
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-pink-500 text-pink-600 hover:bg-pink-50"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  DM on Instagram
                </Button>
              </a>
            </div>
            <p className="text-xs text-green-700 mt-3 text-center">
              WhatsApp: +91 86188 72043 | Instagram: @handmade.by.bhumi
            </p>
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              onClick={handlePaymentComplete}
              className="w-full bg-[#D97757] hover:bg-[#C55E3F] text-white text-lg py-6"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              I've Shared the Screenshot
            </Button>
            <p className="text-center text-sm text-gray-500">
              Click above after sharing the payment screenshot
            </p>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Having trouble? Contact us at{" "}
              <a href="mailto:hello@handmadebybhumi.com" className="text-[#D97757] hover:underline">
                hello@handmadebybhumi.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}