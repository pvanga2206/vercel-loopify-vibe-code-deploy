import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25',
          variant === 'secondary' && 'bg-dark-surface hover:bg-dark-card text-gray-200 border border-dark-border hover:border-dark-border-hover',
          variant === 'ghost' && 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200',
          variant === 'danger' && 'bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/20',
          size === 'sm' && 'px-3 py-1.5 text-sm gap-1.5',
          size === 'md' && 'px-4 py-2 text-sm gap-2',
          size === 'lg' && 'px-6 py-3 text-base gap-2',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
