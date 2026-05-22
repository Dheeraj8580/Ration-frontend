export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
    </div>
  )
}
