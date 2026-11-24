import { Router } from 'express';
import { fileURLToPath } from 'node:url';

const specPath = fileURLToPath(new URL('../../openapi.yaml', import.meta.url));
const swagger = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14';

export const docs = Router();

docs.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Store API documentation</title>
  <link rel="stylesheet" href="${swagger}/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui">
    <p>Open the <a href="/docs/openapi.yaml">OpenAPI specification</a> if Swagger UI cannot load.</p>
  </div>
  <script src="${swagger}/swagger-ui-bundle.js"></script>
  <script>
    if (window.SwaggerUIBundle) {
      window.SwaggerUIBundle({
        url: '/docs/openapi.yaml',
        dom_id: '#swagger-ui',
        validatorUrl: null
      });
    }
  </script>
</body>
</html>`);
});

docs.get('/openapi.yaml', (req, res) => {
  res.type('application/yaml').sendFile(specPath);
});
