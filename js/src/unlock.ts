import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import fs from 'fs';
import {
  Numberu64,
  generateRandomSeed,
  signTransactionInstructions,
} from './utils';
import { unlock, TOKEN_VESTING_PROGRAM_ID } from './main';

/**
 *
 * Simple example of unlocking
 *
 */

/** Path to your wallet */
const WALLET_PATH = '/home/dev/.config/solana/id.json';
const wallet = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(WALLET_PATH).toString())),
);

/** Token info */
const MINT = new PublicKey('');

/** Your RPC connection */
const connection = new Connection('');
const seed = '';

/** Function that unlocks the tokens */
const unlockToken = async () => {
  const instruction = await unlock(
    connection,
    TOKEN_VESTING_PROGRAM_ID,
    Buffer.from(seed),
    MINT
  );

  const tx = await signTransactionInstructions(
    connection,
    [wallet],
    wallet.publicKey,
    instruction,
  );

  console.log(`Transaction: ${tx}`);
}

unlockToken();