import React from 'react';
import { XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Failed = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again.
        </p>
        
        <div className="space-y-3">
          <button onClick={() => navigate('/')} className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Failed;