import Typography from '@/components/common/Typography'
import ConditionalRender from '@/components/ConditionalRender'
import InputCurrency from '@/components/inputs/InputCurrency'
import { formatNumberToCurrency } from '@/utils'
import { ErrorOutlineOutlined } from '@mui/icons-material'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material'
import { makeStyles, styled } from '@mui/styles'
import clsx from 'clsx'
import { Fragment } from 'react'

export interface IHeadCell {
  key: string
  name: string
  editable: boolean
  totalCount?: number
  isShowError?: boolean
  totalName?: string
}
export interface IRow {
  id?: string
  year: number | string
  month: string
  monthId: number
  contractHeadcount?: number | string
  assignHeadcount?: number | string
}
interface ITableHeadCount {
  rows: IRow[]
  headCells: IHeadCell[]
  onInputChange: (value: string, item: any) => void
  isTotalAssignEffortError?: boolean
  disabled: boolean
}

const TableHeadCount = (props: ITableHeadCount) => {
  const classes = useStyles()
  const {
    headCells = [],
    rows = [],
    onInputChange,
    isTotalAssignEffortError,
    disabled,
  } = props

  return (
    <Box className={classes.rootTableHeadCount}>
      <TableContainer
        sx={{ maxHeight: 800, maxWidth: '100%' }}
        className={'scrollbar'}
      >
        <Table aria-label="sticky table">
          <TableBody>
            {headCells.map((headCell: IHeadCell, indexCell: number) => {
              return (
                <TableRow key={`cell-${indexCell}`}>
                  <TableCell
                    className="table-th"
                    colSpan={2}
                    component="th"
                    scope="row"
                  >
                    <Box className="th__text">{headCell.name}</Box>
                  </TableCell>
                  {rows.map((row: any, indexRow: number) => (
                    <ConditionalRender
                      conditional={!!row.id}
                      key={`row-${indexRow}`}
                    >
                      <ConditionalRender
                        conditional={headCell.editable}
                        fallback={
                          <TableCell align="center">
                            {row[headCell.key]}
                          </TableCell>
                        }
                      >
                        <TableCell
                          align="center"
                          className={clsx(
                            'input_wrapper',
                            row[headCell.key] == 0 && 'error'
                          )}
                        >
                          <InputCurrency
                            disabled={disabled}
                            suffix=""
                            value={row[headCell.key]}
                            onChange={(value: any) => onInputChange(value, row)}
                            maxLength={5}
                          />
                        </TableCell>
                      </ConditionalRender>
                    </ConditionalRender>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {headCells.map((headCell: IHeadCell) => {
        return (
          <Fragment key={headCell.key}>
            {!headCell.totalName ? null : headCell.isShowError ? (
              <Box className="table-total__wrapper">
                {isTotalAssignEffortError && <TooltipWithWarningIcon />}
                <Box
                  className={clsx(
                    'table-total table-th',
                    isTotalAssignEffortError && 'error'
                  )}
                >
                  {headCell.totalName}:
                  <Box component="span">
                    &nbsp;{formatNumberToCurrency(headCell.totalCount || 0)} MM
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box className="table-total table-th">
                {headCell.totalName}:
                <Box component="span">
                  &nbsp;{formatNumberToCurrency(headCell.totalCount || 0)} MM
                </Box>
              </Box>
            )}
          </Fragment>
        )
      })}
    </Box>
  )
}

const TooltipWithWarningIcon = (props: any) => {
  const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip
      {...props}
      classes={{ popper: className }}
      leaveDelay={200}
      title={
        <Typography styleProps={{ color: 'white' }}>
          Total Assign Effort is wrong because the assign staff table below has
          the wrong assignment date. Please correct the wrong lines.
        </Typography>
      }
    >
      <ErrorOutlineOutlined className="icon__waring" color="error" />
    </Tooltip>
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 350,
    },
  })

  return <CustomWidthTooltip {...props} />
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTableHeadCount: {
    maxWidth: '100%',
    marginBottom: '10px',
    background: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E0E0E0',
    borderRadius: '4px',
    padding: theme.spacing(0.5, 0.5, 0, 0.5),
    position: 'relative',

    '& .table-total__wrapper': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      borderBottom: `1px solid ${theme.color.grey.secondary}`,

      '& .table-total': {
        borderBottom: `none`,
      },
    },

    '& .table-total': {
      display: 'flex',
      justifyContent: 'end',
      padding: theme.spacing(2),
      borderBottom: `1px solid ${theme.color.grey.secondary}`,
    },
    '& .table-title': {
      display: 'flex',
      justifyContent: 'end',
    },
    '& .table-th': {
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: 500,
      position: 'sticky',
      left: 0,
      backgroundColor: theme.color.white,

      '&.error': {
        color: theme.color.error.primary,
      },
    },

    '& .th__text': {
      minWidth: 'max-content',
    },

    '& .input_wrapper': {
      padding: 0,

      '& input': {
        borderColor: 'transparent',
        textAlign: 'center',
        minWidth: theme.spacing(10),
        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          '-moz-appearance': 'textfield',
          margin: 0,
        },

        '&:hover': {
          borderColor: theme.color.black.primary,
        },

        '&:focus': {
          borderColor: theme.color.blue.primary,
        },
      },

      '& fieldset': {
        borderColor: 'transparent',
      },
    },
  },
  rootHeaderFilter: {
    marginBottom: theme.spacing(1),
  },
  inputWrapper: {
    padding: 0,
  },
}))
export default TableHeadCount
