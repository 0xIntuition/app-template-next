import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  endAdornment?: React.ReactNode
  startAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startAdornment, endAdornment, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex rounded-md bg-background border border-border pr-2',
          className,
        )}
      >
        {!!startAdornment && (
          <div className="flex m-auto items-center">{startAdornment}</div>
        )}
        <input
          type={type}
          className="flex h-8 w-full rounded-md bg-background px-2 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-2"
          ref={ref}
          {...props}
        />

        {!!endAdornment && (
          <div className="flex m-auto items-center">{endAdornment}</div>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
