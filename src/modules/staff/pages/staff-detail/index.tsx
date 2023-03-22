import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import ConditionalRender from '@/components/ConditionalRender'
import DialogBox from '@/components/modal/DialogBox'
import ModalConfirm from '@/components/modal/ModalConfirm'
import CommonStep from '@/components/step/Stepper'
import CommonTabs from '@/components/tabs'
import { LangConstant, PathConstant } from '@/const'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import StaffDetailContext from '@/modules/staff/context/StaffDetailContext'
import { alertError, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { base64ToArrayBuffer, formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ModalExportSkillSets, {
  SkillItem,
  SkillSetListItem,
} from '../../components/ModalExportSkillSets/ModalExportSkillSets'
import { IFileUpload } from '../../components/UploadFile'
import {
  CONFIG_STAFF_STEP,
  CONFIG_STAFF_STEP_DETAIL,
  genders,
  STAFF_STEP,
  STAFF_STEP_DETAIL,
} from '../../const'
import {
  resetFormStaff,
  setActiveStep,
  staffSelector,
} from '../../reducer/staff'
import {
  createNewStaff,
  exportStaffSkillSet,
  getDetailStaff,
} from '../../reducer/thunk'
import { StaffState } from '../../types'
import { formatPayloadGeneralInfoStaff, payloadCreateStaff } from '../../utils'
import Contract from './Contract'
import GeneralInformationStaff from './GeneralInformationStaff'
import GeneralInformationStaffTop from './GeneralInformationStaffTop'
import SkillSetStaff from './SkillSetStaff'
import StaffDetailProject from './StaffDetailProject/StaffDetailProject'

export interface PersonalInformation {
  staffName?: string
  gender?: string
  email?: string
  dateOfBirth?: string
  positionName?: string
}

interface StaffDetailProps {
  isDetailPage: boolean
}

export default function StaffDetail({ isDetailPage }: StaffDetailProps) {
  // const
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const classes = useStyles()
  const {
    activeStep,
    generalInfoStaff,
    certificates,
    contracts,
    skillSetList,
  }: StaffState = useSelector(staffSelector)

  // State
  const [isShowModalConfirmNextStep, setIsShowModalConfirmNextStep] =
    useState(false)
  const [flagUpdate, setFlagUpdate] = useState(false)
  const [isFormInformationChange, setIsFormInformationChange] = useState(false)
  const [isShowModalExportSkillSets, setIsShowModalExportSkillSets] =
    useState(false)
  const [personalInformation, setPersonalInformation] =
    useState<PersonalInformation>({})
  const [tempStep, setTempStep] = useState(0)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog)
  //Memo
  const listStep = useMemo(
    () => (isDetailPage ? CONFIG_STAFF_STEP_DETAIL : CONFIG_STAFF_STEP),
    [CONFIG_STAFF_STEP, CONFIG_STAFF_STEP_DETAIL, isDetailPage]
  )

  const staffId: string | number = useMemo(() => {
    return params.staffId ?? ''
  }, [params.staffId])

  const isViewDetail = useMemo(() => {
    return !!staffId
  }, [staffId])

  // Function
  const backToStaffList = () => {
    navigate(PathConstant.STAFF_LIST)
  }

  const handleChangeStep = (step: number) => {
    setTempStep(step)
    if (isDetailPage && isFormInformationChange) {
      setIsShowModalConfirmNextStep(true)
    } else {
      setFlagUpdate(false)
      dispatch(setActiveStep(step))
    }
  }

  const handleSubmit = () => {
    const certificateFilter = certificates.filter(
      (item: IFileUpload) => item.file
    )
    const contractFilter = contracts.filter((item: IFileUpload) => item.file)
    const payload = {
      requestBody: {
        personal: formatPayloadGeneralInfoStaff(generalInfoStaff),
        skillSet: skillSetList.map((item: SkillSetListItem) => ({
          skillGroupId: +item.id,
          skillSetLevels: item.skillSetLevels.map((skillItem: SkillItem) => ({
            level: skillItem.level,
            note: '',
            skillId: +skillItem.id,
            yearsOfExperience: skillItem.yearOfExperience,
          })),
        })),
      },
      certificate: certificateFilter.map((item: any) => item.file),
      contract: contractFilter.map((item: any) => item.file),
    }
    dispatch(createNewStaff(payloadCreateStaff(payload)))
      .unwrap()
      .then(() => {
        navigate(PathConstant.STAFF_LIST)
      })
    setShowDialog(false)
  }
  const handleNextCheckpointStep = () => {
    setFlagUpdate(true)
  }
  const handleNotSave = () => {
    setFlagUpdate(false)
    setIsShowModalConfirmNextStep(false)
    dispatch(setActiveStep(tempStep))
    dispatch(getDetailStaff(staffId))
      .unwrap()
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }
  const handleChangeFormInformation = (isChange: boolean) => {
    setIsFormInformationChange(isChange)
  }

  const handleShowModalExportSkillSets = () => {
    setIsShowModalExportSkillSets(true)
    const personalInformation = {
      staffName: generalInfoStaff.staffName || '',
      gender:
        genders.find(
          gender => gender.id.toString() === generalInfoStaff.gender.toString()
        )?.label || '',
      email: generalInfoStaff.email || '',
      dateOfBirth: formatDate(generalInfoStaff.birthday || new Date()) || '',
      positionName: generalInfoStaff.positionName || '',
    }
    setPersonalInformation(personalInformation)
  }

  const downloadFileFromByteArr = ({
    fileName,
    fileContent,
  }: {
    fileName: string
    fileContent: string
  }) => {
    const byte = base64ToArrayBuffer(fileContent)
    const blob = new Blob([byte], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
  }

  const handleExport = (payload: any) => {
    dispatch(updateLoading(true))
    dispatch(
      exportStaffSkillSet({
        staffId,
        requestBody: payload,
      })
    )
      .unwrap()
      .then(res => {
        downloadFileFromByteArr({
          fileContent: res.data?.fileContent || '',
          fileName: res.data?.fileName || '',
        })
        setIsShowModalExportSkillSets(false)
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  //Effect
  useEffect(() => {
    if (isViewDetail) {
      dispatch(updateLoading(true))
      dispatch(getDetailStaff(staffId))
        .unwrap()
        .catch(() => {
          dispatch(
            alertError({
              message: 'Staff not found',
            })
          )
          navigate(PathConstant.STAFF_LIST)
        })
        .finally(() => {
          dispatch(updateLoading(false))
        })
    }
  }, [isViewDetail])

  useEffect(() => {
    return () => {
      dispatch(resetFormStaff({}))
    }
  }, [])

  useEffect(() => {
    setShowDialog(isFormInformationChange)
  }, [isFormInformationChange])

  useEffect(() => {
    setIsFormInformationChange(false)
  }, [activeStep])

  return (
    <CommonScreenLayout
      useBackPage
      backLabel={i18Staff('TXT_BACK_TO_LIST_STAFF')}
      onBack={backToStaffList}
    >
      <Box className={classes.stepWrapper}>
        <ConditionalRender conditional={isDetailPage}>
          <GeneralInformationStaffTop
            generalInfoStaff={generalInfoStaff}
            onShowModalExportSkillSets={handleShowModalExportSkillSets}
            isDetailPage
          />
        </ConditionalRender>

        {isDetailPage ? (
          <CommonTabs
            configTabs={listStep}
            activeTab={activeStep}
            nonLinear={isDetailPage}
            onClickTab={handleChangeStep}
          />
        ) : (
          <CommonStep
            configSteps={listStep}
            activeStep={activeStep}
            nonLinear={isDetailPage}
            onClickStep={handleChangeStep}
          />
        )}
        <ModalConfirm
          useNextStep
          title={i18('LB_NEXT_STEP') as string}
          description={i18('MSG_ROUTE_CHANGE_CONFIRMED') as string}
          open={isShowModalConfirmNextStep}
          onClose={() => setIsShowModalConfirmNextStep(false)}
          onDontSave={handleNotSave}
          onSubmit={handleNextCheckpointStep}
        />
        <DialogBox
          // @ts-ignore
          showDialog={showPrompt}
          confirmNavigation={confirmNavigation}
          cancelNavigation={cancelNavigation}
        />
      </Box>
      {isShowModalExportSkillSets && (
        <ModalExportSkillSets
          personalInformation={personalInformation}
          title={`${personalInformation.staffName} - ${personalInformation.positionName}`}
          onClose={() => setIsShowModalExportSkillSets(false)}
          onSubmit={handleExport}
        />
      )}
      <Box className={!isDetailPage ? classes.mt24 : ''}>
        <ConditionalRender
          conditional={activeStep === STAFF_STEP.GENERAL_INFORMATION}
        >
          <StaffDetailContext>
            <GeneralInformationStaff
              tempStep={tempStep}
              flagUpdate={flagUpdate}
              onChangeForm={handleChangeFormInformation}
              onUpdateFlag={setFlagUpdate}
            />
          </StaffDetailContext>
        </ConditionalRender>

        <ConditionalRender conditional={activeStep === STAFF_STEP.SKILL_SET}>
          <SkillSetStaff
            tempStep={tempStep}
            flagUpdate={flagUpdate}
            onChangeForm={handleChangeFormInformation}
            onUpdateFlag={setFlagUpdate}
          />
        </ConditionalRender>

        <ConditionalRender
          conditional={activeStep === STAFF_STEP.CONTRACT && !isDetailPage}
        >
          <Contract onSubmit={handleSubmit} />
        </ConditionalRender>
        <ConditionalRender
          conditional={activeStep === STAFF_STEP_DETAIL.PROJECT && isDetailPage}
        >
          <StaffDetailProject />
        </ConditionalRender>
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  stepWrapper: {},
  rootBtnExport: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
  },
  mb24: {
    marginBottom: `${theme.spacing(3)} !important`,
  },
  mt24: {
    marginTop: theme.spacing(3),
  },
}))
