import { Connection, PublicKey, Keypair, SystemProgram, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';
import fs from 'fs';
import { TransactionInstruction } from '@solana/web3.js';
import {
  createAssociatedTokenAccount,
  signTransactionInstructions
} from './utils';

/**
 *
 * Get an associated token account from wallet address
 *
 */

 /** Path to your wallet */
const WALLET_PATH = '/home/dev/.config/solana/id.json';
const wallet = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(WALLET_PATH).toString())),
);

/** Your RPC connection */
const connection = new Connection('https://api.devnet.solana.com');

const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

/** Token info */
const MINT = new PublicKey('CdjhPzEihiFH1xhjuH7nY66kcUrkuh14L2iMmxDX1UYU');

const walletAdress: PublicKey = new PublicKey(
  '5s6FoT7fn9wrYh8j8bYzkPfuczteUU74fjNnpMcL3ez1',
);

// const createAssociatedTokenAccount = async (
//   walletAddress: PublicKey,
// ): Promise<TransactionInstruction> => {
//   const keys = [
//     {
//       pubkey: walletAddress,
//       isSigner: false,
//       isWritable: true,
//     }
//   ];

//   return new TransactionInstruction({
//     keys,
//     programId: ASSOCIATED_TOKEN_PROGRAM_ID,
//     data: Buffer.from([]),
//   });
// }

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