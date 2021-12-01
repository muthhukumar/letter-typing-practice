import * as React from 'react'
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
  useLoaderData,
  useTransition,
} from 'remix'
import Letter from '~/components/letter'
import Stack from '~/components/stack'
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
  const transition = useTransition()

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
        className="p-2 mx-auto mb-8 rounded-md fit-content"
      />

      <Stack>
        <Status title="Typed" value={typed} />
        <Status title="Error" value={errors} />
      </Stack>

      <div className="flex items-center justify-start">
        <span className="ml-2"></span>
      </div>
      <h2 className="mt-6 text-xl font-bold">Options</h2>
      <Form className="flex flex-col items-start mt-2" method="post">
        <Stack>
          <input
            type="checkbox"
            id="Lowercase"
            name="Lowercase"
            value="true"
            checked={lowercaseAlphabets}
            onChange={() => setLowercase((state) => !state)}
          />
          <label htmlFor="Lowercase">use lowercase</label>
        </Stack>
        <Stack>
          <input
            type="checkbox"
            id="Uppercase"
            name="Uppercase"
            value="true"
            checked={uppercaseAlphabets}
            onChange={() => setUppercase((state) => !state)}
          />

          <label htmlFor="Uppercase">use uppercase</label>
        </Stack>
        <Stack>
          <input
            type="checkbox"
            id="Numbers"
            name="Numbers"
            value="true"
            checked={numbers}
            onChange={() => setNumbers((state) => !state)}
          />
          <label htmlFor="Numbers">use numbers</label>
        </Stack>
        <Stack>
          <input
            type="checkbox"
            id="Symbols"
            name="Symbols"
            value="true"
            checked={symbols}
            onChange={() => setSymbols((state) => !state)}
          />
          <label htmlFor="Symbols">use symbols</label>
        </Stack>
        <button className="w-full py-4 my-4 text-sm font-bold bg-yellow-500 rounded-md">
          {transition.state === 'submitting' ? 'Saving...' : 'Save Options'}
        </button>
      </Form>
    </div>
  )
}
