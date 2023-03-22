import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { PROJECT_STATUS } from '@/const/app.const'
import { LangConstant, TableConstant, PathConstant } from '@/const'
import { EventInput, TableHeaderOption } from '@/types'
import { formatCurrency, formatDate } from '@/utils'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ITechnology } from '../../types'
import StringFormat from 'string-format'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useSelector } from 'react-redux'

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
    id: 'type',
    align: 'left',
    disablePadding: true,
    label: 'Project Type',
  },
  {
    id: 'technologies',
    align: 'left',
    disablePadding: true,
    label: 'Technology',
  },
  {
    id: 'startDate',
    align: 'left',
    disablePadding: true,
    label: 'Project Start Date',
  },
  {
    id: 'endDate',
    align: 'left',
    disablePadding: true,
    label: 'Project End Date',
  },
  {
    id: 'totalCurrentCost',
    align: 'left',
    disablePadding: true,
    label: 'Total Current Cost',
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: true,
    label: 'Status',
  },
]

const createData = (prj: any) => {
  return {
    id: prj.id,
    code: prj.code,
    name: prj.name,
    type: prj.type.name,
    technologies: prj.technologies
      .map((tech: ITechnology) => tech.name)
      .join(', '),
    startDate: formatDate(prj.startDate),
    endDate: formatDate(prj.endDate),
    totalCurrentCost: formatCurrency(+prj.totalCurrentRevenue),
    status: PROJECT_STATUS[prj.status.id],
  }
}

interface PartnerProjectInformationProps {
  listProjects: any[]
}

const PartnerProjectInformation = ({
  listProjects,
}: PartnerProjectInformationProps) => {
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)

  const { permissions }: AuthState = useSelector(selectAuth)
  const { useProjectDetail } = permissions

  const [page, setPage] = useState(TableConstant.PAGE_CURRENT_DEFAULT)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)

  const rows = useMemo(() => {
    return [...listProjects]
      .slice((page - 1) * pageLimit, page * pageLimit)
      .map(prj => createData(prj))
  }, [listProjects, pageLimit, page])

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: EventInput) => {
    setPageLimit(parseInt(event.target.value, 10))
    setPage(1)
  }

  const handleRedirectToProjectDetail = (id: string) => {
    if (useProjectDetail) {
      const url = StringFormat(PathConstant.PROJECT_DETAIL_FORMAT, id)
      window.open(window.location.origin + url, '_blank')
    }
  }

  return (
    <CardForm title={i18Customer('TXT_PROJECT_INFORMATION')}>
      <TableShare
        keyName={'id'}
        isShowCheckbox={false}
        headCells={headCells}
        rows={rows}
        childComp={(row: any, index: number) => (
          <ItemRowTableV2
            useClickDetail={useProjectDetail}
            isShowCheckbox={false}
            row={row}
            key={`table-checkbox-${index}`}
            uuId={row['id']}
            keyName={'id'}
            headCells={headCells}
            onClickDetail={handleRedirectToProjectDetail}
          />
        )}
      />
      <ConditionalRender conditional={!!listProjects.length} fallback={''}>
        <TablePaginationShare
          rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
          totalElements={listProjects.length}
          pageLimit={pageLimit}
          currentPage={page}
          onChangePage={handlePageChange}
          onChangeLimitPage={handleRowsPerPageChange}
        />
      </ConditionalRender>
    </CardForm>
  )
}

export default PartnerProjectInformation
