import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { TableConstant } from '@/const'
import { EventInput, TableHeaderOption } from '@/types'
import { formatNumberToCurrency } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { useMemo, useState } from 'react'

const staffConfigs: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: i18next.t('project:LB_STAFF_CODE'),
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: i18next.t('common:LB_STAFF_NAME'),
  },
  {
    id: 'branch',
    align: 'left',
    disablePadding: true,
    label: i18next.t('project:LB_BRANCH'),
  },
  {
    id: 'division',
    align: 'left',
    disablePadding: true,
    label: i18next.t('project:LB_DIVISION'),
  },
  {
    id: 'currentHeadcountPercentage',
    align: 'left',
    disablePadding: true,
    label: i18next.t('project:TXT_HEADCOUNT_PERCENTAGE'),
  },
]

const formatDataTable = (item: any) => {
  return {
    id: item.staffId,
    code: item.staffCode,
    name: item.staffName,
    branch: item.branchName,
    division: item.divisionName,
    currentHeadcountPercentage: `${formatNumberToCurrency(item.headcount)}%`,
  }
}

interface IProps {
  tableLabel: string
  staffs: any[]
}

function ProjectTableStaff({ tableLabel, staffs }: IProps) {
  const classes = useStyle()

  const [currentPage, setCurrentPage] = useState(
    TableConstant.PAGE_CURRENT_DEFAULT
  )
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)

  const tableRows = useMemo(() => {
    if (!staffs || !staffs.length) return []
    const _staffs = JSON.parse(JSON.stringify(staffs))
    const result = _staffs
      .slice((currentPage - 1) * pageLimit, currentPage * pageLimit)
      .map(formatDataTable)
    return result
  }, [staffs, currentPage, pageLimit])

  const handlePageChange = (_: unknown, newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleRowsPerPageChange = (event: EventInput) => {
    setPageLimit(parseInt(event.target.value, 10))
    setCurrentPage(1)
  }

  return (
    <CardForm className={classes.rootTableStaff} title={tableLabel}>
      <TableShare
        keyName={'id'}
        headCells={staffConfigs}
        rows={tableRows}
        limitPage={0}
        pageCurrent={0}
        childComp={(row: any, index: number) => (
          <ItemRowTableV2
            headCells={staffConfigs}
            row={row}
            key={`${row['id']}-${index}`}
            uuId={row['id']}
          />
        )}
      />

      <ConditionalRender conditional={true}>
        <TablePaginationShare
          rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
          totalElements={staffs.length}
          pageLimit={pageLimit}
          currentPage={currentPage}
          onChangePage={handlePageChange}
          onChangeLimitPage={handleRowsPerPageChange}
        />
      </ConditionalRender>
    </CardForm>
  )
}

const useStyle = makeStyles((theme: Theme) => ({
  rootTableStaff: {},
}))

export default ProjectTableStaff
