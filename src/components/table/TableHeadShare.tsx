import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import { EnhancedTableProps, TableHeaderOption } from '@/types'
import { Box, TableSortLabel, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

export default function TableHeadShare(props: EnhancedTableProps) {
  const {
    numSelected = 0,
    rowCount,
    headCells,
    isShowCheckbox,
    onSelectAllClick,
    onSortChange,
    doubleFirstCol,
  } = props

  const classes = useStyles()

  const firstColRef = useRef<HTMLInputElement | null>(null)

  const [sizeFirstCol, setSizeFirstCol] = useState({
    width: 0,
    height: 0,
  })

  const hypotenuseWidth = useMemo(() => {
    return Math.sqrt(
      sizeFirstCol.width * sizeFirstCol.width +
        sizeFirstCol.height * sizeFirstCol.height
    )
  }, [sizeFirstCol])

  const hypotenuseRotate = useMemo(() => {
    const AB = sizeFirstCol.width
    const BC = sizeFirstCol.height
    const BAC = (Math.atan(BC / AB) * 180) / Math.PI
    return BAC
  }, [sizeFirstCol])

  const setSizeFirstColHeader = () => {
    const firstColEl = document.getElementById('firstColHeader')
    if (firstColEl) {
      const width = firstColEl?.offsetWidth
      const height = firstColEl?.offsetHeight
      setSizeFirstCol({
        width,
        height,
      })
    }
  }

  useEffect(() => {
    setSizeFirstColHeader()
  }, [])

  useEffect(() => {
    function resize() {
      setSizeFirstColHeader()
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <TableHead>
      <TableRow>
        {isShowCheckbox ? (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
        ) : (
          ''
        )}

        {headCells.map((headCell: TableHeaderOption, index: number) => (
          <TableCell
            sx={{
              zIndex: 1,
            }}
            key={index}
            align={headCell.align}
            ref={index === 0 ? firstColRef : null}
            id={index === 0 ? 'firstColHeader' : ''}
          >
            <span
              style={{ textTransform: 'capitalize' }}
              className={clsx(
                classes.tableCell,
                doubleFirstCol && classes.tableCellDoubleFirstCol
              )}
            >
              {!!headCell?.useSort ? (
                <TableSortLabel
                  active
                  direction={headCell.orderBy}
                  onClick={() =>
                    !!onSortChange
                      ? onSortChange(index, headCell.orderBy)
                      : null
                  }
                >
                  {headCell.label}
                </TableSortLabel>
              ) : doubleFirstCol && index === 0 ? (
                <Box
                  className={classes.doubleFirstCol}
                  sx={{
                    width: sizeFirstCol.width,
                    height: sizeFirstCol.height,
                  }}
                >
                  <Box className={classes.labelDoubleFirstCol}>
                    {doubleFirstCol}
                  </Box>
                  <Box className={classes.labelFirstColCustom}>
                    {headCell.label}
                  </Box>
                  <Box
                    component="span"
                    className={classes.hypotenuse}
                    sx={{
                      width: hypotenuseWidth + 'px',
                      transform: `rotate(${hypotenuseRotate}deg)`,
                      top: sizeFirstCol.height / 2 - 1 + 'px',
                    }}
                  ></Box>
                </Box>
              ) : (
                <Box> {headCell.label}</Box>
              )}
            </span>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  tableCell: {
    display: 'inline-block',
    width: 'max-content',
  },
  doubleFirstCol: {
    borderRight: `1px solid ${theme.color.grey.secondary}`,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  tableCellDoubleFirstCol: {},
  hypotenuse: {
    height: '1px',
    backgroundColor: theme.color.grey.secondary,
    display: 'inline-block',
    position: 'absolute',
    left: -2,
  },
  labelDoubleFirstCol: {
    position: 'absolute',
    top: 5,
    right: theme.spacing(2),
  },
  labelFirstColCustom: {
    position: 'absolute',
    bottom: 5,
    left: theme.spacing(2),
  },
}))
