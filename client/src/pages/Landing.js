import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiActivity, 
  FiCheckCircle, 
  FiBarChart2, 
  FiUsers, 
  FiZap,
  FiArrowRight,
  FiStar,
  FiTarget,
  FiClock,
  FiSun,
  FiMoon,
  FiMail,
  FiGithub
} from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();

  const features = [
    {
      icon: FiTarget,
      title: 'AI-Powered Task Processing',
      description: 'Create tasks using natural language and let AI understand context automatically.'
    },
    {
      icon: FiBarChart2,
      title: 'Smart Task Breakdown',
      description: 'Complex projects automatically broken down into manageable steps.'
    },
    {
      icon: FiZap,
      title: 'Intelligent Prioritization',
      description: 'AI-driven priority recommendations based on your work patterns.'
    },
    {
      icon: FiUsers,
      title: 'Cross-Platform Sync',
      description: 'Seamless experience across all your devices with real-time sync.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      content: 'TaskMind has revolutionized how I manage my daily tasks. The AI features are incredibly intuitive.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Software Developer',
      content: 'Finally, a task management tool that understands context. The natural language processing is amazing.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      content: 'The intelligent prioritization has helped me optimize my workflow like never before.',
      rating: 5
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'starry-bg' : 'bg-white'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900/80 border-slate-700/50' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiActivity className="text-white text-lg" />
              </div>
              <span className={`text-xl font-bold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                TaskMind
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'text-yellow-400 hover:bg-slate-800/50' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
              
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-slate-800/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
              isDark 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                : 'bg-blue-50 text-blue-600'
            }`}>
              <FiZap className="w-4 h-4" />
              <span>AI-Powered Task Management</span>
            </div>
            
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Think Smart.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                Work Smarter.
              </span>
            </h1>
            
            <p className={`text-xl mb-10 max-w-3xl mx-auto transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Transform how you organize and prioritize your work with intelligent automation, 
              natural language processing, and smart task insights.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-1"
              >
                <span>Start Free Trial</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className={`w-full sm:w-auto border-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:-translate-y-1 ${
                  isDark 
                    ? 'border-slate-600 text-gray-300 hover:border-slate-500 hover:bg-slate-800/30' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 relative z-10 ${isDark ? 'bg-slate-900/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Experience the future of task management
            </h2>
            <p className={`text-lg max-w-2xl mx-auto transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              AI-powered features designed to boost your productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    isDark 
                      ? 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 hover:shadow-blue-500/10' 
                      : 'bg-white shadow-sm hover:shadow-lg border border-gray-200'
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>10K+</div>
              <div className={`transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Active Users
              </div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>1M+</div>
              <div className={`transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Tasks Completed
              </div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>99.9%</div>
              <div className={`transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Uptime
              </div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>24/7</div>
              <div className={`transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 relative z-10 ${isDark ? 'bg-slate-900/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Loved by thousands of users
            </h2>
            <p className={`text-lg transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              See what our community has to say about TaskMind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  isDark 
                    ? 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70' 
                    : 'bg-white shadow-sm hover:shadow-lg border border-gray-200'
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`mb-4 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{testimonial.content}"
                </p>
                <div>
                  <div className={`font-semibold transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {testimonial.name}
                  </div>
                  <div className={`text-sm transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 transition-colors ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to boost your productivity?
          </h2>
          <p className={`text-lg mb-8 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of users who have transformed their workflow with TaskMind.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-1"
            >
              <span>Get Started Free</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className={`w-full sm:w-auto transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 ${
                isDark 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Try Demo</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 relative z-10 transition-all duration-300 ${
        isDark 
          ? 'border-slate-700/50 bg-slate-900/50' 
          : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <FiActivity className="text-white text-sm" />
              </div>
              <span className={`text-lg font-bold transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                TaskMind
              </span>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center space-x-6">
              <a
                href="mailto:mtoygarby@gmail.com"
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-slate-800/50 hover:shadow-blue-500/20' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Email"
              >
                <FiMail className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/mtogi/taskmind"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-slate-800/50 hover:shadow-blue-500/20' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="GitHub"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/toygaaar"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-slate-800/50 hover:shadow-blue-500/20' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="X (Twitter)"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
            </div>
            
            {/* Copyright */}
            <div className={`text-sm transition-colors ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              © 2025 TaskMind. All rights reserved. Built with ❤️ for productivity enthusiasts.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 