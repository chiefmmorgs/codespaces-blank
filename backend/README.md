# BioMesh Backend - Smart Contracts

Encrypted Clinical Trial Data Marketplace built with Zama's fhEVM

## 📋 Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask or another Web3 wallet
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd biomesh-backend

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your keys
nano .env
```

Required environment variables:
- `SEPOLIA_RPC_URL`: Your Alchemy/Infura Sepolia RPC endpoint
- `PRIVATE_KEY`: Your wallet private key (NEVER commit this!)
- `ETHERSCAN_API_KEY`: For contract verification

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run coverage
npm run test:coverage
```

### 5. Deploy to Local Network

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy contracts
npm run deploy:local
```

### 6. Deploy to Sepolia Testnet

```bash
npm run deploy:sepolia
```

After deployment, verify contracts:
```bash
npm run verify:sepolia
```

## 📁 Project Structure

```
biomesh-backend/
├── contracts/              # Solidity smart contracts
│   ├── DataRegistry.sol   # Patient data storage
│   ├── ResearchOracle.sol # Query execution
│   └── PaymentProcessor.sol # Payment distribution
├── scripts/               # Deployment scripts
│   └── deploy.js         # Main deployment script
├── test/                  # Test files
│   ├── DataRegistry.test.js
│   ├── PaymentProcessor.test.js
│   └── integration/
│       └── full-flow.test.js
├── hardhat.config.js      # Hardhat configuration
└── package.json
```

## 🧪 Testing

### Unit Tests

```bash
# Test individual contracts
npx hardhat test test/DataRegistry.test.js
npx hardhat test test/PaymentProcessor.test.js
```

### Integration Tests

```bash
# Test complete system flow
npx hardhat test test/integration/full-flow.test.js
```

### Test Coverage

```bash
npm run test:coverage
```

Target coverage: >80% for all contracts

## 📊 Contract Architecture

### DataRegistry.sol
- Stores encrypted patient health data
- Manages access permissions
- Tracks patient contributions

**Key Functions:**
- `submitHealthData()`: Submit encrypted patient data
- `revokeRecord()`: Revoke data access
- `authorizeOracle()`: Grant oracle permissions

### ResearchOracle.sol
- Executes encrypted queries on patient data
- Performs FHE operations (comparison, aggregation)
- Returns encrypted results

**Key Functions:**
- `computeAverageBiomarker()`: Calculate average biomarker
- `countPatientsByCriteria()`: Count matching patients

### PaymentProcessor.sol
- Handles payment distribution
- Tracks patient earnings
- Manages platform fees

**Key Functions:**
- `distributeEarnings()`: Split payments to patients
- `withdrawEarnings()`: Allow patients to withdraw
- `updateFeeShares()`: Adjust fee distribution

## 🔐 Security Considerations

### Access Control
- Owner-only admin functions
- Oracle authorization required for queries
- Patient-only record revocation

### Reentrancy Protection
- Checks-Effects-Interactions pattern
- Reentrancy guards on withdrawal functions

### Input Validation
- Zero address checks
- Payment amount validation
- Record active status verification

## 💰 Fee Structure

Default configuration:
- **Patient Share**: 70% of query fees
- **Platform Share**: 30% of query fees
- **Query Fee**: 0.01 ETH (configurable)

Fee splits are adjustable by contract owner.

## 🛠️ Development Commands

```bash
# Compile contracts
npm run compile

# Clean artifacts
npm run clean

# Run local node
npm run node

# Deploy locally
npm run deploy:local

# Deploy to Sepolia
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia

# Run tests
npm test

# Gas reporting
REPORT_GAS=true npm test

# Coverage report
npm run test:coverage
```

## 📝 Deployment Checklist

Before deploying to mainnet:

- [ ] All tests passing (>80% coverage)
- [ ] Contracts audited by security firm
- [ ] Gas optimization completed
- [ ] Emergency pause functionality added
- [ ] Multi-sig wallet for admin functions
- [ ] Incident response plan documented
- [ ] Legal compliance verified (HIPAA/GDPR)

## 🔍 Contract Verification

After deployment, verify contracts on Etherscan:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
npx hardhat verify --network sepolia 0x123... 0xRegistryAddress 0xPlatformWallet 10000000000000000
```

## 🐛 Troubleshooting

### Common Issues

**Issue: "Insufficient funds"**
- Ensure wallet has enough Sepolia ETH
- Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

**Issue: "Nonce too high"**
- Reset MetaMask account nonce
- Or use `npx hardhat clean`

**Issue: "Contract verification failed"**
- Ensure correct constructor arguments
- Check Etherscan API key is valid
- Verify compiler version matches

**Issue: "Gas estimation failed"**
- Increase gas limit in hardhat.config.js
- Check contract has sufficient test ETH

## 📚 Additional Resources

- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethers.js Documentation](https://docs.ethers.org/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## ⚠️ Important Notes

### FHE Limitations (Current Implementation)

**Note**: This is a **demonstration/proof-of-concept** implementation. The current version uses:

1. **Mock Encryption**: Test environment uses simplified encryption for demonstration purposes
2. **Plaintext Queries**: Some query parameters are plaintext for simplicity
3. **Simplified Validation**: Full encrypted validation not yet implemented

### For Production Deployment:

1. **Full fhEVM Integration**: Use actual fhevmjs for client-side encryption
2. **Gateway Integration**: Implement threshold decryption via Zama Gateway
3. **Optimized Queries**: Add indexing and filtering to reduce gas costs
4. **Enhanced Privacy**: Make all query parameters encrypted
5. **Audit Required**: Security audit before any real patient data

### Current Status:

✅ **Working Features:**
- Smart contract architecture
- Access control mechanisms
- Payment distribution logic
- Patient data management
- Query execution framework

🚧 **Requires Production Enhancement:**
- Full FHE encryption integration
- Gateway threshold decryption
- Gas optimization for large datasets
- Production-grade key management
- Comprehensive security audit

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: [Your Contact Info]
- Discord: [Zama Discord](https://discord.gg/zama)

---

**Built with ❤️ for the Zama Developer Program**