import { CONTRACT_NOTE_MAX_ELLIPSIS } from '@/modules/customer/const'
import { ItemRowTableProps, TableHeaderOption } from '@/types'
import { theme } from '@/ui/mui/v5'
import { getTextEllipsis } from '@/utils'
import { Box } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment, useMemo } from 'react'
import PriorityStatus from '../common/PriorityStatus'
import ConditionalRender from '../ConditionalRender'
import ActionTable from './ActionTable'
import StatusItem from './StatusItem'

export default function ItemRowTableV2(props: ItemRowTableProps) {
  const classes = useStyles()
  const {
    row,
    uuId,
    onClickItem = () => {},
    onClickDetail = () => {},
    onClickDelete = () => {},
    isShowCheckbox,
    headCells = [],
    selected = [],
    keyName = 'id',
    rowClassName,
    useClickDetail = true,
    useRightClickOpenNewTab = false,
    link = '/',
  } = props

  const handleClick = () => {
    onClickItem(uuId, row)
  }
  const handleClickDetail = () => {
    onClickDetail(uuId, row)
  }
  const handleClickDelete = () => {
    onClickDelete(uuId, row)
  }
  const isSelected = (name: string) => selected.indexOf(name) !== -1
  const isItemSelected = isSelected(row[keyName])
  const keyException = ['status', 'action', 'priority']

  const listCell = useMemo(
    () =>
      headCells.map((item: TableHeaderOption) => ({
        key: item.id,
        value: row[item.id],
        align: item.align,
        render: item.render,
      })),
    [headCells, row]
  )

  const handleLinkClick = (e: any) => {
    e.preventDefault()
  }

  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.name}
      selected={isItemSelected}
      className={rowClassName}
    >
      <ConditionalRender conditional={!!isShowCheckbox}>
        <TableCell padding="checkbox">
          <Checkbox
            onClick={handleClick}
            color="primary"
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': uuId,
            }}
          />
        </TableCell>
      </ConditionalRender>

      {listCell.map((item: any, index: number) =>
        !keyException.includes(item.key) ? (
          <TableCell
            title={item.value}
            onClick={handleClickDetail}
            key={`${index}`}
            align={item.align}
            className={clsx(
              classes.rootItemRowTable,
              useClickDetail ? 'cursor-pointer' : ''
            )}
          >
            {useRightClickOpenNewTab && (
              <a
                className={classes.link}
                href={link}
                onClick={handleLinkClick}
              ></a>
            )}
            {!!item.render ? (
              item.render(item.value, row)
            ) : (
              <Fragment>
                <span
                  title={item.value}
                  className={clsx(
                    classes.rootItemRowTable,
                    (item.key === 'id' || item.key === 'code') && 'first-item',
                    'row-item-text'
                  )}
                >
                  {item.value?.toString()
                    ? getTextEllipsis(
                        item.value.toString(),
                        item.key === 'note'
                          ? CONTRACT_NOTE_MAX_ELLIPSIS
                          : undefined
                      )
                    : ''}
                </span>
              </Fragment>
            )}
          </TableCell>
        ) : (
          <TableCell key={`${index}`} align={item.align}>
            <ConditionalRender
              key={item.key}
              conditional={item.key === 'status'}
            >
              <Box
                className={clsx(
                  classes.rootItemRowTable,
                  'flex-center cursor-pointer'
                )}
                onClick={handleClickDetail}
              >
                <StatusItem typeStatus={item.value} />
              </Box>
            </ConditionalRender>
            <ConditionalRender
              key={`${index}-action`}
              conditional={item.key === 'action'}
            >
              <ActionTable
                actions={item.value}
                onClickDetail={handleClickDetail}
                onClickDelete={handleClickDelete}
              />
            </ConditionalRender>
            <ConditionalRender
              key={`${index}-priority`}
              conditional={item.key === 'priority'}
            >
              <Box
                sx={{ cursor: useClickDetail ? 'pointer' : 'none' }}
                onClick={handleClickDetail}
              >
                <PriorityStatus priority={item.value} />
              </Box>
            </ConditionalRender>
          </TableCell>
        )
      )}
    </TableRow>
  )
}

const useStyles = makeStyles(() => ({
  rootItemRowTable: {
    position: 'relative',
    '&.first-item': {
      color: theme.color.blue.primary,
    },
    '&.flex-center': {
      display: 'flex',
      justifyContent: 'center',
    },
    '&.cursor-pointer': {
      cursor: 'pointer',
    },
  },
  link: {
    position: 'absolute',
    display: 'inline-block',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
}))
