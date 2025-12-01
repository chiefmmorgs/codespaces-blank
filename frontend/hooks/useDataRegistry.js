import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/lib/contracts';
import { encryptHealthData } from '@/lib/encryption';

export function useDataRegistry(signer) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getContract = () => {
    if (!signer) throw new Error('No signer available');
    return new ethers.Contract(
      CONTRACTS.DataRegistry.address,
      CONTRACTS.DataRegistry.abi,
      signer
    );
  };

  const submitHealthData = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const address = await signer.getAddress();
      const encrypted = await encryptHealthData(
        CONTRACTS.DataRegistry.address,
        address,
        data
      );

      const contract = getContract();
      const tx = await contract.submitHealthData(
        encrypted.handles[0],
        encrypted.handles[1],
        encrypted.handles[2],
        encrypted.handles[3],
        encrypted.inputProof
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log).name === 'HealthDataSubmitted';
        } catch { return false; }
      });

      const recordId = event ? contract.interface.parseLog(event).args.recordId : null;
      return { success: true, recordId: recordId?.toString() };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const revokeRecord = async (recordId) => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = getContract();
      const tx = await contract.revokeRecord(recordId);
      await tx.wait();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientRecords = async (patientAddress) => {
    try {
      const contract = getContract();
      const recordIds = await contract.getPatientRecords(patientAddress);
      
      const records = await Promise.all(
        recordIds.map(async (id) => {
          const record = await contract.records(id);
          return {
            id: id.toString(),
            patient: record.patient,
            timestamp: Number(record.timestamp),
            isActive: record.isActive,
          };
        })
      );

      return records;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  return {
    submitHealthData,
    revokeRecord,
    getPatientRecords,
    isLoading,
    error,
  };
}