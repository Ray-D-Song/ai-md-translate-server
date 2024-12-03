# ai-md-translate-server
This is the server side of the [chatgpt-md-translator](https://github.com/smikitky/chatgpt-md-translator) project, aiming to provide markdown translation services. It is packaged as a single executable file using Bun.js.

## Deployment
Download the executable file for the corresponding platform from the [release](https://github.com/ray-d-song/ai-md-translate-server/releases) page and run it.

## Configuration
The configuration can be sourced from three places: environment variables, the `.env` file in the same directory, and client requests.  
The priority is: client request > environment variables > `.env` file.  
The complete configuration can be referred to the [env-example](.env.example) file.  

## Client Request
The client sends a POST request, which must include the following FormData parameters:
- `MD_CONTENT`: markdown content
- `TARGET_LANGUAGE`: target language, such as `zh-CN` or `Chinese`

If the server has set the secret key, the `Authorization` header needs to be set to `Bearer KEY`.

You can also pass other parameters in the FormData, which will take precedence over the configuration file.

Here is an example of a curl request:
```bash
curl -X POST "http://localhost:3000" -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxx" -F "MD_CONTENT=..." -F "MODEL_NAME=gpt-4o" -F "FRAGMENT_TOKEN_SIZE=4096" -F "TEMPERATURE=0.5" -F "API_CALL_INTERVAL=10" -F 
```

