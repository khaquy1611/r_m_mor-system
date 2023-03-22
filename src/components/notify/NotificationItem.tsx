import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { formatDate } from '@/utils'
import { WarningAmber } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { INotificationsForUser } from './Notifications'

interface IProps {
  selectItem: (item: INotificationsForUser) => void
  item: INotificationsForUser
}
const NotificationItem = ({ selectItem, item }: IProps) => {
  const classes = useStyles()
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { staff }: AuthState = useSelector(selectAuth)
  const getMessage = (
    value: string | number,
    reportDate: string,
    nameApprover: string,
    nameRequester: string
  ) => {
    switch (value) {
      case 1:
        return i18nCommon('MSG_REPORT_UPDATE_CONFIRM', {
          name: nameRequester,
          day: reportDate,
        })

      case 2:
        return i18nCommon('MSG_REPORT_APPROVED', {
          name: nameApprover,
          day: reportDate,
        })
      case 3:
        return i18nCommon('MSG_REPORT_DECLINED', {
          name: nameApprover,
          day: reportDate,
        })

      default:
        return ''
    }
  }
  const getListProject = (list: any[]) => {
    return list?.map(item => item.project.name).toString()
  }
  return (
    <Box
      className={clsx(
        classes.flexCenter,
        classes.notifyItemWrap,
        !item?.isReading && 'unRead'
      )}
      key={item.id}
      onClick={() => {
        selectItem(item)
      }}
    >
      <Box className={clsx(classes.notifyItem)}>
        <Box className={clsx(classes.boldText, 'notifyItem-title')}>
          {!item?.isReading && <span className={classes.dotStatus}>New</span>}
          {i18nDailyReport('TXT_REQUEST_DAILY_REPORT_UPDATE')}
        </Box>
        <Box
          className="notifyItem-content"
          dangerouslySetInnerHTML={{
            __html: getMessage(
              item.sourceValue?.dailyReportApplication?.statusApplication,
              formatDate(item.sourceValue?.dailyReportApplication?.reportDate),
              item.sourceValue?.dailyReportApplication?.approvedBy?.name,
              item.sourceValue?.dailyReportApplication?.staff?.name
            ),
          }}
        ></Box>
        <Box className="notifyItem-bottom">
          <Box className={classes.breakWord}>
            Project:{' '}
            {getListProject(
              item.sourceValue?.dailyReportApplication
                ?.dailyReportApplicationDetails
            )}
          </Box>
          <Box className={classes.dateUpdated}>Updated: {item.createAt}</Box>
        </Box>
      </Box>
      {item?.isReading &&
        item.sourceValue?.dailyReportApplication?.statusApplication === 1 && (
          <WarningAmber className={classes.unConfirm} />
        )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakWord: {
    wordBreak: 'break-word',
  },
  title: {
    color: '#ffffff',
    background: '#205DCE',
    padding: '20px',
    textAlign: 'center',
    fontSize: '1.1em',
    fontWeight: '700',
  },
  notifyItemWrap: {
    borderBottom: ' 1px solid rgb(17 17 26 / 10%)',
    background: '#ecf9ff7a',
    position: 'relative',
    '&.unRead': {
      backgroundColor: '#bae9ff7a',
    },
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: '#205DCE',
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
  dotStatus: {
    background: '#f5c516',
    borderRadius: '5px',
    fontSize: '12px',
    padding: '3px',
    marginRight: '5px',
    position: 'relative',
    top: '-3px',
  },
  unConfirm: {
    position: 'absolute',
    top: '12px',
    right: '15px',
    color: '#ed4a5cde',
  },
  dateUpdated: {
    minWidth: '107px',
    marginRight: '5px',
  },
  readOnly: {
    cursor: 'default',
  },
}))
export default NotificationItem
