import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { 
  Clock, 
  Users, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Star,
  Timer,
  Lock
} from 'lucide-react';
import { formAPI, apiUtils } from '../utils/api';
import { FIELD_TYPES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';

const FillFormPage = () => {
  const { shareableLink } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // Load form data
  useEffect(() => {
    loadForm();
  }, [shareableLink]);

  // Update time remaining
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

  const loadForm = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!apiUtils.validateShareableLink(shareableLink)) {
        setError('Invalid form link format');
        return;
      }

      const response = await formAPI.getByLink(shareableLink);
      
      if (response.success) {
        setForm(response.form);
      } else {
        setError('Form not found');
      }
    } catch (error) {
      console.error('Error loading form:', error);
      
      if (error.response?.status === 404) {
        setError('Form not found or has expired');
      } else if (error.response?.status === 410) {
        setError('This form has expired');
      } else {
        setError('Failed to load form');
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      // Validate required fields
      const requiredFields = form.fields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => !data[field.id] || data[field.id] === '');
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }

      const response = await formAPI.submitResponse(shareableLink, data);
      
      if (response.success) {
        setSubmitted(true);
        toast.success('Response submitted successfully! 🎉');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      // Error is handled by API interceptor
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading form..." />;
  }

  if (error) {
    return <FormError error={error} onRetry={loadForm} />;
  }

  if (!form) {
    return <FormError error="Form not found" />;
  }

  if (submitted) {
    return <SubmissionSuccess form={form} />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="form-header relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 mix-blend-multiply" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-float" style={{animationDelay: '-3s'}} />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '-1s'}} />
        </div>
        
        <div className="form-header-content relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-12"
          >
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {form.title}
            </h1>
            
            {form.description && (
              <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                {form.description}
              </p>
            )}

            {/* Form Info */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-white/80">
              <div className="glass px-4 py-2 rounded-full flex items-center space-x-2">
                <Timer className="w-4 h-4" />
                <span className="font-medium">Expires in: {timeRemaining}</span>
              </div>
              
              {form.responseCount !== null && form.settings?.showResponseCount && (
                <div className="glass px-4 py-2 rounded-full flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{form.responseCount} response{form.responseCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-solid hover-lift"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body space-y-8">
              {form.fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <FormField
                    field={field}
                    register={register}
                    errors={errors}
                    watch={watch}
                  />
                </motion.div>
              ))}

              {/* Submit Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (form.fields.length + 1) }}
                className="flex justify-center pt-8"
              >
                <button
                  type="submit"
                  disabled={submitting || timeRemaining === 'Expired'}
                  className="btn-primary btn-lg flex items-center space-x-3 min-w-56 shadow-glow hover:shadow-glow-blue"
                >
                  {submitting ? (
                    <LoadingSpinner size="sm" text="Submitting your response..." />
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span className="font-bold">Submit Response</span>
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <div className="glass p-6 rounded-2xl inline-block">
            <p className="text-sm text-slate-600 mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-1" />
              This form will automatically delete when it expires for your privacy
            </p>
            <p className="text-xs text-slate-500">
              Powered by <span className="font-bold text-gradient">TempForms</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Form Field Component
const FormField = ({ field, register, errors, watch }) => {
  const fieldError = errors[field.id];
  const fieldValue = watch(field.id);

  const renderField = () => {
    switch (field.type) {
      case FIELD_TYPES.TEXT:
        return (
          <input
            {...register(field.id, {
              required: field.required ? `${field.label} is required` : false,
              maxLength: { value: 1000, message: 'Text is too long (max 1000 characters)' }
            })}
            type="text"
            className={`input ${fieldError ? 'input-error' : ''}`}
            placeholder={field.placeholder || ''}
          />
        );

      case FIELD_TYPES.TEXTAREA:
        return (
          <textarea
            {...register(field.id, {
              required: field.required ? `${field.label} is required` : false,
              maxLength: { value: 5000, message: 'Text is too long (max 5000 characters)' }
            })}
            className={`input ${fieldError ? 'input-error' : ''}`}
            rows={4}
            placeholder={field.placeholder || ''}
          />
        );

      case FIELD_TYPES.MULTIPLE_CHOICE:
        return (
          <div className="space-y-3">
            {field.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  {...register(field.id, {
                    required: field.required ? `${field.label} is required` : false
                  })}
                  type="radio"
                  value={option.value}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case FIELD_TYPES.YES_NO:
        return (
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register(field.id, {
                  required: field.required ? `${field.label} is required` : false
                })}
                type="radio"
                value="yes"
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-gray-700">Yes</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register(field.id, {
                  required: field.required ? `${field.label} is required` : false
                })}
                type="radio"
                value="no"
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        );

      case FIELD_TYPES.RATING:
        const minRating = field.minRating || 1;
        const maxRating = field.maxRating || 5;
        const ratings = Array.from({ length: maxRating - minRating + 1 }, (_, i) => minRating + i);

        return (
          <div className="flex flex-wrap gap-2">
            {ratings.map((rating) => (
              <label key={rating} className="cursor-pointer">
                <input
                  {...register(field.id, {
                    required: field.required ? `${field.label} is required` : false
                  })}
                  type="radio"
                  value={rating}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                  parseInt(fieldValue) === rating
                    ? 'border-primary-500 bg-primary-100 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'
                }`}>
                  <span className="font-semibold">{rating}</span>
                </div>
              </label>
            ))}
            <div className="flex items-center ml-4 text-sm text-gray-500">
              <span>{minRating}</span>
              <div className="flex items-center mx-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-3 h-3 text-gray-300" />
                ))}
              </div>
              <span>{maxRating}</span>
            </div>
          </div>
        );

      default:
        return <div className="text-red-500">Unknown field type: {field.type}</div>;
    }
  };

  return (
    <div className="form-field">
      <label className={`label ${field.required ? 'label-required' : ''}`}>
        {field.label}
      </label>
      {renderField()}
      {fieldError && (
        <p className="error-message">{fieldError.message}</p>
      )}
    </div>
  );
};

// Form Error Component
const FormError = ({ error, onRetry }) => {
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
              {error === 'This form has expired' ? 'Form Expired' : 'Form Not Available'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {error === 'This form has expired' 
                ? 'This form has expired and is no longer accepting responses.'
                : error || 'The form you\'re looking for is not available.'
              }
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

// Submission Success Component
const SubmissionSuccess = ({ form }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="card">
            <div className="card-body">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              {/* Success Message */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Response Submitted! 🎉
              </h2>
              
              <p className="text-gray-600 mb-6">
                Thank you for your response to "<strong>{form.title}</strong>". 
                Your submission has been recorded successfully.
              </p>
              
              {/* Actions */}
              <div className="space-y-3">
                {form.responseLink && (
                  <a
                    href={`/responses/${form.responseLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View All Responses</span>
                  </a>
                )}
                
                <button 
                  onClick={() => navigate('/')}
                  className="btn-secondary w-full"
                >
                  Back to Home
                </button>
              </div>
              
              {/* Privacy Note */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 flex items-start">
                  <Lock className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                  Your response is anonymous and will be automatically deleted 
                  when this form expires.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default FillFormPage;