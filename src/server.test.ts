import { describe, expect, test } from 'bun:test';
import { Config } from './loadConfig';
import { mergeConfig } from './utils/merge-config';

describe.skip('mergeConfig', () => {
  test('should merge remote config into existing config', () => {
    const baseConfig: Config = {
      apiEndpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: 'test-key',
      prompt: 'test prompt',
      model: 'gpt-3.5-turbo',
      apiCallInterval: 0,
      quiet: false,
      fragmentSize: 2048,
      temperature: 0.1,
      codeBlockPreservationLines: 5
    };

    const remoteConfig = {
      OPENAI_API_KEY: 'new-key',
      HTTPS_PROXY: 'http://proxy.test',
      MODEL_NAME: '4',
      FRAGMENT_TOKEN_SIZE: '4096',
      TEMPERATURE: '0.5',
      API_CALL_INTERVAL: '10',
      CODE_BLOCK_PRESERVATION_LINES: '10',
      API_ENDPOINT: 'https://custom.api/v1'
    };

    mergeConfig(baseConfig, remoteConfig);

    expect(baseConfig).toEqual({
      apiEndpoint: 'https://custom.api/v1',
      apiKey: 'new-key',
      prompt: 'test prompt',
      model: 'gpt-4-turbo',
      apiCallInterval: 10,
      quiet: false,
      fragmentSize: 4096,
      temperature: 0.5,
      codeBlockPreservationLines: 10,
      httpsProxy: 'http://proxy.test'
    });
  });

  test('should not modify config for undefined remote values', () => {
    const baseConfig: Config = {
      apiEndpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: 'test-key',
      prompt: 'test prompt',
      model: 'gpt-3.5-turbo',
      apiCallInterval: 0,
      quiet: false,
      fragmentSize: 2048,
      temperature: 0.1,
      codeBlockPreservationLines: 5
    };

    const remoteConfig = {};

    const originalConfig = { ...baseConfig };
    mergeConfig(baseConfig, remoteConfig);

    expect(baseConfig).toEqual(originalConfig);
  });
});

describe.skip('server', () => {
  test('should return 400 for empty markdown content', async () => {
    const formData = new FormData();
    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      body: formData
    });

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('NO MARKDOWN CONTENT');
  });

  test('should translate markdown content', async () => {
    const formData = new FormData();
    formData.append('MD_CONTENT', '# Hello\nThis is a test');

    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      body: formData
    });

    expect(response.status).toBe(200);
    const result = await response.text();
    expect(result).toContain('# ');
  });
});

describe.skip('auth', () => {
  test('should return 401 when auth required but no token provided', async () => {
    const formData = new FormData();
    formData.append('MD_CONTENT', '# Test');
    formData.append('TARGET_LANGUAGE', 'Chinese');

    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      body: formData
    });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });

  test('should return 401 when auth required but wrong token provided', async () => {
    const formData = new FormData();
    formData.append('MD_CONTENT', '# Test');
    formData.append('TARGET_LANGUAGE', 'Chinese');

    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer wrong-token'
      },
      body: formData
    });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });

  test('should accept request when correct token provided', async () => {
    const formData = new FormData();
    formData.append('MD_CONTENT', 'Today is a good day');
    formData.append('TARGET_LANGUAGE', 'Chinese');

    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-secret-key'
      },
      body: formData
    });

    expect(response.status).toBe(200);
    const result = await response.text();
    expect(result).toMatch(/[一-龥]/);
  });

  test.skip('should accept request when auth not required', async () => {
    const formData = new FormData();
    formData.append('MD_CONTENT', '# Test');
    formData.append('TARGET_LANGUAGE', 'Chinese');

    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      body: formData
    });

    expect(response.status).toBe(200);
    const result = await response.text();
    expect(result).toMatch(/[一-龥]/);
  });
});
