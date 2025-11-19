export const profileAbi = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "position", type: "string" },
      { internalType: "uint256", name: "height", type: "uint256" },
      { internalType: "uint256", name: "weight", type: "uint256" },
      { internalType: "string", name: "secondJob", type: "string" },
      { internalType: "string", name: "injuryStatus", type: "string" },
      { internalType: "bool", name: "availableForTransfer", type: "bool" },
      { internalType: "string", name: "videoHash", type: "string" }
    ],
    name: "createProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getProfile",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "position", type: "string" },
          { internalType: "uint256", name: "height", type: "uint256" },
          { internalType: "uint256", name: "weight", type: "uint256" },
          { internalType: "string", name: "secondJob", type: "string" },
          { internalType: "string", name: "injuryStatus", type: "string" },
          { internalType: "bool", name: "availableForTransfer", type: "bool" },
          { internalType: "string", name: "videoHash", type: "string" }
        ],
        internalType: "struct RugbyCVProfile.Profile",
        name: "profile",
        type: "tuple"
      },
      {
        components: [
          { internalType: "string", name: "badgeType", type: "string" },
          { internalType: "address", name: "issuer", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" }
        ],
        internalType: "struct RugbyCVProfile.Badge[]",
        name: "badgeList",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

