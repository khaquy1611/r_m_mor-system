import { LangConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { getCommonStaffs } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { sortAtoZChartArray } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { debounce, isEmpty } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import AutoCompleteSearchCustom from '../common/AutoCompleteSearchCustom'
import InputTitle from '../common/InputTitle'

interface IProps {
  value: OptionItem | null
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem) => void
  placeholder?: string
  error?: boolean
  errorMessage?: string
  uniqueKey?: string
  label?: any
  require?: boolean
  queries?: any
  disabled?: boolean
  isShowEffortUsed?: boolean
  blockStaff?: string | number
  callback?: Function
  customZIndex?: boolean
  staffIdsIgnore?: string[]
  isDesEmailAndPosition?: boolean
}

const initialParams = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: LIMIT_DEFAULT_SELECT,
  keyword: '',
}
const emptyObject = {}

const SelectStaff = ({
  width = '100%',
  value = emptyObject,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  placeholder = '',
  require = false,
  queries = emptyObject,
  disabled = false,
  isShowEffortUsed = false,
  blockStaff,
  callback,
  customZIndex,
  staffIdsIgnore = [],
  isDesEmailAndPosition = false,
}: IProps) => {
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const [params, setParams] = useState({ ...initialParams })
  const [loading, setLoading] = useState<boolean>(false)
  const [listStaffLocal, setListStaffLocal] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)

  const listOptions: OptionItem[] = useMemo(() => {
    if (!listStaffLocal || !listStaffLocal.length) return []
    let _listOptions = listStaffLocal.map((item: any) => ({
      ...item,
      label: isShowEffortUsed
        ? `${item.name} - ${item.effortUsedInMonth}% Used`
        : item.name,
      value: item.id,
      id: item.id,
      description: isDesEmailAndPosition
        ? `${item?.email} - ${item?.positionName}`
        : item?.email ?? '',
    }))
    let listOptionsBlockStaff = blockStaff
      ? _listOptions.filter(
          (item: OptionItem) =>
            item.code !== blockStaff && item.id !== blockStaff
        )
      : _listOptions

    if (!!staffIdsIgnore.length) {
      return listOptionsBlockStaff.filter(
        (item: OptionItem) =>
          !staffIdsIgnore.includes(item.value?.toString() || '*')
      )
    } else {
      return sortAtoZChartArray(listOptionsBlockStaff)
    }
  }, [listStaffLocal, blockStaff])

  const debounceFn = useCallback(
    debounce(handleDebounceFn, INPUT_TIME_DELAY),
    []
  )

  function handleDebounceFn(keyword: string) {
    const _params = {
      ...params,
      ...queries,
      pageNum: PAGE_CURRENT_DEFAULT,
      keyword,
    }
    setParams(_params)
    getListStaffApi(_params)
  }

  const getListStaffApi = (queryParams: any = {}) => {
    const _params = {
      ...queryParams,
    }
    setLoading(true)
    dispatch(
      !!callback ? callback({ ..._params }) : getCommonStaffs({ ..._params })
    )
      .unwrap()
      .then((response: any) => {
        const { content: _staffs, totalElements } = response?.data
        if (queryParams.pageNum > PAGE_CURRENT_DEFAULT) {
          setListStaffLocal((prev: any[]) => [...prev, ..._staffs])
          setTotal(totalElements)
        } else {
          setListStaffLocal(_staffs)
          setTotal(totalElements)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const checkScrollLoading = useMemo(() => {
    if (!listStaffLocal?.length) return false
    const totalPages = Math.ceil(total / params.pageSize)
    return params.pageNum < totalPages
  }, [params, listStaffLocal])

  const handleChange = (value: any) => {
    onChange(value ?? {})
  }

  const handleInputChange = useCallback(
    (valueSearch: string) => {
      if (isEmpty(valueSearch)) {
        debounceFn('')
      } else {
        debounceFn(valueSearch)
      }
    },
    [queries, params, listStaffLocal]
  )

  const handleScroll = (event: any) => {
    const listboxNode = event.currentTarget

    const position = listboxNode.scrollTop + listboxNode.clientHeight
    if (
      listboxNode.scrollHeight - position <= 1 &&
      !loading &&
      checkScrollLoading
    ) {
      getListStaffApi({ ...params, ...queries, pageNum: params.pageNum + 1 })
      setParams((prev: any) => ({
        ...prev,
        pageNum: prev.pageNum + 1,
      }))
    }
  }

  useEffect(() => {
    setParams({ ...params, ...queries })
    getListStaffApi({ ...params, ...queries })
  }, [queries])

  return (
    <Box className={clsx(classes.rootFormItem)} style={{ width }}>
      {!useLabel && !!label && <InputTitle title={label} required={require} />}
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          multiple={false}
          placeholder={
            placeholder ? placeholder : i18Common('PLH_SELECT_STAFF')
          }
          disabled={disabled}
          listOptions={listOptions}
          onChange={handleChange}
          onInputChange={handleInputChange}
          onScroll={handleScroll}
          value={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
          isCustomFilter
          loading={loading}
          customZIndex={customZIndex}
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

export default memo(SelectStaff)
