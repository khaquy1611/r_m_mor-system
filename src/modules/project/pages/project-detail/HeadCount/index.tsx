import ModalConfirm from '@/components/modal/ModalConfirm'
import { LangConstant } from '@/const'
import HeadCountInformation from '@/modules/project/components/HeadCount/HeadcountInformation'
import ProjectAssignStaff from '@/modules/project/components/HeadCount/ProjectAssignStaff'
import ProjectStepAction from '@/modules/project/components/ProjectStep/ProjectStepAction'
import { CONFIG_PROJECT_STEPS } from '@/modules/project/const'
import {
  projectSelector,
  setActiveStep,
  setIsHeadcountChange,
} from '@/modules/project/reducer/project'
import {
  getProjectHeadcount,
  updateProjectHeadcount,
} from '@/modules/project/reducer/thunk'
import { ProjectState } from '@/modules/project/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

interface IProps {
  flagUpdate: boolean
  isShowModalConfirmNextStep: boolean
  isDetailPage: boolean
  onNextStep: () => void
}

const HeadCount = ({
  flagUpdate,
  isShowModalConfirmNextStep,
  onNextStep,
  isDetailPage,
}: IProps) => {
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18 } = useTranslation()
  const {
    activeStep,
    generalInfo,
    contractHeadcount,
    contractHeadcountInitial,
  }: ProjectState = useSelector(projectSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const classes = useStyles()

  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [flagInit, setFlagInit] = useState(false)

  const isViewDetail = useMemo(() => {
    return !!params.projectId
  }, [params.projectId])

  const formDisabled = useMemo(() => {
    if (!isDetailPage) return false
    return !permissions.useProjectUpdateHeadcountInfo
  }, [permissions.useProjectUpdateHeadcountInfo])

  const useProjectStepAction = useMemo(() => {
    if (!isDetailPage) return true
    return !formDisabled
  }, [formDisabled])

  const handleNextStep = () => {
    if (isViewDetail) {
      setIsShowModalConfirm(true)
    } else {
      dispatch(setActiveStep(activeStep + 1))
    }
  }

  const handleUpdateHeadCount = () => {
    dispatch(
      updateProjectHeadcount({
        projectId: params.projectId ?? '',
        data: contractHeadcount,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18nProject('MSG_UPDATE_PROJECT_INFORMATION_SUCCESS', {
              projectId: generalInfo.code || '',
            }),
          })
        )
        dispatch(getProjectHeadcount(params.projectId as string))
        onNextStep()
      })
  }

  useEffect(() => {
    if (isViewDetail) {
      dispatch(getProjectHeadcount(params.projectId as string))
    }
    setTimeout(() => {
      document.getElementById('main__layout')?.scrollTo(0, 0)
    }, 0)
  }, [])

  // handle submit popup confirm leave page
  useEffect(() => {
    if (flagUpdate && !isShowModalConfirmNextStep && flagInit) {
      handleUpdateHeadCount()
    }
    setFlagInit(true)
  }, [flagUpdate])

  // handle compare contractHeadcount change data
  useEffect(() => {
    if (!isViewDetail) return
    const _isHeadCountChange =
      JSON.stringify(contractHeadcountInitial) !==
      JSON.stringify(contractHeadcount)

    dispatch(setIsHeadcountChange(_isHeadCountChange))
  }, [contractHeadcount])

  return (
    <Box className={classes.rootHeadCount}>
      <HeadCountInformation disabled={formDisabled} />

      <ProjectAssignStaff isDetailPage={isDetailPage} />
      {useProjectStepAction && (
        <ProjectStepAction
          configSteps={CONFIG_PROJECT_STEPS}
          activeStep={activeStep}
          onNext={handleNextStep}
          isViewDetail={isViewDetail}
        />
      )}

      <ModalConfirm
        title={i18('TXT_UPDATE_INFORMATION')}
        description="Do you wish to update Project - Headcount?"
        open={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        onSubmit={handleUpdateHeadCount}
      />
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootHeadCount: {
    maxWidth: '100%',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    '& [data-title="title"]': {
      marginBottom: '42px',
      fontWeight: 700,
      fontSiz: '22px',
    },
  },
}))
export default HeadCount
