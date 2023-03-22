import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import ConditionalRender from '@/components/ConditionalRender'
import DialogBox from '@/components/modal/DialogBox'
import ModalConfirm from '@/components/modal/ModalConfirm'
import CommonStep from '@/components/step/Stepper'
import { LangConstant, PathConstant } from '@/const'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { StepConfig } from '@/types'
import { scrollToTop } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { CONFIG_PROJECT_STEPS, PROJECT_STEP } from '../../const'
import {
  projectSelector,
  resetProjectDataStep,
  setActiveStep,
  setIsHeadcountChange,
} from '../../reducer/project'
import { createNewProject, getProjectGeneral } from '../../reducer/thunk'
import { ProjectState } from '../../types'
import {
  convertPayloadAssignStaff,
  convertPayloadCost,
  convertPayloadGeneral,
  convertPayloadRevenue,
} from '../../utils'
import ProjectCost from './Cost'
import ProjectGeneralInformation from './GeneralInformation/ProjectGeneralInformation'
import ProjectHeadCount from './HeadCount'
import ProjectRevenue from './Revenue'

interface ProjectDetailProps {
  isDetailPage: boolean
}

export default function ProjectDetail({ isDetailPage }: ProjectDetailProps) {
  const {
    activeStep,
    generalInfo,
    projectCosts,
    projectRevenuesByDivision,
    projectRevenuesByProject,
    contractHeadcount,
    listStepHadFillData,
    assignStaffs,
    isHeadCountChange,
    generalInfoFormik,
  }: ProjectState = useSelector(projectSelector)

  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)

  const { permissions }: AuthState = useSelector(selectAuth)

  const [isConfirmNextStep, setIsConfirmNextStep] = useState(false)
  const [isShowModalConfirmNextStep, setIsShowModalConfirmNextStep] =
    useState(false)
  const [tempStep, setTempStep] = useState(0)
  const [flagUpdate, setFlagUpdate] = useState(false)
  const [isFormInformationChange, setIsFormInformationChange] = useState(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const projectSteps = useMemo(() => {
    if (!isDetailPage) return CONFIG_PROJECT_STEPS
    const result: StepConfig[] = []
    if (permissions.useProjectViewGeneralInfo) {
      result.push(CONFIG_PROJECT_STEPS[0])
    }
    if (permissions.useProjectViewHeadcountInfo) {
      result.push(CONFIG_PROJECT_STEPS[1])
    }
    if (permissions.useProjectViewProjectRevenueInfo) {
      result.push(CONFIG_PROJECT_STEPS[2])
    }
    if (permissions.useProjectViewCostInfo) {
      result.push(CONFIG_PROJECT_STEPS[3])
    }
    return result
  }, [permissions])

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog)

  const handleChangeStep = (step: number) => {
    setTempStep(step)
    if (
      Object.values(PROJECT_STEP).every(
        (valueStep: number) => valueStep !== step
      )
    )
      return
    if (
      (isConfirmNextStep && activeStep === PROJECT_STEP.GENERAL_INFORMATION) ||
      (activeStep === PROJECT_STEP.HEAD_COUNT && isHeadCountChange)
    ) {
      setIsShowModalConfirmNextStep(true)
    } else {
      dispatch(setActiveStep(step))
    }
  }

  const handleSubmit = () => {
    const data = {
      projectInformation: convertPayloadGeneral(generalInfo),
      projectCosts: projectCosts.map(convertPayloadCost),
      projectRevenues: [
        ...projectRevenuesByDivision,
        ...projectRevenuesByProject,
      ].map(convertPayloadRevenue),
      projectHeadcount: {
        contractHeadcount,
        staffHeadcount: assignStaffs.map(convertPayloadAssignStaff),
      },
    }
    dispatch(createNewProject({ data }))
      .unwrap()
      .then(() => {
        navigate(PathConstant.PROJECT_LIST)
      })
    setShowDialog(false)
  }

  const backToProjectList = () => {
    navigate(PathConstant.PROJECT_LIST)
  }

  const handleNextCheckpointStep = () => {
    setFlagUpdate(true)
  }

  const handleDontSave = () => {
    dispatch(setActiveStep(tempStep))
    dispatch(getProjectGeneral(params.projectId ?? ''))
  }

  const onNextStepHeadCount = () => {
    dispatch(setActiveStep(tempStep))
    setFlagUpdate(false)
  }

  const handleChangeFormInformation = (isChange: boolean) => {
    setIsFormInformationChange(isChange)
  }

  useEffect(() => {
    return () => {
      dispatch(setActiveStep(PROJECT_STEP.GENERAL_INFORMATION))
      dispatch(setIsHeadcountChange(false))
      dispatch(resetProjectDataStep(null))
    }
  }, [])

  useEffect(() => {
    if (generalInfoFormik.code) {
      scrollToTop()
    }
  }, [generalInfoFormik])

  useEffect(() => {
    setShowDialog(isFormInformationChange)
  }, [isFormInformationChange])

  return (
    <CommonScreenLayout
      useBackPage
      backLabel={i18nProject('LB_BACK_TO_PROJECT_LIST')}
      onBack={backToProjectList}
    >
      <Box className={classes.stepWrapper}>
        <CommonStep
          configSteps={projectSteps}
          activeStep={activeStep}
          nonLinear={isDetailPage}
          listStepHadFillData={isDetailPage ? undefined : listStepHadFillData}
          onClickStep={handleChangeStep}
        />
        <ModalConfirm
          useNextStep
          title={i18('LB_NEXT_STEP')}
          description={i18('MSG_ROUTE_CHANGE_CONFIRMED')}
          open={isShowModalConfirmNextStep}
          onClose={() => setIsShowModalConfirmNextStep(false)}
          onSubmit={handleNextCheckpointStep}
          onDontSave={handleDontSave}
        />
        <DialogBox
          // @ts-ignore
          showDialog={showPrompt}
          confirmNavigation={confirmNavigation}
          cancelNavigation={cancelNavigation}
        />
      </Box>
      {isDetailPage && generalInfo.name && (
        <Box className={classes.projectName}>
          <Box className={classes.label}>Project Name:</Box>
          <Box component="span">{generalInfoFormik.name}</Box>
        </Box>
      )}
      <ConditionalRender
        conditional={activeStep === PROJECT_STEP.GENERAL_INFORMATION}
      >
        <ProjectGeneralInformation
          flagUpdate={flagUpdate}
          onChangeForm={handleChangeFormInformation}
          setIsConfirmNextStep={setIsConfirmNextStep}
          onNextStep={onNextStepHeadCount}
          isDetailPage={isDetailPage}
          isShowModalConfirmNextStep={isShowModalConfirmNextStep}
        />
      </ConditionalRender>

      <ConditionalRender conditional={activeStep === PROJECT_STEP.HEAD_COUNT}>
        <ProjectHeadCount
          isDetailPage={isDetailPage}
          flagUpdate={flagUpdate}
          isShowModalConfirmNextStep={isShowModalConfirmNextStep}
          onNextStep={onNextStepHeadCount}
        />
      </ConditionalRender>

      <ConditionalRender conditional={activeStep === PROJECT_STEP.REVENUE}>
        <ProjectRevenue />
      </ConditionalRender>

      <ConditionalRender conditional={activeStep === PROJECT_STEP.COST}>
        <ProjectCost onSubmit={handleSubmit} />
      </ConditionalRender>
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
  stepWrapper: {
    paddingBottom: theme.spacing(3),
  },
  projectName: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  label: {
    fontWeight: 700,
  },
}))
