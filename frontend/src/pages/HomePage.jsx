import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket,
  ArrowRight,
  Shield,
  Timer,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  UserX,
  Database,
  Zap,
  MessageSquare,
  BarChart3,
  FileText
} from 'lucide-react';

const HomePage = () => {

  const features = [
    {
      title: 'No Registration',
      description: 'Create forms instantly without any account or login required.',
      icon: UserX,
    },
    {
      title: 'Auto-Delete',
      description: 'Forms automatically disappear after your set time limit.',
      icon: Timer,
    },
    {
      title: 'Zero Tracking',
      description: 'No cookies, no analytics, no data collection about users.',
      icon: EyeOff,
    },
    {
      title: 'Private by Design',
      description: 'Built from ground up with privacy as the core principle.',
      icon: Shield,
    },
    {
      title: 'Lightning Fast',
      description: 'Minimal interface for quick form creation and sharing.',
      icon: Zap,
    },
    {
      title: 'No Database Storage',
      description: 'Responses are temporarily held then permanently deleted.',
      icon: Database,
    },
  ];

  const useCases = [
    {
      title: 'Anonymous Feedback',
      description: 'Collect honest feedback without revealing identities',
      icon: MessageSquare,
    },
    {
      title: 'Quick Surveys',
      description: 'Gather opinions for immediate decision making',
      icon: BarChart3,
    },
    {
      title: 'Sensitive Data',
      description: 'Handle confidential information with automatic cleanup',
      icon: Lock,
    },
  ];

  const stats = [
    { label: 'No Accounts', value: '0', icon: UserX },
    { label: 'Data Stored', value: '0%', icon: Database },
    { label: 'Tracking', value: 'None', icon: EyeOff },
    { label: 'Forms Created', value: 'Growing', icon: Zap },
  ];

  return (
    <div className="relative min-h-screen">
      {/* DRAMATIC Black Hole Background - You WILL see this! */}
      <div 
        className="fixed inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.3) 30%, transparent 70%),
            radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
            linear-gradient(45deg, #0a0a23 0%, #1a0033 25%, #000066 50%, #330066 75%, #0a0a23 100%)
          `
        }}
      />
      
      {/* VISIBLE Cosmic Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Massive Central Vortex */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Bright Spinning Disk */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[150px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent rounded-full blur-xl animate-spin" style={{animationDuration: '10s'}}></div>
        
        {/* Bright Cosmic Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/40 rounded-full blur-2xl animate-pulse" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-400/35 rounded-full blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-3/4 left-1/6 w-32 h-32 bg-blue-400/50 rounded-full blur-xl animate-pulse" style={{animationDuration: '2s'}}></div>
        <div className="absolute top-1/6 right-1/3 w-40 h-40 bg-yellow-400/30 rounded-full blur-xl animate-pulse" style={{animationDuration: '5s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Brand Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30"
              >
                <Shield className="w-5 h-5 text-gray-700" />
                <span className="text-gray-800 font-medium">StealthForm</span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Forms That
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Stay Hidden
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
                Create anonymous forms that collect responses invisibly and vanish without a trace. 
                No accounts, no tracking, no permanent footprint.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/create" className="group bg-white text-blue-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center">
                  <Rocket className="w-6 h-6 mr-2" />
                  Create Stealth Form
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Learn About Privacy
                </button>
              </div>
            </motion.div>
          </div>
        </section>



        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light text-white mb-8">
                Stealth by Design
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Every feature built to protect anonymity and ensure complete data cleanup
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light text-white mb-8">
                Perfect for Sensitive Data
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                When privacy matters most, StealthForm delivers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center bg-gray-700 p-8 rounded-lg"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <useCase.icon className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {useCase.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light text-white mb-8">
                Simple & Anonymous
              </h2>
              <p className="text-xl text-gray-300 font-light">
                Three steps to invisible data collection
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: '1',
                  title: 'Create Invisibly',
                  description: 'Build your form without any registration or personal information',
                  icon: Lock,
                },
                {
                  step: '2',
                  title: 'Share Secretly',
                  description: 'Get anonymous links that reveal nothing about the creator',
                  icon: Eye,
                },
                {
                  step: '3',
                  title: 'Vanish Completely',
                  description: 'Everything disappears automatically - no traces left behind',
                  icon: Trash2,
                },
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl lg:text-5xl font-light text-white mb-8">
                Ready to go stealth?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Create your first anonymous form and experience true privacy
              </p>
              <Link to="/create" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center">
                Get Started
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;