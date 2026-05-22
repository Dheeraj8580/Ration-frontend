import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const StatusBadge = ({ status, size = 'md', showIcon = true }) => {
  const config = {
    pending: {
      bg: 'bg-warning-100',
      text: 'text-warning-700',
      border: 'border-warning-200',
      icon: Clock,
      label: 'Pending',
    },
    approved: {
      bg: 'bg-success-100',
      text: 'text-success-700',
      border: 'border-success-200',
      icon: CheckCircle,
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-danger-100',
      text: 'text-danger-700',
      border: 'border-danger-200',
      icon: XCircle,
      label: 'Rejected',
    },
    processing: {
      bg: 'bg-primary-100',
      text: 'text-primary-700',
      border: 'border-primary-200',
      icon: AlertCircle,
      label: 'Processing',
    },
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  const currentConfig = config[status] || config.pending
  const Icon = currentConfig.icon

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${currentConfig.bg}
        ${currentConfig.text}
        ${currentConfig.border}
        ${sizes[size]}
      `}
    >
      {showIcon && <Icon className="w-4 h-4 mr-1.5" />}
      {currentConfig.label}
    </span>
  )
}

export default StatusBadge
