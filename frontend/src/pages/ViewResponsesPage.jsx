import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Download, 
  Eye, 
  EyeOff, 
  Users, 
  Clock, 
  Calendar,
  BarChart3,
  Filter,
  Search,
  Timer,
  Trash2,
  Lock,
  Unlock,
  FileText,
  Star,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { formAPI, apiUtils } from '../utils/api';
import { FIELD_TYPES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';

const ViewResponsesPage = () => {
  const { responseLink } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponses, setSelectedResponses] = useState(new Set());
  const [viewMode, setViewMode] = useState('table'); // table, cards

  // Load responses data
  useEffect(() => {
    loadResponses();
  }, [responseLink]);

  // Update time remaining and show pre-expiration warnings
  useEffect(() => {
    if (form?.expiresAt) {
      const updateTimer = () => {
        const now = new Date();
        const expiresAt = new Date(form.expiresAt);
        const timeLeft = expiresAt.getTime() - now.getTime();
        
        if (timeLeft <= 0) {
          setTimeRemaining('Expired');
          return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Show warning when 2 minutes or less remaining
        if (timeLeft <= 2 * 60 * 1000 && timeLeft > 60 * 1000) {
          toast.error(
            `WARNING: Form expires in ${minutes}m ${seconds}s! Responses will no longer be available.`,
            {
              id: 'expiration-warning',
              duration: 4000,
              position: 'top-center',
            }
          );
        }
        // Show critical warning when 1 minute or less remaining
        else if (timeLeft <= 60 * 1000 && timeLeft > 30 * 1000) {
          toast.error(
            `CRITICAL: Form expires in ${seconds}s! This is your final warning!`,
            {
              id: 'critical-warning',
              duration: 6000,
              position: 'top-center',
            }
          );
        }
        
        if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${seconds}s`);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [form]);

  const loadResponses = async (passwordAttempt = '') => {
    try {
      setLoading(true);
      setError(null);

      if (!apiUtils.validateShareableLink(responseLink)) {
        setError('Invalid response link format');
        return;
      }

      const response = await formAPI.getResponses(responseLink, passwordAttempt);
      
      if (response.success) {
        setForm(response.form);
        setResponses(response.responses);
        setStats(response.stats);
        setAuthenticated(true);
        setPasswordRequired(false);
      }
    } catch (error) {
      console.error('Error loading responses:', error);
      
      if (error.response?.status === 401) {
        setPasswordRequired(true);
        setAuthenticated(false);
        if (passwordAttempt) {
          toast.error('Incorrect password');
        }
      } else if (error.response?.status === 404) {
        setError('Form not found or has expired');
      } else if (error.response?.status === 410) {
        setError('This form has expired');
      } else {
        setError('Failed to load responses');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      loadResponses(password);
    }
  };

  const exportResponses = async (format = 'csv') => {
    try {
      const response = await formAPI.exportResponses(responseLink, format, password);
      
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data], { 
          type: format === 'csv' ? 'text/csv' : 'application/json' 
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${form.title.replace(/[^a-zA-Z0-9]/g, '_')}_responses.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success(`Responses exported as ${format.toUpperCase()}!`);
      }
    } catch (error) {
      console.error('Error exporting responses:', error);
      toast.error('Failed to export responses');
    }
  };

  const deleteSelectedResponses = async () => {
    if (selectedResponses.size === 0) return;
    
    if (!confirm(`Delete ${selectedResponses.size} selected response(s)?`)) return;
    
    try {
      const responseIds = Array.from(selectedResponses);
      await formAPI.deleteResponses(responseLink, responseIds, password);
      
      // Remove deleted responses from state
      setResponses(prev => prev.filter(r => !selectedResponses.has(r._id)));
      setSelectedResponses(new Set());
      
      toast.success(`${responseIds.length} response(s) deleted`);
    } catch (error) {
      console.error('Error deleting responses:', error);
      toast.error('Failed to delete responses');
    }
  };

  const filteredResponses = responses.filter(response => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = Object.values(response.data).some(value => 
        value && value.toString().toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }
    
    // Date filter
    if (filter !== 'all') {
      const responseDate = new Date(response.submittedAt);
      const now = new Date();
      
      switch (filter) {
        case 'today':
          return responseDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return responseDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return responseDate >= monthAgo;
        default:
          return true;
      }
    }
    
    return true;
  });

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading responses..." />;
  }

  if (error) {
    return <ResponseError error={error} onRetry={loadResponses} />;
  }

  if (passwordRequired && !authenticated) {
    return <PasswordPrompt onSubmit={handlePasswordSubmit} password={password} setPassword={setPassword} />;
  }

  if (!form) {
    return <ResponseError error="Form not found" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {form.title} - Responses
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{responses.length} response{responses.length !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Timer className="w-4 h-4" />
                  <span>Expires in: {timeRemaining}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              <button
                onClick={() => exportResponses('csv')}
                className="btn-secondary flex items-center space-x-2"
                disabled={responses.length === 0}
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              
              <button
                onClick={() => exportResponses('json')}
                className="btn-secondary flex items-center space-x-2"
                disabled={responses.length === 0}
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
              
              <button
                onClick={() => navigate(`/form/${form.shareableLink}`)}
                className="btn-primary flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Form</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <StatsCard
              title="Total Responses"
              value={stats.totalResponses}
              icon={<Users className="w-5 h-5" />}
              color="blue"
            />
            <StatsCard
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              icon={<BarChart3 className="w-5 h-5" />}
              color="green"
            />
            <StatsCard
              title="Avg. Time to Complete"
              value={stats.avgCompletionTime}
              icon={<Clock className="w-5 h-5" />}
              color="purple"
            />
            <StatsCard
              title="Last Response"
              value={stats.lastResponseTime}
              icon={<Calendar className="w-5 h-5" />}
              color="orange"
            />
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search responses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input w-full sm:w-auto"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                {selectedResponses.size > 0 && (
                  <button
                    onClick={deleteSelectedResponses}
                    className="btn-danger flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete ({selectedResponses.size})</span>
                  </button>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => loadResponses(password)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Responses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredResponses.length === 0 ? (
            <NoResponses hasSearch={searchQuery || filter !== 'all'} />
          ) : viewMode === 'table' ? (
            <ResponseTable
              form={form}
              responses={filteredResponses}
              selectedResponses={selectedResponses}
              setSelectedResponses={setSelectedResponses}
            />
          ) : (
            <ResponseCards
              form={form}
              responses={filteredResponses}
              selectedResponses={selectedResponses}
              setSelectedResponses={setSelectedResponses}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="card">
      <div className="card-body flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Password Prompt Component
const PasswordPrompt = ({ onSubmit, password, setPassword }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Protected Responses
            </h2>
            
            <p className="text-gray-600 mb-6">
              This form's responses are password protected. Please enter the password to view responses.
            </p>
            
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                required
              />
              
              <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
                <Unlock className="w-4 h-4" />
                <span>Access Responses</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Response Error Component
const ResponseError = ({ error, onRetry }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="card-body">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Unable to Load Responses
            </h2>
            
            <p className="text-gray-600 mb-6">
              {error || 'The responses you\'re looking for are not available.'}
            </p>
            
            <div className="space-y-3">
              {onRetry && (
                <button onClick={onRetry} className="btn-primary w-full">
                  Try Again
                </button>
              )}
              <button 
                onClick={() => navigate('/')}
                className="btn-secondary w-full"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// No Responses Component
const NoResponses = ({ hasSearch }) => {
  return (
    <div className="card">
      <div className="card-body text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hasSearch ? 'No Matching Responses' : 'No Responses Yet'}
        </h3>
        
        <p className="text-gray-600">
          {hasSearch 
            ? 'Try adjusting your search or filter criteria.'
            : 'Responses will appear here once people start filling out your form.'
          }
        </p>
      </div>
    </div>
  );
};

// Response Table Component
const ResponseTable = ({ form, responses, selectedResponses, setSelectedResponses }) => {
  const toggleResponse = (responseId) => {
    const newSelected = new Set(selectedResponses);
    if (newSelected.has(responseId)) {
      newSelected.delete(responseId);
    } else {
      newSelected.add(responseId);
    }
    setSelectedResponses(newSelected);
  };

  const toggleAll = () => {
    if (selectedResponses.size === responses.length) {
      setSelectedResponses(new Set());
    } else {
      setSelectedResponses(new Set(responses.map(r => r._id)));
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedResponses.size === responses.length && responses.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              {form.fields.map((field) => (
                <th key={field.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {responses.map((response) => (
              <tr key={response._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedResponses.has(response._id)}
                    onChange={() => toggleResponse(response._id)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(response.submittedAt).toLocaleString()}
                </td>
                {form.fields.map((field) => (
                  <td key={field.id} className="px-6 py-4 text-sm text-gray-900">
                    <ResponseValue field={field} value={response.data[field.id]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Response Cards Component
const ResponseCards = ({ form, responses, selectedResponses, setSelectedResponses }) => {
  const toggleResponse = (responseId) => {
    const newSelected = new Set(selectedResponses);
    if (newSelected.has(responseId)) {
      newSelected.delete(responseId);
    } else {
      newSelected.add(responseId);
    }
    setSelectedResponses(newSelected);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {responses.map((response, index) => (
        <motion.div
          key={response._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className={`card ${selectedResponses.has(response._id) ? 'ring-2 ring-primary-500' : ''}`}
        >
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedResponses.has(response._id)}
                  onChange={() => toggleResponse(response._id)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  Response #{responses.length - index}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(response.submittedAt).toLocaleString()}
              </span>
            </div>
            
            <div className="space-y-3">
              {form.fields.map((field) => (
                <div key={field.id}>
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <div className="mt-1">
                    <ResponseValue field={field} value={response.data[field.id]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Response Value Component
const ResponseValue = ({ field, value }) => {
  if (!value && value !== 0) {
    return <span className="text-gray-400 italic">No response</span>;
  }

  switch (field.type) {
    case FIELD_TYPES.RATING:
      return (
        <div className="flex items-center space-x-1">
          {Array.from({ length: parseInt(value) }, (_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
          <span className="text-sm text-gray-600 ml-2">({value})</span>
        </div>
      );
    
    case FIELD_TYPES.YES_NO:
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 'yes' ? 'Yes' : 'No'}
        </span>
      );
    
    case FIELD_TYPES.TEXTAREA:
      return (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate" title={value}>
            {value}
          </p>
        </div>
      );
    
    default:
      return <span className="text-sm text-gray-900">{value}</span>;
  }
};

export default ViewResponsesPage;