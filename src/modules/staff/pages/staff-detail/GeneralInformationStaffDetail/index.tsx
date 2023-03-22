import StatusItem from '@/components/table/StatusItem'
import {
  genders,
  keyItemGeneralInformationStaff,
  STAFF_STATUS,
} from '@/modules/staff/const'
import { IGeneralInformationStaffState } from '@/modules/staff/types'
import { formatDate } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import moment from 'moment'
import { useMemo } from 'react'
interface IProps {
  dataDetail: IGeneralInformationStaffState
}
interface IStatus {
  status: string
  label: string
}
const GeneralInformationStaffDetail = ({ dataDetail }: IProps) => {
  const classes = useStyles()
  const getDataGender = (genderId: string) => {
    let gender = genders.find((item: any) => item.id == genderId)
    if (gender) {
      return gender?.label ?? ''
    }
    return ''
  }
  const convertDataDetail = (value: IGeneralInformationStaffState) => {
    return {
      gender: getDataGender(value.gender) ?? '',
      directManager: value.directManager?.label ?? '',
      branchName: value.branch?.label ?? '',
      divisionName: value.division?.label ?? '',
      onboardDate: moment(value.onboardDate).format('DD/MM/YYYY') ?? '',
      gradeTitle: value.gradeTitle.label ?? '',
      leaderGradeTitle: value.leaderGradeTitle?.label ?? '',
      status: value.statusName ?? '',
      jobType: value.jobTypeName ?? '',
      lastWorkingDate: value.lastWorkingDate
        ? formatDate(value.lastWorkingDate)
        : '',
    }
  }
  const dataDetailFormat: { [key: string]: any } = useMemo(
    () => convertDataDetail(dataDetail),
    [dataDetail]
  )

  const convertStaffStatus = (status: any): IStatus => {
    if (STAFF_STATUS[status]) {
      return {
        status: STAFF_STATUS[status].status,
        label: STAFF_STATUS[status].label,
      }
    }
    return {
      status: 'error',
      label: '',
    }
  }
  const status = useMemo(
    () => convertStaffStatus(dataDetail.status),
    [dataDetail]
  )
  return (
    <Box className={classes.rootStaffInformation}>
      {!!dataDetail.code && (
        <Box className="extra-information">
          {keyItemGeneralInformationStaff.map((item: any) =>
            item.value === 'status' ? (
              <Box className="extra-item" key={item.key}>
                <Box className="label">{item.key} </Box>
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
      gap: theme.spacing(3),
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
          width: '130px',
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
export default GeneralInformationStaffDetail
