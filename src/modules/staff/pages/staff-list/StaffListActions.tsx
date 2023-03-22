import ButtonActions from '@/components/buttons/ButtonActions'
import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import FilterList from '@/components/common/FilterList'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import InputSearch from '@/components/inputs/InputSearch'
import ModalExportToExcelTable from '@/components/modal/ModalExportToExcelTable'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivision from '@/components/select/SelectDivision'
import SelectMultiplePosition from '@/components/select/SelectMultiplePosition'
import SelectService from '@/components/select/SelectService'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { LIST_ACTIONS_KEY } from '@/const/table.const'
import { jobType, status } from '@/modules/staff/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem, TableHeaderOption } from '@/types'
import { exportToExcelTable } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setStaffQueryParameters, staffSelector } from '../../reducer/staff'
import { StaffState } from '../../types'

interface StaffListActionsProps {
  listChecked: string[]
  headCells: TableHeaderOption[]
  dataExport: any
}

const initialFilters = {
  branchId: '',
  jobType: '',
  positionIds: [],
  skillsId: [],
  startDate: null,
  endDate: null,
  divisionIds: [],
  status: '',
}

const StaffListActions = ({
  listChecked,
  headCells,
  dataExport,
}: StaffListActionsProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)

  const { permissions }: AuthState = useSelector(selectAuth)
  const { staffQueryParameters }: StaffState = useSelector(staffSelector)

  const [valueSearch, setValueSearch] = useState(
    staffQueryParameters.keyword || ''
  )
  const [filters, setFilters] = useState({
    branchId: staffQueryParameters.branchId || '',
    jobType: staffQueryParameters.jobType || '',
    positionIds: staffQueryParameters.positionIds || [],
    skillsId: staffQueryParameters.skillsId || [],
    startDate: staffQueryParameters.startDate || null,
    endDate: staffQueryParameters.endDate || null,
    divisionIds: staffQueryParameters.divisionIds || [],
    status: staffQueryParameters.status || '',
  })
  const [dateRangeError, setDateRangeError] = useState(false)
  const [flagFilter, setFlagFilter] = useState(false)
  const [flagReset, setFlagReset] = useState(false)
  const [isShowModalApplyColumn, setIsShowModalApplyColumn] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const isButtonClearDisabled = useMemo(() => {
    return (
      !filters.jobType &&
      !filters.startDate &&
      !filters.endDate &&
      !filters.branchId &&
      !filters.status &&
      !filters.positionIds.length &&
      !filters.divisionIds.length &&
      !filters.skillsId.length
    )
  }, [filters])

  const listActions = useMemo(() => {
    return [
      {
        id: 1,
        label: i18('TXT_EXPORT_TO_EXCEL'),
        value: LIST_ACTIONS_KEY.EXPORT_TO_EXCEL,
        disabled: !listChecked.length,
      },
    ]
  }, [listChecked])

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [staffQueryParameters]
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...staffQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setStaffQueryParameters(newQueryParameters))
  }
  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handleNavigateToAddPage = () => {
    navigate(PathConstant.STAFF_CREATE)
  }

  const handleFilterChange = (value: any, key: string) => {
    setFilters((prev: any) => ({
      ...prev,
      divisionIds: key !== 'branchId' ? prev.divisionIds : [],
      positionIds:
        key !== 'branchId' && key !== 'divisionIds' ? prev.positionIds : [],
      [key]: value,
    }))
  }

  const handleDateRangeChange = (dateRange: DateRange) => {
    setFlagReset(false)
    const { startDate, endDate } = dateRange
    const _dateRange = {
      startDate:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      endDate: typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    setFilters((prev: any) => ({
      ...prev,
      ..._dateRange,
    }))
  }

  const handleFilter = () => {
    setFlagFilter(true)
    setFlagReset(false)
    const newQueryParameters = {
      ...staffQueryParameters,
      ...filters,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setStaffQueryParameters(newQueryParameters))
  }

  const handleClearFilter = () => {
    setFilters(initialFilters)
    setFlagReset(true)
    if (flagFilter) {
      const newQueryParameters = {
        ...staffQueryParameters,
        ...initialFilters,
        pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
        pageSize: TableConstant.LIMIT_DEFAULT,
      }
      dispatch(setStaffQueryParameters(newQueryParameters))
    }
  }

  const handleChooseAction = (option: OptionItem) => {
    if (option.value === LIST_ACTIONS_KEY.EXPORT_TO_EXCEL) {
      setIsShowModalApplyColumn(true)
    }
  }

  const handleExportToExcel = (listColumnApply: TableHeaderOption[]) => {
    exportToExcelTable('staff', {
      listColumnApply,
      dataExport,
    })
  }

  const handleToggleFilter = (isOpen: boolean) => {
    setIsOpenFilter(isOpen)
  }

  useEffect(() => {
    if (!isButtonClearDisabled) {
      setFlagFilter(true)
    }
  }, [])

  return (
    <Fragment>
      <Box className={classes.rootStaffListActions}>
        <Box className={classes.flexGap24}>
          <InputSearch
            placeholder="Staff Code, Staff Name"
            label="Search"
            value={valueSearch}
            onChange={handleSearchChange}
          />
          <FilterList
            title="Filter Staff List"
            submitDisabled={dateRangeError}
            clearDisabled={isButtonClearDisabled}
            onSubmit={handleFilter}
            onClear={handleClearFilter}
            onToggleFilter={handleToggleFilter}
          >
            {isOpenFilter ? (
              <Box className={classes.fieldFilters}>
                <SelectBranch
                  label="Branch"
                  placeholder="Select Branch"
                  value={filters.branchId}
                  width={260}
                  onChange={(value: string) =>
                    handleFilterChange(value, 'branchId')
                  }
                />
                <SelectDivision
                  width={260}
                  label="Division"
                  placeholder="Select Divisions"
                  disabled={!filters.branchId}
                  branchId={filters.branchId}
                  value={filters.divisionIds}
                  onChange={(divisionIds: OptionItem[]) =>
                    handleFilterChange(divisionIds, 'divisionIds')
                  }
                />
                <SelectMultiplePosition
                  maxLength={5}
                  label={i18('LB_POSITION') ?? ''}
                  value={filters.positionIds}
                  width={260}
                  disabled={!filters.divisionIds.length}
                  divisionIds={
                    filters.divisionIds.map((division: OptionItem) =>
                      division.id?.toString()
                    ) as string[]
                  }
                  onChange={(value: OptionItem[]) =>
                    handleFilterChange(value, 'positionIds')
                  }
                />
                <InputDropdown
                  width={260}
                  keyName={'jobType'}
                  label={i18Staff('LB_JOB_TYPE') ?? ''}
                  placeholder={i18Staff('PLH_SELECT_JOB_TYPE') ?? ''}
                  listOptions={jobType}
                  value={filters.jobType}
                  onChange={(value: string) =>
                    handleFilterChange(value, 'jobType')
                  }
                />
                <SelectService
                  maxLength={10}
                  width={260}
                  label="Skills"
                  placeholder="Select Skills"
                  value={filters.skillsId}
                  onChange={(skillSets: OptionItem[]) =>
                    handleFilterChange(skillSets, 'skillsId')
                  }
                />
                <InputDropdown
                  width={260}
                  label={i18Staff('LB_STATUS') ?? ''}
                  placeholder={i18Staff('PLH_SELECT_STATUS') ?? ''}
                  listOptions={status}
                  value={filters.status.toString()}
                  onChange={(value: string) =>
                    handleFilterChange(value, 'status')
                  }
                />
                <InputRangeDatePicker
                  flagReset={flagReset}
                  errorMessageDateRange="Onboard End Date cannot have the date before Onboard Start Date"
                  values={{
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                  }}
                  title="Onboard Date"
                  onChange={handleDateRangeChange}
                  onError={(error: boolean) => setDateRangeError(error)}
                />
              </Box>
            ) : (
              <Box />
            )}
          </FilterList>
        </Box>
        <Box className={classes.rightActions}>
          {!!permissions.useStaffCreate && (
            <ButtonAddWithIcon onClick={handleNavigateToAddPage}>
              New Staff
            </ButtonAddWithIcon>
          )}
          <ButtonActions
            listOptions={listActions}
            onChooseOption={handleChooseAction}
          />
          {isShowModalApplyColumn && (
            <ModalExportToExcelTable
              listColumn={headCells}
              onClose={() => setIsShowModalApplyColumn(false)}
              onSubmit={handleExportToExcel}
            />
          )}
        </Box>
      </Box>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootStaffListActions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
  flexGap24: {
    display: 'flex',
    gap: theme.spacing(3),
    flexWrap: 'wrap',
  },
  fieldFilters: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  rightActions: {
    display: 'flex',
    gap: theme.spacing(3),
  },
}))

export default StaffListActions
