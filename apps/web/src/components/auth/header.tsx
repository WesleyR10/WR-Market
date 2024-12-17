import React from 'react'

type HeaderProps = {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  align = 'left',
}) => {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  return (
    <>
      <h2
        className={`text-xl font-bold text-emerald-900 dark:text-emerald-900 ${alignClass}`}
      >
        {title}
      </h2>
      <p
        className={`mt-2 max-w-sm text-sm text-emerald-700 dark:text-emerald-800 ${alignClass} ${align === 'center' ? 'mx-auto' : ''}`}
      >
        {subtitle}
      </p>
    </>
  )
}
