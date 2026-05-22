import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TrackApplicationModal from '../components/TrackApplicationModal'
import { useAuth } from '../context/AuthContext'
import { 
  FileText, 
  Clock, 
  Shield, 
  Smartphone, 
  Users, 
  CheckCircle,
  ArrowRight,
  Download,
  Search,
  LayoutDashboard
} from 'lucide-react'

const Home = () => {
  const { isLoggedIn, user } = useAuth()
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false)

  const features = [
    {
      icon: FileText,
      title: 'Easy Application',
      description: 'Apply for your ration card online with a simple, user-friendly form. No paperwork required.',
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Track your application status in real-time. Get instant updates on every step.',
    },
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'Your data is encrypted and secure. Transparent process ensures fairness for all.',
    },
    {
      icon: Smartphone,
      title: 'Digital Card',
      description: 'Download your digital ration card instantly. Access it anytime, anywhere on your phone.',
    },
    {
      icon: Users,
      title: 'Family Management',
      description: 'Manage your entire family ration details in one place. Add or update members easily.',
    },
    {
      icon: CheckCircle,
      title: 'Quick Approval',
      description: 'Fast verification process with digital document submission and validation.',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Register Account',
      description: 'Create your account with basic details and valid mobile number for verification.',
      icon: Users,
    },
    {
      number: '02',
      title: 'Fill Application',
      description: 'Complete the online application form with your personal and family details.',
      icon: FileText,
    },
    {
      number: '03',
      title: 'Upload Documents',
      description: 'Upload required documents like ID proof, address proof, and photographs.',
      icon: Download,
    },
    {
      number: '04',
      title: 'Track & Receive',
      description: 'Track your application status and download your digital ration card upon approval.',
      icon: Search,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium animate-slide-in-left">
                <span className="w-2 h-2 bg-success-400 rounded-full mr-2 animate-pulse"></span>
                Government Approved Digital System
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Digital Ration Card
                <span className="block text-primary-200 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Distribution System</span>
              </h1>
              <p className="text-lg lg:text-xl text-primary-100 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                Apply, track, and manage your ration card digitally. A modern solution for transparent and efficient public distribution.
              </p>
              <div className="flex flex-wrap items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                {isLoggedIn ? (
                  <>
                    <Link
                      to={user?.role === 'admin' ? "/admin" : "/dashboard"}
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Go to Dashboard
                      <LayoutDashboard className="ml-2 w-5 h-5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up"
                      style={{ animationDelay: '1.2s' }}
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => setIsTrackModalOpen(true)}
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary-500/30 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-primary-500/50 transition-all duration-300 border border-white/20 transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '1.4s' }}
                    >
                      Track Application
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-8 text-sm text-primary-200">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>100% Digital</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>24/7 Access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Secure</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:flex lg:justify-end xl:justify-center relative w-full">
              <div className="absolute -inset-10 bg-primary-400/20 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute -inset-5 bg-gradient-to-br from-primary-300/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-400/20 to-transparent rounded-3xl blur-2xl group-hover:from-primary-400/40 transition-all duration-500"></div>
                <img 
                  src="/images/home_hero.png" 
                  alt="Digital Ration System" 
                  className="relative w-full max-w-lg h-auto rounded-[2rem] shadow-2xl border-4 border-white/10 transform transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-3xl group-hover:border-white/20"
                />
                {/* Floating particles around image */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
                <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-white/15 rounded-full blur-md animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}></div>
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-white/25 rounded-full blur-sm animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#f8fafc">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4">
              Quick Access
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Our Digital Services
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Access the most frequently used public services directly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Download Card */}
            <Link 
              to="/digital-ration-card"
              className="group relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] hover:border-primary-200 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-primary-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 w-20 h-20 bg-primary-50 text-primary-600 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-500 shadow-sm border border-primary-100 group-hover:border-transparent">
                <Download className="w-10 h-10 transition-colors duration-300" />
              </div>
              <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                Download E-Ration Card
              </h3>
              <p className="relative z-10 text-slate-600 text-lg leading-relaxed group-hover:text-slate-700 transition-colors">
                Get an instant digital copy of your approved ration card. Valid for all official purposes.
              </p>
              
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-100 rounded-full opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700 ease-out z-0"></div>
            </Link>

            {/* Track Status Card */}
            <button 
              onClick={() => setIsTrackModalOpen(true)}
              className="group relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] hover:border-success-200 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-success-500/5 via-success-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 w-20 h-20 bg-success-50 text-success-600 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-success-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-500 shadow-sm border border-success-100 group-hover:border-transparent">
                <Search className="w-10 h-10 transition-colors duration-300" />
              </div>
              <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-4 group-hover:text-success-600 transition-colors duration-300">
                Track Application Status
              </h3>
              <p className="relative z-10 text-slate-600 text-lg leading-relaxed group-hover:text-slate-700 transition-colors">
                Check the real-time processing status of your new ration card or update application.
              </p>

              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-success-100 rounded-full opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700 ease-out z-0"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Cards Issued' },
              { value: '99%', label: 'Satisfaction' },
              { value: '24hr', label: 'Avg. Processing' },
              { value: '100%', label: 'Digital' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <p className="text-3xl font-bold text-primary-600 group-hover:text-primary-700 transition-colors">{stat.value}</p>
                <p className="text-sm text-slate-600 mt-1 group-hover:text-slate-700 transition-colors">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience a seamless, transparent, and efficient way to manage your ration card needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const colorPalettes = [
                { // Blue
                  iconBg: 'bg-blue-50 text-blue-600 border-blue-100', 
                  hoverIcon: 'group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] group-hover:border-transparent',
                  hoverBorder: 'hover:border-blue-200',
                  hoverShadow: 'hover:shadow-[0_20px_40px_rgba(59,130,246,0.12)]',
                  gradient: 'from-blue-500/5 via-blue-500/0',
                  titleHover: 'group-hover:text-blue-600',
                  accent: 'bg-blue-100'
                },
                { // Amber
                  iconBg: 'bg-amber-50 text-amber-600 border-amber-100', 
                  hoverIcon: 'group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] group-hover:border-transparent',
                  hoverBorder: 'hover:border-amber-200',
                  hoverShadow: 'hover:shadow-[0_20px_40px_rgba(245,158,11,0.12)]',
                  gradient: 'from-amber-500/5 via-amber-500/0',
                  titleHover: 'group-hover:text-amber-600',
                  accent: 'bg-amber-100'
                },
                { // Emerald
                  iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
                  hoverIcon: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:border-transparent',
                  hoverBorder: 'hover:border-emerald-200',
                  hoverShadow: 'hover:shadow-[0_20px_40px_rgba(16,185,129,0.12)]',
                  gradient: 'from-emerald-500/5 via-emerald-500/0',
                  titleHover: 'group-hover:text-emerald-600',
                  accent: 'bg-emerald-100'
                },
                { // Purple
                  iconBg: 'bg-purple-50 text-purple-600 border-purple-100', 
                  hoverIcon: 'group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:border-transparent',
                  hoverBorder: 'hover:border-purple-200',
                  hoverShadow: 'hover:shadow-[0_20px_40px_rgba(168,85,247,0.12)]',
                  gradient: 'from-purple-500/5 via-purple-500/0',
                  titleHover: 'group-hover:text-purple-600',
                  accent: 'bg-purple-100'
                },
                { // Rose
                  iconBg: 'bg-rose-50 text-rose-600 border-rose-100', 
                  hoverIcon: 'group-hover:bg-rose-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(225,29,72,0.4)] group-hover:border-transparent',
                  hoverBorder: 'hover:border-rose-200',
                  hoverShadow: 'hover:shadow-[0_20px_40px_rgba(225,29,72,0.12)]',
                  gradient: 'from-rose-500/5 via-rose-500/0',
                  titleHover: 'group-hover:text-rose-600',
                  accent: 'bg-rose-100'
                },
                { // Cyan
                  iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100', 
                  hoverIcon: 'group-hover:bg-cyan-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(8,145,178,0.4)] group-hover:border-transparent',
                  hoverBorder: 'hover:border-cyan-200',
                  hoverShadow: 'hover:shadow-[0_20px_40px_rgba(8,145,178,0.12)]',
                  gradient: 'from-cyan-500/5 via-cyan-500/0',
                  titleHover: 'group-hover:text-cyan-600',
                  accent: 'bg-cyan-100'
                }
              ];
              const palette = colorPalettes[index];

              return (
                <div
                  key={index}
                  className={`group relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden animate-fade-in-up ${palette.hoverBorder} ${palette.hoverShadow}`}
                  style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                >
                  {/* Subtle Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${palette.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Content Container */}
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center mb-8 border transition-all duration-500 group-hover:scale-110 ${palette.iconBg} ${palette.hoverIcon}`}>
                      <feature.icon className="w-8 h-8 transition-colors duration-300" />
                    </div>
                    
                    <h3 className={`text-2xl font-bold text-slate-900 mb-4 transition-colors duration-300 ${palette.titleHover}`}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed text-lg group-hover:text-slate-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative corner accent */}
                  <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700 ease-out z-0 ${palette.accent}`}></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-success-100 text-success-700 text-sm font-medium rounded-full mb-4">
              Process
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              How the System Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
              Get your digital ration card in just 4 simple steps. No hassle, no waiting in queues.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
                <div className="relative z-10 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group-hover:border-primary-200 overflow-hidden">
                  {/* Decorative background circle */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-50 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 ease-out z-0"></div>
                  
                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <span className="text-5xl font-black text-slate-100 group-hover:text-primary-100 transition-colors duration-500">{step.number}</span>
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center shadow-sm border border-primary-100 group-hover:scale-110 group-hover:bg-primary-600 group-hover:border-transparent group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-500">
                      <step.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="relative z-10 text-slate-600 text-sm leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Teaser */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4">
                Our Vision
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                A Corruption-Free & Efficient Distribution System
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We are committed to ensuring food security for every citizen through a robust digital 
                infrastructure. Our system eliminates leakages and makes public distribution 
                accessible to all eligible beneficiaries.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors group"
              >
                Learn more about our mission
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-200/20 rounded-[3rem] blur-2xl"></div>
              <img 
                src="/images/home_vision.png" 
                alt="Digital Secure System" 
                className="relative w-full h-auto rounded-[2rem] shadow-xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Get Your Digital Ration Card?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of citizens who have already benefited from our digital system. Apply now and experience the convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <Link
                  to={user?.role === 'admin' ? "/admin" : "/dashboard"}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => setIsTrackModalOpen(true)}
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-400 transition-all duration-200 border border-white/20"
                  >
                    Track Application
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <TrackApplicationModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
    </div>
  )
}

export default Home
