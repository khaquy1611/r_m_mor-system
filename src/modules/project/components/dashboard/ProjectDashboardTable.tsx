import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import { formatNumberToCurrency } from '@/utils'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { MONTH_INSTANCE } from '../../const'
import { projectSelector } from '../../reducer/project'
import { ProjectState } from '../../types'
import { getPercentColor } from '../../utils'

interface IDashboardTable {
  key: string
  label: string | ReactNode
  data: any[]
  tooltipLabel: boolean
  render?: any
}

function DashboardTable() {
  const classes = useStyles()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { dashboardState }: ProjectState = useSelector(projectSelector)

  const { health } = dashboardState

  const tableOptions: IDashboardTable[] = useMemo(() => {
    return [
      {
        key: 'month',
        label: i18nProject('TXT_MONTH'),
        data: Object.values(MONTH_INSTANCE).map(
          (item: { value: number; label: string }) => item.label
        ),
        tooltipLabel: false,
        render: (item: any) => <Box style={{ fontWeight: 500 }}>{item}</Box>,
      },
      {
        key: 'contractEffort',
        label: i18nProject('TXT_ACTUAL_EFFORT'),
        data: health.contractEffort,
        tooltipLabel: false,
        render: (item: any) => <Box>{`${formatNumberToCurrency(item)}`}</Box>,
      },
      {
        key: 'totalStaff',
        label: i18nProject('TXT_TOTAL_STAFF'),
        data: health.totalStaff,
        tooltipLabel: false,
        render: (item: any) => <Box>{`${formatNumberToCurrency(item)}`}</Box>,
      },
      {
        key: 'totalStaffAvailable',
        label: i18nProject('TXT_TOTAL_STAFF_AVAILABLE'),
        data: health.staffAvailable,
        tooltipLabel: false,
        render: (item: any) => <Box>{`${formatNumberToCurrency(item)}`}</Box>,
      },
      {
        key: 'headcountSatisfaction',
        label: (
          <Box className={classes.tbHeadInfo}>
            {i18nProject('TXT_HEADCOUNT_SATISFACTION')}
            <InfoOutlinedIcon className="icon" />
          </Box>
        ),
        data: health.percentage,
        tooltipLabel: true,
        render: (item: any, index: number) => {
          return (
            <>
              {+health?.contractEffort?.[index] > 0 ? (
                <Box style={{ color: getPercentColor(item), fontWeight: 500 }}>
                  {`${formatNumberToCurrency(item)}%`}
                </Box>
              ) : (
                <Box>-</Box>
              )}
            </>
          )
        },
      },
    ]
  }, [health])

  return (
    <Box className={classes.rootDashboardTable}>
      <CardForm title="Health">
        <TableContainer
          sx={{ maxHeight: 800, maxWidth: '100%' }}
          className={'scrollbar'}
        >
          <Table aria-label="sticky table">
            <TableBody>
              {tableOptions.map((option: IDashboardTable, index: number) => (
                <TableRow key={index}>
                  <TableCell className="head__cell">
                    <Box>{option.label}</Box>
                  </TableCell>
                  {option.data.map((item: any, index: number) => (
                    <TableCell key={index}>
                      <ConditionalRender
                        conditional={!!option.render}
                        fallback={item}
                      >
                        <Box>
                          {!!option.render && option.render(item, index)}
                        </Box>
                      </ConditionalRender>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardForm>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootDashboardTable: {
    paddingTop: theme.spacing(3),

    '& .head__cell': {
      fontWeight: 700,
      position: 'sticky',
      left: 0,
      backgroundColor: theme.color.white,

      '& > div': {
        width: 'max-content',
      },
    },
  },
  tbHeadInfo: {
    display: 'flex',

    '& .icon': {
      width: theme.spacing(2),
      height: theme.spacing(2),
      marginLeft: theme.spacing(1),
      cursor: 'pointer',
    },
  },
}))

export default DashboardTable
