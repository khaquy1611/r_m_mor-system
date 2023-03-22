import CommonButton from '@/components/buttons/CommonButton'
import Modal from '@/components/common/Modal'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { LangConstant } from '@/const'
import { selectAuth } from '@/reducer/auth'
import { commonSelector, setReCallNotify } from '@/reducer/common'
import { alertError, alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { formatDate } from '@/utils'
import { Box, Button, CircularProgress, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { REPORT_STATUS, STATUS_CONFIRM } from '../../const'
import {
  approveReport,
  getApplicationDetail,
  setOpenConfirmDaily,
} from '../../reducer/dailyReport'
import { IReport, IReportDetail } from '../../types'
interface IProps {
  setStaff?: Dispatch<SetStateAction<OptionItem | null | undefined>>
  open: boolean
  onClose: () => void
  onConfirm?: () => void
}
interface IStatus {
  id?: string
  name?: string
}
interface IStaff {
  code?: string
  email?: string
  id?: string
  name?: string
}
interface IPastAndUpdateDailyReport {
  applicationId: string | number
  approvalDate: string | number
  approvedBy: IStaff
  createDate: number
  dailyReport: IReport
  dailyReportUpdate: IReport
  staff: IStaff
  statusApplication: IStatus
}

function PopupReportCompare({ open, onClose, setStaff, onConfirm }: IProps) {
  const classes = useStyles()
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { itemNotify } = useSelector(commonSelector)
  const dispatch = useDispatch<AppDispatch>()
  const { staff } = useSelector(selectAuth)

  const [loading, setLoading] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState({
    type: '',
    message: '',
  })
  const [openPopupConfirm, setOpenPopupConfirm] = useState(false)
  const [pastAndUpdateDailyReport, setPastAndUpdateDailyReport] =
    useState<IPastAndUpdateDailyReport>({
      applicationId: '',
      approvalDate: 0,
      approvedBy: {},
      createDate: 0,
      dailyReport: {
        dailyReportId: '',
        reportDate: 0,
        improvement: '',
        dailyReportDetails: [],
        status: { id: 0, name: '' },
        note: '',
      },
      dailyReportUpdate: {
        dailyReportId: '',
        reportDate: 0,
        improvement: '',
        dailyReportDetails: [],
        status: { id: 0, name: '' },
        note: '',
      },
      staff: {},
      statusApplication: {},
    })

  const handleSubmit = () => {
    setOpenPopupConfirm(true)
    setConfirmMessage({
      type: 'confirm',
      message: i18nDailyReport('MSG_CONFIRM_UPDATE_REPORT'),
    })
  }
  const handleDecline = () => {
    setOpenPopupConfirm(true)
    setConfirmMessage({
      type: 'cancel',
      message: i18nDailyReport('MSG_DECLINE_UPDATE_REPORT'),
    })
  }
  const handleSubmitConfirm = () => {
    setOpenPopupConfirm(false)
    dispatch(
      approveReport({
        id: pastAndUpdateDailyReport.applicationId,
        status:
          confirmMessage.type === 'confirm'
            ? STATUS_CONFIRM.APPROVED
            : STATUS_CONFIRM.CANCEL,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18nDailyReport(
              'dailyReport:MSG_UPDATE_DAILY_REPORT_SUCCESS',
              {
                date: formatDate(
                  pastAndUpdateDailyReport?.dailyReportUpdate?.reportDate
                ),
              }
            ),
          })
        )
        onConfirm && onConfirm()
        dispatch(setReCallNotify(true))
      })
  }

  const handleCloseModalConfirm = () => {
    setOpenPopupConfirm(false)
  }

  const getStatusReport = (status: number) => {
    switch (status) {
      case REPORT_STATUS.DAY_OFF:
        return i18nDailyReport('TXT_DAY_OFF')
      case REPORT_STATUS.REPORT:
        return i18nDailyReport('TXT_REPORT')
      case REPORT_STATUS.HOLIDAY_BREAK:
        return i18nDailyReport('TXT_HOLIDAY_BREAK')
      case REPORT_STATUS.NO_REPORT:
        return i18nDailyReport('TXT_NO_REPORT')
      default:
        return i18nDailyReport('TXT_NO_REPORT')
    }
  }
  useEffect(() => {
    if (itemNotify?.applicationId) {
      setLoading(true)
      dispatch(getApplicationDetail(itemNotify.applicationId))
        .unwrap()
        .then(res => {
          setPastAndUpdateDailyReport(res.data)
          setStaff && setStaff(res.data.staff)
          setLoading(false)
        })
        .catch(err => {
          if (err[0] && err[0].field === 'id') {
            dispatch(
              alertError({
                message: err[0].message,
              })
            )
          }
          dispatch(setOpenConfirmDaily(false))
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [itemNotify])

  const isReadOnly = useMemo(
    () =>
      pastAndUpdateDailyReport?.statusApplication?.id != '1' ||
      pastAndUpdateDailyReport.staff?.id == staff?.id,
    [staff, pastAndUpdateDailyReport]
  )

  return (
    <Modal
      open={open}
      title={i18nDailyReport('TXT_REPORT_DETAIL_UPDATE')}
      onClose={onClose}
      width={1060}
      hideFooter={true}
    >
      <ModalConfirm
        title={i18nDailyReport('TXT_CONFIRMATION')}
        titleSubmit={'CONFIRM'}
        description={confirmMessage.message}
        open={openPopupConfirm}
        isButtonCustom={false}
        onClose={handleCloseModalConfirm}
        onSubmit={handleSubmitConfirm}
      />
      <Box className={clsx(classes.reportDetails, loading && classes.blur)}>
        <Box className={classes.modalContent}>
          <Box className="space-between-root report-date">
            <Box>
              {i18nCommon('LB_STAFF_NAME')}:{' '}
              {pastAndUpdateDailyReport?.staff?.name}
            </Box>
            <Box>{`${i18nDailyReport('LB_REPORT_DATE')}: ${formatDate(
              pastAndUpdateDailyReport?.dailyReport
                ? pastAndUpdateDailyReport?.dailyReport?.reportDate
                : pastAndUpdateDailyReport?.dailyReportUpdate?.reportDate,
              'DD/MM/YYYY'
            )}`}</Box>
          </Box>
          <Box className="form-wrapper">
            <Box className="project-status">
              {i18nDailyReport('TXT_PAST_REPORT')} :{' '}
              {getStatusReport(
                pastAndUpdateDailyReport?.dailyReport?.status?.id
              )}
            </Box>
            {pastAndUpdateDailyReport?.dailyReport?.dailyReportDetails?.map(
              (item: IReportDetail) => (
                <Box className={classes.projectItem} key={item.id}>
                  <Box className="project-name">
                    <Box component={'span'} className={classes.fontBold}>
                      {i18nDailyReport('LB_PROJECT')}
                    </Box>
                    : {item.project.name}
                  </Box>
                  <Box component={'ul'} className="project-detail">
                    <Box component={'li'}>
                      <Box component={'span'} className={classes.fontBold}>
                        {i18nDailyReport('LB_WORKING_HOURS')}
                      </Box>
                      : {item.workingHours}
                    </Box>
                    <Box component={'li'}>
                      <Box component={'span'} className={classes.fontBold}>
                        {i18nDailyReport('LB_WORKING_DESCRIPTION')}
                      </Box>
                      : {item.workingDescription}
                    </Box>
                    <Box component={'li'}>
                      <Box component={'span'} className={classes.fontBold}>
                        {i18nDailyReport('LB_IMPEDIMENT')}
                      </Box>
                      : {item.improvement}
                    </Box>
                    <Box component={'li'}>
                      <Box component={'span'} className={classes.fontBold}>
                        {i18nDailyReport('LB_SUGGESTION_FOR_IMPROVEMENT')}
                      </Box>
                      : {item.suggestionForImprovement}
                    </Box>
                  </Box>
                </Box>
              )
            )}
            <Box className="report-item">
              <Box className="label">
                {i18nDailyReport('TXT_15_MINUTES_IMPROVEMENT') as string}
              </Box>
              <Box className="content">
                {pastAndUpdateDailyReport?.dailyReport?.improvement}
              </Box>
            </Box>
            <Box className="report-item">
              <Box className="label">
                {i18nDailyReport('LB_REASON_FOR_LATE') as string}
              </Box>
              <Box className="content">
                {' '}
                {pastAndUpdateDailyReport?.dailyReport?.note}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={classes.modalContent}>
          <Box className="space-between-root report-date">
            <Box>
              {i18nCommon('LB_STAFF_NAME')}:{' '}
              {pastAndUpdateDailyReport?.staff?.name}
            </Box>
            <Box>
              {i18nDailyReport('LB_REPORT_DATE')}:{' '}
              {formatDate(
                pastAndUpdateDailyReport?.dailyReportUpdate?.reportDate,
                'DD/MM/YYYY'
              )}
            </Box>
          </Box>
          <Box className="form-wrapper">
            <Box className="project-status">
              Update Report:{' '}
              {getStatusReport(
                pastAndUpdateDailyReport?.dailyReportUpdate?.status?.id
              )}
            </Box>
            {pastAndUpdateDailyReport?.dailyReportUpdate?.dailyReportDetails?.map(
              (item: IReportDetail) => (
                <Box className={classes.projectItem} key={item.id}>
                  <Box className="project-name">
                    <Box component={'span'} className={classes.fontBold}>
                      {i18nDailyReport('LB_PROJECT')}
                    </Box>
                    : {item.project.name}
                  </Box>
                  <Box component={'ul'} className="project-detail">
                    <Box component={'li'}>
                      <Box component={'span'} className={classes.fontBold}>
                        {i18nDailyReport('LB_WORKING_HOURS')}
                      </Box>
                      : {item.workingHours}
                    </Box>
                    <Box component={'li'}>
                      <Box component={'span'} className={classes.fontBold}>
                        {i18nDailyReport('LB_WORKING_DESCRIPTION')}
                      </Box>
                      : {item.workingDescription}
                    </Box>
                    <Box component={'li'}>
                      <Box component={'span'} className={classes.fontBold}>
                        {i18nDailyReport('LB_IMPEDIMENT')}
                      </Box>
                      : {item.improvement}
                    </Box>
                    <Box component={'li'}>
                      <Box component={'span'} className={classes.fontBold}>
                        {i18nDailyReport('LB_SUGGESTION_FOR_IMPROVEMENT')}
                      </Box>
                      : {item.suggestionForImprovement}
                    </Box>
                  </Box>
                </Box>
              )
            )}

            <Box className="report-item">
              <Box className="label">
                {i18nDailyReport('TXT_15_MINUTES_IMPROVEMENT') as string}
              </Box>
              <Box className="content">
                {pastAndUpdateDailyReport?.dailyReportUpdate?.improvement}
              </Box>
            </Box>
            <Box className="report-item">
              <Box className="label">
                {i18nDailyReport('LB_REASON_FOR_LATE') as string}
              </Box>
              <Box className="content">
                {' '}
                {pastAndUpdateDailyReport?.dailyReportUpdate?.note}
              </Box>
            </Box>
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
      {!isReadOnly && (
        <Box className={classes.modalFooter}>
          <Button
            variant="contained"
            className="btn btn-cancel"
            color="error"
            onClick={handleDecline}
          >
            {i18nDailyReport('TXT_DECLINE_UPDATE') as string}
          </Button>
          <CommonButton
            color="primary"
            variant="contained"
            className="btn btn-submit"
            onClick={handleSubmit}
          >
            {i18nDailyReport('TXT_CONFIRM') as string}
          </CommonButton>
        </Box>
      )}
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  reportDetails: {
    display: 'flex',
  },
  formWrapper: {
    '& .btn': {
      width: 'max-content !important',
      flexShrink: 0,
      height: '100%',
    },
  },
  modalContent: {
    flex: '1',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(10),
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: theme.spacing(0.5),
    '& .report-date': {
      fontWeight: 700,
      paddingBottom: theme.spacing(2),
    },
    '& .report-item': {
      paddingBottom: theme.spacing(2),
      '& .label': {
        paddingBottom: theme.spacing(1),
        fontWeight: 'bold',
      },
      '& .content': {
        paddingBottom: theme.spacing(2),
        fontWeight: '400',
        padding: theme.spacing(2),
        border: `1px solid ${theme.color.grey.secondary}`,
        maxHeight: '200px',
        minHeight: '80px',
        wordBreak: 'break-word',
        overflow: 'auto',
      },
    },

    '& .btn-redirect': {
      textTransform: 'capitalize',
    },

    '& .form-wrapper': {
      padding: theme.spacing(2),

      '&:nth-child(n + 3)': {
        marginTop: theme.spacing(3),
      },

      '& .btn-delete': {
        marginLeft: 'auto',
        color: theme.color.black.primary,
        textTransform: 'capitalize',
        fontWeight: 400,
      },
      '& .project-status': {
        fontWeight: '700',
        marginBottom: '5px',
      },
    },
  },
  modalFooter: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    background: theme.color.grey.tertiary,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    '& .btn-back': {
      marginRight: 'auto',
      textTransform: 'capitalize',
    },

    '& .btn-submit': {
      width: 'max-content !important',
    },
  },
  projectItem: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    '& .project-name': {
      paddingBottom: '10px',
      fontWeight: 'bold',
    },
    '& .project-detail': {
      paddingLeft: '20px',
      lineHeight: '25px',
      wordBreak: 'break-word',
    },
  },
  fontBold: {
    fontWeight: 'bold',
  },
  iconLoading: {
    position: 'absolute',
    top: '50%',
    left: '45%',
    '& .iconCircle': {
      color: '#205DCE',
    },
  },
  itemCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    opacity: 0.4,
  },
}))

export default PopupReportCompare
