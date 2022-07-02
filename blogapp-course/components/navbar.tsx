import Link from 'next/link'
import { useState } from 'react'

export const Navbar = () => {
  const [signedUser, setSignedUser] = useState(false)

  return (
    <nav className="flex justify-center space-x-4 border-b border-gray-300 bg-cyan-500 pt-3 pb-3">
      {[
        ['Home', '/'],
        ['Create Post', '/create-post'],
        ['Profile', '/profile'],
      ].map(([title, url], index) => {
        return (
          <Link href={url} key={index}>
            <a className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">
              {title}
            </a>
          </Link>
        )
      })}
    </nav>
  )
}
