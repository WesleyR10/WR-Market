/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { Control, Controller } from 'react-hook-form'

import { Input } from '../ui/input'

interface CodeInputProps {
  control: Control<any>
  name: string
  error?: string
  length?: number
  justify?: 'start' | 'center' | 'end'
  className?: string
}

export const CodeInput: React.FC<CodeInputProps> = ({
  control,
  name,
  error,
  length = 6,
  justify = 'start',
  className,
}) => {
  const [values, setValues] = React.useState(Array(length).fill(''))
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange =
    (index: number, onChange: (value: string) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value.slice(0, 1)
      const newValues = [...values]
      newValues[index] = newValue
      setValues(newValues)

      // Atualiza o valor no react-hook-form
      onChange(newValues.join(''))

      if (newValue && index < length - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    }

  const handleKeyDown =
    (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace' && !values[index] && index > 0) {
        inputsRef.current[index - 1]?.focus()
      }
    }

  const justifyClass =
    justify === 'center'
      ? 'justify-center'
      : justify === 'end'
        ? 'justify-end'
        : 'justify-start'

  return (
    <div className="space-y-2">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className={`flex space-x-3 ${justifyClass} ${className}`}>
            {values.map((_, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={values[index]}
                onChange={handleChange(index, (value) => field.onChange(value))}
                onKeyDown={handleKeyDown(index)}
                ref={(el) => {
                  inputsRef.current[index] = el
                }}
                className="h-12 w-12 rounded-lg border-2 border-emerald-600 bg-emerald-100 text-center text-2xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-0 dark:bg-emerald-100"
              />
            ))}
          </div>
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
