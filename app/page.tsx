'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ConnectWallet from '@/components/ConnectWallet';

type Player = {
  id: string;
  name: string;
  age: number;
  position: string;
  height: string;
  weight: string;
  availability: boolean;
  injured: boolean;
  highlights?: string;
  score: number;
};

type Job = {
  id: string;
  title: string;
  club: string;
  location: string;
  salaryRange: string;
  deadline: string;
};

const MOCK_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Joseph Otieno',
    age: 19,
    position: 'Wing',
    height: '1.82 m',
    weight: '88 kg',
    availability: true,
    injured: false,
    highlights: 'ipfs://QmExample/otieno-highlights.mp4',
    score: 88,
  },
  {
    id: 'p2',
    name: 'Lilian Mwikali',
    age: 24,
    position: 'Flanker',
    height: '1.70 m',
    weight: '72 kg',
    availability: false,
    injured: true,
    highlights: 'ipfs://QmExample/mwikali-highlights.mp4',
    score: 78,
  },
  {
    id: 'p3',
    name: 'Samson Kamau',
    age: 27,
    position: 'Hooker',
    height: '1.78 m',
    weight: '95 kg',
    availability: true,
    injured: false,
    highlights: undefined,
    score: 82,
  },
];

const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Wing - Top Flight Club',
    club: 'Nairobi Lions RFC',
    location: 'Nairobi',
    salaryRange: 'KSH 60k - 120k',
    deadline: '2026-01-31',
  },
  {
    id: 'j2',
    title: 'Flanker (Short-term Contract)',
    club: 'Mombasa Waves',
    location: 'Mombasa',
    salaryRange: 'KSH 45k - 80k',
    deadline: '2026-02-10',
  },
];

export default function Page() {
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [jobs] = useState<Job[]>(MOCK_JOBS);
  const [selected, setSelected] = useState<Player | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, string[]>>({});

  function toggleAvailability(id: string) {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, availability: !p.availability } : p))
    );
  }

  function applyToJob(playerId: string, jobId: string) {
    setAppliedJobs((prev) => {
      const existing = prev[playerId] || [];
      if (existing.includes(jobId)) return prev;
      return { ...prev, [playerId]: [...existing, jobId] };
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold">
            RC
          </div>
          <div>
            <h1 className="text-lg font-semibold">RugbyCV Kenya</h1>
            <p className="text-xs text-gray-500">One on-chain profile. One source of truth.</p>
          </div>
        </div>
        <nav className="flex gap-4 items-center">
          <a className="text-sm hover:underline" href="#jobs">
            Jobs
          </a>
          <a className="text-sm hover:underline" href="#profiles">
            Profiles
          </a>
          <Link href="/my-profile" className="text-sm hover:underline">
            My Profile
          </Link>
          <ConnectWallet />
          <Link href="/create-profile">
            <button className="ml-2 rounded-md bg-indigo-600 text-white text-sm px-3 py-2 shadow hover:bg-indigo-700">
              Start Now
            </button>
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">
              One on-chain profile. One source of truth. Owned by the player, verified by the community.
            </h2>
            <p className="mt-4 text-gray-600">
              Join players, clubs, and scouts across Africa — verifiable, immutable profiles built for rugby.
            </p>

            <div className="mt-6 flex gap-3">
              <Link href="/create-profile">
                <button className="rounded-md bg-indigo-600 text-white px-4 py-2 shadow hover:bg-indigo-700">
                  Get Started Now
                </button>
              </Link>
              <a href="#jobs" className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:border-gray-300">
                Explore Jobs
              </a>
            </div>

            <div className="mt-8 bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Quick problem</h3>
              <p className="text-sm text-gray-600 mt-2">
                A 19-year-old beast from Kisumu dominates the Nationwide league → nobody in Nairobi hears about him.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Join 1,000+ Kenyan rugby players on Moonbase Alpha</p>
                <h3 className="text-xl font-bold mt-2">Ready to build your profile?</h3>
              </div>
              <div className="text-xs text-gray-400">Phase 1: MVP</div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full w-12 h-12 bg-indigo-50 flex items-center justify-center font-semibold">
                  🏉
                </div>
                <div>
                  <div className="text-sm font-medium">Player Profiles</div>
                  <div className="text-xs text-gray-500">Stats, availability, video highlights</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full w-12 h-12 bg-green-50 flex items-center justify-center font-semibold">
                  💼
                </div>
                <div>
                  <div className="text-sm font-medium">Job Board</div>
                  <div className="text-xs text-gray-500">Clubs post. Players apply. Transparent salaries.</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full w-12 h-12 bg-yellow-50 flex items-center justify-center font-semibold">
                  ✅
                </div>
                <div>
                  <div className="text-sm font-medium">Verification</div>
                  <div className="text-xs text-gray-500">Coach, KRU, community & blockchain badges</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features and lists */}
        <section id="profiles" className="mt-12">
          <h3 className="text-2xl font-bold">Key Features</h3>
          <p className="text-gray-600 mt-2">Everything a player and scout needs in one place.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold">Player Profiles</h4>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>✓ Height, weight, position</li>
                <li>✓ Performance stats</li>
                <li>✓ Availability toggle</li>
                <li>✓ Injury status</li>
                <li>✓ Video highlights (IPFS)</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold">Job Board</h4>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>✓ Clubs post openings</li>
                <li>✓ Players apply instantly</li>
                <li>✓ Salary transparency</li>
                <li>✓ Application tracking</li>
                <li>✓ Smart deadlines</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold">Verification Badges</h4>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>✓ Coach verified</li>
                <li>✓ KRU gold tick</li>
                <li>✓ Payment proof</li>
                <li>✓ Community endorsed</li>
                <li>✓ Blockchain verified</li>
              </ul>
            </div>
          </div>

          {/* Player cards */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold">Featured Players</h4>
              <div className="text-sm text-gray-500">Verified by community • Immutable</div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((p) => (
                <article key={p.id} className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold">{p.name}</h5>
                      <div className="text-xs text-gray-500">
                        {p.position} • Age {p.age}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Score</div>
                      <div className="font-bold text-lg">{p.score}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <div>Height: {p.height}</div>
                    <div>Weight: {p.weight}</div>
                    <div>Injured: {p.injured ? 'Yes' : 'No'}</div>
                    <div>Available: {p.availability ? 'Yes' : 'No'}</div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-md border px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setSelected(p)}>
                      View
                    </button>
                    <button
                      className="rounded-md bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700"
                      onClick={() => toggleAvailability(p.id)}
                    >
                      Toggle Availability
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Job board */}
        <section id="jobs" className="mt-12">
          <h3 className="text-2xl font-bold">Job Board</h3>
          <p className="text-gray-600 mt-2">Clubs post, players apply, with clear deadlines and salary ranges.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((j) => (
              <div key={j.id} className="bg-white rounded-xl p-4 shadow flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold">{j.title}</h4>
                  <div className="text-xs text-gray-500">
                    {j.club} • {j.location}
                  </div>

                  <div className="mt-3 text-sm text-gray-600">
                    <div>Salary: {j.salaryRange}</div>
                    <div>Deadline: {j.deadline}</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Save</button>
                  <Link href="/jobs" className="ml-auto">
                    <button className="rounded-md bg-green-600 text-white px-3 py-2 text-sm hover:bg-green-700">
                      Apply Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      
        {/* CTA */}
        <section className="mt-10 flex items-center justify-center">
          <div className="bg-indigo-700 text-white px-8 py-6 rounded-2xl shadow-lg text-center max-w-2xl">
            <h4 className="text-xl font-bold">Ready to Build Your Profile?</h4>
            <p className="mt-2 text-sm">Join 1,000+ Kenyan rugby players on Moonbase Alpha</p>
            <div className="mt-4">
              <Link href="/create-profile">
                <button className="rounded-md bg-white text-indigo-700 px-4 py-2 font-semibold hover:bg-gray-100">
                  Get Started Now
                </button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-12 mb-12 text-center text-gray-500 text-sm">
          © 2025 RugbyCV Kenya. Built on Polkadot. For rugby players, by rugby players.
        </footer>
      </main>

      {/* Modal: Player Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white max-w-2xl w-full rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selected.name}</h3>
                <div className="text-sm text-gray-500">
                  {selected.position} • Age {selected.age}
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelected(null)}>
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dl className="text-sm text-gray-600 space-y-2">
                  <div>
                    <dt className="font-medium">Height</dt>
                    <dd>{selected.height}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Weight</dt>
                    <dd>{selected.weight}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Injured</dt>
                    <dd>{selected.injured ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Available</dt>
                    <dd>{selected.availability ? 'Yes' : 'No'}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex gap-2">
                  <Link href="/create-profile" className="flex-1">
                    <button className="w-full rounded-md bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700">
                      Create Profile
                    </button>
                  </Link>
                  <button
                    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => toggleAvailability(selected.id)}
                  >
                    Toggle Availability
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Highlights</h4>
                {selected.highlights ? (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Video hosted on IPFS (placeholder)</p>
                    <div className="mt-2 bg-gray-100 rounded-md p-3 text-center text-xs">
                      Video Player placeholder for: {selected.highlights}
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No highlights uploaded.</p>
                )}

                <div className="mt-4">
                  <h5 className="font-medium">Verification</h5>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-green-50 rounded">Coach verified</span>
                    <span className="px-2 py-1 bg-yellow-50 rounded">Community endorsed</span>
                    <span className="px-2 py-1 bg-indigo-50 rounded">Blockchain owned</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                className="rounded-md border px-3 py-2 text-sm mr-2 hover:bg-gray-50"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
