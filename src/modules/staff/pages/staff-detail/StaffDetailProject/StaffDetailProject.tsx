import InputYear from '@/components/Datepicker/InputYear'
import CardForm from '@/components/Form/CardForm'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, TableConstant } from '@/const'
import { MONTH_INSTANCE } from '@/modules/project/const'
import ModalProjectDetail from '@/modules/staff/components/ModalProjectDetail'
import { staffSelector } from '@/modules/staff/reducer/staff'
import {
  getStaffHeadcountUsed,
  getStaffProject,
} from '@/modules/staff/reducer/thunk'
import { StaffProject } from '@/modules/staff/types'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, TableHeaderOption } from '@/types'
import { formatDate, formatNumberToCurrency } from '@/utils'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const headCells: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: 'Project Code',
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Project Name',
  },
  {
    id: 'projectStartDate',
    align: 'left',
    disablePadding: true,
    label: 'Project Start Date',
  },
  {
    id: 'projectEndDate',
    align: 'left',
    disablePadding: true,
    label: 'Project End Date',
  },
  {
    id: 'technology',
    align: 'left',
    disablePadding: true,
    label: 'Technology',
  },
  {
    id: 'assignStartDate',
    align: 'left',
    disablePadding: true,
    label: 'Assign Start Date',
  },
  {
    id: 'assignEndDate',
    align: 'left',
    disablePadding: true,
    label: 'Assign End Date',
  },
  {
    id: 'projectHeadcount',
    align: 'center',
    disablePadding: true,
    label: 'Assign Effort',
  },
]

const createData = (item: StaffProject) => {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    projectStartDate: formatDate(item.startDate),
    projectEndDate: formatDate(item.endDate),
    assignStartDate: formatDate(item.assignStartDate),
    assignEndDate: formatDate(item.assignEndDate),
    projectHeadcount: `${formatNumberToCurrency(item.headcount)}%`,
    technology: item.technologies?.map(item => item.name)?.join(', ') || '',
    teamSize: item.teamSize ?? null,
    description: item.description || '',
    role: item.role || '',
  }
}

const StaffDetailProject = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)

  const { staffProject, staffHeadcounts } = useSelector(staffSelector)

  const [queryParams, setQueryParams] = useState({
    pageSize: TableConstant.LIMIT_DEFAULT,
    pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    staffId: params.staffId || '',
  })
  const [isShowModalProjectDetail, setIsShowModalProjectDetail] =
    useState(false)
  const [headcountYear, setHeadcountYear] = useState<Date | null>(new Date())
  const [projectDetail, setProjectDetail] = useState<any>({})

  const rows = useMemo(() => {
    if (!staffProject.data) return []
    return staffProject.data.map((item: StaffProject) => createData(item))
  }, [staffProject.data])

  const labelMonths = useMemo(() => {
    return Object.values(MONTH_INSTANCE).map(
      (item: { value: number; label: string }) => item.label
    )
  }, [])

  const headCountBodyRows = useMemo(() => {
    return [
      {
        label: i18nProject('LB_MONTHLY_HEADCOUNT'),
        className: (_: number | string) => 'headcount-cell',
        headcounts: staffHeadcounts.monthly,
      },
      {
        label: i18nProject('LB_ACTUAL_EFFORT'),
        className: (effortPercent: number | string) =>
          `headcount-cell ${getClassColor(effortPercent)}`,
        headcounts: staffHeadcounts.actual,
      },
    ]
  }, [staffHeadcounts])

  const getClassColor = (effortPercent: number | string) => {
    if (+effortPercent < 100) {
      return 'less-than'
    } else if (+effortPercent === 100) {
      return 'equal-than'
    } else {
      return 'more-than'
    }
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setQueryParams(prev => ({
      ...prev,
      pageNum: newPage,
    }))
  }

  const handleRowsPerPageChange = (event: EventInput) => {
    setQueryParams(prev => ({
      ...prev,
      pageNum: 1,
      pageSize: +event.target.value,
    }))
  }

  const handleClickProjectItem = (id: string, index: number) => {
    const projectSelected = rows[index]
    setProjectDetail(projectSelected ?? {})
    setIsShowModalProjectDetail(true)
  }

  const handleChangeYear = (date: Date | null) => {
    setHeadcountYear(date)
  }

  useEffect(() => {
    dispatch(updateLoading(true))
    dispatch(getStaffProject(queryParams))
      .unwrap()
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }, [queryParams])

  useEffect(() => {
    const year = !!headcountYear
      ? new Date(headcountYear).getFullYear().toString()
      : ''

    dispatch(updateLoading(true))
    dispatch(
      getStaffHeadcountUsed({
        staffId: params.staffId ?? '',
        year,
      })
    )
      .unwrap()
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }, [headcountYear])

  return (
    <Box className={classes.rootStaffProject}>
      <CardForm title={i18nProject('TXT_HEADCOUNT_INFORMATION')}>
        <InputYear
          label={i18nCommon('LB_YEAR') as string}
          value={headcountYear}
          onChange={handleChangeYear}
        />
        <Box className={classes.tableHeadcount}>
          <TableContainer
            sx={{ maxHeight: 800, maxWidth: '100%' }}
            className={'scrollbar'}
          >
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    className="table-th"
                    colSpan={2}
                    component="th"
                    scope="row"
                  >
                    <Box className="th__text">Month</Box>
                  </TableCell>
                  {labelMonths.map((month: string) => (
                    <TableCell align="center" key={month}>
                      {month}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {headCountBodyRows.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell
                      className="table-th"
                      colSpan={2}
                      component="td"
                      scope="row"
                    >
                      <Box className="th__text">{item.label}</Box>
                    </TableCell>
                    {labelMonths.map((_: string | number, index: number) => (
                      <TableCell
                        align="center"
                        key={index}
                        className={item.className(item.headcounts[index])}
                      >
                        {item.headcounts[index]
                          ? `${formatNumberToCurrency(item.headcounts[index])}%`
                          : `0%`}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardForm>

      <CardForm title={i18nStaff('TXT_PROJECT_INFORMATION')}>
        <ModalProjectDetail
          title={i18nStaff('TXT_PROJECT_DETAILS')}
          open={isShowModalProjectDetail}
          onClose={() => setIsShowModalProjectDetail(false)}
          dataProps={projectDetail}
        />
        <TableShare
          keyName="id"
          isShowCheckbox={false}
          headCells={headCells}
          rows={rows}
          childComp={(row: any, index: number) => (
            <ItemRowTableV2
              row={row}
              key={`${row['id']}-${index}`}
              headCells={headCells}
              isShowCheckbox={false}
              uuId={row['id']}
              keyName={'id'}
              onClickDetail={(id: string) => handleClickProjectItem(id, index)}
            />
          )}
        />
        {!!rows.length && (
          <TablePaginationShare
            rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
            totalElements={staffProject.total as number}
            pageLimit={queryParams.pageSize}
            currentPage={queryParams.pageNum}
            onChangePage={handlePageChange}
            onChangeLimitPage={handleRowsPerPageChange}
          />
        )}
      </CardForm>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootStaffProject: {
    '& .table-th': {
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: 500,
      position: 'sticky',
      left: 0,
      backgroundColor: theme.color.white,
    },

    '& .th__text': {
      minWidth: 'max-content',
    },

    '& .headcount-cell': {
      fontWeight: 'bolder',
    },

    '& .less-than': {
      color: theme.color.error.primary,
    },
    '& .equal-than': {
      color: theme.color.green.primary,
    },
    '& .more-than': {
      color: theme.color.orange.primary,
    },
  },
  tableHeadcount: {
    marginTop: theme.spacing(3),
    maxWidth: '100%',
    marginBottom: '10px',
    background: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E0E0E0',
    borderRadius: '4px',
    padding: theme.spacing(0.5, 0.5, 0, 0.5),
    position: 'relative',
  },
}))

export default StaffDetailProject
