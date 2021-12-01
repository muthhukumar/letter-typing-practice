import { Link } from 'remix'

export default function Navbar() {
  return (
    <header className="p-12">
      <nav>
        <Link to="/">
          <p className="text-2xl font-bold text-yellow-400">Letter Typing Practice</p>
        </Link>
      </nav>
    </header>
  )
}
