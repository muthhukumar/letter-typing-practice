import { createCookieSessionStorage } from 'remix'

const cookieSecret = process.env.COOKIE_SECRET

if (!cookieSecret) {
  throw new Error('Please enter valid cookie secret')
}

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__options__',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV !== 'development',
    secrets: [cookieSecret],
  },
})
