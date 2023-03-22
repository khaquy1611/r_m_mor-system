import InputDropdown from '@/components/inputs/InputDropdown'
import { commonSelector, CommonState, getLeaderGrades } from '@/reducer/common'
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
  errorMessage?: string
  placeholder?: string
  label?: string
  require?: boolean
  isDisable?: boolean
  positionId?: string
  gradeId?: string
}

const SelectLeaderGrade = ({
  width,
  option,
  useLabel,
  placeholder = '',
  onChange,
  error,
  errorMessage,
  label,
  require = false,
  isDisable = false,
  positionId = '',
  gradeId = '',
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const { leaderGrades }: CommonState = useSelector(commonSelector)

  const listOptions = useMemo(() => {
    let _listOptions: any = []
    for (const [key, value] of Object.entries(leaderGrades)) {
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
  }, [leaderGrades, option])
  const handleChange = (value: string) => {
    const itemFound = listOptions.find((item: OptionItem) => item.id === value)
    onChange(itemFound || {})
  }
  useEffect(() => {
    if (positionId && gradeId) {
      dispatch(getLeaderGrades({ positionId, gradeId }))
    }
  }, [positionId, gradeId])

  return (
    <InputDropdown
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

export default SelectLeaderGrade
