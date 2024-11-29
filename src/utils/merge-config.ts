import { Config, resolveModelShorthand } from '../loadConfig';
import createPrompt from '../prompt';

interface FormDataObj {
  OPENAI_API_KEY?: string;
  // Target language
  TARGET_LANGUAGE?: string;
  // HTTPS Proxy
  HTTPS_PROXY?: string;
  // Default language model.
  MODEL_NAME?: string;
  // Soft limit of the token size, used to split the file into fragments.
  FRAGMENT_TOKEN_SIZE?: string;
  // Sampling temperature, i.e., randomness of the generated text.
  TEMPERATURE?: string;
  // API call interval
  API_CALL_INTERVAL?: string;
  // The maximum number of lines for code blocks
  CODE_BLOCK_PRESERVATION_LINES?: string;
  // API endpoint
  API_ENDPOINT?: string;
  // markdown content
  MD_CONTENT?: string;
}

export function mergeConfig(config: Config, remoteConfig: FormDataObj) {
  if (remoteConfig.OPENAI_API_KEY) {
    config.apiKey = remoteConfig.OPENAI_API_KEY;
  }
  if (remoteConfig.TARGET_LANGUAGE) {
    config.prompt = createPrompt(remoteConfig.TARGET_LANGUAGE);
  }
  if (remoteConfig.HTTPS_PROXY) {
    config.httpsProxy = remoteConfig.HTTPS_PROXY;
  }
  if (remoteConfig.MODEL_NAME) {
    config.model = resolveModelShorthand(remoteConfig.MODEL_NAME);
  }
  if (remoteConfig.FRAGMENT_TOKEN_SIZE) {
    config.fragmentSize = Number(remoteConfig.FRAGMENT_TOKEN_SIZE);
  }
  if (remoteConfig.TEMPERATURE) {
    config.temperature = Number(remoteConfig.TEMPERATURE);
  }
  if (remoteConfig.API_CALL_INTERVAL) {
    config.apiCallInterval = Number(remoteConfig.API_CALL_INTERVAL);
  }
  if (remoteConfig.CODE_BLOCK_PRESERVATION_LINES) {
    config.codeBlockPreservationLines = Number(
      remoteConfig.CODE_BLOCK_PRESERVATION_LINES
    );
  }
  if (remoteConfig.API_ENDPOINT) {
    config.apiEndpoint = remoteConfig.API_ENDPOINT;
  }
}
