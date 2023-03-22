import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import NoData from '@/components/common/NoData'
import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const YourProfile = () => {
  const classes = useStyles()
  const { staff }: AuthState = useSelector(selectAuth)
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18Setting } = useTranslation(LangConstant.NS_SETTING)
  return (
    <CommonScreenLayout title={''}>
      <CardForm title={i18Common('TXT_GENERAL_INFORMATION')}>
        {!!staff?.id ? (
          <Box className={classes.rootStaffInformation}>
            <Box className="main-information">
              <Box className="main-item">
                <Box className="label label-name">
                  {i18Setting('LB_STAFF_ID')}:
                </Box>
                <Box className="value value-name">{staff?.code ?? ''}</Box>
              </Box>
              <Box className="main-item">
                <Box className="label label-name">
                  {i18Setting('LB_FULL_NAME')}:
                </Box>
                <Box className="value value-name">{staff?.name ?? ''}</Box>
              </Box>
              <Box className="main-item">
                <Box className="label">{i18Setting('LB_DATE_OF_BIRTH')}:</Box>
                <Box className="value">{staff?.dateOfBirth ?? ''}</Box>
              </Box>
              <Box className="main-item">
                <Box className="label">{i18Common('LB_EMAIL')}:</Box>
                <Box className="value">{staff?.email ?? ''}</Box>
              </Box>
              <Box className="main-item">
                <Box className="label">{i18Common('LB_POSITION')}:</Box>
                <Box className="value">{staff?.positionName ?? ''}</Box>
              </Box>
              <Box className="main-item">
                <Box className="label">{i18Common('LB_BRANCH')}:</Box>
                <Box className="value">{staff?.branchName ?? ''}</Box>
              </Box>
              <Box className="main-item">
                <Box className="label">{i18Common('LB_DIVISION')}:</Box>
                <Box className="value">{staff?.divisionName ?? ''}</Box>
              </Box>
              <Box className="main-item">
                <Box className="label">{i18Setting('LB_DIRECT_MANAGER')}:</Box>
                <Box className="value">{staff?.directManager ?? ''}</Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <NoData />
        )}
      </CardForm>
    </CommonScreenLayout>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffInformation: {
    width: '100%',
    minHeight: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    '& .main-information': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      '& .main-item': {
        display: 'flex',
        '& .label': {
          width: '200px',
          fontSize: '16px',
          lineHeight: '20px',
          color: '#333333',
          fontWeight: 700,
        },
        '& .value': {
          fontSize: '16px',
        },
        '& .value-name': {
          fontWeight: 700,
        },
      },
    },
  },
}))
export default YourProfile
