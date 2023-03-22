import { HttpStatusCode } from '@/api/types'
import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import InputDatePicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import ModalConfirm from '@/components/modal/ModalConfirm'
import SelectBranch from '@/components/select/SelectBranch'
import SelectCurrency from '@/components/select/SelectCurrency'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectDivision from '@/components/select/SelectDivision'
import SelectPartner from '@/components/select/SelectPartner'
import SelectProjectManager from '@/components/select/SelectProjectManager'
import SelectService from '@/components/select/SelectService'
import { LangConstant, PathConstant } from '@/const'
import {
  CURRENCY_CODE,
  PROJECT_STATUS,
  PROJECT_STATUS_TYPE,
} from '@/const/app.const'
import ModalConfirmHeadcount from '@/modules/project/components/Modal/ModalConfirmHeadcount'
import {
  CONFIG_PROJECT_STEPS,
  generalInitialState,
} from '@/modules/project/const'
import {
  projectSelector,
  setActiveStep,
  setEndDateChange,
  setGeneralInfo,
  setIsHeadcountChange,
  setIsTotalContractHeadcountChange,
  setStartDateChange,
} from '@/modules/project/reducer/project'
import {
  getProjectGeneral,
  getProjectHeadcount,
  updateProjectGeneral,
  updateProjectHeadcount,
} from '@/modules/project/reducer/thunk'
import { ProjectState } from '@/modules/project/types'
import { convertPayloadGeneral } from '@/modules/project/utils'
import { AuthState, selectAuth } from '@/reducer/auth'
import {
  commonSelector,
  getContractCodes,
  getProjectTypes,
} from '@/reducer/common'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { checkValidateFormik, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ProjectStepAction from '../../../components/ProjectStep/ProjectStepAction'
import formikConfig from '../formik/Formik'
import StringFormat from 'string-format'

const projectStatus: OptionItem[] = [
  {
    id: PROJECT_STATUS_TYPE.NOT_STARTED,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.NOT_STARTED].label,
    value: PROJECT_STATUS_TYPE.NOT_STARTED,
  },
  {
    id: PROJECT_STATUS_TYPE.PENDING,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.PENDING].label,
    value: PROJECT_STATUS_TYPE.PENDING,
  },
  {
    id: PROJECT_STATUS_TYPE.IN_PROGRESS,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.IN_PROGRESS].label,
    value: PROJECT_STATUS_TYPE.IN_PROGRESS,
  },
  {
    id: PROJECT_STATUS_TYPE.COMPLETED,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.COMPLETED].label,
    value: PROJECT_STATUS_TYPE.COMPLETED,
  },
  {
    id: PROJECT_STATUS_TYPE.CANCELLED,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.CANCELLED].label,
    value: PROJECT_STATUS_TYPE.CANCELLED,
  },
]

interface IProps {
  setIsConfirmNextStep: Dispatch<SetStateAction<boolean>>
  flagUpdate?: boolean
  onNextStep: () => void
  isShowModalConfirmNextStep: boolean
  onChangeForm: (isChange: boolean) => void
  isDetailPage: boolean
}

interface UpdateGeneralInformationParams {
  isSave: boolean
}

export default function ProjectGeneralInformation({
  setIsConfirmNextStep,
  flagUpdate,
  onNextStep,
  onChangeForm,
  isShowModalConfirmNextStep,
  isDetailPage,
}: IProps) {
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18 } = useTranslation()
  const {
    activeStep,
    generalInfo,
    generalInfoFormik,
    isRollbackGeneralStep,
    startDate,
    endDate,
  }: ProjectState = useSelector(projectSelector)

  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const navigate = useNavigate()

  const { listProjectTypes, listContractCode } = useSelector(commonSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [startDateError, setStartDateError] = useState(false)
  const [endDateError, setEndDateError] = useState(false)
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [openModalConfirmHeadcount, setOpenModalConfirmHeadcount] =
    useState(false)
  const classes = useStyles()
  const { generalSchemaValidation } = formikConfig()

  const isViewDetail = useMemo(() => {
    return !!params.projectId
  }, [params.projectId])

  const formDisabled = useMemo(() => {
    if (!isDetailPage) return false
    return !permissions.useProjectUpdateGeneralInfo
  }, [permissions.useProjectUpdateGeneralInfo])

  const useProjectStepAction = useMemo(() => {
    if (!isDetailPage) return true
    return !formDisabled
  }, [formDisabled])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: generalInfoFormik,
    validationSchema: generalSchemaValidation,
    validateOnMount: true,
    onSubmit: (values: any) => {
      if (endDateError) return
      if (isViewDetail) {
        if (startDate.change || endDate.change) {
          setOpenModalConfirmHeadcount(true)
        } else {
          setIsShowModalConfirm(true)
        }
      } else {
        dispatch(setGeneralInfo({ ...values }))
        dispatch(setActiveStep(activeStep + 1))
      }
    },
  })

  useEffect(() => {
    dispatch(setGeneralInfo({ ...formik.values }))
  }, [formik.values])

  useEffect(() => {
    if (formik.values.customer?.id) {
      dispatch(
        getContractCodes({
          customerId: formik.values.customer?.id as string,
          projectId: params.projectId as string,
        })
      )
    }
  }, [formik.values.customer?.id])

  const handleNextStep = () => {
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const handleInputChange = useCallback((event: any) => {
    formik.setFieldValue('name', event.target.value)
  }, [])

  const handleBranchChange = useCallback((value: any) => {
    formik.setFieldValue('divisions', [])
    formik.setFieldValue('branchId', value)
  }, [])

  const handleDivisionsChange = useCallback((value: any) => {
    formik.setFieldValue('divisions', value)
  }, [])

  const handleTechnologyChange = useCallback((value: any) => {
    formik.setFieldValue('technologies', value)
  }, [])

  const handleCustomerChange = useCallback((value: any) => {
    formik.setFieldValue('customer', value)
    formik.setFieldValue('contractIds', [])
  }, [])

  const handlePartnerChange = useCallback((value: any) => {
    formik.setFieldValue('partner', value)
  }, [])

  const handleTypeChange = useCallback((value: any) => {
    formik.setFieldValue('type', value)
  }, [])

  const handleStatusChange = useCallback((value: any) => {
    formik.setFieldValue('status', value)
  }, [])

  const handleStartDateChange = useCallback((value: any) => {
    // when startDate change set flag isHeadcountChange = false
    dispatch(setIsHeadcountChange(false))
    dispatch(
      setStartDateChange({
        change: true,
        oldValue: formik.values.startDate,
      })
    )
    formik.setFieldValue('startDate', value)
  }, [])

  const handleEndDateChange = useCallback((value: any) => {
    // when endDate change set flag isHeadcountChange = false
    dispatch(setIsHeadcountChange(false))
    dispatch(
      setEndDateChange({
        change: true,
        oldValue: formik.values.endDate,
      })
    )
    formik.setFieldValue('endDate', value)
  }, [])

  const handleManagerChange = useCallback((value: any) => {
    formik.setFieldValue('manager', value)
  }, [])

  const handleSlackLinkChange = useCallback((event: any) => {
    formik.setFieldValue('workChannelLink', event.target.value)
  }, [])

  const handleContractCodeChange = useCallback((value: any) => {
    formik.setFieldValue('contractIds', value)
  }, [])

  const handleTotalContractChange = useCallback(
    (value: any) => {
      // when totalContract change set flag isHeadcountChange = false
      dispatch(setIsHeadcountChange(false))
      if (isRollbackGeneralStep && value !== formik.values.totalContract) {
        dispatch(setIsTotalContractHeadcountChange(true))
      }
      formik.setFieldValue('totalContract', value ?? '')
    },
    [formik.values.totalContract]
  )
  const handleNoteChange = useCallback((value: any) => {
    formik.setFieldValue('note', value.target.value)
  }, [])

  const handleDescriptionChange = useCallback((value: any) => {
    formik.setFieldValue('description', value.target.value)
  }, [])

  const handleTotalRevenueChange = useCallback((value: any) => {
    formik.setFieldValue('totalRevenue', value)
  }, [])

  const handleRevenueCurrencyChange = useCallback((value: any) => {
    if (CURRENCY_CODE.VND === value) {
      formik.setFieldValue('revenueRate', '1')
    } else {
      formik.setFieldValue('revenueRate', '')
    }
    formik.setFieldValue('revenueCurrency', value)
  }, [])

  const handleRevenueRateChange = useCallback((value: any) => {
    formik.setFieldValue('revenueRate', value)
  }, [])

  const isChangeData = useMemo(() => {
    return !(
      JSON.stringify(formik.values) === JSON.stringify(generalInfoFormik)
    )
  }, [formik.values])

  const isChangeDataCreate = useMemo(() => {
    return !(
      JSON.stringify(formik.values) === JSON.stringify(generalInitialState)
    )
  }, [formik.values])

  const isDisabledButtonSubmit = useMemo(() => {
    return isViewDetail ? !isChangeData : false
  }, [formik.values])

  const startDateErrorMessage = useMemo(() => {
    if (startDateError || endDateError) {
      if (
        formik.values.startDate &&
        formik.values.endDate &&
        formik.values.startDate > formik.values.endDate
      ) {
        return i18nProject('MSG_INVALID_START_DATE_RANGE') as string
      } else {
        return i18nProject('MSG_PROJECT_START_DATE_INVALID') as string
      }
    } else {
      return !!formik.touched.startDate ? formik.errors.startDate : ''
    }
  }, [
    startDateError,
    formik.touched.startDate,
    formik.errors.startDate,
    formik.values.startDate,
    formik.values.endDate,
  ])

  const compareStartDateWithEndDate = useMemo(() => {
    if (!formik.values.startDate || !formik.values.endDate) return false
    return formik.values.startDate > formik.values.endDate
  }, [formik.values.startDate, formik.values.endDate])

  const handleUpdateGeneralInformation = ({
    isSave,
  }: UpdateGeneralInformationParams) => {
    const data = convertPayloadGeneral(formik.values)
    dispatch(updateProjectGeneral({ projectId: params.projectId ?? '', data }))
      .unwrap()
      .then(() => {
        dispatch(getProjectGeneral(params.projectId ?? ''))
        dispatch(
          getContractCodes({
            customerId: formik.values.customer?.id as string,
            projectId: params.projectId as string,
          })
        )
        if (isSave) {
          onNextStep()
        }
      })
    setIsShowModalConfirm(false)
  }

  const handleUpdateHeadCount = (contractHeadcount: any) => {
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
      })
  }

  const handleUpdateTwoStep = (contractHeadcount: any) => {
    handleUpdateGeneralInformation({ isSave: true })
    handleUpdateHeadCount(contractHeadcount)
    setOpenModalConfirmHeadcount(false)
    onChangeForm(false)
  }

  useEffect(() => {
    if (isViewDetail) {
      dispatch(updateLoading(true))
      dispatch(getProjectGeneral(params.projectId ?? ''))
        .unwrap()
        .catch(res => {
          dispatch(
            alertError({
              message:
                res?.status === HttpStatusCode.FORBIDDEN ||
                res?.status === HttpStatusCode.UNAUTHORIZED
                  ? StringFormat(i18('MSG_SCREEN_NOT_FOUND'), 'Project')
                  : res[0]?.message,
            })
          )
          navigate(PathConstant.PROJECT_LIST)
        })
        .finally(() => {
          dispatch(updateLoading(false))
        })
      dispatch(getProjectHeadcount(params.projectId ?? ''))
    }
    setTimeout(() => {
      document.getElementById('main__layout')?.scrollTo(0, 0)
    }, 0)
  }, [])

  useEffect(() => {
    if (isViewDetail) {
      setIsConfirmNextStep(!isDisabledButtonSubmit)
    }
  }, [isDisabledButtonSubmit])

  useEffect(() => {
    dispatch(getProjectTypes())
  }, [])

  useEffect(() => {
    // handle validate form when click change step
    if (!isShowModalConfirmNextStep && flagUpdate) {
      ;(async () => {
        const isError = await checkValidateFormik(formik)
        if (!isError) {
          if (startDate.change || endDate.change) {
            setOpenModalConfirmHeadcount(true)
          } else {
            handleUpdateGeneralInformation({ isSave: true })
          }
        }
      })()
    }
  }, [isShowModalConfirmNextStep])

  useEffect(() => {
    isViewDetail ? onChangeForm(isChangeData) : onChangeForm(isChangeDataCreate)
  }, [isViewDetail, isChangeData, isChangeDataCreate])

  return (
    <form onSubmit={formik.handleSubmit} className={classes.formContainer}>
      <CardForm title={i18('TXT_GENERAL_INFORMATION')}>
        <Box className={classes.formWrapper}>
          <FormLayout top={24} gap={24}>
            <InputTextLabel
              disabled={formDisabled}
              label={i18nProject('LB_PROJECT_NAME')}
              require
              placeholder={i18nProject('PLH_PROJECT_NAME')}
              name="name"
              value={formik.values.name}
              onChange={handleInputChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              errorMessage={formik.touched.name ? formik.errors.name : ''}
            />
          </FormLayout>
          <FormLayout top={24} gap={24}>
            <SelectBranch
              disabled={isDetailPage || formDisabled}
              label={i18nProject('LB_RESPONSIBLE_BRANCH')}
              require
              error={formik.touched.branchId && Boolean(formik.errors.branchId)}
              errorMessage={formik.touched.branchId && formik.errors.branchId}
              value={formik.values.branchId}
              onChange={handleBranchChange}
            />

            <SelectDivision
              require
              disabled={formDisabled}
              width={'100%'}
              label={i18nProject('LB_PARTICIPATE_DIVISION')}
              isProject={true}
              placeholder={i18nProject('PLH_SELECT_DIVISION')}
              error={
                formik.touched.divisions && Boolean(formik.errors.divisions)
              }
              errorMessage={
                !!formik.touched.divisions
                  ? (formik.errors.divisions as string)
                  : ''
              }
              value={formik.values.divisions}
              onChange={handleDivisionsChange}
            />
          </FormLayout>

          <FormLayout top={24} gap={24}>
            <SelectService
              disabled={formDisabled}
              label={i18nProject('LB_TECHNOLOGY')}
              require
              width={'100%'}
              placeholder={i18nProject('PLH_SELECT_TECHNOLOGY')}
              error={
                formik.touched.technologies &&
                Boolean(formik.errors.technologies)
              }
              errorMessage={
                Boolean(formik.touched.technologies)
                  ? (formik.errors.technologies as string)
                  : ''
              }
              value={formik.values.technologies}
              onChange={handleTechnologyChange}
            />
          </FormLayout>

          <FormLayout top={24} gap={24}>
            <SelectCustomer
              disabled={formDisabled}
              isProject
              require
              value={formik.values.customer}
              onChange={handleCustomerChange}
              error={formik.touched.customer && Boolean(formik.errors.customer)}
              errorMessage={
                Boolean(formik.touched.customer)
                  ? (formik.errors.customer as string)
                  : ''
              }
            />

            <SelectPartner
              isProject
              disabled={formDisabled}
              label={i18nProject('LB_OUTSOURCE')}
              placeholder={i18nProject('PLH_SELECT_OUTSOURCE') as string}
              value={formik.values.partner}
              onChange={handlePartnerChange}
              error={formik.touched.partner && Boolean(formik.errors.partner)}
              errorMessage={
                Boolean(formik.touched.partner)
                  ? (formik.errors.partner as string)
                  : ''
              }
            />
          </FormLayout>

          <FormLayout top={24} gap={24}>
            <FormItem label={i18nProject('lB_PROJECT_TYPE')} require>
              <InputDropdown
                isDisable={formDisabled}
                width={'100%'}
                placeholder={i18nProject('PLH_SELECT_PROJECT_TYPE')}
                listOptions={listProjectTypes}
                value={formik.values.type}
                onChange={handleTypeChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                errorMessage={formik.errors.type || formik.errors.noteType}
              />
            </FormItem>
            <FormItem label={i18nProject('LB_PROJECT_CONTRACT_CODE')}>
              <AutoCompleteSearchCustom
                multiple
                disabled={!formik.values.customer?.id || formDisabled}
                placeholder={i18nProject('PLH_SELECT_CONTRACT_CODE')}
                listOptions={listContractCode}
                onChange={handleContractCodeChange}
                onInputChange={() => {}}
                value={formik.values.contractIds}
              />
            </FormItem>
          </FormLayout>

          <FormLayout gap={24} top={24}>
            <SelectProjectManager
              disabled={formDisabled}
              error={formik.touched.manager && Boolean(formik.errors.manager)}
              errorMessage={formik.errors.manager as string}
              value={formik.values.manager}
              label={i18('LB_PROJECT_MANAGER')}
              onChange={handleManagerChange}
            />

            <FormItem
              label={i18nProject('LB_MONTHLY_HEADCOUNT')}
              error={
                formik.touched.totalContract && !!formik.errors.totalContract
              }
              errorMessage={
                formik.touched.totalContract ? formik.errors.totalContract : ''
              }
            >
              <InputCurrency
                disabled={isViewDetail || formDisabled}
                suffix=""
                placeholder={i18nProject('PLH_INPUT_TOTAL_HEAD_COUNT')}
                value={formik.values.totalContract}
                onChange={handleTotalContractChange}
                error={
                  formik.touched.totalContract && !!formik.errors.totalContract
                }
              />
            </FormItem>
          </FormLayout>

          <FormLayout gap={24} top={24}>
            <FormItem
              label={i18nProject('LB_TOTAL_REVENUE')}
              error={
                formik.touched.totalRevenue &&
                Boolean(formik.errors.totalRevenue)
              }
              errorMessage={formik.errors.totalRevenue}
            >
              <InputCurrency
                suffix=""
                disabled={formDisabled}
                error={
                  formik.touched.totalRevenue &&
                  Boolean(formik.errors.totalRevenue)
                }
                placeholder={i18nProject('PLH_INPUT_TOTAL_REVENUE')}
                value={formik.values.totalRevenue}
                onChange={handleTotalRevenueChange}
              />
            </FormItem>

            <SelectCurrency
              disabled={formDisabled}
              isShowClearIcon={false}
              label={i18nProject('LB_REVENUE_CURRENCY')}
              value={formik.values.revenueCurrency}
              onChange={handleRevenueCurrencyChange}
            />
          </FormLayout>

          <FormLayout gap={24} top={24}>
            <FormItem
              label={i18nProject('LB_REVENUE_RATE')}
              error={formik.touched.revenueRate && !!formik.errors.revenueRate}
              errorMessage={formik.errors.revenueRate}
            >
              <InputCurrency
                suffix=""
                error={
                  formik.touched.revenueRate && !!formik.errors.revenueRate
                }
                placeholder={i18nProject('PLH_INPUT_REVENUE_RATE')}
                value={formik.values.revenueRate}
                onChange={handleRevenueRateChange}
                disabled={
                  +formik.values.revenueCurrency === +CURRENCY_CODE.VND ||
                  formDisabled
                }
              />
            </FormItem>
          </FormLayout>
          <FormLayout gap={24} top={24}>
            <InputDatePicker
              require
              isShowClearIcon={!formDisabled}
              disabled={formDisabled}
              width={'calc((600px - 48px) / 3)'}
              label={i18nProject('lB_PROJECT_START_DATE')}
              maxDate={formik.values.endDate}
              value={formik.values.startDate}
              onChange={handleStartDateChange}
              error={
                (formik.touched.startDate &&
                  Boolean(formik.errors.startDate)) ||
                startDateError
              }
              errorMessage={startDateErrorMessage}
              onError={(error: string | null) => setStartDateError(!!error)}
            />

            <InputDatePicker
              require
              isShowClearIcon={!formDisabled}
              disabled={formDisabled}
              width={'calc((600px - 48px) / 3)'}
              label={i18nProject('lB_PROJECT_END_DATE')}
              error={
                (formik.touched.endDate && Boolean(formik.errors.endDate)) ||
                endDateError
              }
              errorMessage={
                endDateError
                  ? compareStartDateWithEndDate
                    ? ''
                    : (i18nProject('MSG_PROJECT_END_DATE_INVALID') as string)
                  : !!formik.touched.endDate
                  ? formik.errors.endDate
                  : ''
              }
              minDate={formik.values.startDate}
              value={formik.values.endDate}
              onChange={handleEndDateChange}
              onError={(error: string | null) => setEndDateError(!!error)}
            />
            <FormItem label={i18nProject('lB_PROJECT_STATUS')} require>
              <InputDropdown
                isDisable={formDisabled}
                width={'calc((600px - 48px) / 3)'}
                placeholder={i18nProject('PLH_SELECT_PROJECT_STATUS')}
                listOptions={projectStatus}
                value={formik.values.status}
                onChange={handleStatusChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                errorMessage={formik.touched.status && formik.errors.status}
              />
            </FormItem>
          </FormLayout>

          <FormLayout top={24}>
            <FormItem
              label={i18('LB_DESCRIPTION')}
              error={formik.touched.description && !!formik.errors.description}
              errorMessage={formik.errors.description}
            >
              <InputTextArea
                disabled={formDisabled}
                placeholder={i18('PLH_DESCRIPTION')}
                name="description"
                defaultValue={formik.values.description}
                onChange={handleDescriptionChange}
                error={
                  formik.touched.description && !!formik.errors.description
                }
              />
            </FormItem>
          </FormLayout>

          <FormLayout top={24}>
            <FormItem label={i18nProject('LB_NOTE')}>
              <InputTextArea
                disabled={formDisabled}
                placeholder={i18nProject('PLH_INPUT_NOTE')}
                name="note"
                defaultValue={formik.values.note}
                onChange={handleNoteChange}
              />
            </FormItem>
          </FormLayout>

          <FormLayout top={24} gap={24}>
            <InputTextLabel
              disabled={formDisabled}
              label={i18nProject('LB_PROJECT_SLACK_LINK')}
              placeholder={i18nProject('PLH_INPUT_SLACK_LINK')}
              name="workChannelLink"
              value={formik.values.workChannelLink}
              onChange={handleSlackLinkChange}
              error={
                formik.touched.workChannelLink &&
                Boolean(formik.errors.workChannelLink)
              }
              errorMessage={
                formik.touched.workChannelLink
                  ? formik.errors.workChannelLink
                  : ''
              }
            />
          </FormLayout>
        </Box>
      </CardForm>
      {useProjectStepAction && (
        <ProjectStepAction
          configSteps={CONFIG_PROJECT_STEPS}
          activeStep={activeStep}
          isViewDetail={isViewDetail}
          disabledBtnNext={isDisabledButtonSubmit}
          onNext={handleNextStep}
        />
      )}
      <ModalConfirm
        title={i18('TXT_UPDATE_INFORMATION')}
        description={`Do you wish to update Project ${generalInfo.code} - General Information?`}
        open={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        onSubmit={() => handleUpdateGeneralInformation({ isSave: false })}
      />
      <ModalConfirmHeadcount
        title={i18('TXT_UPDATE_INFORMATION')}
        description="Do you wish to update Project - General Information and Project Headcount?"
        open={openModalConfirmHeadcount}
        onClose={() => setOpenModalConfirmHeadcount(false)}
        onSubmit={handleUpdateTwoStep}
        startDate={formik.values.startDate}
        endDate={formik.values.endDate}
      />
    </form>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {},
  formWrapper: {
    maxWidth: theme.spacing(75),
  },
}))
