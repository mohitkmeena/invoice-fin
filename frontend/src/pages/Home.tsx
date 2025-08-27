import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap, 
  DollarSign, 
  Clock, 
  FileText, 
  BarChart3,
  Star,
  Award,
  Globe,
  Building2,
  CreditCard,
  Lock,
  Target,
  Rocket,
  Mail
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Bank-grade security with full regulatory compliance and KYC verification"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "AI-powered insights and real-time market analysis for better decisions"
    },
    {
      icon: Users,
      title: "Global Network",
      description: "Connect with verified lenders and borrowers worldwide"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Complete transactions in minutes, not days with automated processing"
    },
    {
      icon: DollarSign,
      title: "Competitive Rates",
      description: "Best-in-class interest rates and transparent fee structures"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support and technical assistance"
    }
  ];

  const benefits = [
    "Instant invoice financing approval",
    "No hidden fees or charges",
    "Flexible repayment terms",
    "Real-time transaction tracking",
    "Multi-currency support",
    "Advanced fraud protection",
    "Seamless API integration",
    "Comprehensive reporting"
  ];

  const stats = [
    { number: "₹50Cr+", label: "Total Funding", icon: DollarSign },
    { number: "1000+", label: "Active Users", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "<24hrs", label: "Processing Time", icon: Clock }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Upload Invoice",
      description: "Simply upload your invoice PDF and fill in the details",
      icon: FileText
    },
    {
      step: "02",
      title: "Get Offers",
      description: "Receive multiple competitive offers from verified lenders",
      icon: BarChart3
    },
    {
      step: "03",
      title: "Choose & Accept",
      description: "Select the best offer and accept with one click",
      icon: CheckCircle
    },
    {
      step: "04",
      title: "Get Funded",
      description: "Receive funds directly to your account within 24 hours",
      icon: Rocket
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Tech Solutions Ltd",
      role: "CEO",
      content: "Invoice Finance transformed our cash flow. We got funding in hours, not weeks!",
      rating: 5,
      avatar: "RK"
    },
    {
      name: "Priya Sharma",
      company: "Global Exports",
      role: "Finance Director",
      content: "The platform is incredibly user-friendly and the rates are unbeatable.",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Amit Patel",
      company: "Innovation Corp",
      role: "Founder",
      content: "Finally, a fintech solution that actually works for small businesses.",
      rating: 5,
      avatar: "AP"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-teal-50 pt-20 pb-32">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-secondary-600/5 to-teal-600/5"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-br from-teal-400/20 to-primary-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary-600 rounded-full"></div>
          <div className="absolute top-40 right-40 w-3 h-3 bg-secondary-600 rounded-full"></div>
          <div className="absolute top-60 left-1/3 w-2 h-2 bg-teal-600 rounded-full"></div>
          <div className="absolute top-80 right-1/4 w-3 h-3 bg-primary-600 rounded-full"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Enhanced Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-100 rounded-full px-6 py-3 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-dark">Trusted by 1000+ businesses</span>
            </div>
            
            {/* Enhanced Hero Title */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 bg-clip-text text-transparent">
                Invoice Financing
              </span>
              <br />
              <span className="text-dark">Made Simple</span>
            </h1>
            
            {/* Enhanced Hero Description */}
            <p className="text-xl text-medium mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your invoices into immediate cash flow. Get funded in hours, not weeks, 
              with our AI-powered invoice financing platform.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/register" className="btn btn-primary btn-lg group shadow-glow hover:shadow-glow-hover">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link to="/#how-it-works" className="btn btn-outline btn-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white">
                How It Works
              </Link>
            </div>
            
            {/* Enhanced Trust Indicators */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-8 text-sm text-medium">
                <div className="flex items-center gap-2 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="group-hover:text-dark transition-colors duration-300">Bank-grade Security</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="group-hover:text-dark transition-colors duration-300">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <span className="group-hover:text-dark transition-colors duration-300">ISO Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="card glass hover:scale-110 transition-all duration-500 delay-100 group-hover:shadow-glow">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 via-secondary-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow group-hover:shadow-glow-hover">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-dark mb-2 group-hover:text-primary-600 transition-colors duration-300">{stat.number}</div>
                    <div className="text-medium font-medium group-hover:text-dark transition-colors duration-300">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark mb-4">
              How <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 bg-clip-text text-transparent">Invoice Financing</span> Works
            </h2>
            <p className="text-xl text-medium max-w-2xl mx-auto">
              Get funded in 4 simple steps. Our platform makes invoice financing 
              as easy as uploading a document.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  <div className="card glass text-center hover:scale-105 transition-all duration-500 delay-100 group-hover:shadow-glow">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-glow group-hover:shadow-glow-hover transition-all duration-300">
                      {step.step}
                    </div>
                    
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 via-secondary-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-primary-600" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary-600 transition-colors duration-300">{step.title}</h3>
                    <p className="text-medium leading-relaxed group-hover:text-dark transition-colors duration-300">{step.description}</p>
                  </div>
                  
                  {/* Enhanced connecting lines with gradients */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-teal-200 group-hover:from-primary-400 group-hover:via-secondary-400 group-hover:to-teal-400 transition-all duration-300"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-secondary-50/30 to-teal-50/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark mb-4">
              Why Choose <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 bg-clip-text text-transparent">Invoice Finance</span>
            </h2>
            <p className="text-xl text-medium max-w-2xl mx-auto">
              Built for modern businesses with cutting-edge technology and 
              industry-leading security standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card glass group hover:scale-105 transition-all duration-500 delay-100 group-hover:shadow-glow">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-secondary-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow group-hover:shadow-glow-hover">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-medium leading-relaxed group-hover:text-dark transition-colors duration-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50/50 via-white to-teal-50/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-dark mb-6">
                Benefits for <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 bg-clip-text text-transparent">Your Business</span>
              </h2>
              <p className="text-lg text-medium mb-8 leading-relaxed">
                Transform your business operations with our comprehensive invoice 
                financing solution designed for growth and efficiency.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-dark font-medium group-hover:text-primary-600 transition-colors duration-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to="/register" className="btn btn-primary btn-lg shadow-glow hover:shadow-glow-hover">
                  Start Your Journey
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="card bg-gradient-to-br from-primary-600 via-secondary-600 to-teal-600 text-white p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Target className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Smart Matching</h3>
                    <p className="text-primary-100">AI-powered lender matching</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <span>Processing Speed</span>
                    <span className="font-bold">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <span>Success Rate</span>
                    <span className="font-bold">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <span>Customer Satisfaction</span>
                    <span className="font-bold">4.9/5</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced floating elements with premium colors */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse shadow-glow"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 animate-pulse delay-1000 shadow-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-white via-primary-50/20 to-secondary-50/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark mb-4">
              What Our <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-teal-600 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-xl text-medium max-w-2xl mx-auto">
              Join thousands of satisfied businesses that have transformed 
              their cash flow with our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card glass group hover:scale-105 transition-all duration-500 delay-100 group-hover:shadow-glow">
                <div className="flex items-center gap-3 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" />
                  ))}
                </div>
                
                <p className="text-dark mb-6 leading-relaxed italic group-hover:text-primary-600 transition-colors duration-300">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-teal-500 rounded-full flex items-center justify-center shadow-glow group-hover:shadow-glow-hover transition-all duration-300">
                    <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-dark group-hover:text-primary-600 transition-colors duration-300">{testimonial.name}</div>
                    <div className="text-sm text-medium group-hover:text-dark transition-colors duration-300">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-secondary-600 to-teal-600 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-secondary-600/90 to-teal-600/90"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Cash Flow</span>?
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Join thousands of businesses that have already unlocked their 
              working capital with our innovative platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn bg-white text-primary-600 hover:bg-primary-50 btn-lg shadow-glow hover:shadow-glow-hover group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link to="/#how-it-works" className="btn btn-outline border-2 border-white/30 text-white hover:bg-white/20 btn-lg backdrop-blur-sm">
                Learn More
              </Link>
            </div>
            
            <div className="mt-8 text-primary-100 text-sm">
              <span>✓ No setup fees</span>
              <span className="mx-4">✓ No hidden charges</span>
              <span>✓ Instant approval</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-dark via-dark to-dark/95 text-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-secondary-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Invoice Finance
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Empowering businesses with innovative invoice financing solutions 
                for sustainable growth and success.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Globe, href: '#', label: 'Website' },
                  { icon: Mail, href: '#', label: 'Email' },
                  { icon: Users, href: '#', label: 'LinkedIn' }
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg flex items-center justify-center text-primary-300 hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all duration-300 group-hover:scale-110"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'How It Works', 'Security', 'API'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-primary-300 transition-colors duration-300 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-primary-300 transition-colors duration-300 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
              <ul className="space-y-3">
                {['Help Center', 'Documentation', 'Status', 'Contact Support', 'Community'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-primary-300 transition-colors duration-300 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Invoice Finance. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;