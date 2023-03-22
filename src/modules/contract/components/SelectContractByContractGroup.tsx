import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import InputTitle from '@/components/common/InputTitle'
import {
  commonSelector,
  CommonState,
  getContractByContractGroup,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface SelectContractByContractGroupProps {
  value: OptionItem
  width?: number
  onChange: (value: OptionItem, keyName?: string) => void
  error?: boolean
  errorMessage?: any
  label?: any
  required?: boolean
  placeholder?: any
  contractGroup: string | number
  disabled?: boolean
  useRequestAPI?: boolean
}

const SelectContractByContractGroup = ({
  width,
  value,
  onChange,
  error,
  errorMessage,
  required = false,
  contractGroup,
  disabled,
  useRequestAPI = true,
  label,
  placeholder,
}: SelectContractByContractGroupProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()

  const { listContractByContractGroup }: CommonState =
    useSelector(commonSelector)
  const [valueSearch, setValueSearch] = useState('')

  const listOptions: OptionItem[] = useMemo(() => {
    if (!listContractByContractGroup || !listContractByContractGroup.length)
      return []
    const listOptions = structuredClone(listContractByContractGroup)
    if (!valueSearch) return listOptions
    return listOptions.filter((option: OptionItem) =>
      option.label?.toLowerCase()?.includes(valueSearch.toLowerCase())
    )
  }, [listContractByContractGroup, valueSearch])

  const handleInputChange = (value: string) => {
    setValueSearch(value)
  }

  const handleChange = (value: OptionItem) => {
    onChange(value, 'selectContractGroup')
  }

  useEffect(() => {
    if (useRequestAPI && contractGroup) {
      dispatch(getContractByContractGroup(contractGroup))
    }
  }, [contractGroup])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      <InputTitle title={label} required={required} />
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          disabled={disabled}
          keyName="selectContractGroup"
          error={error}
          errorMessage={errorMessage}
          multiple={false}
          placeholder={placeholder}
          listOptions={listOptions}
          onChange={handleChange}
          onInputChange={handleInputChange}
          value={value}
          width={width}
          isCustomFilter
        />
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: 14,
    lineHeight: 1,
  },
  formContent: {
    width: '100%',
  },
}))

export default memo(SelectContractByContractGroup)
