import ConditionalRender from '@/components/ConditionalRender'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, TableConstant } from '@/const'
import { IProjectRevenue } from '@/modules/project/components/ModalAddRevenue'
import { TAB_PROJECT_REVENUE_PROJECT } from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { IListProjectsParams, ProjectState } from '@/modules/project/types'
import { CurrencyType } from '@/types'
import { formatNumber } from '@/utils'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  headCellProjectRevenueByDivision,
  headCellProjectRevenueByProject,
} from '../../project-list/instance'
import ItemRowCellEnd from './ItemRowCellEnd'

interface IProp {
  projectId: string
  listCurrency: CurrencyType[]
  handleDeleteItem: (id: string, row: any) => void
  handleClickDetail: (id: string, row: any) => void
  setParams: Dispatch<SetStateAction<IListProjectsParams>>
  activeTab: number
  disabled: boolean
}
const STATUS_INVOICE_PUBLISHED = 2

const ListRevenues = ({
  projectId = '',
  listCurrency,
  handleDeleteItem,
  handleClickDetail,
  setParams,
  activeTab,
  disabled,
}: IProp) => {
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const {
    projectRevenuesByDivision,
    projectRevenuesByProject,
    totalProjectRevenue,
    totalActualRevenue,
    totalExpectedRevenue,
  }: ProjectState = useSelector(projectSelector)

  //State
  const [page, setPage] = useState(TableConstant.PAGE_CURRENT_DEFAULT)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)

  //Memo
  const isViewDetail = useMemo(() => {
    return !!projectId
  }, [projectId])
  const isTabProject = useMemo(
    () => activeTab === TAB_PROJECT_REVENUE_PROJECT,
    [activeTab]
  )
  const rows: IProjectRevenue[] = useMemo(() => {
    if (projectRevenuesByDivision && !isTabProject) {
      return projectRevenuesByDivision ?? []
    } else if (projectRevenuesByProject && isTabProject) {
      return projectRevenuesByProject ?? []
    } else return []
  }, [
    projectRevenuesByDivision,
    projectRevenuesByProject,
    isTabProject,
    isViewDetail,
  ])
  const revenueHeadCells = useMemo(() => {
    if (activeTab === TAB_PROJECT_REVENUE_PROJECT) {
      let _headCellProjectRevenueByProject = cloneDeep(
        headCellProjectRevenueByProject
      )
      !isViewDetail ? (_headCellProjectRevenueByProject[0].label = 'No') : ''
      return !disabled
        ? _headCellProjectRevenueByProject
        : _headCellProjectRevenueByProject.slice(0, -1)
    } else {
      let _headCellProjectRevenueByDivision = cloneDeep(
        headCellProjectRevenueByDivision
      )
      !isViewDetail ? (_headCellProjectRevenueByDivision[0].label = 'No') : ''
      return !disabled
        ? _headCellProjectRevenueByDivision
        : _headCellProjectRevenueByDivision.slice(0, -1)
    }
  }, [
    headCellProjectRevenueByProject,
    headCellProjectRevenueByDivision,
    activeTab,
    disabled,
  ])
  const totalActualRevenueDefault = useMemo(() => {
    let _totalActualRevenue = 0
    rows.forEach((item: any) => {
      if (item.status?.id == STATUS_INVOICE_PUBLISHED) {
        _totalActualRevenue =
          _totalActualRevenue + Number(item?.actualRevenue) * Number(item?.rate)
      }
    })
    return _totalActualRevenue
  }, [rows])
  const totalExpectRevenueDefault = useMemo(() => {
    let _totalExpectRevenue = 0
    rows.forEach((item: any) => {
      if (item.status?.id == STATUS_INVOICE_PUBLISHED) {
        _totalExpectRevenue =
          _totalExpectRevenue +
          Number(item?.expectedRevenue) * Number(item?.rate)
      }
    })
    return _totalExpectRevenue
  }, [rows])
  const rowsPageCurrent = useMemo(() => {
    let rowsPage = cloneDeep(rows)
    let _rowsPage = rowsPage.map((item: any, index: number) => ({
      ...item,
      no: isViewDetail ? item.id : index + 1,
      revenue: formatNumber(item.revenue),
      division: item.division.label,
      rate: formatNumber(item.rate),
      currency:
        item.currency.label ||
        listCurrency.find((cur: any) => cur.id == item.currency.value)?.code ||
        '',
      statusRevenue: item.status?.label ?? '',
      actualRevenue: formatNumber(item.actualRevenue),
      expectedRevenue: formatNumber(item.expectedRevenue),
      date: moment(item.date).format('MM/YYYY'),
    }))
    if (!isViewDetail) {
      let revenueRowsPage = cloneDeep(_rowsPage).reverse()
      _rowsPage = revenueRowsPage.slice(
        (page - 1) * pageLimit,
        (page - 1) * pageLimit + pageLimit
      )
    }
    return _rowsPage
  }, [rows, page, pageLimit])

  useEffect(() => {
    setPageLimit(TableConstant.LIMIT_DEFAULT)
    setPage(TableConstant.PAGE_CURRENT_DEFAULT)
  }, [activeTab])

  //Function
  const handleClick = () => {}
  const handleChangePage = (_: unknown, newPage: number) => {
    setParams(prev => ({
      ...prev,
      pageNum: Number(newPage),
    }))
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setPageLimit(parseInt(event.target.value, 10))
    setParams(prev => ({
      ...prev,
      pageNum: 1,
      pageSize: parseInt(event.target.value, 10),
    }))
  }

  return (
    <>
      <TableShare
        keyName={'id'}
        headCells={revenueHeadCells}
        rows={rowsPageCurrent}
        limitPage={pageLimit}
        pageCurrent={page}
        isShowCheckbox={false}
        isShowTotal={true}
        childComp={(row: any, index: number) => (
          <ItemRowTableV2
            row={row}
            key={`table-checkbox-${row['id']}`}
            isShowCheckbox={false}
            uuId={row['id']}
            headCells={revenueHeadCells}
            keyName={'id'}
            onClickItem={handleClick}
            onClickDelete={handleDeleteItem}
            onClickDetail={handleClickDetail}
          />
        )}
        childCompEnd={
          <ItemRowCellEnd
            isEmpty={rows.length == 0}
            totalActualRevenue={
              isViewDetail ? totalActualRevenue : totalActualRevenueDefault
            }
            totalExpectRevenue={
              isViewDetail ? totalExpectedRevenue : totalExpectRevenueDefault
            }
          />
        }
      />
      <ConditionalRender conditional={!!rows.length} fallback={''}>
        <TablePaginationShare
          rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
          totalElements={isViewDetail ? totalProjectRevenue : rows.length}
          pageLimit={pageLimit}
          currentPage={page}
          onChangePage={handleChangePage}
          onChangeLimitPage={handleChangeRowsPerPage}
        />
      </ConditionalRender>
    </>
  )
}
export default ListRevenues
