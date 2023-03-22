import { LangConstant } from '@/const'
import { formatDate } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  contractGeneralInformation: any
}
const GeneralInformationContractTop = ({
  contractGeneralInformation,
}: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  return (
    <Box className={classes.rootContractTop}>
      {!!Object.keys(contractGeneralInformation) && (
        <Box className="main-information">
          <Box className="main-item">
            <Box className="label label-name">{i18('LB_CONTRACT_NUMBER')}:</Box>
            <Box className="value value-name">
              {contractGeneralInformation.contractNumber}
            </Box>
          </Box>
          {contractGeneralInformation.startDate &&
          contractGeneralInformation.endDate ? (
            <Box className="main-item">
              <Box className="label">Contract Date:</Box>
              <Box className="value">
                {formatDate(contractGeneralInformation.startDate)}
                <span> - </span>
                {formatDate(contractGeneralInformation.endDate)}
              </Box>
            </Box>
          ) : (
            <Fragment>
              {contractGeneralInformation.startDate && (
                <Box className="main-item">
                  <Box className="label">
                    {i18Contract('LB_CONTRACT_START_DATE')}:
                  </Box>
                  <Box className="value">
                    {formatDate(contractGeneralInformation.startDate)}
                  </Box>
                </Box>
              )}
              {contractGeneralInformation.endDate && (
                <Box className="main-item">
                  <Box className="label">
                    {i18Contract('LB_CONTRACT_END_DATE')}:
                  </Box>
                  <Box className="value">
                    {formatDate(contractGeneralInformation.endDate)}
                  </Box>
                </Box>
              )}
            </Fragment>
          )}
          <Box className="main-item">
            <Box className="label">{i18Contract('LB_SIGN_DATE')}:</Box>
            <Box className="value">
              {formatDate(contractGeneralInformation.signDate)}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootContractTop: {
    width: '100%',
    minHeight: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    '& .main-information': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      '& .main-item': {
        display: 'flex',
        '& .label': {
          width: '160px',
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
  rootBtnExport: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
  },
  mb24: {
    marginBottom: `${theme.spacing(3)} !important`,
  },
}))
export default GeneralInformationContractTop
