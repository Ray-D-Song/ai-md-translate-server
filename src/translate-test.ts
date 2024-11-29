import { expect, test, describe } from 'bun:test';

const TEST_MARKDOWN = `
# Hello World

This is a test markdown file.

## Features

- Simple formatting
- Code blocks
- Lists

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`
`;

describe('翻译服务测试', () => {
  test('基础翻译功能', async () => {
    const formData = new FormData();
    formData.append('MD_CONTENT', TEST_MARKDOWN);

    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      body: formData
    });

    expect(response.status).toBe(200);
    const result = await response.text();

    // 验证翻译结果包含中文
    expect(result).toMatch(/[一-龥]/);
    // 验证保留了 markdown 格式
    expect(result).toMatch(/^# /m);
    expect(result).toMatch(/^## /m);
    // 验证代码块未被翻译
    expect(result).toMatch(/```javascript/);
    expect(result).toMatch(/const hello = 'world';/);
  });

  test('自定义配置', async () => {
    const formData = new FormData();
    formData.append('MD_CONTENT', TEST_MARKDOWN);
    formData.append('MODEL_NAME', '4');
    formData.append('TEMPERATURE', '0.8');
    formData.append('FRAGMENT_TOKEN_SIZE', '1000');

    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      body: formData
    });

    expect(response.status).toBe(200);
    const result = await response.text();
    expect(result).toMatch(/[一-龥]/);
  });

  test('错误处理 - 空内容', async () => {
    const formData = new FormData();
    formData.append('MD_CONTENT', '');

    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      body: formData
    });

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('NO MARKDOWN CONTENT');
  });
});
