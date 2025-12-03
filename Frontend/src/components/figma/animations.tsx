import React from 'react'
import { motion, useReducedMotion } from 'motion/react'

type FadeInProps = {
  delay?: number
  duration?: number
  y?: number
  children: React.ReactNode
  className?: string
}

export function FadeIn({ delay = 0, duration = 0.6, y = 20, children, className }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  delayChildren?: number
  staggerChildren?: number
  className?: string
  children: React.ReactNode
}

export function Stagger({ delayChildren = 0.1, staggerChildren = 0.06, className, children }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export const itemVariant = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

type ScaleOnHoverProps = React.ComponentProps<typeof motion.div>
export function ScaleOnHover({ children, className, ...rest }: ScaleOnHoverProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export const hoverCard = {
  rest: { y: 0, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' },
  hover: { y: -6, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
}
