import React from 'react'

export default function Loading() {
  return (
    <>
      {/* Repeat 5 times to simulate multiple event cards */}
      {[...Array(10)].map((_, i) => (
        <div className='rounded-xl shadow-lg'>

        <div key={i} className="h-100 p-4 space-x-4 animate-pulse">
          {/* Thumbnail */}
          <div className="bg-gray-300 h-40 w-100 rounded-xl"></div>

          {/* Text content */}
          <div className="flex-1 space-y-2 py-1">
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            <div className="h-10 mt-10 bg-gray-300 rounded w-1/4 "></div>
          </div>
        </div>
        </div>
      ))}
    </>
  )
}