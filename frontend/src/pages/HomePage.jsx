import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  Eye, 
  Trash2, 
  Lock, 
  CheckCircle,
  ArrowRight,
  Rocket,
  Key,
  Link as LinkIcon,
  FileText,
  Users,
  Zap
} from 'lucide-react';

const HomePage = () => {
  // No mouse tracking needed

  const features = [
    {
      title: 'Stealth Mode',
      description: 'Forms operate in complete stealth - no tracking, no permanent storage, no digital footprint.',
      icon: Shield,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Auto-Destruction',
      description: 'Forms automatically self-destruct after expiration. Your data vanishes without a trace.',
      icon: Clock,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Secret Access',
      description: 'Dual-link system: public form link and private response key for secure data access.',
      icon: Key,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Anonymous',
      description: 'No accounts, no login required. Create and share forms completely anonymously.',
      icon: Eye,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'Instant Links',
      description: 'Get shareable form link and private response key instantly upon creation.',
      icon: LinkIcon,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Zero Trace',
      description: 'Once expired, forms leave no trace. Perfect for sensitive data collection.',
      icon: Trash2,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
  ];

  const useCases = [
    {
      title: 'Anonymous Feedback',
      description: 'HR surveys and employee feedback without identity tracking',
      icon: Users,
    },
    {
      title: 'Secret Polls',
      description: 'Confidential voting and opinion gathering',
      icon: CheckCircle,
    },
    {
      title: 'Stealth Surveys',
      description: 'Market research and data collection that leaves no trace',
      icon: Eye,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-ping" style={{animationDuration: '4s'}}></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30 shadow-lg">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-medium">StealthForm</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Forms That
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Vanish
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              Create anonymous forms with <strong>instant dual-link generation</strong> and secret response keys. 
              Collect data in stealth mode, then watch everything disappear without a trace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/create" className="inline-flex items-center justify-center bg-white text-blue-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group">
                <Rocket className="w-6 h-6 mr-3" />
                Create Stealth Form
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                <Eye className="w-5 h-5 mr-3" />
                Explore Features
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-light text-white mb-12">
              Stealth Operations
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
              Three steps to anonymous data collection with <strong>instant dual-link generation</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: 'Create & Deploy',
                description: 'Build your form and get instant shareable link plus a secret response key for data access.',
                icon: FileText,
              },
              {
                title: 'Share Stealthily',
                description: 'Distribute the public form link while keeping your private response key secure.',
                icon: Users,
              },
              {
                title: 'Auto-Destruct',
                description: 'Forms vanish automatically after expiration. Use your secret key to access responses until then.',
                icon: Zap,
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="mb-6">
                  <step.icon className="w-12 h-12 text-blue-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-light text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-light text-white mb-12">
              Stealth Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Advanced privacy features with <strong>dual-link security system</strong> for maximum anonymity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="flex items-center justify-center mb-8">
                  <div className={`w-16 h-16 ${feature.bgColor} border border-gray-700 flex items-center justify-center transition-colors group-hover:border-gray-600`}>
                    <feature.icon className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                  </div>
                </div>
                <h3 className="text-2xl font-light text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-light text-white mb-12">
              Perfect for covert ops
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
              Ideal for situations requiring maximum privacy and zero digital footprint.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-8">
                  <useCase.icon className="w-16 h-16 text-blue-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-light text-white mb-4">
                  {useCase.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl lg:text-6xl font-light text-white mb-12">
              Ready to go stealth?
            </h2>
            <p className="text-xl text-gray-300 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
              Create anonymous forms with <strong>instant dual-link generation</strong>. Public sharing, private access.
            </p>
            <Link to="/create" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group">
              <Shield className="w-6 h-6 mr-3" />
              Launch Stealth Mode
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;