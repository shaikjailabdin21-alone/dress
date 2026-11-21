export function notFound(req, res) { res.status(404).json({ message: `Route ${req.method} ${req.path} was not found.` }); }
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.statusCode || (['ValidationError', 'CastError', 'SyntaxError'].includes(err.name) ? 400 : err.code === 11000 ? 409 : 500);
  const message = status === 500 ? 'The server could not complete this request.' : err.message;
  if (status === 500) console.error(err);
  res.status(status).json({ message, ...(err.name === 'ValidationError' ? { errors: Object.values(err.errors).map(e => e.message) } : {}) });
}
