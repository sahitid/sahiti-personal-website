export function allowLocalPuzzleEdit(req, res) {
  if (process.env.NODE_ENV !== 'development') { res.status(404).end(); return false; }
  const host = req.headers.host || '';
  if (!/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host) || (req.headers.origin && req.headers.origin !== `http://${host}`)) {
    res.status(403).end(); return false;
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).end(); return false; }
  if (!req.headers['content-type']?.startsWith('application/json')) { res.status(415).end(); return false; }
  return true;
}
