import { LangConstant } from '@/const'
import { GENERAL_INFO_STAFF_INIT } from '@/modules/staff/const'
import {
  setActiveStep,
  setGeneralInfoStaff,
  staffSelector,
} from '@/modules/staff/reducer/staff'
import {
  IGeneralInformationStaffState,
  StaffState,
} from '@/modules/staff/types'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import { scrollToFirstErrorMessage } from '@/utils'
import { useFormik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import formikConfig from '../../../formik/Formik'

const useGeneralInformation = () => {
  //const
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()

  const DATE_FORMAT = 'DD/MM/YYYY'
  const { generalSchemaValidation } = formikConfig()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const { activeStep, generalInfoStaff }: StaffState =
    useSelector(staffSelector)

  //State
  const [birthDayError, setBirthDayError] = useState(false)
  const [dateOnBoardError, setDateOnBoardError] = useState(false)
  const [isChangeCertificate, setIsChangeCertificate] = useState(false)
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [showEditInformation, setShowEditInformation] = useState<boolean>(false)
  const [isShowModalConfirmCancelUpdate, setShowModalConfirmCancelUpdate] =
    useState<boolean>(false)

  // Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: generalInfoStaff,
    validationSchema: generalSchemaValidation,
    validateOnMount: true,
    onSubmit: (values: IGeneralInformationStaffState) => {
      if (birthDayError || dateOnBoardError) return
      if (isViewDetail) {
        setIsShowModalConfirm(true)
      } else {
        dispatch(setGeneralInfoStaff(values))
        dispatch(setActiveStep(activeStep + 1))
      }
    },
  })

  // Memo
  const staffId: string | number = useMemo(() => {
    return params.staffId ?? ''
  }, [params.staffId])
  const isViewDetail = useMemo(() => {
    return !!staffId
  }, [staffId])
  const isChangeData = useMemo(() => {
    return !(JSON.stringify(formik.values) === JSON.stringify(generalInfoStaff))
  }, [formik.values, generalInfoStaff])

  const isChangeDataCreate = useMemo(() => {
    return (
      !(
        JSON.stringify(formik.values) ===
        JSON.stringify(GENERAL_INFO_STAFF_INIT)
      ) || isChangeCertificate
    )
  }, [formik.values, isChangeCertificate])

  const isDisabledButtonSubmit = useMemo(() => {
    return isViewDetail ? !isChangeData : false
  }, [formik.values, isChangeCertificate, isChangeData, isViewDetail])

  // Function
  const handleNextStep = () => {
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }
  const handleChangeFile = () => {
    setIsChangeCertificate(true)
  }

  const handleInputChange = useCallback((e: EventInput, field: string) => {
    formik.setFieldValue(field, e.target.value)
  }, [])
  const handleSelectChange = useCallback(
    (
      value: string,
      option: OptionItem | undefined,
      keyName: string | undefined
    ) => {
      if (keyName) {
        formik.setFieldValue(keyName, value)
      }
    },
    []
  )
  const handleBirthDayError = (error: string | null) => {
    setBirthDayError(!!error)
  }
  const handleDateOnBoardError = (error: string | null) => {
    setDateOnBoardError(!!error)
  }
  const handleChangeDate = useCallback(
    (dateSelected: string, keyName: string) => {
      if (keyName != undefined) {
        formik.setFieldValue(keyName, dateSelected)
      }
    },
    []
  )
  const handleBranchChange = (value: string) => {
    formik.setValues({
      ...formik.values,
      branchId: value,
      divisionId: '',
      position: '',
    })
  }
  const handleDivisionChange = (value: OptionItem) => {
    formik.setValues({
      ...formik.values,
      divisionId: value.id as string,
      position: '',
    })
  }

  const handleSelectPosition = (value: string) => {
    formik.setValues({
      ...formik.values,
      position: value,
      grade: {},
      gradeTitle: {},
      leaderGrade: {},
      leaderGradeTitle: {},
    })
  }

  const handleDirectManagerChange = (value: any) => {
    if (value.id) {
      formik.setValues({
        ...formik.values,
        directManager: value,
        branchId: value?.branch?.id ?? '',
        divisionId: value?.division?.divisionId ?? '',
        position: '',
        grade: {},
        gradeTitle: {},
        leaderGrade: {},
        leaderGradeTitle: {},
      })
    } else {
      formik.setValues({
        ...formik.values,
        directManager: {},
        branchId: '',
        divisionId: '',
        position: '',
        grade: {},
        gradeTitle: {},
        leaderGrade: {},
        leaderGradeTitle: {},
      })
    }
  }
  const handleGradeChange = (value: OptionItem) => {
    formik.setValues({
      ...formik.values,
      grade: value,
      gradeTitle: {},
      leaderGrade: {},
      leaderGradeTitle: {},
    })
  }
  const handleLeaderGradeChange = (value: OptionItem) => {
    formik.setValues({
      ...formik.values,
      leaderGrade: value,
      leaderGradeTitle: {},
    })
  }
  const handleGradeTitleChange = (value: OptionItem) => {
    formik.setValues({
      ...formik.values,
      gradeTitle: value,
      leaderGrade: {},
      leaderGradeTitle: {},
    })
  }
  const handleLeaderGradeTitleChange = useCallback((value: OptionItem) => {
    formik.setFieldValue('leaderGradeTitle', value)
  }, [])
  const handleSubmit = () => {}

  const handleShowModalEditInformation = () => {
    setShowEditInformation(!showEditInformation)
    formik.resetForm({
      values: generalInfoStaff,
    })
  }
  const handleShowModalCancelUpdateInformation = () => {
    isDisabledButtonSubmit
      ? setShowEditInformation(false)
      : setShowModalConfirmCancelUpdate(true)
  }

  const resetFormik = () => {
    formik.resetForm({
      values: generalInfoStaff,
    })
  }

  return {
    handleShowModalCancelUpdateInformation,
    handleShowModalEditInformation,
    handleLeaderGradeTitleChange,
    handleGradeTitleChange,
    handleLeaderGradeChange,
    handleGradeChange,
    handleSubmit,
    handleDirectManagerChange,
    handleSelectPosition,
    handleDivisionChange,
    handleBranchChange,
    handleChangeDate,
    handleDateOnBoardError,
    handleBirthDayError,
    handleSelectChange,
    handleInputChange,
    handleNextStep,
    handleChangeFile,
    birthDayError,
    setBirthDayError,
    dateOnBoardError,
    setDateOnBoardError,
    isChangeCertificate,
    setIsChangeCertificate,
    isShowModalConfirm,
    setIsShowModalConfirm,
    showEditInformation,
    setShowEditInformation,
    isShowModalConfirmCancelUpdate,
    setShowModalConfirmCancelUpdate,
    staffId,
    isViewDetail,
    isChangeData,
    isChangeDataCreate,
    isDisabledButtonSubmit,
    DATE_FORMAT,
    formik,
    resetFormik,
  }
}

export default useGeneralInformation
