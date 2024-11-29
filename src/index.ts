import configureApiCaller from './api.js';
import { type Config } from './loadConfig.js';
import { type DoneStatus, type Status, statusToText } from './status.js';
import { translateMultiple } from './translate.js';
import {
  replaceCodeBlocks,
  restoreCodeBlocks,
  splitStringAtBlankLines
} from './utils/md-utils.js';
import logger from './utils/logger';

const translate = async (markdown: string, config: Config): Promise<string> => {
  logger.info('Starting translation with config:', {
    fragmentSize: config.fragmentSize,
    model: config.model,
    temperature: config.temperature
  });

  const { output: replacedMd, codeBlocks } = replaceCodeBlocks(
    markdown,
    config.codeBlockPreservationLines
  );

  const fragments = splitStringAtBlankLines(
    replacedMd,
    config.fragmentSize
  ) ?? [replacedMd];

  logger.info(`Split markdown into ${fragments.length} fragments`);

  let status: Status = { status: 'pending', lastToken: '' };

  const printStatus = () => {
    if (config.quiet) return;
    process.stdout.write('\x1b[1A\x1b[2K');
    console.log(statusToText(status, process.stdout.columns - 1));
  };
  printStatus();

  const callApi = configureApiCaller({
    apiEndpoint: config.apiEndpoint,
    apiKey: config.apiKey,
    rateLimit: config.apiCallInterval,
    httpsProxy: config.httpsProxy
  });

  const startTime = Date.now();
  const result = await translateMultiple(
    callApi,
    fragments,
    config,
    newStatus => {
      status = newStatus;
      printStatus();
    }
  );

  if (result.status === 'error') {
    logger.error('Translation failed:', result.message);
    throw new Error(result.message);
  }

  const translatedText = (result as DoneStatus).translation;
  const finalResult = `${restoreCodeBlocks(translatedText, codeBlocks)}\n`;
  const elapsedTime = Date.now() - startTime;

  logger.info(`Translation completed in ${elapsedTime}ms`);
  return finalResult;
};

export default translate;
