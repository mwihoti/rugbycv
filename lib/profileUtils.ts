import { decodeAbiParameters, parseAbiParameters, keccak256, toHex } from 'viem';

/**
 * Decode transaction input for createProfile function
 * createProfile(string name, string position, uint256 height, uint256 weight, string secondJob, string injuryStatus, bool availableForTransfer, string videoHash)
 */
export function decodeCreateProfileInput(input: `0x${string}`) {
  try {
    if (!input.startsWith('0x') || input.length < 10) {
      return null;
    }

    // Remove function selector (first 10 chars: 0x + 8 hex chars)
    const dataHex = ('0x' + input.slice(10)) as `0x${string}`;

    // Decode the parameters
    const decoded = decodeAbiParameters(
      parseAbiParameters(
        'string name, string position, uint256 height, uint256 weight, string secondJob, string injuryStatus, bool availableForTransfer, string videoHash'
      ),
      dataHex
    );

    if (decoded && decoded.length === 8) {
      return {
        name: decoded[0] as string,
        position: decoded[1] as string,
        height: Number(decoded[2]),
        weight: Number(decoded[3]),
        secondJob: decoded[4] as string,
        injuryStatus: decoded[5] as string,
        availableForTransfer: decoded[6] as boolean,
        videoHash: decoded[7] as string,
      };
    }
  } catch (error) {
    console.error('Error decoding profile input:', error);
  }

  return null;
}

/**
 * Get the function selector for createProfile
 * Calculates keccak256 hash of "createProfile(string,string,uint256,uint256,string,string,bool,string)"
 */
export function getCreateProfileSelector(): `0x${string}` {
  // Calculate the function signature hash
  const functionSig = 'createProfile(string,string,uint256,uint256,string,string,bool,string)';
  const hash = keccak256(toHex(functionSig));
  // Return first 4 bytes (8 hex chars)
  return (hash.slice(0, 10)) as `0x${string}`;
}
