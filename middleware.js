// Routing Middleware (Vercel's current name for what's commonly called
// "Edge Middleware") that gates the whole site behind HTTP Basic Auth.
//
// Credentials are read from environment variables so nothing secret lives
// in the repo:
//   BASIC_AUTH_USER
//   BASIC_AUTH_PASS
// Set them in Vercel: Project -> Settings -> Environment Variables.
//
// Runs on every request by default (no `matcher` below = all paths).
import { next } from '@vercel/functions';

function unauthorized() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Restricted", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}

export default function middleware(request) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  // If credentials aren't configured yet, fail closed rather than
  // leaving the dashboard open.
  if (!user || !pass) {
    return unauthorized();
  }

  const authHeader = request.headers.get('authorization') || '';
  const [scheme, encoded] = authHeader.split(' ');

  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try {
      decoded = atob(encoded);
    } catch {
      // malformed base64 -> fall through to unauthorized below
    }
    const sep = decoded.indexOf(':');
    const suppliedUser = sep === -1 ? decoded : decoded.slice(0, sep);
    const suppliedPass = sep === -1 ? '' : decoded.slice(sep + 1);

    if (suppliedUser === user && suppliedPass === pass) {
      return next();
    }
  }

  return unauthorized();
}
