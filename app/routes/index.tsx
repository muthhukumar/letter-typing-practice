import * as React from 'react'
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from 'remix'
import Letter from '~/components/letter'
import Stack from '~/components/stack'
import Status from '~/components/status'
import { generateRandomString } from '~/utils'
import { useTyping } from '~/utils/hooks'
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
  const uppercaseAlphabets = Boolean(formData.get('Uppercase'))
  const numbers = Boolean(formData.get('Numbers'))
  const symbols = Boolean(formData.get('Symbols'))

  if (
    [lowercaseAlphabets, uppercaseAlphabets, numbers, symbols].every((value) => value === false)
  ) {
    return {
      error: 'At least one of the option must be selected!!!',
    }
  }

  session.set(TYPING_OPTION_KEY, {
    lowercaseAlphabets,
    uppercaseAlphabets,
    numbers,
    symbols,
  })

  // TODO: Make this dynamic
  return redirect('/', {
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

export default function Index() {
  const transition = useTransition()

  const { randomStrings, typingOptions } = useLoaderData<LoaderData>()
  const actionData = useActionData<{ error: string } | undefined>()

  const [lowercaseAlphabets, setLowercase] = React.useState(typingOptions.lowercaseAlphabets)
  const [uppercaseAlphabets, setUppercase] = React.useState(typingOptions.uppercaseAlphabets)
  const [numbers, setNumbers] = React.useState(typingOptions.numbers)
  const [symbols, setSymbols] = React.useState(typingOptions.symbols)

  const { errors, handleInputChange, letters, index, input, typedLetters } = useTyping({
    initialData: randomStrings,
    options: { uppercaseAlphabets, lowercaseAlphabets, numbers, symbols, length: 1 },
  })

  return (
    <div className="p-8">
      <div className="container max-w-2xl mx-auto">
        <div className="w-full">
          {letters && letters[index] && <Letter>{letters[index]}</Letter>}
          <input
            name="letter"
            type="text"
            onChange={handleInputChange}
            value={input}
            autoComplete="off"
            className="p-2 mx-auto mb-8 rounded-md fit-content"
          />

          <div className="flex items-center justify-center">
            <Status title="Typed Letters" value={typedLetters} />
            <Status title="Error" value={errors} />
          </div>
        </div>
        <details className="mt-6">
          <summary className="text-xl font-bold">Options</summary>
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
              <label htmlFor="Lowercase">Enable lowercase letters</label>
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

              <label htmlFor="Uppercase">Enable uppercase letters</label>
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
              <label htmlFor="Numbers">Enable numbers</label>
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
              <label htmlFor="Symbols">Enable symbols characters</label>
            </Stack>
            {actionData?.error && <p className="mb-4 text-red-600">{actionData?.error}</p>}
            <button className="w-full py-4 my-4 text-sm font-bold bg-yellow-500 rounded-md">
              {transition.state === 'submitting' ? 'Saving...' : 'Save Options'}
            </button>
          </Form>
        </details>
      </div>
    </div>
  )
}
