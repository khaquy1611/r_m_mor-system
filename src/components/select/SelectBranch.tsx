import { LangConstant } from '@/const'
import {
  commonSelector,
  CommonState,
  getBranchDashboardList,
  getBranchList,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import InputDropdown from '../inputs/InputDropdown'

interface SelectBranchProps {
  value: string
  width?: number
  useLabel?: boolean
  onChange: (value: string, option?: OptionItem, keyName?: string) => void
  error?: boolean
  errorMessage?: any
  label?: any
  require?: boolean
  placeholder?: any
  disabled?: boolean
  isShowClearIcon?: boolean
  isDashboard?: boolean
  keyName?: string
  useAllBranches?: boolean
}

const SelectBranch = ({
  width,
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  require = false,
  placeholder,
  disabled = false,
  isShowClearIcon,
  isDashboard = false,
  keyName = 'branchId',
  useAllBranches = false,
}: SelectBranchProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation(LangConstant.NS_CUSTOMER)

  const { listBranches, listDashboardBranches }: CommonState =
    useSelector(commonSelector)

  const listOptions = useMemo(() => {
    if (isDashboard) {
      return listDashboardBranches
    }
    return listBranches
  }, [listBranches, listDashboardBranches])

  useEffect(() => {
    if (isDashboard) {
      dispatch(getBranchDashboardList())
    } else {
      dispatch(getBranchList({ useAllBranches }))
    }
  }, [])

  return (
    <InputDropdown
      keyName={keyName}
      required={require}
      useLabel={useLabel}
      label={label ?? t('LB_SELECT_BRANCH')}
      placeholder={!useLabel ? placeholder ?? t('PLH_SELECT_BRANCH') : ''}
      width={width ?? '100%'}
      value={value}
      listOptions={listOptions}
      isDisable={disabled}
      onChange={onChange}
      error={error}
      errorMessage={errorMessage}
      isShowClearIcon={isShowClearIcon}
    />
  )
}

export default memo(SelectBranch)
