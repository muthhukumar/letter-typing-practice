import * as React from 'react'
import { Link, MetaFunction } from 'remix'

export const meta: MetaFunction = () => {
  return {
    title: 'LTP | Letter typing practice',
    description: 'Welcome to remix!',
  }
}

export default function Index() {
  return (
    <div className="container max-w-lg mx-auto">
      index route
      <Link to="/practice">Practice</Link>
    </div>
  )
}
