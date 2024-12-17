/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Control, Controller } from 'react-hook-form'

import { Input } from '../aceternity-UI/input'
import { Label } from '../aceternity-UI/label'
import { LabelInputContainer } from './label-input-container'

type InputWithLabelProps = {
  id: string
  label: string
  placeholder?: string
  type?: string
  className?: string
  control: Control<any>
  name: string
  error?: string
  defaultValue?: string
}

export const InputWithLabel = ({
  id,
  label,
  placeholder,
  type = 'text',
  className,
  control,
  name,
  error,
  defaultValue,
}: InputWithLabelProps) => {
  return (
    <LabelInputContainer className={className}>
      <Label
        htmlFor={id}
        className="text-sm font-medium text-emerald-800 dark:text-emerald-900"
      >
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || ''}
        render={({ field }) => {
          return (
            <Input
              {...field}
              id={id}
              placeholder={placeholder}
              type={type}
              className="bg-white/80 text-emerald-900 placeholder:text-emerald-500/50"
              onChange={(e) => {
                field.onChange(e)
              }}
            />
          )
        }}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-500">{error}</p>
      )}
    </LabelInputContainer>
  )
}
