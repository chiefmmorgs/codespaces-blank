export const CONTRACTS = {
  DataRegistry: {
    address: process.env.NEXT_PUBLIC_DATA_REGISTRY_ADDRESS,
    abi: [
      "function submitHealthData(bytes32 age, bytes32 diagnosis, bytes32 outcome, bytes32 biomarker, bytes memory proof) external returns (uint256)",
      "function revokeRecord(uint256 recordId) external",
      "function getPatientRecords(address patient) external view returns (uint256[] memory)",
      "function records(uint256) external view returns (address patient, uint256 timestamp, bool isActive)",
      "event HealthDataSubmitted(uint256 indexed recordId, address indexed patient, uint256 timestamp)",
      "event RecordRevoked(uint256 indexed recordId, address indexed patient)"
    ]
  },
  PaymentProcessor: {
    address: process.env.NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS,
    abi: [
      "function getPatientEarnings(address patient) external view returns (uint256)",
      "function withdrawEarnings() external",
      "event EarningsDistributed(address indexed patient, uint256 amount)",
      "event EarningsWithdrawn(address indexed patient, uint256 amount)"
    ]
  },
  ResearchOracle: {
    address: process.env.NEXT_PUBLIC_RESEARCH_ORACLE_ADDRESS,
    abi: [
      "function computeAverageBiomarker(uint32 minAge, uint32 maxAge, uint32 diagnosisCode) external payable returns (uint256)",
      "function countPatientsByCriteria(uint32 diagnosisCode, uint32 minOutcome) external payable returns (uint256)",
      "function getQueryResult(uint256 queryId) external view returns (address researcher, uint256 timestamp, bool isComplete)",
      "function queryFee() external view returns (uint256)",
      "event QueryExecuted(uint256 indexed queryId, address indexed researcher, uint256 timestamp)",
      "event QueryCompleted(uint256 indexed queryId, uint256 resultCount)"
    ]
  }
};

export const CHAIN_CONFIG = {
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID),
  chainName: 'Sepolia',
  rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
  blockExplorer: 'https://sepolia.etherscan.io'
};