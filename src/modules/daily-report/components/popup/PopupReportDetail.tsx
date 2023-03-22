import Modal from '@/components/common/Modal'
import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { IReport } from '../../types'

interface IProps {
  report: IReport | null
  open: boolean
  staffSelected: OptionItem | undefined | null
  onClose: () => void
}

function PopupReportDetail({ report, open, staffSelected, onClose }: IProps) {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  return (
    <Modal
      open={open}
      title={'Report Details'}
      onClose={onClose}
      width={1060}
      hideFooter={true}
    >
      <Box>
        <Box className={classes.modalContent}>
          <Box className="space-between-root report-date">
            <Box>
              {' '}
              {i18('LB_STAFF_NAME')}: {staffSelected?.label}
            </Box>
            <Box>{`${i18nDailyReport('LB_REPORT_DATE')}: ${formatDate(
              report?.reportDate ?? 0
            )}`}</Box>
          </Box>
          <Box className="form-wrapper">
            {report?.dailyReportDetails.map(item => (
              <Box className={classes.projectItem} key={item.id}>
                <Box className="project-name">
                  <Box component={'span'} className={classes.fontBold}>
                    {i18nDailyReport('LB_PROJECT')}
                  </Box>
                  : {item?.project?.name}
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
            ))}
            {Boolean(report?.improvement?.trim()) && (
              <Box className="report-item">
                <Box className="label">
                  {i18nDailyReport('TXT_15_MINUTES_IMPROVEMENT') as string}
                </Box>
                <Box className="content">{report?.improvement}</Box>
              </Box>
            )}
            {Boolean(report?.note?.trim()) && (
              <Box className="report-item">
                <Box className="label">
                  {i18nDailyReport('LB_REASON_FOR_LATE') as string}
                </Box>
                <Box className="content">{report?.note}</Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  formWrapper: {
    '& .btn': {
      width: 'max-content !important',
      flexShrink: 0,
      height: '100%',
    },
  },
  modalContent: {
    marginBottom: theme.spacing(3),
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
      border: `1px solid ${theme.color.grey.secondary}`,
      borderRadius: theme.spacing(0.5),

      '&:nth-child(n + 3)': {
        marginTop: theme.spacing(3),
      },

      '& .btn-delete': {
        marginLeft: 'auto',
        color: theme.color.black.primary,
        textTransform: 'capitalize',
        fontWeight: 400,
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
}))

export default PopupReportDetail
