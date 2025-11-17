import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  console.log('HomePage component rendering...');
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 TempForms is Working! 🎉
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The React app is successfully running
        </p>
        <Link 
          to="/create" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Create Form
        </Link>
      </div>
    </div>
  );
};

// Keep the original HomePage as backup
const OriginalHomePage = () => {
  const features = [
    {
      icon: Timer,
      title: 'Auto-Expiring Forms',
      description: 'Forms automatically delete after 15 minutes, 1 hour, 24 hours, or custom time',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Zap,
      title: 'No Login Required',
      description: 'Create and share forms instantly without sign-up, email, or password',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Shield,
      title: 'Anonymous & Private',
      description: 'No permanent data storage, no tracking, all data auto-deleted',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Globe,
      title: 'Lightweight Sharing',
      description: 'Instant link generation for form filling and viewing responses',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Trash2,
      title: 'Zero Cleanup',
      description: 'MongoDB TTL indexes automatically delete expired forms and responses',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Users,
      title: 'Dynamic Fields',
      description: 'Text, textarea, multiple choice, yes/no, and rating fields',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  const useCases = [
    {
      title: 'Students',
      description: 'Quick class surveys and feedback collection',
      icon: '🎓',
    },
    {
      title: 'Event Organizers',
      description: 'Registration forms and post-event feedback',
      icon: '🎉',
    },
    {
      title: 'Hackathons',
      description: 'Team formation and project judging',
      icon: '💻',
    },
    {
      title: 'Anonymous Feedback',
      description: 'HR surveys and course evaluations',
      icon: '🔒',
    },
    {
      title: 'Quick Polls',
      description: 'Decision making and opinion gathering',
      icon: '📊',
    },
    {
      title: 'Temporary Surveys',
      description: 'One-time data collection needs',
      icon: '⏰',
    },
  ];

  const stats = [
    { label: 'Forms Created', value: '10,000+', icon: CheckCircle },
    { label: 'Auto-Deleted', value: '100%', icon: Trash2 },
    { label: 'No Tracking', value: '0%', icon: Shield },
    { label: 'Login Required', value: '0%', icon: Lock },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Temporary Forms That{' '}
                <span className="text-gradient bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  Auto-Delete
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                Create privacy-focused forms that automatically disappear after a set time. 
                No login required, completely anonymous, perfect for quick surveys.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/create" className="btn-primary btn-lg group">
                  Create Your First Form
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button 
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="btn-ghost btn-lg"
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Unique Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TempForms offers features you won't find in Google Forms or Microsoft Forms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow duration-300"
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TempForms is ideal for various scenarios where privacy and temporary data collection are important
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="text-4xl mb-4">
                  {useCase.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-gray-600">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, fast, and completely anonymous
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Form',
                description: 'Add fields, set expiration time, and customize settings. No account required.',
                icon: '📝',
              },
              {
                step: '2',
                title: 'Share the Link',
                description: 'Get instant shareable links - one for filling, one for viewing responses.',
                icon: '🔗',
              },
              {
                step: '3',
                title: 'Auto-Delete',
                description: 'Forms and responses automatically delete when the time expires. Zero cleanup needed.',
                icon: '🗑️',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200 transform translate-x-8"></div>
                  )}
                </div>
                <div className="text-4xl mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Create Your First Temporary Form?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust TempForms for their privacy-focused form needs.
              Start creating forms that disappear when you're done.
            </p>
            <Link to="/create" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg group">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;