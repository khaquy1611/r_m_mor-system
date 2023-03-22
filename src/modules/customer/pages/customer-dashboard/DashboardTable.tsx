import { TableHeaderOption } from '@/types'
import { formatNumberToCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import i18next from 'i18next'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import TableCustomerDashboard from '../../components/TableCustomerDashboard'
import { CustomerState, selectCustomer } from '../../reducer/customer'

interface IProps {}

const customerRevenueHeadConfigs: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_CUSTOMER_CODE'),
  },
  {
    id: 'customerName',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_CUSTOMER_NAME'),
  },
  {
    id: 'service',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_SERVICE'),
  },
  {
    id: 'revenue',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_REVENUE'),
  },
]

const partnerCostHeadConfigs: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_PARTNER_CODE'),
  },
  {
    id: 'partnerName',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_PARTNER_NAME'),
  },
  {
    id: 'strength',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_STRENGTH'),
  },
  {
    id: 'cost',
    align: 'left',
    disablePadding: true,
    label: i18next.t('customer:TXT_COST'),
  },
]

function createDataCustomer(item: any) {
  return {
    code: item.id,
    customerName: item.name,
    service: item.skillSets,
    revenue: formatNumberToCurrency(item.revenue),
  }
}
function createDataPartner(item: any) {
  return {
    code: item.id,
    partnerName: item.name,
    strength: item.strength,
    cost: formatNumberToCurrency(item.cost),
  }
}

function DashboardTable({}: IProps) {
  const classes = useStyles()

  const { dataDashboard }: CustomerState = useSelector(selectCustomer)
  const { totalCustomerCost, totalPartnerCost } = dataDashboard

  const tableCustomers: any = useMemo(() => {
    if (!totalCustomerCost?.customers) return []
    return totalCustomerCost?.customers.map(createDataCustomer)
  }, [totalCustomerCost?.customers])

  const tablePartners: any = useMemo(() => {
    if (!totalPartnerCost?.partners) return []
    return totalPartnerCost?.partners.map(createDataPartner)
  }, [totalPartnerCost?.partners])

  return (
    <Box className={clsx('space-between-root', classes.rootTableDashboard)}>
      <TableCustomerDashboard
        title={i18next.t('customer:TXT_TOTAL_CUSTOMER_REVENUE')}
        subTitle={i18next.t('customer:TXT_TOP_CUSTOMER', { number: 5 })}
        headConfigs={customerRevenueHeadConfigs}
        dataList={tableCustomers}
        totalCount={totalCustomerCost.total ?? 0}
      />

      <TableCustomerDashboard
        title={i18next.t('customer:TXT_TOTAL_PARTNER_COST')}
        subTitle={i18next.t('customer:TXT_TOP_PARTNER', { number: 5 })}
        headConfigs={partnerCostHeadConfigs}
        dataList={tablePartners}
        totalCount={totalPartnerCost.total ?? 0}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTableDashboard: {
    paddingTop: theme.spacing(3),
    gap: theme.spacing(3),
    alignItems: 'stretch',
    flexWrap: 'wrap',

    '& > div': {
      flex: 1,
      width: `calc(50% - ${theme.spacing(1.5)})`,
      minWidth: theme.spacing(60),
      marginTop: '0 !important',
    },
  },
}))

export default DashboardTable
