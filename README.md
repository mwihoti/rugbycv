# RugbyCV Kenya

RugbyCV Kenya is a decentralized application (dApp) built on the Moonbeam network (Polkadot ecosystem) that provides a single source of truth for Kenyan rugby players' profiles. It allows players to own their data, clubs to post jobs, and the community to verify achievements through badges.

## Vision

One on-chain profile. One source of truth. Owned by the player, verified by the community, visible to every club, selector, sponsor, and employer in Kenya (and the world).

Think of it as:
- LinkedIn → but you can't lie
- Transfermarkt → but the player owns the data
- Huduma Namba → but for rugby talent and welfare

## Features

### Player Profiles (ERC-721 NFTs)
- Height, weight, position, GPS data
- Tries, tackles, lineout %, verified by Kenya Cup stats team
- Current club + "Open to offers" toggle
- Day job / university course
- Injury status & rehab updates
- 15-second highlight video (stored on IPFS)
- Badges: Coach Verified ✓ | KRU Gold Tick ✓ | No Payment Delays (last 12 months) ✓

### Job Board
- Clubs can post job openings with salary, description, deadline
- Players can apply to jobs
- Transparent application tracking

### Badges & Verification
- Verified issuers (e.g., KRU, coaches) can mint badges on player profiles
- Badges require player signature for authenticity

### Web3 Benefits
- Zero trust needed → the blockchain is the referee
- Players own their NFT profile → they can take it from club to club
- Clubs pay small posting fees → the app funds itself
- Payment delays become mathematically impossible to hide

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Web3**: Wagmi v2, Viem, RainbowKit, Moonbeam (Polkadot)
- **Smart Contracts**: Solidity 0.8.26, OpenZeppelin contracts
- **Blockchain**: Moonbeam (Moonbase Alpha testnet, mainnet ready)
- **Storage**: IPFS for videos and metadata
- **Deployment**: Hardhat for contract deployment

## Roadmap

### Phase 1 (MVP – January 2026)
- 1,000 verified player profiles live on Moonbase Alpha
- Mainnet deployment Q1 2026
- Partnerships with Kabras Sugar, KCB, Menengai Oilers, Strathmore Leos
- Chipu & Kenya U20 players onboarded

### Phase 2 (2026/27 season)
- "No Payment Delays" badge → automatically removed if club >30 days late
- Sponsor marketplace
- Integration with Kenya Cup live-scoring

### Phase 3 (2027+)
- Cross-border: Ugandan, Tanzanian, South African clubs
- University scholarship portal
- Player micro-payments for video views

## Local Development

### Prerequisites
- Node.js 18+
- Bun (recommended for faster installs)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rugbycv-dapp.git
cd rugbycv-dapp
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
PRIVATE_KEY=your_private_key_for_deployment
WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

4. Run the development server:
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Contract Deployment

Contracts are already deployed on Moonbase Alpha. Addresses are in `lib/contracts.ts`.

To redeploy or deploy to mainnet:

1. Ensure Hardhat is set up (contracts compile with `bun run hardhat compile`)
2. Deploy script in `scripts/deploy.js`
3. Run `bun run hardhat run scripts/deploy.js --network moonbase`

### Testing

Run tests:
```bash
bun run hardhat test
```

### Building for Production

```bash
bun run build
bun run start
```

## Project Structure

```
rugbycv-dapp/
├── app/                    # Next.js app directory
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx           # Home page
│   ├── jobs/
│   │   └── page.tsx       # Job board
│   └── profile/
│       └── [id]/
│           └── page.tsx   # Player profile
├── components/            # React components
│   ├── BadgeVerifier.tsx
│   ├── ConnectWallet.tsx
│   └── ProfileForm.tsx
├── contracts/             # Solidity contracts
│   ├── JobBoard.sol
│   └── RugbyCVProfile.sol
├── lib/                   # Utilities
│   ├── chains.ts
│   ├── contracts.ts       # ABIs and addresses
│   └── wagmi.tsx          # Web3 config
├── scripts/               # Deployment scripts
├── test/                  # Contract tests
└── deployments/           # Deployed contract addresses
    └── moonbase-alpha/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License

## Contact

For partnerships or inquiries: [contact@rugbycvkenya.com](mailto:contact@rugbycvkenya.com)
