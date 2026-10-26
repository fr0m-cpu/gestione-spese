import jwt from 'jsonwebtoken';

const COOKIE = 'token';
const MAX_AGE = 30 * 24 * 60 * 60 * 1000;

function secret() {
  const s = process.env.JWT_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET mancante');
  return 'solo-per-sviluppo';
}

export function setAuthCookie(res, userId) {
  const token = jwt.sign({ sub: String(userId) }, secret(), { expiresIn: '30d' });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE);
}

export function requireAuth(req, res, next) {
  try {
    const { sub } = jwt.verify(req.cookies?.[COOKIE] ?? '', secret());
    req.userId = sub;
    next();
  } catch {
    res.status(401).json({ error: 'Accesso richiesto' });
  }
}
