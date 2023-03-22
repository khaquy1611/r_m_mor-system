import StatusItem from '@/components/table/StatusItem'
import { CONTRACT_STATUS } from '@/const/app.const'
import { commonSelector, CommonState } from '@/reducer/common'
import { OptionItem } from '@/types'
import { formatNumberToCurrency } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import i18next from 'i18next'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { CONTRACT_GROUP_TYPE, CONTRACT_TYPE, ORDER } from '../../const'

interface IProps {
  contractGeneralInformation: any
}

interface IStatus {
  status: string
  label: string
}

const GeneralInformationContractDetail = ({
  contractGeneralInformation,
}: IProps) => {
  const classes = useStyles()
  const { listBranches }: CommonState = useSelector(commonSelector)

  const keyItemGeneralInformation = useMemo(() => {
    return [
      {
        key: i18next.t('common:LB_CONTRACT_GROUP'),
        value: 'group',
      },
      {
        key: i18next.t(
          `contract:${
            +contractGeneralInformation.group === ORDER
              ? 'LB_TEMPLATE'
              : 'LB_NDA'
          }`
        ),
        value: 'selectContractGroup',
      },
      {
        key: 'Type',
        value: 'type',
      },
      {
        key: i18next.t('common:LB_BRANCH'),
        value: 'branchId',
      },
      {
        key: i18next.t('common:LB_CONTACT_PERSON'),
        value: 'contactPerson',
      },
      {
        key: i18next.t('contract:LB_BUYER'),
        value: 'buyerId',
      },
      {
        key: i18next.t('contract:LB_SELLER'),

        value: 'sellerId',
      },
      {
        key: i18next.t('common:LB_EXPECTED_VALUE'),
        value: 'value',
      },
      {
        key: i18next.t('contract:LB_DUE_DATE_PAYMENT'),
        value: 'dueDatePayment',
      },
      {
        key: i18next.t('contract:LB_PROJECT_ABBREVIATION_NAME'),
        value: 'projectAbbreviationName',
      },
      {
        key: i18next.t('common:LB_STATUS'),
        value: 'status',
      },
      {
        key: i18next.t('common:LB_DESCRIPTION'),
        value: 'description',
      },
    ]
  }, [])

  const convertDataDetail = (value: any) => {
    return {
      branchId: listBranches.find(
        (branch: OptionItem) => branch.id === value.branchId
      )?.label,
      contactPerson: value.contactPerson?.label,
      description: value.description,
      dueDatePayment: value.dueDatePayment
        ? formatNumberToCurrency(value.dueDatePayment)
        : '',
      group: CONTRACT_GROUP_TYPE[value.group],
      projectAbbreviationName: value.projectAbbreviationName,
      selectContractGroup: value.selectContractGroup?.label,
      sellerId: value.sellerId?.label,
      buyerId: value.buyerId?.label,
      status: value.status,
      type: CONTRACT_TYPE.find((type: OptionItem) => type.id === value.type)
        ?.label,
      value: value.value ? formatNumberToCurrency(value.value) : '',
    }
  }

  const dataDetailFormat: { [key: string]: any } = useMemo(
    () => convertDataDetail(contractGeneralInformation),
    [contractGeneralInformation]
  )

  const convertStatus = (status: any): IStatus => {
    if (CONTRACT_STATUS[status]) {
      return {
        status: CONTRACT_STATUS[status].status,
        label: CONTRACT_STATUS[status].label,
      }
    }
    return {
      status: 'error',
      label: '',
    }
  }
  const status = useMemo(
    () => convertStatus(contractGeneralInformation.status),
    [contractGeneralInformation]
  )

  return (
    <Box className={classes.rootStaffInformation}>
      {!!Object.keys(contractGeneralInformation).length && (
        <Box className="extra-information">
          {keyItemGeneralInformation.map((item: any) =>
            item.value === 'status' ? (
              <Box className="extra-item" key={item.key}>
                <Box className="label">{item.key}:</Box>
                <Box className="value status-margin">
                  <StatusItem typeStatus={status} />
                </Box>
              </Box>
            ) : (
              !!dataDetailFormat[item.value as string] && (
                <Box className="extra-item" key={item.key}>
                  <Box className="label">{item.key}:</Box>
                  <Box className="value">
                    {dataDetailFormat[item.value as string] ?? ''}
                  </Box>
                </Box>
              )
            )
          )}
        </Box>
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffInformation: {
    width: '100%',
    minHeight: '10px',
    '& .extra-information-title': {
      fontSize: '16px',
      lineHeight: '10px 0 20px 0',
      color: '#333333',
      fontWeight: 700,
      padding: '20px 0',
    },
    '& .wrap-button-edit': {
      display: 'flex',
      justifyContent: 'end',
      marginBottom: '20px',
    },
    '& .extra-information': {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      '& .extra-item': {
        display: 'flex',
        width: '30%',
        gap: '10px',
        alignItems: 'center',
        minWidth: '300px',
        wordBreak: 'break-word',
        '& .label': {
          fontSize: '14px',
          lineHeight: '20px',
          color: '#333333',
          fontWeight: 700,
          width: '240px',
        },
        '& .value': {
          width: 'calc(100% - 130px)',
        },
      },
    },
    '& .status-margin': {
      marginLeft: theme.spacing(-1),
    },
  },
}))
export default GeneralInformationContractDetail
