// import React from 'react'

// export default function SubFeed() {
//     return (
//         <main>
//             <div className="flex flex-col sticky top-0 ">
//                 <h2 className="text-lg font-bold text-gray-800 m-0 ">
//                     Honest Stories
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                     Top rants & reviews from around the world.
//                 </p>
//             </div>
//         </main>
//     )
// }


// 'use client';

// import { useState, FormEvent } from 'react';

// interface FiltersProps {
//     filters: { tag?: string; country?: string };
//     onChange: (newFilters: { tag?: string; country?: string }) => void;
// }

// export default function Filters({ filters, onChange }: FiltersProps) {
//     const [tag, setTag] = useState(filters.tag || '');
//     const [country, setCountry] = useState(filters.country || '');

//     const handleSubmit = (e: FormEvent) => {
//         e.preventDefault();
//         onChange({ tag: tag || undefined, country: country || undefined });
//     };

//     return (
//         <form onSubmit={handleSubmit} className="flex space-x-2">
//             <input
//                 type="text"
//                 placeholder="Tag (e.g., tech)"
//                 value={tag}
//                 onChange={(e) => setTag(e.target.value)}
//                 className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//                 type="text"
//                 placeholder="Country (e.g., US)"
//                 value={country}
//                 onChange={(e) => setCountry(e.target.value.toUpperCase())}
//                 className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 maxLength={3}
//             />
//             <button
//                 type="submit"
//                 className="px-4 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//                 Filter
//             </button>
//         </form>
//     );
// }