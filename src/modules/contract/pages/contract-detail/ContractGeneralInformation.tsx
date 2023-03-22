import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import ModalConfirm from '@/components/modal/ModalConfirm'
import SelectBranch from '@/components/select/SelectBranch'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectPartner from '@/components/select/SelectPartner'
import SelectStaffContactPerson from '@/components/select/SelectStaffContactPerson'
import { LangConstant } from '@/const'
import { CONTRACT_STATUS, INPUT_TEXTAREA_MAX_LENGTH } from '@/const/app.const'
import { convertStatusInSelectOption } from '@/modules/customer/utils'
import { AuthState, selectAuth } from '@/reducer/auth'
import { commonSelector, CommonState, getBranchList } from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import {
  convertTimestampToDate,
  scrollToFirstErrorMessage,
  scrollToTop,
} from '@/utils'
import { BorderColor, Cancel, Save } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
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
import { useParams } from 'react-router-dom'
import ContractStepAction from '../../components/ContractStepAction'
import SelectContractByContractGroup from '../../components/SelectContractByContractGroup'
import {
  CONTRACT_GROUP,
  CONTRACT_TYPE,
  EXTERNAL,
  INTERNAL,
  NDA,
  ORDER,
  TEMPLATE,
} from '../../const'
import {
  contractSelector,
  IContractState,
  setActiveStep,
} from '../../reducer/contract'
import { updateContractGeneral } from '../../reducer/thunk'
import { CONFIG_CONTRACT_STEPS } from './ContractDetail'
import GeneralInformationContractDetail from './GeneralInformationContractDetail'

const contractStatus = convertStatusInSelectOption(
  Object.values(CONTRACT_STATUS)
)

const MAX_LENGTH = {
  DUE_DATE_PAYMENT: 5,
  PROJECT_ABBREVIATION_NAME: 50,
}

interface ContractGeneralInformationProps {
  isDetailPage: boolean
  form: any
  getDetailContractGeneralInformation: () => void
  isShowModalConfirm: boolean
  setIsShowModalConfirm: Dispatch<SetStateAction<boolean>>
  setShowEditInformation: Dispatch<SetStateAction<boolean>>
  isButtonSubmitDisabled: boolean
  flagUpdate: boolean
  setFlagUpdate: Dispatch<SetStateAction<boolean>>
  tempStep: number
  showEditInformation: boolean
  generalTemp: any
}

const ContractGeneralInformation = ({
  isDetailPage,
  form,
  isShowModalConfirm,
  setIsShowModalConfirm,
  getDetailContractGeneralInformation,
  isButtonSubmitDisabled,
  flagUpdate,
  setFlagUpdate,
  tempStep,
  showEditInformation,
  generalTemp,
  setShowEditInformation,
}: ContractGeneralInformationProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)
  const { activeStep }: IContractState = useSelector(contractSelector)
  const { listBranches }: CommonState = useSelector(commonSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { values, errors, touched } = form

  const [showLeaveSite, setShowLeaveSite] = useState(false)

  const contractNumberError = useMemo(() => {
    return (
      (+values.source === EXTERNAL &&
        !values.contractNumber &&
        !!touched.contractNumber) ||
      (!!errors.contractNumber && !!touched.contractNumber)
    )
  }, [
    values.source,
    values.contractNumber,
    touched.contractNumber,
    errors.contractNumber,
  ])

  const contractTypeError = useMemo(() => {
    return (
      !!values.group &&
      values.group !== NDA &&
      errors.type &&
      touched.type &&
      !values.type
    )
  }, [values.group, touched.type, errors.type, values.type])

  const contractByGroupError = useMemo(() => {
    return (
      values.branchId &&
      values.group !== NDA &&
      errors.selectContractGroup &&
      touched.selectContractGroup
    )
  }, [
    values.branchId,
    values.group,
    touched.selectContractGroup,
    errors.selectContractGroup,
  ])

  const contractByGroupErrorMessage = useMemo(() => {
    return !(!values.group || +values.group === NDA)
      ? (i18('MSG_SELECT_REQUIRE', {
          name:
            +values.group === TEMPLATE
              ? i18Contract('LB_NDA')
              : i18Contract('LB_TEMPLATE'),
        }) as string)
      : ''
  }, [values.group])

  const contractNumberErrorMessage = useMemo(() => {
    return +values.source === EXTERNAL
      ? (i18(
          values.contractNumber
            ? 'MSG_INPUT_NAME_INVALID'
            : 'MSG_INPUT_REQUIRE',
          {
            name: i18('LB_CONTRACT_NUMBER'),
          }
        ) as string)
      : ''
  }, [values.source, values.contractNumber])

  const contactPersonError = useMemo(() => {
    return (
      values.branchId &&
      errors.contactPerson &&
      touched.contactPerson &&
      !values.contactPerson
    )
  }, [
    values.branchId,
    errors.contactPerson,
    touched.contactPerson,
    values.contactPerson,
  ])

  const valueError = useMemo(() => {
    return (
      values.group &&
      values.group !== NDA &&
      errors.value &&
      touched.value &&
      (!values.value || (values.value && values.value.length < 5))
    )
  }, [values.group, values.value, errors.value, touched.value])

  const projectAbbreviationNameError = useMemo(() => {
    return (
      values.group &&
      values.group === ORDER &&
      errors.projectAbbreviationName &&
      touched.projectAbbreviationName &&
      !values.projectAbbreviationName
    )
  }, [
    values.group,
    errors.projectAbbreviationName,
    touched.projectAbbreviationName,
    values.projectAbbreviationName,
  ])

  const handleSingleDropdownChange = useCallback(
    (value: string, _?: OptionItem, keyName?: string) => {
      form.setFieldValue(keyName, value)
      if (keyName === 'group') {
        form.setFieldValue('type', '')
        form.setFieldValue('selectContractGroup', '')
        form.setFieldValue('value', '')
        form.setFieldValue('dueDatePayment', '')
        form.setFieldValue('projectAbbreviationName', '')
      }
      if (keyName === 'branchId') {
        form.setFieldValue('selectContractGroup', '')
        form.setFieldValue('contactPerson', '')
      }
    },
    []
  )

  const handleTextChange = useCallback((e: EventInput, keyName?: string) => {
    let value = e.target.value
    form.setFieldValue(keyName, value)
  }, [])

  const handleCurrencyChange = useCallback((value: any, keyName?: string) => {
    if (
      keyName === 'dueDatePayment' &&
      value.length > MAX_LENGTH.DUE_DATE_PAYMENT
    ) {
      value = value.slice(0, MAX_LENGTH.DUE_DATE_PAYMENT)
    }
    form.setFieldValue(keyName, value)
  }, [])

  const handleDateChange = useCallback((date: Date, keyName: string) => {
    form.setFieldValue(keyName, date?.getTime() || null)
  }, [])

  const handleOptionChange = useCallback((value: any, keyName?: string) => {
    form.setFieldValue(keyName, value)
    if (keyName === 'selectContractGroup') {
      autoFillWithRelatedOrder(value)
      form.setFieldValue(keyName, value)
    }
  }, [])

  const handleSourceChange = () => {
    form.setFieldValue(
      'source',
      +values.source === INTERNAL ? EXTERNAL : INTERNAL
    )
    form.setFieldValue('contractNumber', '')
  }

  const autoFillWithRelatedOrder = (value: any) => {
    if (value) {
      form.setFieldValue('type', value.type?.id || '')
      form.setFieldValue('buyerId', {
        id: value.buyer?.id,
        value: value.buyer?.id,
        label: value.buyer?.name,
      })
      form.setFieldValue('sellerId', {
        id: value.seller?.id,
        value: value.seller?.id,
        label: value.seller?.name,
      })
      form.setFieldValue('contactPerson', {
        id: value.contactPerson?.id,
        value: value.contactPerson?.id,
        label: value.contactPerson?.name,
      })
    } else {
      form.setFieldValue('type', '')
      form.setFieldValue('buyerId', null)
      form.setFieldValue('sellerId', null)
      form.setFieldValue('contactPerson', null)
    }
  }

  const handleNextStep = () => {
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const handleUpdateContractGeneral = (
    useSetActiveStep?: boolean | undefined
  ) => {
    const { contractId } = params
    dispatch(updateLoading(true))
    dispatch(
      updateContractGeneral({
        id: contractId as string,
        data: {
          ...values,
          buyerId: values.buyerId?.id ?? '',
          contactPerson: values.contactPerson?.id ?? '',
          selectContractGroup: values.selectContractGroup?.id || '',
          sellerId: values.sellerId?.id || '',
        },
      })
    )
      .unwrap()
      .then(() => {
        getDetailContractGeneralInformation()
        setFlagUpdate(false)
        !!useSetActiveStep && dispatch(setActiveStep(tempStep))
      })
      .finally(() => {
        scrollToTop()
        dispatch(updateLoading(false))
      })
  }

  const setUseUpdateContract = () => {
    setShowEditInformation(true)
  }

  const handleCancelModeUpdate = () => {
    if (isButtonSubmitDisabled) {
      setShowEditInformation(false)
    } else {
      setShowLeaveSite(true)
    }
  }

  useEffect(() => {
    if (flagUpdate) {
      handleUpdateContractGeneral(true)
    }
  }, [flagUpdate])

  useEffect(() => {
    if (!listBranches.length) {
      dispatch(getBranchList({ useAllBranches: false }))
    }
  }, [])

  return (
    <form onSubmit={form.handleSubmit}>
      <Box className={classes.rootContractGeneralInformation}>
        <ConditionalRender conditional={showEditInformation || !isDetailPage}>
          <CardForm
            title={i18('TXT_GENERAL_INFORMATION')}
            childCompEnd={
              isDetailPage ? (
                <Box style={{ display: 'flex', gap: '5px' }}>
                  <Box
                    className={clsx(
                      classes.buttonIcon,
                      isButtonSubmitDisabled ? 'disable' : 'active'
                    )}
                    onClick={form.handleSubmit}
                  >
                    <Save />
                  </Box>
                  <Box
                    className={clsx(classes.buttonIcon, 'cancel')}
                    onClick={handleCancelModeUpdate}
                  >
                    <Cancel />
                  </Box>
                </Box>
              ) : (
                ''
              )
            }
          >
            <Box className={classes.listFields}>
              {!isDetailPage && (
                <InputCheckbox
                  checked={+values.source === INTERNAL}
                  label={i18Contract('LB_MORS_FORM')}
                  onClick={handleSourceChange}
                />
              )}
              {!isDetailPage && (
                <InputTextLabel
                  require={values.source === EXTERNAL}
                  disabled={values.source !== EXTERNAL || isDetailPage}
                  error={contractNumberError}
                  errorMessage={contractNumberErrorMessage}
                  keyName="contractNumber"
                  label={i18('LB_CONTRACT_NUMBER')}
                  placeholder={i18('PLH_CONTRACT_NUMBER')}
                  value={values.contractNumber}
                  onChange={handleTextChange}
                />
              )}
              <FormLayout gap={24}>
                <SelectBranch
                  require
                  error={!!errors.branchId && !!touched.branchId}
                  errorMessage={errors.branchId}
                  label={i18('LB_BRANCH')}
                  placeholder={i18('PLH_SELECT_BRANCH')}
                  value={values.branchId}
                  onChange={handleSingleDropdownChange}
                />
                <InputDropdown
                  required
                  error={!values.group && !!errors.group && !!touched.group}
                  errorMessage={errors.group}
                  keyName="group"
                  label={i18('LB_CONTRACT_GROUP')}
                  placeholder={i18('PLH_SELECT_CONTRACT_GROUP')}
                  listOptions={CONTRACT_GROUP}
                  value={values.group}
                  onChange={handleSingleDropdownChange}
                />
              </FormLayout>
              <FormLayout gap={24}>
                <SelectContractByContractGroup
                  disabled={
                    +values.group === NDA || !values.branchId || !values.group
                  }
                  label={i18Contract(
                    +values.group === ORDER ? 'LB_TEMPLATE' : 'LB_NDA'
                  )}
                  placeholder={i18Contract(
                    +values.group === ORDER
                      ? 'PLH_SELECT_TEMPLATE'
                      : 'PLH_SELECT_NDA'
                  )}
                  useRequestAPI={!!values.group && +values.group !== NDA}
                  required={
                    values.branchId &&
                    values.group &&
                    values.group.toString() !== NDA.toString()
                  }
                  error={contractByGroupError}
                  errorMessage={contractByGroupErrorMessage}
                  contractGroup={+values.group === TEMPLATE ? NDA : TEMPLATE}
                  value={values.selectContractGroup}
                  onChange={handleOptionChange}
                />
                <InputDropdown
                  error={contractTypeError}
                  isDisable={values.group === NDA}
                  required={values.group !== NDA}
                  errorMessage={
                    values.group !== NDA
                      ? (i18('MSG_SELECT_REQUIRE', {
                          name: i18('LB_CONTRACT_TYPE'),
                        }) as string)
                      : ''
                  }
                  keyName="type"
                  label={i18('LB_CONTRACT_TYPE')}
                  placeholder={i18('PLH_SELECT_CONTRACT_TYPE')}
                  listOptions={CONTRACT_TYPE}
                  value={values.type}
                  onChange={handleSingleDropdownChange}
                />
              </FormLayout>
              <SelectStaffContactPerson
                require
                disabled={!values.branchId}
                keyName="contactPerson"
                error={contactPersonError}
                errorMessage={errors.contactPerson}
                value={values.contactPerson}
                onChange={handleOptionChange}
              />
              <FormLayout gap={24}>
                <InputDatepicker
                  width={'100%'}
                  keyName="startDate"
                  label={i18Contract('LB_CONTRACT_START_DATE')}
                  placeholder={i18('PLH_INPUT_DATE') as string}
                  maxDate={values.endDate}
                  value={convertTimestampToDate(values.startDate)}
                  onChange={handleDateChange}
                />
                <InputDatepicker
                  width={'100%'}
                  keyName="endDate"
                  label={i18Contract('LB_CONTRACT_END_DATE')}
                  placeholder={i18('PLH_INPUT_DATE') as string}
                  minDate={values.startDate}
                  value={convertTimestampToDate(values.endDate)}
                  onChange={handleDateChange}
                />
                <InputDatepicker
                  require
                  error={!!errors.signDate && !!touched.signDate}
                  errorMessage={errors.signDate}
                  width={'100%'}
                  keyName="signDate"
                  label={i18Contract('LB_CONTRACT_SIGN_DATE')}
                  placeholder={i18('PLH_INPUT_DATE') as string}
                  value={convertTimestampToDate(values.signDate)}
                  onChange={handleDateChange}
                />
              </FormLayout>
              <FormLayout gap={24}>
                <SelectCustomer
                  require
                  keyName="buyerId"
                  label={i18Contract('LB_BUYER')}
                  placeholder={i18Contract('PLH_SELECT_BUYER') as string}
                  error={!!errors.buyerId && !!touched.buyerId}
                  errorMessage={errors.buyerId}
                  value={values.buyerId}
                  onChange={handleOptionChange}
                />
                <SelectPartner
                  require
                  keyName="sellerId"
                  label={i18Contract('LB_SELLER')}
                  placeholder={i18Contract('PLH_SELECT_SELLER') as string}
                  error={!!errors.sellerId && !!touched.sellerId}
                  errorMessage={errors.sellerId}
                  multiple={false}
                  value={values.sellerId}
                  onChange={handleOptionChange}
                />
              </FormLayout>
              <FormLayout gap={24}>
                <FormItem
                  label={i18('LB_EXPECTED_VALUE')}
                  require={values.group === ORDER}
                  error={valueError}
                  errorMessage={values.group === ORDER ? errors.value : ''}
                >
                  <InputCurrency
                    disabled={values.group !== ORDER}
                    ignoreChars={['.']}
                    error={
                      +values.group === ORDER &&
                      !!errors.value &&
                      !!touched.value
                    }
                    suffix=""
                    keyName="value"
                    placeholder={i18('PLH_INPUT_CURRENCY')}
                    value={values.value}
                    onChange={handleCurrencyChange}
                  />
                </FormItem>
                <FormItem label={i18Contract('LB_DUE_DATE_PAYMENT')}>
                  <InputCurrency
                    suffix=""
                    disabled={values.group !== ORDER}
                    ignoreChars={['.']}
                    placeholder={i18Contract('PLH_DUE_DATE_PAYMENT')}
                    keyName="dueDatePayment"
                    value={values.dueDatePayment}
                    onChange={handleCurrencyChange}
                  />
                </FormItem>
              </FormLayout>
              <FormLayout gap={24}>
                <InputTextLabel
                  require={+values.group === ORDER}
                  disabled={+values.group !== ORDER}
                  maxLength={MAX_LENGTH.PROJECT_ABBREVIATION_NAME}
                  error={projectAbbreviationNameError}
                  errorMessage={errors.projectAbbreviationName}
                  label={i18Contract('LB_PROJECT_ABBREVIATION_NAME')}
                  placeholder={i18('PLH_ABBREVIATION')}
                  keyName="projectAbbreviationName"
                  value={values.projectAbbreviationName}
                  onChange={handleTextChange}
                />
              </FormLayout>
              <FormLayout gap={24}>
                <InputDropdown
                  required
                  keyName="status"
                  label={i18('LB_STATUS')}
                  error={!!errors.status && !!touched.status}
                  errorMessage={errors.status}
                  value={values.status as string}
                  placeholder={i18Contract('PLH_SELECT_CONTRACT_STATUS')}
                  listOptions={contractStatus}
                  onChange={handleSingleDropdownChange}
                />
              </FormLayout>
              <InputTextArea
                maxLength={INPUT_TEXTAREA_MAX_LENGTH}
                label={i18('LB_DESCRIPTION') as string}
                placeholder={i18('PLH_DESCRIPTION')}
                defaultValue={values.description}
                onChange={handleTextChange}
              />
            </Box>
          </CardForm>
        </ConditionalRender>
        <ConditionalRender conditional={!showEditInformation && isDetailPage}>
          <CardForm
            title={i18('TXT_GENERAL_INFORMATION') as string}
            childCompEnd={
              permissions.useContractUpdate ? (
                <Box
                  className={classes.buttonIcon}
                  onClick={setUseUpdateContract}
                >
                  <BorderColor />
                </Box>
              ) : (
                <Box />
              )
            }
          >
            <GeneralInformationContractDetail
              contractGeneralInformation={generalTemp}
            />
          </CardForm>
        </ConditionalRender>
        {!isDetailPage && (
          <ContractStepAction
            configSteps={CONFIG_CONTRACT_STEPS}
            activeStep={activeStep}
            isDetailPage={isDetailPage}
            disabledBtnNext={isButtonSubmitDisabled}
            onNext={handleNextStep}
          />
        )}
      </Box>
      {showLeaveSite && (
        <ModalConfirm
          open
          title={i18('TXT_LEAVE_SITE')}
          description={i18('MSG_DESCRIPTION_CONFIRM_LEAVE')}
          titleSubmit={i18('LB_LEAVE') as string}
          onClose={() => {
            setShowLeaveSite(false)
          }}
          onSubmit={() => {
            setShowLeaveSite(false)
            setShowEditInformation(false)
            form.resetForm({
              values: generalTemp,
            })
          }}
        />
      )}
      {isShowModalConfirm && (
        <ModalConfirm
          title={i18('TXT_UPDATE_INFORMATION')}
          description={i18Contract('MSG_UPDATE_DESCRIPTION', {
            contractId: values.contractNumber,
          })}
          open={isShowModalConfirm}
          onClose={() => setIsShowModalConfirm(false)}
          onSubmit={handleUpdateContractGeneral}
        />
      )}
    </form>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractGeneralInformation: {},
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    maxWidth: '600px',
  },
  buttonIcon: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    transitionDuration: '100ms',
    '&:hover': {
      backgroundColor: `${theme.color.blue.primary}20`,
    },

    '& svg': {
      fontSize: 25,
      color: theme.color.black.secondary,
    },
    '& svg:hover': {
      color: theme.color.blue.primary,
    },
    '&.disable': {
      pointerEvents: 'none',
    },
    '&.active': {
      backgroundColor: `${theme.color.blue.primary}20`,
      '& svg': {
        color: theme.color.blue.primary,
      },
    },
    '&.cancel': {
      '& svg:hover': {
        color: theme.color.error.primary,
      },
    },
  },
}))

export default ContractGeneralInformation
