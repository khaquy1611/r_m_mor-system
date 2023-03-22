import { LangConstant, PathConstant } from '@/const'
import { BASE_WS } from '@/const/api.const'
import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { useClickOutside2 } from '@/hooks'
import { setOpenConfirmDaily } from '@/modules/daily-report/reducer/dailyReport'
import { AuthState, selectAuth } from '@/reducer/auth'
import {
  commonSelector,
  CommonState,
  getNotificationsForUser,
  getNumberOfNotification,
  readNotify,
  setItemNotify,
  setNotificationsForUser,
  setReCallNotify,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { IQueries } from '@/types'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Box, CircularProgress, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Client } from '@stomp/stompjs'
import clsx from 'clsx'
import { cloneDeep, isEmpty } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import String2Color from 'string-to-color'
import NoData from '../common/NoData'
import NotificationItem from './NotificationItem'

export interface INotificationsForUser {
  id: string | number
  createAt: string
  createdBy: string
  isReading: boolean
  sourceType: string
  sourceValue: any
  sourceValueId: string | number
  type: string
}

const initQueries = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: LIMIT_DEFAULT_SELECT,
}

const Notifications = () => {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { staff }: AuthState = useSelector(selectAuth)
  const {
    notificationsForUser,
    numberOfNotification,
    reCallNotify,
  }: CommonState = useSelector(commonSelector)

  const classes = useStyles({ color: String2Color(staff?.name) })
  const wrapperRef = useRef<any>()
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const [hideNotify, setHideNotify] = useState(true)
  const [queries, setQueries] = useState<IQueries>(initQueries)
  const [numberOfNotificationTemp, setNumberOfNotificationTemp] = useState(0)
  const [notificationsForUserTemp, setNotificationsForUserTemp] = useState<
    INotificationsForUser[]
  >([])
  const [countToggle, setCountToggle] = useState(0)

  useClickOutside2(wrapperRef, () => {
    if (countToggle) {
      setHideNotify(true)
    }
  })

  const formatNotify = (notify: any): INotificationsForUser => {
    return {
      id: notify.id,
      createAt: notify.createAt,
      createdBy: notify.createdBy,
      isReading: notify.isReading,
      sourceType: notify.sourceType,
      sourceValue: JSON.parse(notify.sourceValue),
      sourceValueId: notify.sourceValueId,
      type: 'DAILY_REPORT',
    }
  }

  const selectItem = (value: any) => {
    navigate(PathConstant.DAILY_REPORT)
    dispatch(setOpenConfirmDaily(true))
    dispatch(setItemNotify(value.sourceValue.dailyReportApplication))
    if (!value.isReading) {
      setLoading(true)
      dispatch(readNotify(value.id))
        .unwrap()
        .then(() => {
          const indexNotificationsForUserTemp =
            notificationsForUserTemp.findIndex(item => item.id === value.id)
          if (indexNotificationsForUserTemp > -1) {
            let _notificationsForUserTemp = cloneDeep(notificationsForUserTemp)
            _notificationsForUserTemp[indexNotificationsForUserTemp].isReading =
              true
            setNotificationsForUserTemp(_notificationsForUserTemp)
          } else {
            const indexNotificationsForUser = notificationsForUser.findIndex(
              item => item.id === value.id
            )
            if (indexNotificationsForUser > -1) {
              let _notificationsForUser = cloneDeep(notificationsForUser)
              _notificationsForUser[indexNotificationsForUser].isReading = true
              dispatch(setNotificationsForUser(_notificationsForUser))
            }
          }
          dispatch(getNumberOfNotification({}))
            .unwrap()
            .then(res => {
              setNumberOfNotificationTemp(0)
            })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleScroll = (event: any) => {
    const listboxNode = event.currentTarget
    const position = listboxNode.scrollTop + listboxNode.clientHeight
    const _queries = { ...queries, pageNum: Number(queries.pageNum) + 1 }
    if (
      listboxNode.scrollHeight - position <= 1 &&
      !loading &&
      totalPage >= _queries.pageNum
    ) {
      setLoading(true)
      setQueries(_queries)
      dispatch(getNotificationsForUser(_queries))
        .unwrap()
        .then(res => {
          if (res) {
            const listNotify = res.data.content?.map((item: any) =>
              formatNotify(item)
            )
            dispatch(
              setNotificationsForUser([...notificationsForUser, ...listNotify])
            )
            setTotalPage(res.data.totalPages)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const toggleNotify = () => {
    setHideNotify(prev => !prev)
    setCountToggle(prev => prev + 1)
  }

  useEffect(() => {
    setLoading(true)
    dispatch(getNotificationsForUser(queries))
      .unwrap()
      .then(res => {
        if (res) {
          const listNotify = res.data.content?.map((item: any) =>
            formatNotify(item)
          )
          dispatch(setNotificationsForUser(listNotify))
          setTotalPage(res.data.totalPages)
        }
      })
      .finally(() => {
        setLoading(false)
      })
    dispatch(getNumberOfNotification({}))
  }, [])

  useEffect(() => {
    if (reCallNotify) {
      setQueries(initQueries)
      setLoading(true)
      dispatch(getNotificationsForUser(initQueries))
        .unwrap()
        .then(res => {
          if (res) {
            const listNotify = res.data.content?.map((item: any) =>
              formatNotify(item)
            )
            dispatch(setNotificationsForUser(listNotify))
            setTotalPage(res.data.totalPages)
            dispatch(setReCallNotify(false))
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [reCallNotify])

  useEffect(() => {
    const client = new Client({
      brokerURL: BASE_WS,
      onConnect: () => {
        client.subscribe(`/user/${staff?.id}/notifications/detail`, message => {
          const notify = JSON.parse(message.body)
          setNotificationsForUserTemp([
            formatNotify(notify),
            ...notificationsForUserTemp,
          ])
        })
        client.subscribe(`/user/${staff?.id}/notifications/number`, message => {
          setNumberOfNotificationTemp(numberOfNotificationTemp + 1)
        })
      },
    })
    client.activate()
    return () => {
      client.deactivate()
    }
  }, [numberOfNotificationTemp, notificationsForUserTemp])

  return (
    <Box className={classes.rootNotifications} ref={wrapperRef}>
      <Box className={classes.notifyIconWrap}>
        <Box
          className={clsx(
            classes.notifyIcon,
            classes.flexCenter,
            !hideNotify && classes.notifyActive
          )}
          onClick={toggleNotify}
        >
          <NotificationsIcon />
        </Box>
        {!!(numberOfNotification + numberOfNotificationTemp) && (
          <Box className={clsx('count', classes.flexCenter)}>
            {numberOfNotification + numberOfNotificationTemp ?? ''}
          </Box>
        )}
      </Box>

      {!hideNotify && (
        <Box
          className={clsx(
            classes.notifyDropdown,
            loading && classes.backgroundColorWhite
          )}
        >
          <Box className={classes.title}>Notifications</Box>
          <Box
            className={clsx(
              'scrollbar',
              classes.notifyList,
              loading && classes.overflowNone
            )}
            onScroll={handleScroll}
          >
            <Box className={clsx(loading && classes.blurBackground)}>
              {[...notificationsForUserTemp, ...notificationsForUser].map(
                (item: INotificationsForUser, index: number) => (
                  <NotificationItem
                    selectItem={selectItem}
                    item={item}
                    key={item.id}
                  />
                )
              )}
              <Box
                className={clsx(
                  classes.backgroundColorWhite,
                  classes.overflowNone
                )}
              >
                {isEmpty(notificationsForUser) && !loading && <NoData />}
              </Box>
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
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootNotifications: { position: 'relative' },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakWord: {
    wordBreak: 'break-word',
  },
  notifyIcon: {
    cursor: 'pointer',
    margin: '0 10px 0 10px',
    height: '44px',
    width: '44px',
    background: theme.color.grey.tertiary,
    borderRadius: '50%',
    '&:hover': {
      background: theme.color.grey.secondary,
    },
    '& svg': {
      color: theme.color.black.secondary,
    },
  },
  notifyIconWrap: {
    position: 'relative',
    '& .count': {
      position: 'absolute',
      left: '76%',
      color: '#ffffff',
      padding: '3px',
      background: '#f83a3a',
      borderRadius: '100%',
      textAlign: 'center',
      fontSize: '10px',
      top: '0px',
      minWidth: '25px',
      minHeight: '25px',
    },
  },
  notifyActive: {
    background: theme.color.grey.secondary,
    '& svg': {
      color: theme.color.blue.primary,
    },
  },
  notifyDropdown: {
    position: 'absolute',
    top: '50px',
    right: '10px',
    width: '350px',
    height: 'calc(100vh - 72px)',
    minHeight: '200px',
    borderRadius: '10px',
    wordBreak: 'break-word',
    paddingBottom: '10px',
  },
  title: {
    color: '#ffffff',
    background: '#205DCE',
    padding: '20px',
    textAlign: 'center',
    fontSize: '1.1em',
    fontWeight: '700',
  },
  notifyList: {
    background: '#ffffff',
    maxHeight: 'calc(100% - 44px)',
    border: '#dee2e6 solid 1px',
    boxShadow: `1px 3px 4px 0px ${theme.color.grey.secondary}`,
    overflowY: 'auto',
    '&.scrollbar': {
      '&::-webkit-scrollbar': {
        width: '4px',
        height: '8px',
      },
    },
  },
  notifyItem: {
    padding: '15px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    '& .notifyItem-title': {
      width: 'calc(100% - 25px)',
    },
    '& .notifyItem-content': {
      fontSize: '0.9em',
    },
    '& .notifyItem-bottom': {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.7em',
      fontStyle: 'oblique',
    },
  },
  boldText: {
    fontWeight: '700',
  },
  status: {
    '&.unReply': {
      color: 'yellow',
      width: '30px',
      height: '25px',
    },
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
  blurBackground: {
    opacity: '0.3',
    pointerEvents: 'none',
  },
  overflowNone: {
    overflow: 'hidden',
  },
  backgroundColorWhite: {
    background: '#ffffff',
  },
}))
export default Notifications
