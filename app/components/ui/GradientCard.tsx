'use client'

import React, { ReactNode } from 'react'

interface GradientCardProps {
  children: ReactNode
  className?: string
}

export function GradientCard({ children, className = '' }: GradientCardProps) {
  return (
    <div
      className={`bg-gradient-to-r from-orange-500 to-orange-300 text-white rounded-2xl shadow-md p-6 ${className}`}
    >
      {children}
    </div>
  )
}
