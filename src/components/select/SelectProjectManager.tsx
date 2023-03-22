import { INPUT_TIME_DELAY } from '@/const/app.const'
import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  commonSelector,
  CommonState,
  getProjectManagers,
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
  value: OptionItem[]
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem[]) => void
  error?: boolean
  errorMessage?: string
  uniqueKey?: string
  label?: any
  require?: boolean
  disabled?: boolean
}

const initialParams = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: LIMIT_DEFAULT_SELECT,
}

const SelectProjectManager = ({
  width = '100%',
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  require = false,
  disabled = false,
}: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const { listProjectManagers, totalProjectManagers }: CommonState =
    useSelector(commonSelector)

  const [params, setParams] = useState(initialParams)
  const [loading, setLoading] = useState(false)

  const checkScrollLoading = useMemo(() => {
    if (!listProjectManagers?.length) return false
    const totalPages = Math.ceil(totalProjectManagers / params.pageSize)
    return params.pageNum < totalPages
  }, [params, listProjectManagers])

  const getListProjectManagersApi = (queryParams: any = {}) => {
    const _params = {
      ...queryParams,
    }
    setLoading(true)
    dispatch(getProjectManagers({ ..._params }))
      .unwrap()
      .finally(() => setLoading(false))
  }

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    []
  )
  function handleDebounceFn(keyword: string) {
    const _params = {
      ...params,
      pageNum: 1,
      keyword,
    }
    setParams(_params)
    getListProjectManagersApi(_params)
  }

  const handleChange = (value: any) => {
    onChange(value)
  }

  const handleInputChange = (valueSearch: string) => {
    debounceFn(valueSearch)
  }

  const handleScroll = (event: any) => {
    const listboxNode = event.currentTarget

    const position = listboxNode.scrollTop + listboxNode.clientHeight
    if (
      listboxNode.scrollHeight - position <= 1 &&
      !loading &&
      checkScrollLoading
    ) {
      getListProjectManagersApi({ ...params, pageNum: params.pageNum + 1 })
      setParams((prev: any) => ({
        ...prev,
        pageNum: prev.pageNum + 1,
      }))
    }
  }

  useEffect(() => {
    if (!listProjectManagers.length) {
      getListProjectManagersApi(params)
    }
  }, [])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!useLabel && !!label && <InputTitle title={label} required={require} />}
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          multiple
          disabled={disabled}
          placeholder={i18('PLH_SELECT_PROJECT_MANAGER')}
          listOptions={listProjectManagers}
          onChange={handleChange}
          onInputChange={handleInputChange}
          value={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
          loading={loading}
          onScroll={handleScroll}
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

export default memo(SelectProjectManager)
