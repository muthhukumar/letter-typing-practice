import { Link } from 'remix'

export default function Navbar() {
  return (
    <header className="p-12">
      <nav>
        <Link to="/">
          <p className="text-2xl font-bold">LTP | Letter Typing Practice</p>
        </Link>
      </nav>
    </header>
  )
}
