import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShareFirstCol from '@/components/table/TableShareFirstCol'
import { LangConstant, TableConstant } from '@/const'
import { UNIT_OF_TIME } from '@/const/app.const'
import { OptionItem, TableHeaderOption } from '@/types'
import { allowedYears as allowedYearsUtil } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { MONTH, MONTH_INSTANCE } from '../../const'
import { projectSelector } from '../../reducer/project'
import { ProjectState } from '../../types'
import { ActualEffortQuery } from './ProjectAssignStaff'

const headCells: TableHeaderOption[] = [
  {
    id: 'id',
    align: 'left',
    disablePadding: true,
    label: 'Staff Name',
  },
  {
    id: String(MONTH.JAN),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.JAN].label,
  },
  {
    id: String(MONTH.FEB),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.FEB].label,
  },
  {
    id: String(MONTH.MAR),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.MAR].label,
  },
  {
    id: String(MONTH.APR),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.APR].label,
  },
  {
    id: String(MONTH.MAY),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.MAY].label,
  },
  {
    id: String(MONTH.JUN),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.JUN].label,
  },
  {
    id: String(MONTH.JUL),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.JUL].label,
  },
  {
    id: String(MONTH.AUG),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.AUG].label,
  },
  {
    id: String(MONTH.SEP),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.SEP].label,
  },
  {
    id: String(MONTH.OCT),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.OCT].label,
  },
  {
    id: String(MONTH.NOV),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.NOV].label,
  },
  {
    id: String(MONTH.DEC),
    align: 'left',
    disablePadding: true,
    label: MONTH_INSTANCE[MONTH.DEC].label,
  },
]

const refactorStaffActualEffort = (staffActualEffort: {
  staff: {
    code: string
    id: string
    name: string
  }
  effort: number[]
  unitOfTime: {
    id: number
    name: string
  }
}) => {
  return {
    // id: staffActualEffort.id,
    id: staffActualEffort.staff.name,
    [MONTH.JAN]: staffActualEffort.effort[MONTH.JAN],
    [MONTH.FEB]: staffActualEffort.effort[MONTH.FEB],
    [MONTH.MAR]: staffActualEffort.effort[MONTH.MAR],
    [MONTH.APR]: staffActualEffort.effort[MONTH.APR],
    [MONTH.MAY]: staffActualEffort.effort[MONTH.MAY],
    [MONTH.JUN]: staffActualEffort.effort[MONTH.JUN],
    [MONTH.JUL]: staffActualEffort.effort[MONTH.JUL],
    [MONTH.AUG]: staffActualEffort.effort[MONTH.AUG],
    [MONTH.SEP]: staffActualEffort.effort[MONTH.SEP],
    [MONTH.OCT]: staffActualEffort.effort[MONTH.OCT],
    [MONTH.NOV]: staffActualEffort.effort[MONTH.NOV],
    [MONTH.DEC]: staffActualEffort.effort[MONTH.DEC],
  }
}

interface TableActualEffortProps {
  actualEffortQuery: ActualEffortQuery
  setActualEffortQuery: Dispatch<SetStateAction<ActualEffortQuery>>
  actualEffort: { data: any[]; total: number }
}

const TableActualEffort = ({
  actualEffortQuery,
  setActualEffortQuery,
  actualEffort,
}: TableActualEffortProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { generalInfo }: ProjectState = useSelector(projectSelector)

  const [unitOfTimeLabel, setUnitOfTimeLabel] = useState('MM')

  const allowedYears = useMemo(() => {
    return allowedYearsUtil(2016, 2099)
  }, [])

  const rows = useMemo(() => {
    const base = actualEffort.data.map((staff: any) =>
      refactorStaffActualEffort(staff)
    )
    return [...base]
  }, [actualEffort])

  const handleChangePage = (_: unknown, newPage: number) => {
    setActualEffortQuery((prev: ActualEffortQuery) => ({
      ...prev,
      page: newPage,
    }))
  }
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setActualEffortQuery((prev: ActualEffortQuery) => ({
      ...prev,
      pageNum: 1,
      pageSize: +event.target.value,
    }))
  }

  const handleYearChange = (date: Date | null) => {
    setActualEffortQuery((prev: ActualEffortQuery) => ({
      ...prev,
      year: date?.getTime() || null,
    }))
  }

  const handleDivisionChange = (division: any) => {
    setActualEffortQuery((prev: ActualEffortQuery) => ({
      ...prev,
      divisionId: division.id,
    }))
  }

  const handleUnitOfTimeChange = (unitOfTime: string, option?: OptionItem) => {
    setActualEffortQuery((prev: ActualEffortQuery) => ({
      ...prev,
      unitOfTime,
    }))
    setUnitOfTimeLabel(option?.note as string)
  }

  return (
    <Box>
      <Box className={classes.headerFilter}>
        <Box sx={{ width: 160 }}>
          <InputDatepicker
            allowedYears={allowedYears}
            isShowClearIcon={false}
            views={['year']}
            inputFormat="YYYY"
            label={i18('LB_YEAR')}
            value={
              actualEffortQuery.year ? new Date(actualEffortQuery.year) : null
            }
            onChange={handleYearChange}
          />
        </Box>
        <SelectDivisionSingle
          width={260}
          value={actualEffortQuery.divisionId}
          label={i18('LB_DIVISION') || ''}
          isFullData={false}
          listDivision={generalInfo.divisions}
          placeholder={i18('PLH_SELECT_DIVISION') || ''}
          onChange={handleDivisionChange}
        />
        <FormLayout width={200}>
          <FormItem label={i18('LB_UNIT_OF_TIME')}>
            <InputDropdown
              width={200}
              isShowClearIcon={false}
              value={actualEffortQuery.unitOfTime || ''}
              listOptions={UNIT_OF_TIME}
              placeholder={i18('PLH_SELECT_UNIT_OF_TIME')}
              onChange={handleUnitOfTimeChange}
            />
          </FormItem>
        </FormLayout>
      </Box>
      <TableShareFirstCol
        useKeyIndex
        doubleFirstCol={`Month (${unitOfTimeLabel})`}
        headCells={headCells}
        rows={rows}
      />
      <ConditionalRender conditional={!!rows.length}>
        <TablePaginationShare
          rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
          totalElements={actualEffort.total}
          pageLimit={actualEffortQuery.pageSize as number}
          currentPage={actualEffortQuery.pageNum as number}
          onChangePage={handleChangePage}
          onChangeLimitPage={handleChangeRowsPerPage}
        />
      </ConditionalRender>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  headerFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}))

export default TableActualEffort
