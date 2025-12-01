export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEther(wei) {
  if (!wei) return '0';
  return (Number(wei) / 1e18).toFixed(4);
}

export function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString();
}

export function validateAge(age) {
  const num = parseInt(age);
  return num >= 1 && num <= 120;
}

export function validateOutcome(outcome) {
  const num = parseInt(outcome);
  return num >= 0 && num <= 100;
}

export function validateDiagnosis(code) {
  const num = parseInt(code);
  return num >= 0 && num <= 9999;
}