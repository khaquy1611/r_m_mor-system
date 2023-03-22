import InputDropdown from '@/components/inputs/InputDropdown'
import { commonSelector, CommonState, getGrades } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface IProps {
  option: OptionItem
  width?: number | string
  useLabel?: boolean
  onChange: (value: any) => void
  error?: boolean
  positionId?: string
  errorMessage?: string
  placeholder?: string
  label?: string
  require?: boolean
  isDisable?: boolean
}

const SelectGrade = ({
  width,
  option,
  positionId = '',
  useLabel,
  placeholder = '',
  onChange,
  error,
  errorMessage,
  label,
  require = false,
  isDisable = false,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const { listGrade }: CommonState = useSelector(commonSelector)

  const listOptions = useMemo(() => {
    let _listOptions: any = []
    for (const [key, value] of Object.entries(listGrade)) {
      _listOptions.push({
        id: key,
        label: key,
        value: key,
        disabled: false,
        name: key,
      })
    }
    const itemFound = _listOptions.find(
      (item: OptionItem) => item.id === option?.id
    )
    if (!itemFound && option.id) {
      _listOptions.push(option)
    }
    return _listOptions
  }, [listGrade, option])
  const handleSelectGrade = (value: string) => {
    const itemFound = listOptions.find((item: OptionItem) => item.id === value)
    onChange(itemFound ?? {})
  }
  useEffect(() => {
    if (positionId && !isDisable) {
      dispatch(getGrades({ positionId }))
    }
  }, [positionId])

  return (
    <InputDropdown
      required={require}
      useLabel={useLabel}
      label={label ?? ''}
      isDisable={isDisable || !listOptions.length}
      placeholder={!useLabel ? placeholder : ''}
      width={width ?? '100%'}
      value={(option.id as string) ?? ''}
      listOptions={listOptions}
      onChange={handleSelectGrade}
      error={error}
      errorMessage={errorMessage}
    />
  )
}

export default SelectGrade
