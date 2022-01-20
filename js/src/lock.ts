import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import fs from 'fs';
import {
  Numberu64,
  generateRandomSeed,
  signTransactionInstructions,
} from './utils';
import { Schedule } from './state';
import { create, TOKEN_VESTING_PROGRAM_ID } from './main';
import {
  RPC,
  WALLET_PATH,
  token_address,
  token_account,
  DECIMALS,
  distination_owner,
  distination_token_account
} from './variables';

/**
 *
 * Simple example of a linear unlock.
 *
 * This is just an example, please be careful using the vesting contract and test it first with test tokens.
 *
 */

const wallet = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(WALLET_PATH).toString())),
);

/** There are better way to generate an array of dates but be careful as it's irreversible */
const now = new Date();
const date1 = new Date(now.getTime() + 5*60000);
const date2 = new Date(now.getTime() + 10*60000);
const DATES = [
  // new Date(),
  // new Date('-12-17T03:24:00.146Z')),
  // new Date(2022, 2),
  // new Date(2022, 3),
  // new Date(2022, 4),
  date1,
  date2
];

/** Amount to give per schedule */
const AMOUNT_PER_SCHEDULE = [50, 100];

/** Info about the desintation */
const DESTINATION_OWNER = new PublicKey(distination_owner);
const DESTINATION_TOKEN_ACCOUNT = new PublicKey(distination_token_account);

/** Token info */
const MINT = new PublicKey(token_address);

/** Info about the source */
const SOURCE_TOKEN_ACCOUNT = new PublicKey(token_account);

/** Your RPC connection */
const connection = new Connection(RPC);

/** Do some checks before sending the tokens */
const checks = async () => {
  const tokenInfo = await connection.getParsedAccountInfo(
    DESTINATION_TOKEN_ACCOUNT,
  );

  // @ts-ignore
  const parsed = tokenInfo.value.data.parsed;
  if (parsed.info.mint !== MINT.toBase58()) {
    throw new Error('Invalid mint');
  }
  if (parsed.info.owner !== DESTINATION_OWNER.toBase58()) {
    throw new Error('Invalid owner');
  }
  if (parsed.info.tokenAmount.decimals !== DECIMALS) {
    throw new Error('Invalid decimals');
  }
};

/** Function that locks the tokens */
const lock = async () => {
  await checks();
  const schedules: Schedule[] = [];
  let index = 0;
  for (let date of DATES) {
    schedules.push(
      new Schedule(
        /** Has to be in seconds */
        new Numberu64(date.getTime() / 1_000),
        /** Don't forget to add decimals */
        new Numberu64(AMOUNT_PER_SCHEDULE[index] * Math.pow(10, DECIMALS)),
      ),
    );
    index++;
  }
  const seed = generateRandomSeed();

  console.log(`Seed: ${seed}`);

  const instruction = await create(
    connection,
    TOKEN_VESTING_PROGRAM_ID,
    Buffer.from(seed),
    wallet.publicKey,
    wallet.publicKey,
    SOURCE_TOKEN_ACCOUNT,
    DESTINATION_TOKEN_ACCOUNT,
    MINT,
    schedules,
  );

  const tx = await signTransactionInstructions(
    connection,
    [wallet],
    wallet.publicKey,
    instruction,
  );

  console.log(`Transaction: ${tx}`);
};

lock();
