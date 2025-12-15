import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto py-4 px-5 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} BeHonest. All rights reserved.
      </div>
      <div>
        V0.2.1
      </div>
    </footer>
  )
}
