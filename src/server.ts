import loadConfig from './loadConfig';
import translate from './index';
import { mergeConfig } from './utils/merge-config';
import logger from './utils/logger';

loadConfig().then(config => {
  logger.info('Server starting with config:', config);
  const needAuth =
    config.secretKey &&
    typeof config.secretKey === 'string' &&
    config.secretKey.length > 0;
  Bun.serve({
    async fetch(req) {
      if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }
      if (needAuth) {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (token !== config.secretKey) {
          return new Response('Unauthorized', { status: 401 });
        }
      }

      const formData = await req.formData();
      const mdContent = formData.get('MD_CONTENT');
      const targetLanguage = formData.get('TARGET_LANGUAGE');

      if (
        !mdContent ||
        typeof mdContent !== 'string' ||
        mdContent.length === 0
      ) {
        logger.warn('Received request with empty markdown content');
        return new Response('NO MARKDOWN CONTENT', { status: 400 });
      }
      if (
        !targetLanguage ||
        typeof targetLanguage !== 'string' ||
        targetLanguage.length === 0
      ) {
        logger.warn('Received request with empty target language');
        return new Response('NO TARGET LANGUAGE', { status: 400 });
      }

      const formDataObj = Object.fromEntries(formData);
      logger.info('Received translation request with config:', formDataObj);

      try {
        mergeConfig(config, formDataObj);
        const translated = await translate(mdContent, config);
        logger.info('Translation completed successfully');
        return new Response(translated);
      } catch (error) {
        logger.error('Translation failed:', error);
        return new Response('Translation failed', { status: 500 });
      }
    },
    port: 3000
  });

  logger.info('Server started on port 3000');
});
