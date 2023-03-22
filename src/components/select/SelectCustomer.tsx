import { LangConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  commonSelector,
  CommonState,
  getCommonCustomers,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import _ from 'lodash'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import AutoCompleteSearchCustom from '../common/AutoCompleteSearchCustom'
import InputTitle from '../common/InputTitle'

interface IProps {
  keyName?: string
  value: OptionItem | null
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem | null, keyName?: string) => void
  error?: boolean
  errorMessage?: string
  label?: any
  placeholder?: string
  require?: boolean
  isProject?: boolean
  disabled?: boolean
}

const initialParams = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: 0,
}

const SelectCustomer = ({
  width = '100%',
  value,
  onChange,
  error,
  errorMessage,
  label,
  require = false,
  isProject,
  keyName = 'customerId',
  placeholder,
  disabled = false,
}: IProps) => {
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const dispatch = useDispatch<AppDispatch>()

  const { listCommonCustomers }: CommonState = useSelector(commonSelector)
  const [params, setParams] = useState(initialParams)
  const [loading, setLoading] = useState(false)

  const classes = useStyles()

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    []
  )

  function handleDebounceFn(keyword: string) {
    const _params = {
      ...params,
      pageNum: PAGE_CURRENT_DEFAULT,
      keyword,
    }
    setParams(_params)
    getListCustomersApi(_params)
  }

  const getListCustomersApi = (queryParams: any = {}) => {
    const _params = {
      ...queryParams,
      isProject,
    }
    setLoading(true)
    dispatch(getCommonCustomers({ ..._params }))
      .unwrap()
      .finally(() => setLoading(false))
  }

  const handleChange = (value: any) => {
    onChange(value, keyName)
  }

  const handleInputChange = (valueSearch: string) => {
    const isItemHadChoose = listCommonCustomers?.find(
      (option: any) => option.name === valueSearch
    )
    if (
      (isItemHadChoose && value && value.value) ||
      (!isItemHadChoose && !listCommonCustomers?.length)
    ) {
      debounceFn('')
    } else {
      debounceFn(valueSearch)
    }
  }

  useEffect(() => {
    if (!listCommonCustomers.length) {
      getListCustomersApi(params)
    }
  }, [])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      <InputTitle
        title={label || i18Common('LB_CUSTOMER')}
        required={require}
      />
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          disabled={disabled}
          multiple={false}
          placeholder={placeholder ?? i18Common('PLH_SELECT_CUSTOMER')}
          listOptions={listCommonCustomers}
          onChange={handleChange}
          onInputChange={handleInputChange}
          value={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
          loading={loading}
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

export default memo(SelectCustomer)
