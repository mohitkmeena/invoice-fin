import React from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/Layout/PublicHeader';
import { 
  FileText, 
  Users, 
  CreditCard, 
  BarChart3, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowLeft,
  Smartphone,
  Mail,
  Globe,
  Clock,
  DollarSign,
  Bell
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Smart Invoice Creation',
      description: 'Create professional invoices in under 2 minutes with our intuitive interface.',
      features: [
        'Multi-item support with automatic calculations',
        'GST/tax auto-calculation',
        'Professional PDF generation',
        'Customizable invoice templates',
        'Bulk invoice creation'
      ]
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Maintain comprehensive client profiles with complete payment history.',
      features: [
        'Detailed client profiles with contact info',
        'Payment history and statistics',
        'Automated payment reminders',
        'Client tags and categorization',
        'Export client data'
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Accept payments through multiple channels with automated tracking.',
      features: [
        'UPI QR code generation',
        'Bank transfer details',
        'Payment confirmation workflow',
        'Automated receipt generation',
        'Payment method tracking'
      ]
    },
    {
      icon: BarChart3,
      title: 'Business Analytics',
      description: 'Get detailed insights into your business performance and revenue.',
      features: [
        'Revenue tracking and trends',
        'Top clients and products analysis',
        'Payment behavior insights',
        'Overdue invoice management',
        'Monthly/yearly reports'
      ]
    },
    {
      icon: Zap,
      title: 'Instant Sharing',
      description: 'Share invoices instantly through multiple channels.',
      features: [
        'WhatsApp direct sharing',
        'Email with PDF attachments',
        'Public invoice links',
        'Social media sharing',
        'Bulk sharing options'
      ]
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Bank-level security with complete data protection.',
      features: [
        'End-to-end encryption',
        'Secure cloud storage',
        'GDPR compliant',
        'Regular security audits',
        'Data backup and recovery'
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: 'Automated Reminders',
      description: 'Never miss a payment with automated follow-ups'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Access your invoices from anywhere, anytime'
    },
    {
      icon: Mail,
      title: 'Email Integration',
      description: 'Send invoices directly from your email client'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Available in multiple languages for global reach'
    },
    {
      icon: DollarSign,
      title: 'Multi-currency',
      description: 'Support for multiple currencies and exchange rates'
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Get instant updates on payment status'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Public Header */}
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="pt-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Powerful <span className="text-blue-600">Features</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              Everything you need to manage your invoices, track payments, and grow your business efficiently.
            </p>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              And Much More
            </h2>
            <p className="text-xl text-gray-600">
              Additional features that make InvoiceFlow the complete solution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see how InvoiceFlow can transform your business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">InvoiceFlow</span>
              </div>
              <p className="text-gray-400">
                The complete invoice management solution for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 InvoiceFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;