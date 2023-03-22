import InputDropdown from '@/components/inputs/InputDropdown'
import { commonSelector, CommonState } from '@/reducer/common'
import { OptionItem } from '@/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

interface IProps {
  option?: OptionItem
  width?: number | string
  useLabel?: boolean
  onChange: (value: any) => void
  error?: boolean
  errorMessage?: string
  placeholder?: string
  label?: string
  require?: boolean
  gradeId?: string
  isDisable?: boolean
}

const SelectGradeTitle = ({
  width,
  option = {},
  useLabel,
  placeholder = '',
  gradeId = '',
  onChange,
  error,
  errorMessage,
  label,
  require = false,
  isDisable = false,
}: IProps) => {
  const { listGrade }: CommonState = useSelector(commonSelector)

  const listOptions = useMemo(() => {
    let _listOptions: OptionItem[] = []
    for (const [key, value] of Object.entries(listGrade)) {
      if (key === gradeId) {
        _listOptions = value.map((item: any) => ({
          id: item.id,
          label: item.title,
          value: item.id,
          disabled: false,
          name: item.title,
        }))
      }
    }
    const itemFound = _listOptions.find(
      (item: OptionItem) => item.id === option?.id
    )
    if (!itemFound && option.id) {
      _listOptions.push(option)
    }
    return _listOptions
  }, [listGrade, gradeId, option])

  const handleChange = (value: string) => {
    const itemFound = listOptions.find((item: OptionItem) => item.id === value)
    onChange(itemFound || {})
  }

  return (
    <InputDropdown
      required={require}
      useLabel={useLabel}
      label={label}
      isDisable={isDisable || !listOptions.length}
      placeholder={!useLabel ? placeholder : ''}
      width={width ?? '100%'}
      value={(option.id as string) ?? ''}
      listOptions={listOptions}
      onChange={handleChange}
      error={error}
      errorMessage={errorMessage}
    />
  )
}

export default SelectGradeTitle
