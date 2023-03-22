import ButtonActions from '@/components/buttons/ButtonActions'
import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import FilterList from '@/components/common/FilterList'
import FormItem from '@/components/Form/FormItem/FormItem'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import InputSearch from '@/components/inputs/InputSearch'
import ModalExportToExcelTable from '@/components/modal/ModalExportToExcelTable'
import SelectBranch from '@/components/select/SelectBranch'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectDivision from '@/components/select/SelectDivision'
import SelectService from '@/components/select/SelectService'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { LIST_ACTIONS_KEY } from '@/const/table.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem, TableHeaderOption } from '@/types'
import { exportToExcelTable } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PROJECT_TYPES } from '../../const'
import {
  projectSelector,
  setProjectQueryParameters,
} from '../../reducer/project'
import { ProjectState } from '../../types'

interface ProjectListActionsProps {
  listChecked: string[]
  headCells: TableHeaderOption[]
  dataExport: any
}

const initialFilters = {
  branchId: '',
  divisionIds: [],
  type: '',
  technologyIds: [],
  startDateFrom: null,
  endDateFrom: null,
  startDateTo: null,
  endDateTo: null,
  customerId: null,
}

const ProjectListAction = ({
  listChecked,
  headCells,
  dataExport,
}: ProjectListActionsProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18 } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { projectQueryParameters }: ProjectState = useSelector(projectSelector)

  const [valueSearch, setValueSearch] = useState(
    projectQueryParameters.keyword || ''
  )
  const [filters, setFilters] = useState({
    branchId: projectQueryParameters.branchId || '',
    divisionIds: projectQueryParameters.divisionIds || [],
    type: projectQueryParameters.type || '',
    technologyIds: projectQueryParameters.technologyIds || [],
    startDateFrom: projectQueryParameters.startDateFrom || null,
    endDateFrom: projectQueryParameters.endDateFrom || null,
    startDateTo: projectQueryParameters.startDateTo || null,
    endDateTo: projectQueryParameters.endDateTo || null,
    customerId: projectQueryParameters.customerId || null,
  })
  const [dateRangeError, setDateRangeError] = useState(false)
  const [flagFilter, setFlagFilter] = useState(false)
  const [flagReset, setFlagReset] = useState(false)
  const [isShowModalApplyColumn, setIsShowModalApplyColumn] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const isButtonClearDisabled = useMemo(() => {
    return (
      !filters.branchId &&
      !filters.type &&
      !filters.technologyIds.length &&
      !filters.divisionIds.length &&
      !filters.startDateFrom &&
      !filters.endDateFrom &&
      !filters.customerId
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
    []
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...projectQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setProjectQueryParameters(newQueryParameters))
  }
  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }
  const handleNavigateToAddPage = () => {
    navigate(PathConstant.PROJECT_CREATE)
  }

  const handleFilter = () => {
    const newQueryParameters = {
      ...projectQueryParameters,
      ...filters,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setProjectQueryParameters(newQueryParameters))
  }
  const handleFilterChange = (value: any, key: string) => {
    setFlagFilter(true)
    setFlagReset(false)
    setFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleProjectStartDateChange = (dateRange: DateRange) => {
    setFlagReset(false)
    const { startDate, endDate } = dateRange
    const _dateRange = {
      startDateFrom:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      startDateTo: typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    setFilters((prev: any) => ({
      ...prev,
      ..._dateRange,
    }))
  }

  const handleProjectEndDateChange = (dateRange: DateRange) => {
    setFlagReset(false)
    const { startDate, endDate } = dateRange
    const _dateRange = {
      endDateFrom:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      endDateTo: typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    setFilters((prev: any) => ({
      ...prev,
      ..._dateRange,
    }))
  }

  const handleClearFilter = () => {
    setFilters(initialFilters)
    setFlagReset(true)
    if (flagFilter) {
      const newQueryParameters = {
        ...projectQueryParameters,
        ...initialFilters,
        customerId: null,
        pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
        pageSize: TableConstant.LIMIT_DEFAULT,
      }
      dispatch(setProjectQueryParameters(newQueryParameters))
    }
  }

  const handleChooseAction = (option: OptionItem) => {
    if (option.value === LIST_ACTIONS_KEY.EXPORT_TO_EXCEL) {
      setIsShowModalApplyColumn(true)
    }
  }

  const handleExportToExcel = (listColumnApply: TableHeaderOption[]) => {
    exportToExcelTable('project', {
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
    <Box className={classes.rootProjectListActions}>
      <Box className={classes.flexGap24}>
        <InputSearch
          placeholder={i18Project('PLH_SEARCH_PROJECT')}
          label={i18Project('LB_SEARCH')}
          value={valueSearch}
          onChange={handleSearchChange}
        />
        <FilterList
          title={i18Project('TXT_FILTER_PROJECT_LIST').toString()}
          submitDisabled={dateRangeError}
          clearDisabled={isButtonClearDisabled}
          onSubmit={handleFilter}
          onClear={handleClearFilter}
          onToggleFilter={handleToggleFilter}
        >
          {isOpenFilter ? (
            <Box className={classes.fieldFilters}>
              <SelectCustomer
                isProject
                width={260}
                value={filters.customerId}
                onChange={(customerId: OptionItem | null) =>
                  handleFilterChange(customerId, 'customerId')
                }
              />
              <FormItem label={i18Project('lB_PROJECT_TYPE')}>
                <InputDropdown
                  width={260}
                  placeholder={i18Project('PLH_SELECT_PROJECT_TYPE')}
                  listOptions={PROJECT_TYPES}
                  value={filters.type}
                  onChange={(type: string) => handleFilterChange(type, 'type')}
                />
              </FormItem>
              <SelectBranch
                label={i18Project('LB_RESPONSIBLE_BRANCH')}
                value={filters.branchId}
                width={260}
                onChange={(branchId: string) => {
                  handleFilterChange(branchId, 'branchId')
                  handleFilterChange([], 'divisionIds')
                }}
              />
              <FormItem label={i18Project('LB_PARTICIPATE_DIVISION')}>
                <SelectDivision
                  isProject={true}
                  width={260}
                  value={filters.divisionIds}
                  disabled={!filters.branchId}
                  branchId={filters.branchId}
                  placeholder={i18Project('PLH_SELECT_DIVISION')}
                  onChange={(divisionIds: OptionItem[]) =>
                    handleFilterChange(divisionIds, 'divisionIds')
                  }
                />
              </FormItem>
              <FormItem label={i18Project('LB_TECHNOLOGY')}>
                <SelectService
                  width={260}
                  placeholder={i18Project('PLH_SELECT_TECHNOLOGY')}
                  value={filters.technologyIds}
                  onChange={(technology: OptionItem[]) =>
                    handleFilterChange(technology, 'technologyIds')
                  }
                />
              </FormItem>
              <InputRangeDatePicker
                flagReset={flagReset}
                title={'Project Start Date'}
                errorMessage="Project Start Date has invalid date"
                errorMessageDateRange="Project Start Date 'To' cannot have the date before Project Start Date 'From'"
                values={{
                  startDate: filters.startDateFrom,
                  endDate: filters.startDateTo,
                }}
                onChange={handleProjectStartDateChange}
                onError={(error: boolean) => setDateRangeError(error)}
              />
              <InputRangeDatePicker
                flagReset={flagReset}
                title={'Project End Date'}
                errorMessage="Project End Date has invalid date"
                errorMessageDateRange="Project End Date 'To' cannot have the date before Project End Date 'From'"
                values={{
                  startDate: filters.endDateFrom,
                  endDate: filters.endDateTo,
                }}
                onChange={handleProjectEndDateChange}
                onError={(error: boolean) => setDateRangeError(error)}
              />
            </Box>
          ) : (
            <Box />
          )}
        </FilterList>
      </Box>

      <Box className={classes.rightActions}>
        {!!permissions.useProjectCreate && (
          <ButtonAddWithIcon onClick={handleNavigateToAddPage}>
            {i18Project('LB_ADD_NEW_PROJECT')}
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
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootProjectListActions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
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
export default ProjectListAction
