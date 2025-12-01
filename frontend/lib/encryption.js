import { createInstance, initFhevm } from 'fhevmjs';

let fhevmInstance = null;

export async function getFHEInstance() {
  if (fhevmInstance) return fhevmInstance;

  try {
    if (typeof window !== 'undefined') {
      await initFhevm();
    }
    
    fhevmInstance = await createInstance({
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID),
      networkUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
      gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL,
    });
    return fhevmInstance;
  } catch (error) {
    console.error('Failed to create FHE instance:', error);
    throw error;
  }
}

export async function encryptHealthData(contractAddress, userAddress, data) {
  const instance = await getFHEInstance();
  
  const input = instance.createEncryptedInput(contractAddress, userAddress);
  input.add32(parseInt(data.age));
  input.add32(parseInt(data.diagnosis));
  input.add32(parseInt(data.outcome));
  input.add64(parseInt(data.biomarker));

  const encryptedData = await input.encrypt();
  
  return {
    handles: [
      encryptedData.handles[0],
      encryptedData.handles[1],
      encryptedData.handles[2],
      encryptedData.handles[3]
    ],
    inputProof: encryptedData.inputProof
  };
}