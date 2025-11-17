import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Zap, Users } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-50 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                StealthForm
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${
                  isHomePage 
                    ? 'text-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/create" 
                className="btn-primary btn-sm"
              >
                Create Form
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link to="/create" className="btn-primary btn-sm">
                Create
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">StealthForm</span>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                Create anonymous forms that collect responses invisibly and vanish without a trace. 
                No registration, no tracking, no permanent storage.
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Anonymous by design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>No registration needed</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Zero tracking</span>
                </li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/create" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Create Form
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://github.com/tempforms/tempforms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="/privacy" 
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="/terms" 
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} StealthForm. Built for privacy.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">
                Built for privacy • Open source
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;