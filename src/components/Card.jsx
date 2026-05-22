const Card = ({ 
  children, 
  className = '', 
  title,
  subtitle,
  icon: Icon,
  action,
  actionLabel,
  onAction,
  padding = 'normal'
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-5',
    normal: 'p-7',
    large: 'p-9'
  }

  return (
    <div className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-slate-300 overflow-hidden ${className}`}>
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {(title || Icon) && (
        <div className="relative z-10 px-6 py-5 border-b border-slate-100/50 flex items-center justify-between bg-white/50 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            {Icon && (
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shadow-sm border border-primary-100 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] group-hover:border-transparent">
                <Icon className="w-7 h-7 transition-colors duration-300" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors duration-300">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-slate-600 font-medium group-hover:text-slate-700 transition-colors duration-300">{subtitle}</p>
              )}
            </div>
          </div>
          {action && onAction && (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)] transform hover:-translate-y-0.5 active:scale-95"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
      <div className={`relative z-10 ${paddingClasses[padding]}`}>
        {children}
      </div>
    </div>
  )
}

export default Card
