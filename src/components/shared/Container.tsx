import type { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Single layout container: max width + gutters 16/24/36. */
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-9 ${className}`}>
      {children}
    </div>
  )
}
