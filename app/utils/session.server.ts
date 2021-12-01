import { createCookieSessionStorage } from 'remix'

const cookieSecret = process.env.COOKIE_SECRET

console.log('here', cookieSecret)

if (!cookieSecret) {
  throw new Error('Please enter valid cookie secret')
}

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV !== 'development',
    secrets: [cookieSecret],
  },
})
