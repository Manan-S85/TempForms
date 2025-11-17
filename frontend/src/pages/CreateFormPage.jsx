import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  Clock, 
  Copy, 
  Eye, 
  Settings,
  Type,
  Mail,
  AlignLeft,
  List,
  ToggleLeft,
  Star,
  Save,
  ArrowRight,
  Lock
} from 'lucide-react';
import { formAPI, apiUtils } from '../utils/api';
import { FIELD_TYPES, EXPIRATION_OPTIONS, FIELD_TYPE_CONFIG } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateFormPage = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [createdForm, setCreatedForm] = useState(null);
  const [activeTab, setActiveTab] = useState('fields');

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      expirationTime: '1hour',
      customExpirationMinutes: 60,
      responsePassword: '',
      fields: [
        {
          type: FIELD_TYPES.TEXT,
          label: 'What is your name?',
          placeholder: 'Enter your name...',
          required: false
        }
      ],
      settings: {
        allowMultipleResponses: true,
        showResponseCount: true,
        requireAllFields: false
      }
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'fields'
  });

  const watchExpirationTime = watch('expirationTime');
  const watchFields = watch('fields');

  const fieldTypeIcons = {
    [FIELD_TYPES.TEXT]: Type,
    [FIELD_TYPES.EMAIL]: Mail,
    [FIELD_TYPES.TEXTAREA]: AlignLeft,
    [FIELD_TYPES.MULTIPLE_CHOICE]: List,
    [FIELD_TYPES.YES_NO]: ToggleLeft,
    [FIELD_TYPES.RATING]: Star,
  };

  const addField = (type) => {
    const newField = {
      type,
      label: `New ${FIELD_TYPE_CONFIG[type].label}`,
      placeholder: FIELD_TYPE_CONFIG[type].placeholder || '',
      required: false,
    };

    if (type === FIELD_TYPES.MULTIPLE_CHOICE) {
      newField.options = [
        { id: 'opt1', label: 'Option 1', value: 'option1' },
        { id: 'opt2', label: 'Option 2', value: 'option2' }
      ];
    } else if (type === FIELD_TYPES.RATING) {
      newField.minRating = 1;
      newField.maxRating = 5;
    }

    append(newField);
  };

  const onSubmit = async (data) => {
    setIsCreating(true);
    
    try {
      // Process fields to add unique IDs
      const processedFields = data.fields.map((field, index) => ({
        ...field,
        id: `field_${Date.now()}_${index}`,
        order: index
      }));

      const formData = {
        ...data,
        fields: processedFields
      };

      const response = await formAPI.create(formData);
      
      if (response.success) {
        setCreatedForm(response.form);
        toast.success('Form created successfully! 🎉');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      // Error handling is done by API interceptor
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text, label) => {
    apiUtils.copyToClipboard(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (createdForm) {
    return <FormCreatedSuccess form={createdForm} onCopyLink={copyToClipboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-indigo-900/50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '-2s'}} />
        </div>
        
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-20"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Create Your Form
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Build beautiful, temporary forms that expire automatically. No accounts
              required, perfect for surveys, feedback, and data collection.
            </p>
          </motion.div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Form Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className="px-8 py-6 bg-gray-800 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Form Details</h2>
              <p className="text-sm text-gray-300 mt-1">Give your form a title and description</p>
            </div>
            <div className="px-8 py-6 space-y-6">
              {/* Title */}
              <div className="form-field">
                <label className="block text-sm font-medium text-white mb-2">Form Title <span className="text-red-400">*</span></label>
                <input
                  {...register('title', { 
                    required: 'Title is required',
                    maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                  })}
                  className={`input ${errors.title ? 'input-error' : ''}`}
                  placeholder="e.g., Event Feedback Survey"
                />
                {errors.title && (
                  <p className="error-message">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="form-field">
                <label className="block text-sm font-medium text-white mb-2">Description (Optional)</label>
                <textarea
                  {...register('description', {
                    maxLength: { value: 500, message: 'Description must be less than 500 characters' }
                  })}
                  className={`input ${errors.description ? 'input-error' : ''}`}
                  rows={3}
                  placeholder="Brief description of your form..."
                />
                {errors.description && (
                  <p className="error-message">{errors.description.message}</p>
                )}
              </div>

              {/* Expiration Time */}
              <div className="form-field">
                <label className="block text-sm font-medium text-white mb-4">Expiration Time <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EXPIRATION_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        watchExpirationTime === option.value
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-800'
                      }`}
                    >
                      <input
                        {...register('expirationTime', { required: 'Please select expiration time' })}
                        type="radio"
                        value={option.value}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-semibold text-white">
                            {option.label}
                          </div>
                          {option.popular && (
                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Popular</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                
                {watchExpirationTime === 'custom' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white mb-2">Custom expiration (minutes)</label>
                    <input
                      {...register('customExpirationMinutes', {
                        required: watchExpirationTime === 'custom' ? 'Custom time is required' : false,
                        min: { value: 1, message: 'Minimum 1 minute' },
                        max: { value: 1440, message: 'Maximum 24 hours (1440 minutes)' }
                      })}
                      type="number"
                      className="input"
                      placeholder="60"
                      max={1440}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter minutes (1-1440). Examples: 60 = 1 hour, 480 = 8 hours, 1440 = 24 hours
                    </p>
                    {errors.customExpirationMinutes && (
                      <p className="error-message">{errors.customExpirationMinutes.message}</p>
                    )}
                  </div>
                )}

                {errors.expirationTime && (
                  <p className="error-message">{errors.expirationTime.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Form Fields */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className="px-8 py-6 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Form Fields</h2>
                <p className="text-sm text-gray-300 mt-1">Build your form with interactive fields</p>
              </div>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                <span className="text-xs font-semibold">{fields.length} field{fields.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="px-8 py-6 space-y-6">
              {/* Field Type Buttons */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-white mb-4">Add Field Type</label>
                <div className="field-type-grid">
                  {Object.entries(FIELD_TYPE_CONFIG).map(([type, config]) => {
                    const IconComponent = fieldTypeIcons[type];
                    return (
                      <motion.button
                        key={type}
                        type="button"
                        onClick={() => addField(type)}
                        className="field-type-button hover-lift group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent className="field-type-icon" />
                        <span className="text-sm font-semibold text-white group-hover:text-blue-400">
                          {config.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Fields List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border border-gray-600 rounded-lg p-4 bg-gray-700"
                    >
                      <FieldEditor
                        field={field}
                        index={index}
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        onRemove={() => remove(index)}
                        canRemove={fields.length > 1}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className="px-8 py-6 bg-gray-800 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Settings className="w-6 h-6" />
                <span>Settings</span>
              </h2>
              <p className="text-sm text-gray-300 mt-1">Configure form behavior and security</p>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Allow Multiple Responses</label>
                  <p className="text-sm text-gray-300">Allow users to submit multiple responses</p>
                </div>
                <input
                  {...register('settings.allowMultipleResponses')}
                  type="checkbox"
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Show Response Count</label>
                  <p className="text-sm text-gray-300">Display how many responses were submitted</p>
                </div>
                <input
                  {...register('settings.showResponseCount')}
                  type="checkbox"
                  className="toggle"
                />
              </div>

              <div className="form-field">
                <label className="block text-sm font-medium text-white mb-2">Response Password (Optional)</label>
                <input
                  {...register('responsePassword', {
                    minLength: { value: 4, message: 'Password must be at least 4 characters' },
                    maxLength: { value: 50, message: 'Password must be less than 50 characters' }
                  })}
                  type="password"
                  className={`input ${errors.responsePassword ? 'input-error' : ''}`}
                  placeholder="Set a password to protect response viewing"
                />
                {errors.responsePassword && (
                  <p className="error-message">{errors.responsePassword.message}</p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  If set, viewers will need this password to see responses
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary btn-lg flex items-center space-x-3 min-w-56 shadow-glow hover:shadow-glow-blue"
            >
              {isCreating ? (
                <LoadingSpinner size="sm" text="Creating your form..." />
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  <span className="font-bold">Create Form</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

// Field Editor Component
const FieldEditor = ({ field, index, register, setValue, errors, onRemove, canRemove }) => {
  const fieldErrors = errors.fields?.[index];

  return (
    <div className="space-y-4">
      {/* Field Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {index + 1}
          </span>
          <span className="font-medium text-white">
            {FIELD_TYPE_CONFIG[field.type].label}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Field Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Field Label</label>
          <input
            {...register(`fields.${index}.label`, { 
              required: 'Label is required',
              maxLength: { value: 200, message: 'Label too long' }
            })}
            className={`input ${fieldErrors?.label ? 'input-error' : ''}`}
            placeholder="Enter field label"
          />
          {fieldErrors?.label && (
            <p className="error-message">{fieldErrors.label.message}</p>
          )}
        </div>

        {(field.type === FIELD_TYPES.TEXT || field.type === FIELD_TYPES.EMAIL || field.type === FIELD_TYPES.TEXTAREA) && (
          <div>
            <label className="label">Placeholder</label>
            <input
              {...register(`fields.${index}.placeholder`)}
              className="input"
              placeholder="Enter placeholder text"
            />
          </div>
        )}

        {field.type === FIELD_TYPES.RATING && (
          <>
            <div>
              <label className="label">Min Rating</label>
              <input
                {...register(`fields.${index}.minRating`, {
                  min: { value: 1, message: 'Min rating must be at least 1' },
                  max: { value: 10, message: 'Min rating must be at most 10' }
                })}
                type="number"
                className="input"
                defaultValue={1}
              />
            </div>
            <div>
              <label className="label">Max Rating</label>
              <input
                {...register(`fields.${index}.maxRating`, {
                  min: { value: 1, message: 'Max rating must be at least 1' },
                  max: { value: 10, message: 'Max rating must be at most 10' }
                })}
                type="number"
                className="input"
                defaultValue={5}
              />
            </div>
          </>
        )}
      </div>

      {/* Multiple Choice Options */}
      {field.type === FIELD_TYPES.MULTIPLE_CHOICE && (
        <MultipleChoiceEditor
          fieldIndex={index}
          register={register}
          setValue={setValue}
          options={field.options || []}
        />
      )}

      {/* Required Toggle */}
      <div className="flex items-center space-x-2">
        <input
          {...register(`fields.${index}.required`)}
          type="checkbox"
          className="rounded"
        />
        <label className="text-sm text-white">Required field</label>
      </div>
    </div>
  );
};

// Multiple Choice Editor Component
const MultipleChoiceEditor = ({ fieldIndex, register, setValue, options }) => {
  const [localOptions, setLocalOptions] = useState(options || [
    { id: 'opt1', label: 'Option 1', value: 'option1' },
    { id: 'opt2', label: 'Option 2', value: 'option2' }
  ]);

  const addOption = () => {
    const newOption = {
      id: `opt${Date.now()}`,
      label: `Option ${localOptions.length + 1}`,
      value: `option${localOptions.length + 1}`
    };
    const updatedOptions = [...localOptions, newOption];
    setLocalOptions(updatedOptions);
    setValue(`fields.${fieldIndex}.options`, updatedOptions);
  };

  const removeOption = (optionIndex) => {
    if (localOptions.length > 2) {
      const updatedOptions = localOptions.filter((_, i) => i !== optionIndex);
      setLocalOptions(updatedOptions);
      setValue(`fields.${fieldIndex}.options`, updatedOptions);
    }
  };

  const updateOption = (optionIndex, field, value) => {
    const updatedOptions = localOptions.map((opt, i) => 
      i === optionIndex ? { ...opt, [field]: value } : opt
    );
    setLocalOptions(updatedOptions);
    setValue(`fields.${fieldIndex}.options`, updatedOptions);
  };

  return (
    <div className="space-y-3">
      <label className="label">Options</label>
      {localOptions.map((option, optionIndex) => (
        <div key={option.id} className="flex items-center space-x-2">
          <input
            type="text"
            value={option.label}
            onChange={(e) => updateOption(optionIndex, 'label', e.target.value)}
            className="input flex-1"
            placeholder={`Option ${optionIndex + 1}`}
          />
          {localOptions.length > 2 && (
            <button
              type="button"
              onClick={() => removeOption(optionIndex)}
              className="text-red-600 hover:text-red-700 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {localOptions.length < 20 && (
        <button
          type="button"
          onClick={addOption}
          className="btn-ghost btn-sm flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Option</span>
        </button>
      )}
    </div>
  );
};

// Form Created Success Component
const FormCreatedSuccess = ({ form, onCopyLink }) => {
  const navigate = useNavigate();
  
  // Safety check to prevent errors
  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="card text-center">
          <div className="card-body space-y-6">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-green-600" />
            </div>

            {/* Success Message */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Form Created Successfully! 🎉
              </h1>
              <p className="text-gray-600">
                Your temporary form "<strong>{form.title}</strong>" is ready to use.
                It will automatically expire based on your selected time setting.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              {/* Form Link */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Form Link (for filling)
                  </label>
                  <button
                    onClick={() => onCopyLink(`${window.location.origin}/form/${form.shareableLink}`, 'Form link')}
                    className="btn-ghost btn-sm flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="bg-white rounded border p-3 font-mono text-sm text-gray-600 break-all">
                  {window.location.origin}/form/{form.shareableLink}
                </div>
              </div>

              {/* Response Link */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Response Link (for viewing)
                  </label>
                  <button
                    onClick={() => onCopyLink(`${window.location.origin}/responses/${form.responseLink}`, 'Response link')}
                    className="btn-ghost btn-sm flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="bg-white rounded border p-3 font-mono text-sm text-gray-600 break-all">
                  {window.location.origin}/responses/{form.responseLink}
                </div>
                {form.hasResponsePassword && (
                  <p className="text-sm text-yellow-600 mt-2 flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    This link is password protected
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`/form/${form.shareableLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Form</span>
              </a>
              
              <button
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                Create Another Form
              </button>
            </div>

            {/* Expiration Warning */}
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <p className="text-sm text-warning-800">
                <strong>⏰ Important:</strong> This form will automatically delete in{' '}
                <strong>{form.timeRemaining}</strong>. Make sure to save any important links!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateFormPage;