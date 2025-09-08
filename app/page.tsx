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
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <header className="bg-yellow-500 text-black text-center py-20">
        <h1 className="text-5xl font-bold">Welcome to 4Taxis</h1>
        <p className="text-xl mt-4">Discover and share taxi routes in your city.</p>
      </header>

      <main className="container mx-auto p-8">
        {/* How it works */}
        <section className="my-16">
          <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-500 mb-2">1. Find Your Route</h3>
              <p className="text-gray-300">Browse through a list of community-contributed taxi routes.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-500 mb-2">2. View Stops</h3>
              <p className="text-gray-300">See detailed information about each stop, including hand signals and wait spots.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-500 mb-2">3. Contribute</h3>
              <p className="text-gray-300">Add new stops to existing routes and earn rewards for your contributions.</p>
            </div>
          </div>
        </section>

        {/* Available Routes */}
        <section>
          <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8">Available Routes</h2>
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
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500">
        <p>&copy; 2024 4Taxis. All rights reserved.</p>
      </footer>
    </div>
  );
}