import { Connection, PublicKey, Keypair, SystemProgram, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';
import fs from 'fs';
import { TransactionInstruction } from '@solana/web3.js';
import {
  createAssociatedTokenAccount,
  signTransactionInstructions
} from './utils';
import {
  RPC,
  WALLET_PATH,
  token_address,
  associated_wallet_address
} from './variables';

/**
 *
 * Get an associated token account from wallet address
 *
 */

const wallet = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(WALLET_PATH).toString())),
);

/** Your RPC connection */
const connection = new Connection(RPC);

const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

/** Token info */
const MINT = new PublicKey(token_address);

const walletAdress: PublicKey = new PublicKey(
  associated_wallet_address
);

/** Function that get an associated token account */
const getATAccount = async () => {
  let instruction = [
    await createAssociatedTokenAccount(
      SystemProgram.programId,
      SYSVAR_CLOCK_PUBKEY,
      wallet.publicKey,
      walletAdress,
      MINT,
    ),
  ];

  const tx = await signTransactionInstructions(
    connection,
    [wallet],
    wallet.publicKey,
    instruction,
  );

  console.log(`Transaction: ${tx}`);

  const trans = await connection.getTransaction(tx);

  // @ts-ignore
  const accountKeys = trans?.transaction.message.accountKeys
  // @ts-ignore
  const tokenAddress = accountKeys[1].toBase58();

  console.log(tokenAddress)
}

getATAccount();