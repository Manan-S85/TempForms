import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-soft p-8">
          {/* 404 Illustration */}
          <div className="relative mb-8">
            <div className="text-8xl font-bold text-gray-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or may have expired. 
            This could be a temporary form that has already been deleted.
          </p>
          
          {/* Actions */}
          <div className="space-y-3">
            <Link to="/" className="btn-primary w-full flex items-center justify-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Link>
            
            <Link to="/create" className="btn-secondary w-full">
              Create New Form
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="btn-ghost w-full flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
        
        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Looking for a specific form? Make sure the link is correct and hasn't expired.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;