import React from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CopyProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
}

const Copy = React.forwardRef<HTMLButtonElement, CopyProps>(
  ({ className, ...props }, ref) => {
    const { text } = props
    const [copied, setCopied] = React.useState(false)

    const handleCopy = () => {
      navigator.clipboard.writeText(text)
      if (!copied) {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      }
    }

    return !copied ? (
      <CopyIcon
        className={cn('hover:text-gray-400 cursor-pointer', className)}
        onClick={() => {
          handleCopy()
        }}
      />
    ) : (
      <CheckIcon className={cn('text-success-600', className)} />
    )
  },
)

export { Copy }
