import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import fs from 'fs';
import {
  Numberu64,
  generateRandomSeed,
  signTransactionInstructions,
} from './utils';
import { unlock, TOKEN_VESTING_PROGRAM_ID } from './main';
import {
  RPC,
  WALLET_PATH,
  token_address,
  locked_seed
} from './variables';

/**
 *
 * Simple example of unlocking
 *
 */

const wallet = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(WALLET_PATH).toString())),
);

/** Token info */
const MINT = new PublicKey(token_address);

/** Your RPC connection */
const connection = new Connection(RPC);

/** Function that unlocks the tokens */
const unlockToken = async () => {
  const instruction = await unlock(
    connection,
    TOKEN_VESTING_PROGRAM_ID,
    Buffer.from(locked_seed),
    MINT
  );

  try {
    const tx = await signTransactionInstructions(
      connection,
      [wallet],
      wallet.publicKey,
      instruction,
    );
  
    console.log(`Transaction: ${tx}`);
  } catch(err) {
    console.log(err);
  }

}

unlockToken();