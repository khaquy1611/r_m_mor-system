import InputSearch from '@/components/inputs/InputSearch'
import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/system'
import clsx from 'clsx'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
interface IListStaffSideBar {
  staffSelected: OptionItem | undefined | null
  onSelectStaff: (staff: OptionItem | null) => void
  isZoomInRightSideBar: boolean
  loading: boolean
  listStaffs: OptionItem[]
  onOpen: (isZoomInRightSideBar: boolean) => void
}

const ListStaffSideBar = ({
  staffSelected,
  onOpen,
  onSelectStaff,
  loading = false,
  listStaffs,
  isZoomInRightSideBar,
}: IListStaffSideBar) => {
  const classes = useStyles()

  const [valueSearch, setValueSearch] = useState('')
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)

  const handleSearchChange = useCallback(
    (e: string) => {
      setValueSearch(e)
    },
    [valueSearch]
  )
  const dataFilter = useMemo(
    () =>
      listStaffs.filter(
        item =>
          item?.label?.toLowerCase().includes(valueSearch.toLowerCase()) ||
          item?.code
            ?.toString()
            ?.toLowerCase()
            .includes(valueSearch.toLowerCase())
      ),
    [valueSearch, listStaffs]
  )

  return (
    <Box className={classes.rootListStaffBar}>
      {isZoomInRightSideBar ? (
        <Box className={classes.listStaffSideBarZoomIn}>
          <Box className={classes.headerStaffSideBar}>
            <KeyboardDoubleArrowRightIcon
              className={classes.cursorPointer}
              onClick={() => {
                onOpen(!isZoomInRightSideBar)
              }}
            />
            <Box className={'title-staff'}>
              {i18nDailyReport('LB_STAFF_LIST')}
            </Box>
          </Box>
          <Box className={classes.staffListWrap}>
            <Box className={'search-staff'}>
              <InputSearch
                width={'100%'}
                value={valueSearch}
                placeholder={'Staff Code, Staff Name'}
                label={'Staff Search'}
                onChange={handleSearchChange}
              />
            </Box>
            <Box className={clsx(classes.staffList, 'scrollbar')}>
              <Table
                sx={{ minWidth: '100%' }}
                aria-labelledby="tableTitle"
                size={'medium'}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align={'left'}>
                      {i18nDailyReport('LB_STAFF_CODE')}
                    </TableCell>
                    <TableCell align={'left'}>
                      {i18nCommon('LB_STAFF_NAME')}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dataFilter.map(item => (
                    <TableRow
                      className={clsx(
                        classes.cursorPointer,
                        staffSelected?.id === item.id && classes.activeStaff
                      )}
                      key={item.id}
                      onClick={() => {
                        staffSelected?.id === item.id
                          ? onSelectStaff(null)
                          : onSelectStaff(item)
                      }}
                    >
                      <TableCell
                        align={'left'}
                        className={clsx(
                          'active-text',
                          staffSelected?.id != item.id && classes.firstItem
                        )}
                      >
                        <Box className={classes.itemStaff}>{item.code}</Box>
                      </TableCell>
                      <TableCell align={'left'}>
                        <Box className={clsx(classes.boldText, 'active-text')}>
                          <Box className={classes.itemStaff}>{item.label}</Box>
                        </Box>
                        <Box
                          className={clsx(
                            classes.breakWord,
                            'ellipsis',
                            'active-text'
                          )}
                        >
                          <Box className={classes.itemStaff}>
                            {item.description}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
          {loading && (
            <Box className={classes.iconLoading}>
              <Box className={classes.itemCenter}>
                <CircularProgress
                  color="inherit"
                  size={20}
                  className="iconCircle"
                />
              </Box>
              <Box>{i18nCommon('MSG_LOADING_DATA')}</Box>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          className={clsx(
            classes.itemCenter,
            classes.listStaffSideBarZoomOut,
            classes.cursorPointer
          )}
          onClick={() => {
            onOpen(!isZoomInRightSideBar)
          }}
        >
          <KeyboardDoubleArrowLeftIcon />
        </Box>
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootListStaffBar: {
    position: 'sticky',
    top: 0,
    right: 0,
    height: '100%',
  },
  listStaffSideBarZoomIn: {
    width: '340px',
    height: 'calc(100vh - 71px)',
    background: '#ffffff',
    boxShadow:
      'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
    position: 'relative',
    transitionDuration: '350ms',
    overflow: 'hidden',
  },
  listStaffSideBarZoomOut: {
    padding: '20px',
    '& .title-staff': {
      fontSize: '18px',
      fontWeight: '700',
      flex: 1,
      textAlign: 'center',
    },
    transitionDuration: '350ms',
    overflow: 'hidden',
    width: '40px',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  activeStaff: {
    background: '#205DCE',
    '& .active-text': {
      color: '#ffffff',
    },
  },
  firstItem: {
    color: '#205DCE !important',
  },
  itemStaff: {
    maxWidth: '150px',
    minWidth: '100px',
    wordBreak: 'break-word',
  },
  headerStaffSideBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    boxShadow: 'rgb(17 17 26 / 10%) 0px 1px 0px',
    '& .title-staff': {
      fontSize: '18px',
      fontWeight: '700',
      flex: 1,
      textAlign: 'center',
    },
  },
  staffListWrap: {
    '& .search-staff': {
      padding: '20px 20px 0 20px',
    },
  },
  staffList: {
    marginTop: '20px',
    overflow: 'auto',
    height: 'calc(100vh - 200px)',
    '&.scrollbar': {
      '&::-webkit-scrollbar': {
        width: '4px',
        height: '8px',
      },
    },
  },
  breakWord: {
    wordBreak: 'break-word',
  },
  boldText: {
    fontWeight: '700',
  },
  iconLoading: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    '& .iconCircle': {
      color: '#205DCE',
    },
  },
  itemCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
export default ListStaffSideBar
