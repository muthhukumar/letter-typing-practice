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
import Letter from '~/components/letter'
import Status from '~/components/status'
import { generateRandomString } from '~/utils'
import { commitSession, getSession } from '~/utils/session.server'

type TypingOptions = {
  lowercaseAlphabets: boolean
  uppercaseAlphabets: boolean
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

  const lowercaseAlphabets = Boolean(formData.get('Lowercase')) ?? true
  const uppercaseAlphabets = Boolean(formData.get('Uppercase')) ?? false
  const numbers = Boolean(formData.get('Numbers')) ?? false
  const symbols = Boolean(formData.get('Symbols')) ?? false

  session.set(TYPING_OPTION_KEY, {
    lowercaseAlphabets,
    uppercaseAlphabets,
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
  const session = await getSession(request.headers.get('Cookie'))

  const typingOptionsFromSession = session.get(TYPING_OPTION_KEY)

  const typingOptions = {
    lowercaseAlphabets: true,
    uppercaseAlphabets: false,
    numbers: false,
    symbols: false,
  }

  if (typingOptionsFromSession) {
    typingOptions.lowercaseAlphabets = typingOptionsFromSession.lowercaseAlphabets ?? true
    typingOptions.uppercaseAlphabets = typingOptionsFromSession.uppercaseAlphabets ?? false
    typingOptions.numbers = typingOptionsFromSession.numbers ?? false
    typingOptions.symbols = typingOptionsFromSession.symbols ?? false
  }

  return json({
    randomStrings: generateRandomString({ ...typingOptions, length: 1 }).split(''),
    typingOptions,
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
  const [lowercaseAlphabets, setLowercase] = React.useState(typingOptions.lowercaseAlphabets)
  const [uppercaseAlphabets, setUppercase] = React.useState(typingOptions.uppercaseAlphabets)
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
      setLetters(
        generateRandomString({
          length: 1,
          lowercaseAlphabets: lowercaseAlphabets,
          numbers: numbers,
          symbols: symbols,
          uppercaseAlphabets: uppercaseAlphabets,
        }).split(''),
      )
      setIndex(0)
      return
    }
    setErrors((state) => state + 1)
    setInput('')
  }

  return (
    <div className="container max-w-xl p-8 mx-auto mt-20 border border-yellow-400 shadow-xl rounded-xl">
      {letters && letters[index] && <Letter>{letters[index]}</Letter>}
      <input
        name="letter"
        type="text"
        onChange={handleChange}
        value={input}
        autoComplete="off"
        className="mx-auto rounded-md fit-content"
      />

      <div>Errors: {errors}</div>
      <div>Typed: {typed}</div>
      <h2>Options</h2>
      <Form className="flex flex-col items-start" method="post">
        <label htmlFor="Lowercase">
          <input
            type="checkbox"
            id="Lowercase"
            name="Lowercase"
            value="true"
            checked={lowercaseAlphabets}
            onChange={() => setLowercase((state) => !state)}
          />
          Use Lowercase
        </label>
        <label htmlFor="Uppercase">
          <input
            type="checkbox"
            id="Uppercase"
            name="Uppercase"
            value="true"
            checked={uppercaseAlphabets}
            onChange={() => setUppercase((state) => !state)}
          />
          Use Uppercase
        </label>
        <label htmlFor="Numbers">
          <input
            type="checkbox"
            id="Numbers"
            name="Numbers"
            value="true"
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
            value="true"
            checked={symbols}
            onChange={() => setSymbols((state) => !state)}
          />
          Use Symbols
        </label>
        <button className="w-full py-4 my-4 text-sm font-bold bg-yellow-500 rounded-md">
          Save Options
        </button>
      </Form>
    </div>
  )
}
