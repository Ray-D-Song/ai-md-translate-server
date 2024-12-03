import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parse } from 'dotenv';
import { isNodeException } from './utils/error-utils.js';
import { readTextFile } from './utils/fs-utils.js';

export interface Config {
  apiEndpoint: string;
  apiKey: string;
  prompt: string;
  model: string;
  apiCallInterval: number;
  quiet: boolean;
  fragmentSize: number;
  temperature: number;
  codeBlockPreservationLines: number;
  httpsProxy?: string;
  secretKey?: string;
}

const findFile = async (paths: string[]) => {
  for (const path of paths) {
    try {
      await fs.access(path);
      return path;
    } catch (e) {
      if (isNodeException(e) && e.code === 'ENOENT') continue;
      throw e; // Permission denied or other error
    }
  }
  return null;
};

export const findConfigFile = () =>
  findFile([path.join(process.cwd(), '.env')]);

export const findPromptFile = () =>
  findFile([path.join(process.cwd(), 'prompt.md')]);

export const resolveModelShorthand = (model: string): string => {
  const shorthands: { [key: string]: string } = {
    '4': 'gpt-4-turbo',
    '4large': 'gpt-4-32k', // legacy
    '3': 'gpt-3.5-turbo',
    '3large': 'gpt-3.5-turbo-16k' // legacy
  };
  return shorthands[model] ?? model;
};

const loadConfig = async (): Promise<Config> => {
  const configPath = await findConfigFile();
  if (!configPath) throw new Error('Config file not found.');
  const conf = parse(await readTextFile(configPath));

  const toNum = (input: unknown) => {
    if (input === undefined || input === null) return undefined;
    const num = Number(input);
    return Number.isNaN(num) ? undefined : num;
  };

  const config = {
    apiEndpoint:
      process.env.API_ENDPOINT ??
      conf.API_ENDPOINT ??
      'https://api.openai.com/v1/chat/completions',
    secretKey: process.env.SECRET_KEY ?? conf.SECRET_KEY,
    apiKey: process.env.OPENAI_API_KEY ?? conf.OPENAI_API_KEY,
    prompt: '',
    model: resolveModelShorthand(process.env.MODEL_NAME ?? conf.MODEL_NAME ?? '3'),
    apiCallInterval: toNum(process.env.API_CALL_INTERVAL ?? conf.API_CALL_INTERVAL) ?? 0,
    quiet: process.stdout.isTTY === false,
    fragmentSize: toNum(process.env.FRAGMENT_TOKEN_SIZE ?? conf.FRAGMENT_TOKEN_SIZE) ?? 2048,
    temperature: toNum(process.env.TEMPERATURE ?? conf.TEMPERATURE) ?? 0.1,
    codeBlockPreservationLines: toNum(process.env.CODE_BLOCK_PRESERVATION_LINES ?? conf.CODE_BLOCK_PRESERVATION_LINES) ?? 5,
    httpsProxy: process.env.HTTPS_PROXY ?? conf.HTTPS_PROXY
  };

  return config;
};

export default loadConfig;
