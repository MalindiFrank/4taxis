'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Route {
  id: string;
  title: string;
  city: string;
}

export default function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    fetch('/routes.json')
      .then((res) => res.json())
      .then((data) => setRoutes(data.routes));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-yellow-500 mb-8">Taxi Connect</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => (
          <Link key={route.id} href={`/routes/${route.id}`}>
            <div className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
              <h2 className="text-2xl font-bold text-yellow-400">{route.title}</h2>
              <p className="text-gray-300">{route.city}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}