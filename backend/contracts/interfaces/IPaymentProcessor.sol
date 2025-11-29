// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

/**
 * @title IPaymentProcessor
 * @notice Interface for the PaymentProcessor contract
 * @dev Defines the structure and functions for payment distribution
 */
interface IPaymentProcessor {
    
    // ============ Events ============
    
    event PaymentReceived(
        address indexed researcher,
        uint256 amount,
        uint256 patientPool,
        uint256 platformFee
    );
    
    event EarningsDistributed(
        address indexed patient,
        uint256 amount,
        uint256 recordCount
    );
    
    event EarningsWithdrawn(
        address indexed patient,
        uint256 amount
    );
    
    event OracleAuthorized(address indexed oracle);
    event OracleRevoked(address indexed oracle);
    event FeeShareUpdated(uint256 patientShare, uint256 platformShare);
    event PlatformWalletUpdated(address indexed newWallet);
    
    // ============ Core Functions ============
    
    /**
     * @notice Distribute query fees to contributing patients
     * @param recordIds Array of record IDs used in the query
     * @param researcher Address of the researcher who paid
     */
    function distributeEarnings(
        uint256[] memory recordIds,
        address researcher
    ) external payable;
    
    /**
     * @notice Allow patients to withdraw their earnings
     */
    function withdrawEarnings() external;
    
    /**
     * @notice Get patient's withdrawable earnings
     * @param patient The patient address
     * @return Earnings amount in wei
     */
    function getPatientEarnings(address patient) external view returns (uint256);
    
    /**
     * @notice Get researcher's total spending
     * @param researcher The researcher address
     * @return Total spending in wei
     */
    function getResearcherSpending(address researcher) external view returns (uint256);
    
    // ============ Admin Functions ============
    
    /**
     * @notice Authorize an oracle to trigger distributions
     * @param oracle Address of the oracle contract
     */
    function authorizeOracle(address oracle) external;
    
    /**
     * @notice Revoke oracle authorization
     * @param oracle Address of the oracle contract
     */
    function revokeOracle(address oracle) external;
    
    /**
     * @notice Update fee share percentages
     * @param _patientShare New patient share in basis points
     * @param _platformShare New platform share in basis points
     */
    function updateFeeShares(
        uint256 _patientShare,
        uint256 _platformShare
    ) external;
    
    /**
     * @notice Update platform wallet address
     * @param newWallet New platform wallet address
     */
    function updatePlatformWallet(address newWallet) external;
    
    /**
     * @notice Emergency withdrawal (only unclaimed funds)
     */
    function emergencyWithdraw() external;
    
    // ============ View Functions ============
    
    /**
     * @notice Get contract statistics
     * @return totalFees Total fees collected
     * @return totalDist Total distributed to patients
     * @return contractBal Current contract balance
     */
    function getStats() external view returns (
        uint256 totalFees,
        uint256 totalDist,
        uint256 contractBal
    );
    
    /**
     * @notice Check if address is authorized oracle
     * @param oracle Address to check
     * @return Boolean indicating authorization status
     */
    function isAuthorizedOracle(address oracle) external view returns (bool);
    
    /**
     * @notice Get patient earnings mapping
     * @param patient Patient address
     * @return Earnings amount
     */
    function patientEarnings(address patient) external view returns (uint256);
    
    /**
     * @notice Get researcher spending mapping
     * @param researcher Researcher address
     * @return Spending amount
     */
    function researcherSpending(address researcher) external view returns (uint256);
    
    /**
     * @notice Get data registry address
     * @return DataRegistry contract address
     */
    function dataRegistry() external view returns (address);
    
    /**
     * @notice Get authorized oracles mapping
     * @param oracle Oracle address
     * @return Boolean indicating authorization
     */
    function authorizedOracles(address oracle) external view returns (bool);
    
    /**
     * @notice Get platform wallet address
     * @return Platform wallet address
     */
    function platformWallet() external view returns (address);
    
    /**
     * @notice Get contract owner
     * @return Owner address
     */
    function owner() external view returns (address);
    
    /**
     * @notice Get patient share percentage (basis points)
     * @return Patient share (e.g., 7000 = 70%)
     */
    function patientShare() external view returns (uint256);
    
    /**
     * @notice Get platform share percentage (basis points)
     * @return Platform share (e.g., 3000 = 30%)
     */
    function platformShare() external view returns (uint256);
    
    /**
     * @notice Get total fees collected
     * @return Total fees in wei
     */
    function totalFeesCollected() external view returns (uint256);
    
    /**
     * @notice Get total distributed to patients
     * @return Total distributed in wei
     */
    function totalDistributed() external view returns (uint256);
}