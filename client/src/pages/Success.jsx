import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  const query = new URLSearchParams(useLocation().search);
  const sessionId = query.get("session_id");
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionId) {
      api.post("/payment-confirm", { sessionId })
        .then(res => {
          console.log("✅ Payment confirmed and updates done", res.data);
        })
        .catch(err => {
          console.error("❌ Failed to confirm payment", err.response?.data || err.message);
        });
    }
  }, [sessionId]);

  return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully.
        </p>
        
        <button onClick={() => navigate('/')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 cursor-pointer transition-colors">
          Continue
        </button>
      </div>
    </div>  
  );
};

export default Success