export function logger(req, res, next) {
  const startedAt = performance.now();
  res.once('finish', () => {
    const elapsed = (performance.now() - startedAt).toFixed(1);
    console.info('%s %s %d %s ms', req.method, req.originalUrl, res.statusCode, elapsed);
  });
  next();
}
