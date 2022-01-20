import fs from 'fs';

/** Read variables */
const VARIABLES_PATH = './variables.json';
const variables = JSON.parse(fs.readFileSync(VARIABLES_PATH).toString());

// RPC
export const RPC = variables.rpc;

// Wallet keypair path
export const WALLET_PATH = variables.wallet_path;

// Wallet address
export const wallet_address = variables.wallet_address;

// Token address
export const token_address = variables.token_address;

// Token account
export const token_account = variables.token_account;

// Token decimals
export const DECIMALS = variables.decimals;

// Token vesting program id
export const token_vesting_program_id = variables.token_vesting_program_id;

// Distination owner
export const distination_owner = variables.distination_owner;

// Distination token account
export const distination_token_account = variables.distination_token_account;

// Associated wallet address
export const associated_wallet_address = variables.associated_wallet_address;

// Seed for unlocking
export const locked_seed = variables.locked_seed;