import * as React from 'react'
import { generateRandomString, StringOptions } from '.'

const isLastIndex = (index: number, items: Array<any>) => {
  return index === items.length
}

const useTyping = ({
  initialData,
  options,
}: {
  initialData: Array<string>
  options: StringOptions
}) => {
  const [index, setIndex] = React.useState(0)
  const [errors, setErrors] = React.useState(0)
  const [typedLetters, setTypedLetters] = React.useState(0)

  const initialStringsData = Array.isArray(initialData) ? initialData : []

  const [letters, setLetters] = React.useState(initialStringsData)
  const [input, setInput] = React.useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const letter = event.target.value

    setTypedLetters((state) => state + 1)

    if (letter === letters[index]) {
      if (!isLastIndex(index, letters)) {
        setIndex((state) => state + 1)
      }

      handleGenerateNewRandomStrings()

      return
    }
    setErrors((state) => state + 1)
    setInput('')
  }

  const { lowercaseAlphabets, uppercaseAlphabets, numbers, symbols } = options

  const handleGenerateNewRandomStrings = React.useCallback(() => {
    setLetters(generateRandomString({ ...options }).split(''))
    setIndex(0)
  }, [lowercaseAlphabets, uppercaseAlphabets, numbers, symbols])

  React.useEffect(() => {
    handleGenerateNewRandomStrings()
  }, [lowercaseAlphabets, uppercaseAlphabets, numbers, symbols])

  return {
    index,
    letters,
    errors,
    typedLetters,
    input,
    handleInputChange,
  }
}

export { useTyping }
