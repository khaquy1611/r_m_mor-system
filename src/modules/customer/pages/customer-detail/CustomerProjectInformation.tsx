import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import ItemRowTable from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, TableConstant, PathConstant } from '@/const'
import { IProject } from '@/modules/customer/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { formatCurrency } from '@/utils'
import i18next from 'i18next'
import { ChangeEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'

const tableOptions: any[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_PROJECT_CODE'),
  },
  {
    id: 'projectName',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_PROJECT_NAME'),
  },
  {
    id: 'projectType',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_PROJECT_TYPE'),
  },
  {
    id: 'technology',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_TECHNOLOGY'),
  },
  {
    id: 'startDate',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_PROJECT_START_DATE'),
  },
  {
    id: 'endDate',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_PROJECT_END_DATE'),
  },
  {
    id: 'totalCurrentRevenue',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_TOTAL_CURRENT_REVENUE'),
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: true,
    label: i18next.t('customer:LB_STATUS'),
  },
]

export function createData(item: any) {
  return {
    id: item.id,
    code: item.code,
    projectName: item.name,
    projectType: item.type.name,
    technology: item.technologies,
    startDate: item.startDate,
    endDate: item.endDate,
    totalCurrentRevenue: formatCurrency(+item.totalCurrentRevenue),
    status: item.status,
  }
}

interface IProps {
  projects: IProject[]
}

const CustomerProjectInformation = ({ projects }: IProps) => {
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { permissions }: AuthState = useSelector(selectAuth)
  const { useProjectDetail } = permissions

  const [page, setPage] = useState(TableConstant.PAGE_CURRENT_DEFAULT)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)

  const projectsPaginate = useMemo(() => {
    if (!projects || !projects.length) return []
    return [...projects]
      .slice((page - 1) * pageLimit, page * pageLimit)
      .map((project: IProject) => createData(project))
  }, [projects, pageLimit, page])

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        headCells={tableOptions}
        rows={projectsPaginate}
        limitPage={pageLimit}
        pageCurrent={page}
        childComp={(row: any, index: number) => (
          <ItemRowTable
            useClickDetail={useProjectDetail}
            headCells={tableOptions}
            row={row}
            key={`${row.id}-${index}`}
            isShowCheckbox={false}
            uuId={row['id']}
            onClickDetail={handleRedirectToProjectDetail}
          />
        )}
      />
      <ConditionalRender conditional={!!projects.length} fallback={''}>
        <TablePaginationShare
          rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
          totalElements={projects.length}
          pageLimit={pageLimit}
          currentPage={page}
          onChangePage={handlePageChange}
          onChangeLimitPage={handleRowsPerPageChange}
        />
      </ConditionalRender>
    </CardForm>
  )
}

export default CustomerProjectInformation
