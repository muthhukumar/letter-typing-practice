import * as React from 'react'

export default function Letter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-w-[96px] min-h-[96px] mx-auto my-8 bg-gray-700 rounded-full fit-content">
      <p className="flex items-center justify-center text-6xl font-bold">{children}</p>
    </div>
  )
}
