'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import MintButton from '@/app/components/MintButton';

const Map = dynamic(() => import('@/app/components/Map'), { ssr: false });

interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
  description: string;
  hand_signal: string;
  recommended_wait_spot: string;
}

interface Route {
  id: string;
  title: string;
  city: string;
  stops: Stop[];
}

export default function RouteDetailPage() {
  const params = useParams();
  const { id } = params;
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<Stop[]>([]);

  useEffect(() => {
    if (id) {
      fetch('/routes.json')
        .then((res) => res.json())
        .then((data) => {
          const currentRoute = data.routes.find((r: Route) => r.id === id);
          setRoute(currentRoute || null);
          setLoading(false);
        });
    }
  }, [id]);

  const handleAddStop = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newStop: Stop = {
      id: `new-stop-${contributions.length + 1}`,
      name: form.stopName.value,
      description: form.description.value,
      lat: parseFloat(form.latitude.value),
      lon: parseFloat(form.longitude.value),
      hand_signal: form.handSignal.value,
      recommended_wait_spot: form.waitSpot.value,
    };
    setContributions([...contributions, newStop]);
    form.reset();
  };

  const handleShare = (stop: Stop) => {
    const shareUrl = `${window.location.origin}/routes/${route?.id}#${stop.id}`;
    navigator.clipboard.writeText(`Check out this taxi stop: ${stop.name} at ${shareUrl}`)
      .then(() => alert('Copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!route) {
    return <div className="text-center mt-10">Route not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-yellow-500 mb-4">{route.title}</h1>
      <p className="text-lg text-gray-300 mb-6">{route.city}</p>

      <div className="h-96 w-full mb-8">
        <Map stops={route.stops} />
      </div>

      <div className="mb-8">
        <MintButton />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Stops</h2>
        <div className="space-y-4">
          {route.stops.map((stop) => (
            <div key={stop.id} id={stop.id} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-500">{stop.name}</h3>
              <p className="text-gray-400 mt-2">{stop.description}</p>
              <div className="mt-4">
                <p className="font-semibold text-gray-300">Hand Signal:</p>
                <p className="text-gray-400">{stop.hand_signal}</p>
              </div>
              <div className="mt-2">
                <p className="font-semibold text-gray-300">Wait Spot:</p>
                <p className="text-gray-400">{stop.recommended_wait_spot}</p>
              </div>
              <button onClick={() => handleShare(stop)} className="mt-4 bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">Share</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Contribute a New Stop</h2>
        <form onSubmit={handleAddStop} className="bg-gray-800 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="stopName" placeholder="Stop Name" required className="bg-gray-700 text-white p-2 rounded-lg" />
            <input type="text" name="description" placeholder="Description" required className="bg-gray-700 text-white p-2 rounded-lg" />
            <input type="number" step="any" name="latitude" placeholder="Latitude" required className="bg-gray-700 text-white p-2 rounded-lg" />
            <input type="number" step="any" name="longitude" placeholder="Longitude" required className="bg-gray-700 text-white p-2 rounded-lg" />
            <input type="text" name="handSignal" placeholder="Hand Signal" required className="bg-gray-700 text-white p-2 rounded-lg" />
            <input type="text" name="waitSpot" placeholder="Recommended Wait Spot" required className="bg-gray-700 text-white p-2 rounded-lg" />
          </div>
          <button type="submit" className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Add Stop</button>
        </form>
      </div>

      {contributions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">New Contributions</h2>
          <div className="space-y-4">
            {contributions.map((stop) => (
              <div key={stop.id} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-yellow-500">{stop.name}</h3>
                <p className="text-gray-400 mt-2">{stop.description}</p>
                <div className="mt-4">
                  <p className="font-semibold text-gray-300">Hand Signal:</p>
                  <p className="text-gray-400">{stop.hand_signal}</p>
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-gray-300">Wait Spot:</p>
                  <p className="text-gray-400">{stop.recommended_wait_spot}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}