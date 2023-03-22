import ConditionalRender from '@/components/ConditionalRender'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { TableConstant } from '@/const'
import { setItemNotify } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { Box } from '@mui/system'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { useDispatch } from 'react-redux'
import { IQueriesReportList } from '.'
import { headCellsReportList } from '../../const'
import { setOpenConfirmDaily } from '../../reducer/dailyReport'

interface IProps {
  reportList: any[]
  totalPage: number
  setQueries: Dispatch<SetStateAction<IQueriesReportList>>
  queries: IQueriesReportList
}

const ReportList = ({
  reportList = [],
  totalPage = 0,
  setQueries,
  queries,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const handlePageChange = (_: any, newPage: number) => {
    setQueries({ ...queries, pageNum: newPage })
  }

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    setQueries({ ...queries, pageSize: newLimit })
  }

  const handleClickDetail = (value: any) => {
    dispatch(setOpenConfirmDaily(true))
    dispatch(setItemNotify({ applicationId: value }))
  }
  return (
    <Box>
      <TableShare
        keyName={'id'}
        headCells={headCellsReportList}
        rows={reportList}
        childComp={(row: any) => (
          <ItemRowTableV2
            row={row}
            key={`table-checkbox-${row['id']}`}
            uuId={row['id']}
            headCells={headCellsReportList}
            keyName={'id'}
            onClickDetail={handleClickDetail}
            onClickDelete={() => {}}
            onClickItem={() => {}}
          />
        )}
      />
      <ConditionalRender conditional={!!reportList.length} fallback={''}>
        <TablePaginationShare
          rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
          totalElements={totalPage}
          pageLimit={queries.pageSize as number}
          currentPage={queries.pageNum as number}
          onChangePage={handlePageChange}
          onChangeLimitPage={handleRowsPerPageChange}
        />
      </ConditionalRender>
    </Box>
  )
}
export default ReportList
