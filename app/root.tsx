import * as React from 'react'
import { Links, LiveReload, Meta, MetaFunction, Outlet, Scripts, useCatch } from 'remix'
import type { LinksFunction } from 'remix'

import ReactGA from 'react-ga'

import globalStylesUrl from '~/styles/global.css'
import tailwindcss from '~/styles/tailwind.css'
import darkStylesUrl from '~/styles/dark.css'
import Navbar from './components/navbar'

export const meta: MetaFunction = () => {
  return {
    title: 'LTP | Letter typing practice',
    description:
      'Letter typing practice allows you to practice individual characters rather than typing the entire word. It is important to have good muscle memory of each keys then typing entire word quickly.',
  }
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStylesUrl },
    { rel: 'stylesheet', href: tailwindcss },
    {
      rel: 'stylesheet',
      href: darkStylesUrl,
      media: '(prefers-color-scheme: dark)',
    },
  ]
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

function Document({ children, title }: { children: React.ReactNode; title?: string }) {
  React.useEffect(() => {
    ReactGA.initialize('G-DLLT7VDSWP')
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="text-white bg-black">
        <Scripts />
        {children}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

function Layout({ children }: React.PropsWithChildren<Record<string, unknown>>) {
  return (
    <div className="container max-w-6xl">
      <Navbar />
      <main>{children}</main>
      <article className="container max-w-2xl text-sm">
        <h4 className="mt-4 mb-2 text-xl font-bold">What is letter typing practice?</h4>
        <p className="mb-1">
          Letter typing practice allows you to practice individual characters rather than typing the
          entire word. It is important to have good muscle memory of each keys then typing entire
          word quickly.
        </p>
        <p>That is the main motivation behind building the Letter typing practice site.</p>

        <h4 className="mt-4 mb-2 text-xl font-bold">How to use Letter typing practice?</h4>
        <p className="mb-1">
          Letters are randomly generated and displayed on the screen at the top inside the gray
          circle. Now you should click the input and type the corresponding key in the keyboard.
        </p>
        <p className="mb-1">
          If the correct key is pressed new letter will be displayed on the screen. If the correct
          key is not pressed then the letter will not change.
        </p>
        <p>
          Options allows you to customize the letters you what to practice. You can choose between
          capital letters, lowercase letters, symbols and even numbers.
        </p>
      </article>
      <footer className="container flex items-start justify-between max-w-2xl py-6 mt-8 border-t border-gray-400">
        <div className="flex flex-col items-start">
          <h1 className="mb-1 font-bold text-yellow-400">Letter Typing Practice</h1>
          <p className="text-sm text-gray-400">
            &copy; 2021-present Muthukumar. All rights Reserved.
          </p>
        </div>
        <div className="flex flex-col items-start text-sm">
          <h2 className="mb-1 font-bold">Links</h2>
          <p>
            <a href="https://rd.nullish.in/github">Github</a>
          </p>
          <p>
            <a href="https://rd.nullish.in/twitter">Twitter</a>
          </p>
          <p>
            <a href="https://github.com/muthhukumar/letter-typing-practice">Source code</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>
      break
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>Hey, developer, you should replace this with what you want your users to see.</p>
        </div>
      </Layout>
    </Document>
  )
}
