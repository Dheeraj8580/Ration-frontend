import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WorkflowIllustration from '../components/WorkflowIllustration'
import {
  FileText,
  Shield,
  Clock,
  Users,
  Target,
  Award,
  Globe,
  Heart
} from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'End-to-end encrypted platform ensuring complete transparency in the ration distribution process.',
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Digital verification and automated workflows reduce processing time from weeks to days.',
    },
    {
      icon: Users,
      title: 'Citizen-Centric',
      description: 'Designed with user experience in mind, making it accessible to all citizens regardless of technical expertise.',
    },
    {
      icon: Globe,
      title: 'Nationwide Access',
      description: 'Available across all states and union territories with multi-language support.',
    },
  ]

  const stats = [
    { value: '50+', label: 'Million Cards Issued' },
    { value: '36', label: 'States & UTs Covered' },
    { value: '5L+', label: 'Fair Price Shops' },
    { value: '99.9%', label: 'System Uptime' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                About the System
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Transforming Public Distribution Through Technology
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed mb-8">
                The Digital Ration Card Distribution System is a modern initiative by the Government of India
                to digitize and streamline the public distribution system, making it more accessible,
                transparent, and efficient for all citizens.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-xs text-primary-200 uppercase tracking-wider">Digital</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <p className="text-2xl font-bold">Zero</p>
                  <p className="text-xs text-primary-200 uppercase tracking-wider">Paperwork</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
                <img 
                  src="/images/about_hero.png" 
                  alt="Digital Ration System" 
                  className="relative w-full h-auto rounded-3xl shadow-2xl border-4 border-white/10 transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Purpose & Goals</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Focused on bringing efficiency and transparency to every doorstep across the nation.</p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  To ensure food security for every citizen by creating a robust, transparent, and
                  efficient digital infrastructure for ration card distribution. We aim to eliminate
                  leakage and reduce processing time.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group md:mt-12">
                <div className="w-14 h-14 bg-success-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-success-200 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  A fully digitized public distribution system where every eligible citizen can
                  seamlessly access their entitled commodities. We envision a system
                  that is corruption-free and citizen-friendly.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <img 
                src="/images/mission_vision.png" 
                alt="Mission and Vision" 
                className="w-full h-auto rounded-3xl shadow-xl hover:rotate-2 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-slate-400 uppercase tracking-widest text-xs font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              How the System Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
              A streamlined process designed for efficiency and transparency
            </p>
            <div className="mb-16">
              <WorkflowIllustration />
            </div>

          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Registration',
                description: 'Citizens register on the platform with their Aadhaar and basic details.',
              },
              {
                step: '02',
                title: 'Application',
                description: 'Fill out the online application form with required family details.',
              },
              {
                step: '03',
                title: 'Verification',
                description: 'Documents are verified digitally by authorized officials.',
              },
              {
                step: '04',
                title: 'Distribution',
                description: 'Approved applicants receive their digital ration card instantly.',
              },
            ].map((item, index) => (
              <div key={index} className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
                <div className="relative z-10 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group-hover:border-primary-200 overflow-hidden">
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-50 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 ease-out z-0"></div>
                  
                  <div className="relative z-10 flex flex-col items-start mb-6">
                    <span className="text-6xl font-black text-slate-100 group-hover:text-primary-100 transition-colors duration-500 mb-4">{item.step}</span>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors duration-300">{item.title}</h3>
                  </div>
                  <p className="relative z-10 text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-success-600/10 blur-[100px] -ml-32 -mb-32"></div>
            
            <div className="relative flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                <Award className="w-10 h-10 text-primary-400" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 italic tracking-tight">Award-Winning Platform</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Recognized as one of the best <span className="text-white font-semibold underline decoration-primary-500 underline-offset-4">e-governance</span> initiatives,
                receiving multiple awards for innovation in public service.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {['Digital India Award 2023', 'Best e-Governance Project', 'Innovation in Public Service'].map((tag, i) => (
                  <span key={i} className="px-8 py-3 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full text-sm font-semibold hover:bg-white/10 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Government Partners */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Government Partners</h2>
            <div className="w-20 h-1.5 bg-primary-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-40 grayscale hover:grayscale-0 transition-all">
            {['Ministry of Consumer Affairs', 'National Informatics Centre', 'UIDAI', 'State Food Departments'].map((partner, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-default">
                <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>

  )
}

export default About
