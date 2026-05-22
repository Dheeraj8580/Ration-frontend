import { useState, useEffect } from 'react'

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  return (
    <div className={`page-transition ${isVisible ? 'page-enter' : 'page-exit'}`}>
      {children}
    </div>
  )
}

export default PageTransition
