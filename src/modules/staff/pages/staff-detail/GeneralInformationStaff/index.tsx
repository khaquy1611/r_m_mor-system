import ConditionalRender from '@/components/ConditionalRender'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { LangConstant } from '@/const'
import StaffStepAction from '@/modules/staff/components/StaffStepAction'
import { IFileUpload } from '@/modules/staff/components/UploadFile'
import { CONFIG_STAFF_STEP } from '@/modules/staff/const'
import { useStaffDetailContext } from '@/modules/staff/context/StaffDetailContext'
import {
  setActiveStep,
  setGeneralInfoStaff,
  staffSelector,
} from '@/modules/staff/reducer/staff'
import {
  getDetailStaff,
  updateStaffGeneralInfo,
} from '@/modules/staff/reducer/thunk'
import {
  IGeneralInformationStaffState,
  StaffState,
} from '@/modules/staff/types'
import {
  formatPayloadGeneralInfoStaff,
  payloadUpdateStaff,
} from '@/modules/staff/utils'
import { AppDispatch } from '@/store'
import { checkValidateFormik } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import StringFormat from 'string-format'
import Contract from '../Contract'
import CertificateCard from './CertificateCard'
import GeneralInformation from './GeneralInformation'
interface IProps {
  tempStep?: number
  flagUpdate?: boolean
  showEditInformation?: boolean
  onChangeForm: (isChange: boolean) => void
  onUpdateFlag: (isChange: boolean) => void
}

const GeneralInformationStaff = ({
  tempStep = 0,
  flagUpdate,
  onChangeForm,
  onUpdateFlag,
}: IProps) => {
  const classes = useStyles()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const { t: i18 } = useTranslation()
  const { activeStep, generalInfoStaff, certificates }: StaffState =
    useSelector(staffSelector)
  const dispatch = useDispatch<AppDispatch>()

  const {
    handleSubmit,
    handleNextStep,
    birthDayError,
    dateOnBoardError,
    setIsChangeCertificate,
    isShowModalConfirm,
    setIsShowModalConfirm,
    setShowEditInformation,
    isShowModalConfirmCancelUpdate,
    setShowModalConfirmCancelUpdate,
    staffId,
    isViewDetail,
    isChangeData,
    isChangeDataCreate,
    isDisabledButtonSubmit,
    formik,
    resetFormik,
  } = useStaffDetailContext()

  //Function
  const updateStaffGeneralInformation = (
    values: IGeneralInformationStaffState
  ) => {
    const certificateFilter = certificates.filter(
      (item: IFileUpload) => item.file
    )
    const payload = {
      id: staffId,
      requestBody: formatPayloadGeneralInfoStaff(values),
      certificate: certificateFilter.map((item: any) => item.file),
    }
    const formData = payloadUpdateStaff(payload)
    dispatch(
      updateStaffGeneralInfo({
        formData: formData,
        code: values.code,
        id: staffId,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getDetailStaff(staffId))
        setIsChangeCertificate(false)
        onChangeForm(false)
        dispatch(setGeneralInfoStaff(values))
      })
  }
  const handleUpdateGeneralInformation = () => {
    updateStaffGeneralInformation(formik.values)
  }

  //Effect
  useEffect(() => {
    isViewDetail ? onChangeForm(isChangeData) : onChangeForm(isChangeDataCreate)
  }, [isViewDetail, isChangeData, isChangeDataCreate])
  useEffect(() => {
    if (flagUpdate) {
      ;(async () => {
        const isError = await checkValidateFormik(formik)
        if (!isError) {
          if (birthDayError || dateOnBoardError) return
          dispatch(setGeneralInfoStaff(formik.values))
          if (isViewDetail) {
            updateStaffGeneralInformation(formik.values)
            onChangeForm(false)
            onUpdateFlag(false)
            dispatch(setActiveStep(tempStep))
          }
        } else {
          onUpdateFlag(false)
        }
      })()
    }
  }, [flagUpdate])

  return (
    <form onSubmit={formik.handleSubmit} className={classes.formContainer}>
      <GeneralInformation />
      <ConditionalRender conditional={isViewDetail}>
        <Box className="contract-and-certificate">
          <Box className="c2-file-item">
            <CertificateCard staffId={staffId} isViewDetail={isViewDetail} />
          </Box>
          <Box className="c2-file-item">
            <Contract onSubmit={handleSubmit} />
          </Box>
        </Box>
      </ConditionalRender>
      <ConditionalRender conditional={!isViewDetail}>
        <CertificateCard staffId={staffId} isViewDetail={isViewDetail} />
      </ConditionalRender>
      <ConditionalRender conditional={!isViewDetail}>
        <StaffStepAction
          configSteps={CONFIG_STAFF_STEP}
          activeStep={activeStep}
          isViewDetail={isViewDetail}
          disabledBtnNext={isDisabledButtonSubmit}
          onNext={handleNextStep}
        />
      </ConditionalRender>
      <ModalConfirm
        title={i18('TXT_UPDATE_INFORMATION')}
        description={StringFormat(
          i18Staff('MSG_DESCRIPTION_CONFIRM_UPDATE_INFORMATION'),
          generalInfoStaff.code ?? ''
        )}
        open={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        onSubmit={() => handleUpdateGeneralInformation()}
      />
      <ModalConfirm
        title={i18('TXT_LEAVE_SITE')}
        description={i18('MSG_DESCRIPTION_CONFIRM_LEAVE')}
        open={isShowModalConfirmCancelUpdate}
        titleSubmit={'Leave'}
        onClose={() => {
          setShowModalConfirmCancelUpdate(false)
        }}
        onSubmit={() => {
          setShowModalConfirmCancelUpdate(false)
          setShowEditInformation(false)
          resetFormik()
        }}
      />
    </form>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    height: '100%',
    '& .contract-and-certificate': {
      marginTop: '20px',
      display: 'flex',
      alignItems: 'stretch',
      gap: '20px',
      flexWrap: 'wrap',
      '& .c2-file-item': {
        width: '50%',
        minWidth: '400px',
        flex: 1,
      },
    },
  },
  formWrapper: {
    maxWidth: theme.spacing(75),
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))
export default GeneralInformationStaff
