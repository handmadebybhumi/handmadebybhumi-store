import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="border-2 border-green-200 bg-green-50/30">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4">
            Order Placed Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order! We've received your request and will contact you shortly to confirm the details.
          </p>

          <div className="bg-white rounded-xl p-6 mb-8 border-2 border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-6 h-6 text-[#D97757]" />
              <h2 className="text-xl font-semibold text-[#8B6F47]">What's Next?</h2>
            </div>
            <ul className="text-left space-y-3 text-gray-600 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-[#D97757] font-bold">1.</span>
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D97757] font-bold">2.</span>
                <span>We'll contact you to confirm the order details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D97757] font-bold">3.</span>
                <span>Your handmade items will be carefully packed and shipped</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate(createPageUrl("Home"))}
              className="bg-[#D97757] hover:bg-[#C55E3F] text-white"
            >
              <Home className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}