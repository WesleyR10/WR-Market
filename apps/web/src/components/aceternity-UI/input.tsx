// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input
'use client'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 100 // raio do efeito hover
    const [visible, setVisible] = React.useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function handleMouseMove(
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) {
      const { currentTarget, clientX, clientY } = event
      const { left, top } = currentTarget.getBoundingClientRect()

      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    }
    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
              var(--emerald-300),
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[2px] transition duration-300"
      >
        <input
          type={type}
          className={cn(
            `duration-400 flex h-10 w-full rounded-md border-none bg-white/90 px-3 py-2 text-sm
            text-emerald-950 shadow-input transition file:border-0 file:bg-transparent 
            file:text-sm file:font-medium placeholder:text-emerald-400
            focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-emerald-500
            disabled:cursor-not-allowed disabled:opacity-50 
            group-hover/input:shadow-none
            dark:bg-white/80 dark:text-emerald-950 
            dark:shadow-[0px_0px_1px_1px_var(--emerald-200)]
            dark:focus-visible:ring-emerald-400`,
            className,
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
