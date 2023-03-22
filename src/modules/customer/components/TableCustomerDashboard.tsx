import CardForm from '@/components/Form/CardForm'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TableShare from '@/components/table/TableShare'
import { TableHeaderOption } from '@/types'
import { formatNumberToCurrencyBigInt } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

interface IProps {
  title: string
  subTitle: string
  dataList: any[]
  headConfigs: TableHeaderOption[]
  totalCount: number
}

function TableCustomerDashboard({
  title,
  subTitle,
  dataList,
  headConfigs,
  totalCount,
}: IProps) {
  const classes = useStyles()

  return (
    <CardForm
      title={`${title}: ${formatNumberToCurrencyBigInt(totalCount)} VND`}
    >
      <Box className={classes.rootTableDashboard}>
        <Box className="table__wrapper">
          <Box className="table__title">{subTitle}</Box>
          <TableShare
            keyName={'id'}
            headCells={headConfigs}
            rows={dataList}
            limitPage={0}
            pageCurrent={0}
            childComp={(row: any, index: number) => (
              <ItemRowTableV2
                headCells={headConfigs}
                row={row}
                key={`${row['id']}-${index}`}
                uuId={row['id']}
              />
            )}
          />
        </Box>
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTableDashboard: {
    '& .title': {
      fontSize: '32px',
      fontWeight: 500,
      textAlign: 'center',
    },
    '& .currency': {
      padding: theme.spacing(3, 0),
    },

    '& .table__title': {
      color: theme.color.black.primary,
      fontSize: '14px',
      fontWeight: 500,
      paddingBottom: theme.spacing(1),
    },

    '& .MuiTable-root': {
      minWidth: '100%',
    },
  },
}))

export default TableCustomerDashboard
