import { useState } from 'react'
import { 
  User, 
  LayoutDashboard, 
  Database, 
  CheckCircle, 
  ArrowRight,
  Shield,
  FileText,
  Smartphone
} from 'lucide-react'

const WorkflowIllustration = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredStep, setHoveredStep] = useState(null)

  const workflowSteps = [
    {
      id: 0,
      icon: User,
      title: 'User Login',
      description: 'Secure authentication',
      color: '#3b82f6'
    },
    {
      id: 1,
      icon: FileText,
      title: 'Application',
      description: 'Submit ration card request',
      color: '#8b5cf6'
    },
    {
      id: 2,
      icon: Database,
      title: 'Data Processing',
      description: 'Verify & process documents',
      color: '#f59e0b'
    },
    {
      id: 3,
      icon: LayoutDashboard,
      title: 'Dashboard Access',
      description: 'View status & manage card',
      color: '#10b981'
    },
    {
      id: 4,
      icon: Smartphone,
      title: 'Digital Card',
      description: 'Download & use e-ration card',
      color: '#ef4444'
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Main SVG Workflow */}
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-green-50 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-auto"
          style={{ maxHeight: '400px' }}
        >
          {/* Dynamic Gradients for Lines */}
          <defs>
          {workflowSteps.map((step, index) => {
            if (index === workflowSteps.length - 1) return null;
            return (
              <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={step.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={workflowSteps[index + 1].color} stopOpacity="0.8" />
              </linearGradient>
            );
          })}
          
          <filter id="greenGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feFlood floodColor="#10b981" floodOpacity="0.4"/>
            <feComposite in2="coloredBlur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="hoverGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feFlood floodColor="#10b981" floodOpacity="0.6"/>
            <feComposite in2="coloredBlur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection Lines and Arrows */}
        {workflowSteps.map((step, index) => {
          if (index === workflowSteps.length - 1) return null;
          const startX = 120 + (index * 240) + 55; // Start after circle + padding
          const endX = 120 + ((index + 1) * 240) - 55; // End before next circle - padding
          const midX = 120 + (index * 240) + 120; // Exact middle between the two circles
          
          return (
            <g key={`arrow-${index}`}>
              <path
                d={`M ${startX} 200 L ${endX} 200`}
                stroke={`url(#grad-${index})`}
                strokeWidth="4"
                fill="none"
                strokeDasharray="8,6"
                className="animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
              <polygon 
                points={`${midX - 8},192 ${midX + 8},200 ${midX - 8},208`} 
                fill={workflowSteps[index + 1].color}
                className="animate-pulse" 
                style={{ animationDelay: `${index * 0.2}s` }} 
              />
            </g>
          );
        })}

          {/* Workflow Steps */}
          {workflowSteps.map((step, index) => {
            const Icon = step.icon
            const x = 120 + (index * 240)
            const isActive = activeStep === step.id
            const isHovered = hoveredStep === step.id
            
            return (
              <g 
                key={step.id} 
                onMouseEnter={() => {
                  setActiveStep(step.id)
                  setHoveredStep(step.id)
                }}
                onMouseLeave={() => setHoveredStep(null)}
                className="cursor-pointer"
              >
                {/* Hover Background Circle */}
                {isHovered && (
                  <circle
                    cx={x}
                    cy="200"
                    r="55"
                    fill="#10b981"
                    fillOpacity="0.1"
                    className="transition-all duration-300"
                  />
                )}
                
                {/* Step Circle */}
                <circle
                  cx={x}
                  cy="200"
                  r={isHovered ? "48" : "45"}
                  fill={isActive ? step.color : '#ffffff'}
                  stroke={isHovered ? '#10b981' : step.color}
                  strokeWidth={isHovered ? "4" : "3"}
                  className="transition-all duration-300 ease-out"
                  filter={isHovered ? 'url(#hoverGlow)' : (isActive ? 'url(#greenGlow)' : '')}
                  style={{
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                    transformOrigin: `${x}px 200px`
                  }}
                />
                
                {/* Icon */}
                <foreignObject 
                  x={x - 20} 
                  y={180} 
                  width="40" 
                  height="40"
                  style={{
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transformOrigin: `${x}px 200px`,
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  <div className={`flex items-center justify-center ${isActive ? 'text-white' : ''}`}>
                    <Icon 
                      size={24} 
                      style={{ 
                        color: isActive ? '#ffffff' : step.color,
                        filter: isHovered ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' : 'none'
                      }} 
                    />
                  </div>
                </foreignObject>
                
                {/* Title */}
                <text
                  x={x}
                  y="270"
                  textAnchor="middle"
                  className={`font-semibold transition-all duration-300 select-none ${
                    isHovered ? 'fill-green-700' : (isActive ? 'fill-slate-900' : 'fill-slate-600')
                  }`}
                  fontSize={isHovered ? "15" : "14"}
                  style={{
                    filter: isHovered ? 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))' : 'none'
                  }}
                >
                  {step.title}
                </text>
                
                {/* Description */}
                <text
                  x={x}
                  y="290"
                  textAnchor="middle"
                  className={`text-sm transition-all duration-300 select-none ${
                    isHovered ? 'text-green-600' : (isActive ? 'text-blue-700' : 'text-slate-500')
                  }`}
                  fontSize="12"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 1px 2px rgba(16, 185, 129, 0.2))' : 'none'
                  }}
                >
                  {step.description}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      
      {/* Security Badge */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-full transition-all duration-300 hover:border-green-400 hover:shadow-lg hover:shadow-green-200/50 hover:scale-105 cursor-default">
          <Shield className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-sm font-medium text-green-800">End-to-End Encrypted & Secure Process</span>
        </div>
      </div>
    </div>
  )
}

export default WorkflowIllustration
