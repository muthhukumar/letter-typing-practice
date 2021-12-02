const getRandomIntBetweenRange = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface StringValuesType {
  uppercaseAlphabets: Array<string>
  lowercaseAlphabets: Array<string>
  symbols: Array<string>
  numbers: Array<number>
}

export interface StringOptions {
  length: number
  uppercaseAlphabets: boolean
  lowercaseAlphabets: boolean
  symbols: boolean
  numbers: boolean
}

const stringValues: StringValuesType = {
  uppercaseAlphabets: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ],
  lowercaseAlphabets: [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ],
  numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  symbols: ['!', '@', '#', '$', '%', '^', '&', '*'],
}

type StringValueKeysType = keyof typeof stringValues

const generateRandomString = (options: StringOptions) => {
  const { length, ...otherOptions } = options

  return Array.from({ length: length })
    .map(() => {
      const stringOptionsValueClone = { ...stringValues }

      const stringOptionKeys = (Object.keys(stringValues) as StringValueKeysType[]).filter(
        (key) => {
          const optionValue = otherOptions[key]

          if (optionValue) {
            return true
          }
          if (key in stringOptionsValueClone && stringOptionsValueClone[key]) {
            delete stringOptionsValueClone[key]
          }

          return false
        },
      )

      if (Object.keys(stringOptionsValueClone).length === 0) {
        return []
      }

      const stringOptionIndex = getRandomIntBetweenRange(0, stringOptionKeys.length - 1)

      const stringOption = stringOptionKeys[stringOptionIndex] as StringValueKeysType

      const randomValueIndex = getRandomIntBetweenRange(0, stringOption.length)

      return stringOptionsValueClone[stringOption][randomValueIndex]
    })
    .join('')
}

export { generateRandomString }
