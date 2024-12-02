# 目录
- [简体中文](README.md)
- [English](README.en.md)

# ai-md-translate-server
这是 [chatgpt-md-translator](https://github.com/smikitky/chatgpt-md-translator) 项目的服务端移植，旨在提供 markdown 翻译服务，由 Bun.js 打包为单个可执行文件。  

## 部署
在 [release](https://github.com/ray-d-song/ai-md-translate-server/releases) 页面下载对应平台的可执行文件，并运行。

## 配置
程序会读取同目录下的 `.env` 文件，并读取其中的配置。  
完整配置可以参考 [env-example](.env.example) 文件。  

中文版注释如下：
```bash

# =====================================
# 以下配置都为可选
# =====================================
# OpenAI's API Key
OPENAI_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 服务端密钥
# 如果未设置，则不检查请求头中的密钥
# 如果设置，则需要在客户端请求头中设置，如：`Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxx`
SECRET_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxx"

# HTTPS Proxy (e.g, "https://proxy.example.com:8080")
# 同时也会读取 HTTPS_PROXY 环境变量
HTTPS_PROXY=""

# 默认语言模型
MODEL_NAME="gpt-3.5-turbo"

# 软令牌限制，用于将文件拆分为片段
FRAGMENT_TOKEN_SIZE=2048

# 采样温度，即生成文本的随机性
TEMPERATURE=0.1

# 如果命中 API 速率限制，可以设置此值为正数
# API 不会比给定的时间间隔更频繁地调用
API_CALL_INTERVAL=0

# 代码块的最大行数，用于将代码块直接发送到 API 作为上下文
CODE_BLOCK_PRESERVATION_LINES=5

# 自定义 API 地址，用于集成第三方 API 服务提供商
API_ENDPOINT="https://xxx.com/v1/chat/completions"
```

## 客户端请求
客户端发送 POST 请求，必须包含以下 FormData 参数：
- `MD_CONTENT`：markdown 内容
- `TARGET_LANGUAGE`：目标语言，如 `zh-CN` 或 `Chinese` 都可以

如果服务端设置了密钥，则需要在请求头中设置 `Authorization: Bearer 密钥值`。

同时可以在 FormData 中传递配置文件中除了`SECRET_KEY`的其他参数，传递后，服务会优先使用请求中的配置。  

以下是一个 curl 请求示例：
```bash
curl -X POST "http://localhost:3000" -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxx" -F "MD_CONTENT=..." -F "MODEL_NAME=gpt-4o" -F "FRAGMENT_TOKEN_SIZE=4096" -F "TEMPERATURE=0.5" -F "API_CALL_INTERVAL=10" -F "CODE_BLOCK_PRESERVATION_LINES=10" -F "API_ENDPOINT=https://xxx.com/v1/chat/completions"
```
