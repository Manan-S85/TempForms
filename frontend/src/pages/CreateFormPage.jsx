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
  AlignLeft,
  List,
  ToggleLeft,
  Star,
  Save,
  ArrowRight
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Create a Temporary Form
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build your form with dynamic fields and set how long it should stay active
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Form Details */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Form Details</h2>
            </div>
            <div className="card-body space-y-6">
              {/* Title */}
              <div className="form-field">
                <label className="label label-required">Form Title</label>
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
                <label className="label">Description (Optional)</label>
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
                <label className="label label-required">Expiration Time</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EXPIRATION_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        watchExpirationTime === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
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
                          <div className="text-lg font-semibold text-gray-900">
                            {option.label}
                          </div>
                          {option.popular && (
                            <span className="badge badge-success text-xs">Popular</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                
                {watchExpirationTime === 'custom' && (
                  <div className="mt-4">
                    <label className="label">Custom expiration (minutes)</label>
                    <input
                      {...register('customExpirationMinutes', {
                        required: watchExpirationTime === 'custom' ? 'Custom time is required' : false,
                        min: { value: 1, message: 'Minimum 1 minute' },
                        max: { value: 43200, message: 'Maximum 30 days (43200 minutes)' }
                      })}
                      type="number"
                      className="input"
                      placeholder="60"
                    />
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
          </div>

          {/* Form Fields */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Form Fields</h2>
              <span className="text-sm text-gray-500">
                {fields.length} field{fields.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="card-body">
              {/* Field Type Buttons */}
              <div className="mb-6">
                <label className="label">Add Field Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Object.entries(FIELD_TYPE_CONFIG).map(([type, config]) => {
                    const IconComponent = fieldTypeIcons[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addField(type)}
                        className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                      >
                        <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-primary-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                          {config.label}
                        </span>
                      </button>
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
                      className="border border-gray-200 rounded-lg p-4 bg-white"
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
          </div>

          {/* Settings */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="label mb-0">Allow Multiple Responses</label>
                  <p className="text-sm text-gray-600">Allow users to submit multiple responses</p>
                </div>
                <input
                  {...register('settings.allowMultipleResponses')}
                  type="checkbox"
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="label mb-0">Show Response Count</label>
                  <p className="text-sm text-gray-600">Display how many responses were submitted</p>
                </div>
                <input
                  {...register('settings.showResponseCount')}
                  type="checkbox"
                  className="toggle"
                />
              </div>

              <div className="form-field">
                <label className="label">Response Password (Optional)</label>
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
                <p className="text-sm text-gray-500 mt-1">
                  If set, viewers will need this password to see responses
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary btn-lg flex items-center space-x-2 min-w-48"
            >
              {isCreating ? (
                <LoadingSpinner size="sm" text="Creating..." />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Create Form</span>
                </>
              )}
            </button>
          </div>
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
          <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold">
            {index + 1}
          </span>
          <span className="font-medium text-gray-700">
            {FIELD_TYPE_CONFIG[field.type].label}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-danger-600 hover:text-danger-700 p-1"
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

        {(field.type === FIELD_TYPES.TEXT || field.type === FIELD_TYPES.TEXTAREA) && (
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
        <label className="text-sm text-gray-700">Required field</label>
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
                It will automatically expire in <strong>{form.timeRemaining}</strong>.
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
                  <p className="text-sm text-warning-600 mt-2">
                    🔒 This link is password protected
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