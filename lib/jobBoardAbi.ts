export const jobBoardAbi = [
  {
    inputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "uint256", name: "salaryKsh", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" }
    ],
    name: "postJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "jobId", type: "uint256" }],
    name: "applyToJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "jobId", type: "uint256" }],
    name: "getJob",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint256", name: "salaryKsh", type: "uint256" },
          { internalType: "address", name: "club", type: "address" },
          { internalType: "bool", name: "active", type: "bool" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct JobBoard.Job",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;
