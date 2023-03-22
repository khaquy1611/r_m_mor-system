import { LangConstant } from '@/const'
import { CONTRACT_STATUS, PROJECT_TYPE_ID } from '@/const/app.const'
import {
  CONTRACT_REQUEST_KEY,
  MAX_CONTRACT_NOTE,
} from '@/modules/customer/const'
import { initialContract } from '@/modules/customer/pages/customer-detail/hooks/useFetchCustomerDetail'
import { IContract, Optional } from '@/modules/customer/types'
import { convertStatusInSelectOption } from '@/modules/customer/utils'
import {
  commonSelector,
  CommonState,
  getContractGroups,
  getContractTypes,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
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
import { useLocation } from 'react-router-dom'
import Modal from '../common/Modal'
import InputDatePicker from '../Datepicker/InputDatepicker'
import FormItem from '../Form/FormItem/FormItem'
import FormLayout from '../Form/FormLayout'
import InputCurrency from '../inputs/InputCurrency'
import InputDropdown from '../inputs/InputDropdown'
import InputTextArea from '../inputs/InputTextArea'
import InputTextLabel from '../inputs/InputTextLabel'

interface ModalAddNewContractProps {
  open: boolean
  setOpen: Function
  onSubmit: () => void
  contractFormik: any
  isViewMode: boolean
  contractError: boolean
  setContractError: Dispatch<SetStateAction<boolean>>
  contracts: Optional<IContract>[]
}

const contractStatus = convertStatusInSelectOption(
  Object.values(CONTRACT_STATUS)
)

const ModalAddNewContract = ({
  open,
  setOpen,
  onSubmit,
  contractFormik,
  isViewMode,
  contractError,
  setContractError,
  contracts,
}: ModalAddNewContractProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const location = useLocation()

  const { contractTypes, contractGroups }: CommonState =
    useSelector(commonSelector)

  const { values, errors, touched } = contractFormik

  const [contractTemp, setContractTemp] = useState<Optional<IContract>>({})

  const isShowInput = useMemo(() => {
    return false && +values.type === PROJECT_TYPE_ID.OTHER
  }, [values.type])

  const isDisabledBtnSubmit = useMemo(() => {
    if (isViewMode) {
      return JSON.stringify(values) === JSON.stringify(contractTemp)
    }
    return false
  }, [values, contractTemp])

  const contractCodeErrorMessage = useMemo(() => {
    const isCustomerDisplay = location.pathname.includes('list-customer')
    return contractError
      ? i18Customer(
          isCustomerDisplay
            ? 'MSG_CONTRACT_HAD_EXIST_CUSTOMER'
            : 'MSG_CONTRACT_HAD_EXIST_PARTNER',
          { count: '' as any }
        )
      : errors.code
  }, [errors, contractError, location])

  const handleContractNumberChange = useCallback((e: EventInput) => {
    const { value } = e.target
    contractFormik.setFieldValue(CONTRACT_REQUEST_KEY.CODE, value)
  }, [])

  const handleContractTypeChange = useCallback((value: string) => {
    contractFormik.setFieldValue(CONTRACT_REQUEST_KEY.TYPE, value)
  }, [])

  const handleContractGroupChange = useCallback((value: string) => {
    contractFormik.setFieldValue(CONTRACT_REQUEST_KEY.GROUP, value)
  }, [])

  const handleValueChange = useCallback(
    (value: string | number | undefined) => {
      contractFormik.setFieldValue(CONTRACT_REQUEST_KEY.VALUE, value)
    },
    []
  )

  const handleExpectedRevenueChange = useCallback(
    (value: string | number | undefined) => {
      contractFormik.setFieldValue(CONTRACT_REQUEST_KEY.EXPECTED_REVENUE, value)
    },
    []
  )

  const handleStatusChange = useCallback((value: string) => {
    contractFormik.setFieldValue(CONTRACT_REQUEST_KEY.STATUS, value)
  }, [])

  const handleStartDateChange = useCallback((value: Date) => {
    contractFormik.setFieldValue(CONTRACT_REQUEST_KEY.START_DATE, value)
  }, [])

  const handleEndDateChange = useCallback((value: Date) => {
    contractFormik.setFieldValue(CONTRACT_REQUEST_KEY.END_DATE, value)
  }, [])

  const handleNoteChange = useCallback((e: EventInput) => {
    const { value } = e.target
    contractFormik.setFieldValue(CONTRACT_REQUEST_KEY.NOTE, value)
  }, [])

  const handleClose = () => {
    contractFormik.setTouched({}, false)
    contractFormik.setValues(initialContract)
    setOpen(false)
  }

  const checkContractHadExits = (newContract: any) => {
    const contractHadExist = contracts.some((contract: any) => {
      return newContract.id
        ? contract.code === newContract.code && contract.id !== newContract.id
        : contract.code === newContract.code
    })
    setContractError(contractHadExist)
    return contractHadExist
  }

  useEffect(() => {
    setContractTemp(values)
    return () => setContractError(false)
  }, [])

  useEffect(() => {
    if (!touched.code) return
    checkContractHadExits(values)
  }, [touched.code, values.code])

  useEffect(() => {
    if (!contractTypes.length) {
      dispatch(getContractTypes())
    }
    if (!contractGroups.length) {
      dispatch(getContractGroups())
    }
  }, [])

  return (
    <Modal
      open={open}
      title={i18Customer(
        isViewMode ? 'LB_UPDATE_CONTRACT' : 'LB_ADD_NEW_CONTRACT'
      )}
      labelSubmit={i18(isViewMode ? 'LB_UPDATE' : 'LB_SUBMIT')}
      onClose={handleClose}
      onSubmit={onSubmit}
      submitDisabled={isDisabledBtnSubmit}
    >
      <Box className={clsx(classes.listFields, 'scrollbar')}>
        <InputTextLabel
          require
          error={contractError || (!!errors.code && !!touched.code)}
          errorMessage={contractCodeErrorMessage}
          value={values.code}
          label={i18('LB_CONTRACT_NUMBER')}
          placeholder={i18('PLH_CONTRACT_NUMBER')}
          onChange={handleContractNumberChange}
        />

        <Box className={classes.flex}>
          <InputDropdown
            required
            isShowInput={isShowInput}
            listOptions={contractTypes}
            error={!!errors.type && !!touched.type}
            errorMessage={errors.type}
            label={i18('LB_CONTRACT_TYPE')}
            placeholder={i18('PLH_SELECT_CONTRACT_TYPE')}
            value={values.type as string}
            onChange={handleContractTypeChange}
          />
          <InputDropdown
            required
            label={i18('LB_CONTRACT_GROUP') as string}
            placeholder={i18('PLH_SELECT_CONTRACT_GROUP')}
            error={!!errors.group && !!touched.group}
            errorMessage={errors.group}
            listOptions={contractGroups}
            value={values.group as string}
            onChange={handleContractGroupChange}
          />
        </Box>
        <FormItem
          label={i18Customer('LB_VALUE')}
          error={!!errors.value && !!touched.value}
          errorMessage={errors.value}
        >
          <InputCurrency
            error={!!errors.value && !!touched.value}
            placeholder={i18('PLH_INPUT_CURRENCY')}
            value={values.value}
            onChange={handleValueChange}
          />
        </FormItem>
        <FormItem
          label={i18Customer('LB_EXPECTED_REVENUE')}
          error={!!errors.expectedRevenue && !!touched.expectedRevenue}
          errorMessage={errors.expectedRevenue}
        >
          <InputCurrency
            error={!!errors.expectedRevenue && !!touched.expectedRevenue}
            placeholder={i18('PLH_INPUT_CURRENCY')}
            value={values.expectedRevenue}
            onChange={handleExpectedRevenueChange}
          />
        </FormItem>

        <FormItem
          require
          label={i18('LB_CONTRACT_STATUS')}
          error={!!errors.status && !!touched.status}
          errorMessage={errors.status}
        >
          <InputDropdown
            error={!!errors.status && !!touched.status}
            width={259}
            value={values.status as string}
            placeholder={i18('PLH_SELECT_CONTRACT_STATUS')}
            listOptions={contractStatus}
            onChange={handleStatusChange}
          />
        </FormItem>

        <FormLayout gap={24} width={350}>
          <FormItem label={i18Customer('LB_START_DATE')} require>
            <InputDatePicker
              error={!!errors.startDate && !!touched.startDate}
              errorMessage={errors.startDate}
              value={values.startDate}
              onChange={handleStartDateChange}
              maxDate={values.endDate}
            />
          </FormItem>
          <FormItem label={i18Customer('LB_END_DATE')} require>
            <InputDatePicker
              error={!!errors.endDate && !!touched.endDate}
              errorMessage={errors.endDate}
              value={values.endDate}
              onChange={handleEndDateChange}
              minDate={values.startDate}
            />
          </FormItem>
        </FormLayout>
        <FormItem label={i18Customer('LB_NOTE')}>
          <InputTextArea
            maxLength={MAX_CONTRACT_NOTE}
            placeholder={i18Customer('PLH_NOTE')}
            defaultValue={values.note}
            onChange={handleNoteChange}
          />
        </FormItem>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    overflow: 'auto',
    maxHeight: '600px',
    overflowX: 'hidden',
    paddingRight: theme.spacing(1),
  },
  flex: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  formItem: {
    width: 'unset !important',
  },
}))

export default ModalAddNewContract
