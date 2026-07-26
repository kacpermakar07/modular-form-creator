import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { Input, type InputProps } from '../design-system'

interface FormInputProps<TFieldValues extends FieldValues> extends Omit<
  InputProps,
  'error' | 'name' | 'form'
> {
  form: UseFormReturn<TFieldValues>
  name: Path<TFieldValues>
}

export function FormInput<TFieldValues extends FieldValues>({
  form,
  name,
  ...props
}: FormInputProps<TFieldValues>) {
  const error = form.formState.errors[name]?.message

  return (
    <Input
      {...props}
      error={typeof error === 'string' ? error : undefined}
      {...form.register(name)}
    />
  )
}
