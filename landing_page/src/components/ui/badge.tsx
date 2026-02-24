import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors',
        variant === 'default' && 'bg-brand-600/10 text-brand-400 border-brand-600/20',
        variant === 'outline' && 'bg-transparent border-dark-border text-gray-400',
        className
      )}
    >
      {children}
    </span>
  )
}
