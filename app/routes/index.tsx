import * as React from 'react'
import { Link, LoaderFunction, MetaFunction, useLoaderData } from 'remix'
import { generateRandomString } from '~/utils'

type LoaderData = Array<string>

export const meta: MetaFunction = () => {
  return {
    title: 'LTP | Letter typing practice',
    description: 'Welcome to remix!',
  }
}

export const loader: LoaderFunction = () => {
  return generateRandomString({
    length: 1,
    lowercaseAlphabets: true,
    numbers: false,
    symbols: false,
    uppercaseAlphabets: false,
  }).split('')
}

const isLastIndex = (index: number, items: Array<any>) => {
  return index === items.length
}

const useTyping = ({ initialItems }: { initialItems: Array<string> }) => {
  const [errors, setErrors] = React.useState(0)
  const [typed, setTyped] = React.useState(0)
  const letters = useLoaderData<LoaderData>()
  const [input, setInput] = React.useState<string>('')
}

export default function Index() {
  const [index, setIndex] = React.useState(0)
  const [errors, setErrors] = React.useState(0)
  const [typed, setTyped] = React.useState(0)
  const lettersFromLoader = useLoaderData<LoaderData>()

  const [letters, setLetters] = React.useState(lettersFromLoader)

  const [input, setInput] = React.useState<string>('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const letter = event.target.value

    setTyped((state) => state + 1)

    if (letter === letters[index]) {
      if (!isLastIndex(index, letters)) {
        setIndex((state) => state + 1)
      }
      console.log('here')
      setLetters(
        generateRandomString({
          length: 1,
          lowercaseAlphabets: true,
          numbers: false,
          symbols: false,
          uppercaseAlphabets: false,
        }).split(''),
      )
      setIndex(0)
      return
    }
    setErrors((state) => state + 1)
    setInput('')
  }

  return (
    <div className="container max-w-lg mx-auto">
      index route
      <Link to="/practice">Practice</Link>
    </div>
  )
}
