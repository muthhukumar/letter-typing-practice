import * as React from 'react'
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
  useLoaderData,
} from 'remix'
import { generateRandomString } from '~/utils'
import { commitSession, getSession } from '~/utils/session.server'

type TypingOptions = {
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
}

type LoaderData = {
  randomStrings: Array<string>
  typingOptions: TypingOptions
}
const TYPING_OPTION_KEY = 'typingOptions'

export const meta: MetaFunction = () => {
  return {
    title: 'LTP | Letter typing practice',
    description: 'Welcome to remix!',
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const session = await getSession(request.headers.get('Cookie'))

  const lowercase = formData.get('Lowercase') ?? true
  const uppercase = formData.get('Uppercase') ?? false
  const numbers = formData.get('Numbers') ?? false
  const symbols = formData.get('Symbols') ?? false

  session.set(TYPING_OPTION_KEY, {
    lowercase,
    uppercase,
    numbers,
    symbols,
  })

  // TODO: Make this dynamic
  return redirect('/practice', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const formData = await request.formData()

  const session = await getSession(request.headers.get('Cookie'))

  const typingOptions = session.get(TYPING_OPTION_KEY)

  const lowercase = typingOptions.get('Lowercase') ?? true
  const uppercase = typingOptions.get('Uppercase') ?? false
  const numbers = typingOptions.get('Numbers') ?? false
  const symbols = typingOptions.get('Symbols') ?? false

  return json({
    randomStrings: generateRandomString({
      length: 1,
      lowercaseAlphabets: true,
      numbers: false,
      symbols: false,
      uppercaseAlphabets: false,
    }).split(''),
    typingOptions: {
      lowercase,
      uppercase,
      numbers,
      symbols,
    },
  })
}

const isLastIndex = (index: number, items: Array<any>) => {
  return index === items.length
}

export default function Index() {
  const { randomStrings, typingOptions } = useLoaderData<LoaderData>()

  const [index, setIndex] = React.useState(0)
  const [errors, setErrors] = React.useState(0)
  const [typed, setTyped] = React.useState(0)
  const [lowercase, setLowercase] = React.useState(typingOptions.lowercase)
  const [uppercase, setUppercase] = React.useState(typingOptions.uppercase)
  const [numbers, setNumbers] = React.useState(typingOptions.numbers)
  const [symbols, setSymbols] = React.useState(typingOptions.symbols)

  const [letters, setLetters] = React.useState(randomStrings)

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
          lowercaseAlphabets: lowercase,
          numbers: numbers,
          symbols: symbols,
          uppercaseAlphabets: uppercase,
        }).split(''),
      )
      setIndex(0)
      return
    }
    setErrors((state) => state + 1)
    setInput('')
  }

  return (
    <div className="container max-w-6xl mx-auto">
      {letters && letters[index] && (
        <p className="my-8 text-6xl font-bold text-center">{letters[index]}</p>
      )}
      <input
        name="letter"
        type="text"
        onChange={handleChange}
        value={input}
        autoComplete="off"
        className="rounded-md"
      />

      <div>Errors: {errors}</div>
      <div>Typed: {typed}</div>
      <h2>Options</h2>
      <Form className="flex flex-col items-start" action="post">
        <label htmlFor="Lowercase">
          <input
            type="checkbox"
            id="Lowercase"
            name="Lowercase"
            value="Lowercase"
            checked={lowercase}
            onChange={() => setLowercase((state) => !state)}
          />
          Use Lowercase
        </label>
        <label htmlFor="Uppercase">
          <input
            type="checkbox"
            id="Uppercase"
            name="Uppercase"
            value="Uppercase"
            checked={uppercase}
            onChange={() => setUppercase((state) => !state)}
          />
          Use Uppercase
        </label>
        <label htmlFor="Numbers">
          <input
            type="checkbox"
            id="Numbers"
            name="Numbers"
            value="Numbers"
            checked={numbers}
            onChange={() => setNumbers((state) => !state)}
          />
          Use Numbers
        </label>
        <label htmlFor="Symbols">
          <input
            type="checkbox"
            id="Symbols"
            name="Symbols"
            value="Symbols"
            checked={symbols}
            onChange={() => setSymbols((state) => !state)}
          />
          Use Symbols
        </label>
      </Form>
    </div>
  )
}
