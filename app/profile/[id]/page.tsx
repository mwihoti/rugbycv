'use client';

export default function PlayerProfile({ params }: { params: { id: string } }) {
  // Mock player data
  const player = {
    id: params.id,
    name: "Sam Kipchoge",
    position: "Flanker",
    club: "Kabras Sugar",
    number: 7,
    height: 185,
    weight: 95,
    university: "University of Nairobi",
    job: "Data Analyst @ Tech Firm",
    injuryStatus: "Fit",
    availableForTransfer: true,
    stats: {
      tries: 24,
      tackles: 342,
      lineoutSteals: 12,
      passAccuracy: "92%"
    },
    badges: [
      { type: "Coach Verified", issuer: "Kabras Sugar", date: "Nov 2025" },
      { type: "KRU Gold Tick", issuer: "Kenya Rugby Union", date: "Oct 2025" },
      { type: "Payment Verified", issuer: "RugbyCV", date: "Nov 2025" }
    ],
    videoHash: "Qm...",
    bio: "Passionate flanker with 8 years of competitive rugby experience. Known for exceptional game sense and leadership on the pitch."
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header with Background */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{player.name}</h1>
              <p className="text-white text-lg opacity-90">{player.position} | #{player.number}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-lg">{player.club}</p>
              <p className="text-white opacity-90">{player.university}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            {/* Bio */}
            <div className="bg-gray-700 p-6 rounded-lg mb-8 border border-gray-600">
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-300">{player.bio}</p>
            </div>

            {/* Physical Stats */}
            <div className="bg-gray-700 p-6 rounded-lg mb-8 border border-gray-600">
              <h2 className="text-2xl font-bold text-white mb-4">Physical Attributes</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-600 p-4 rounded">
                  <p className="text-gray-400 text-sm">Height</p>
                  <p className="text-white text-2xl font-bold">{player.height} cm</p>
                </div>
                <div className="bg-gray-600 p-4 rounded">
                  <p className="text-gray-400 text-sm">Weight</p>
                  <p className="text-white text-2xl font-bold">{player.weight} kg</p>
                </div>
              </div>
            </div>

            {/* Career Stats */}
            <div className="bg-gray-700 p-6 rounded-lg mb-8 border border-gray-600">
              <h2 className="text-2xl font-bold text-white mb-4">Career Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-600 p-4 rounded text-center">
                  <p className="text-gray-400 text-sm">Tries</p>
                  <p className="text-green-500 text-3xl font-bold">{player.stats.tries}</p>
                </div>
                <div className="bg-gray-600 p-4 rounded text-center">
                  <p className="text-gray-400 text-sm">Tackles</p>
                  <p className="text-green-500 text-3xl font-bold">{player.stats.tackles}</p>
                </div>
                <div className="bg-gray-600 p-4 rounded text-center">
                  <p className="text-gray-400 text-sm">Lineout Steals</p>
                  <p className="text-green-500 text-3xl font-bold">{player.stats.lineoutSteals}</p>
                </div>
                <div className="bg-gray-600 p-4 rounded text-center">
                  <p className="text-gray-400 text-sm">Pass Accuracy</p>
                  <p className="text-green-500 text-3xl font-bold">{player.stats.passAccuracy}</p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <h2 className="text-2xl font-bold text-white mb-4">Verification Badges</h2>
              <div className="space-y-3">
                {player.badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-600 p-4 rounded">
                    <div>
                      <p className="text-white font-semibold">{badge.type}</p>
                      <p className="text-gray-400 text-sm">Verified by {badge.issuer}</p>
                    </div>
                    <div className="text-green-500 text-2xl">✓</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Status Card */}
            <div className="bg-gray-700 p-6 rounded-lg mb-8 border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-4">Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Injury Status</p>
                  <p className="text-green-500 font-semibold">{player.injuryStatus}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Day Job</p>
                  <p className="text-white">{player.job}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Available for Transfer</p>
                  <p className={player.availableForTransfer ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                    {player.availableForTransfer ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-8">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition">
                Send Message
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Offer Position
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition">
                Share Profile
              </button>
            </div>

            {/* On-Chain Info */}
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-4">On-Chain Profile</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="font-semibold text-white">Token ID:</span> {player.id}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold text-white">Network:</span> Moonbase Alpha
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold text-white">Status:</span> <span className="text-green-500">Verified</span>
                </p>
                <button className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm transition">
                  View on Explorer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Profiles */}
      <div className="bg-gray-800 py-12 mt-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Similar Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition border border-gray-600">
                <h3 className="text-xl font-bold text-white mb-2">John Wanyonyi</h3>
                <p className="text-green-500 mb-3">Flanker | Menengai Oilers</p>
                <p className="text-gray-400 text-sm mb-4">Tall, athletic flanker with excellent game intelligence</p>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}