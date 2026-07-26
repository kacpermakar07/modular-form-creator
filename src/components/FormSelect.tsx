import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { Select, type SelectProps } from '../design-system'

interface FormSelectProps<TFieldValues extends FieldValues> extends Omit<
  SelectProps,
  'error' | 'name' | 'form'
> {
  form: UseFormReturn<TFieldValues>
  name: Path<TFieldValues>
}

export function FormSelect<TFieldValues extends FieldValues>({
  form,
  name,
  ...props
}: FormSelectProps<TFieldValues>) {
  const error = form.formState.errors[name]?.message

  return (
    <Select
      {...props}
      error={typeof error === 'string' ? error : undefined}
      {...form.register(name)}
    />
  )
}
