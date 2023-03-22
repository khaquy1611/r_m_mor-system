import { LangConstant } from '@/const'
import { CONTRACT_STATUS, PROJECT_STATUS } from '@/const/app.const'
import { CUSTOMER_LIST } from '@/const/path.const'
import {
  CONTRACT_REQUEST_KEY,
  CUSTOMER_REQUEST_KEY,
} from '@/modules/customer/const'
import {
  createCustomer,
  CustomerState,
  getCustomerDetail,
  selectCustomer,
  updateCustomer,
} from '@/modules/customer/reducer/customer'
import {
  IContract,
  ICustomer,
  ICustomerValid,
  IProject,
  Optional,
} from '@/modules/customer/types'
import { getListCodeContractError } from '@/modules/customer/utils'
import { alertError, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { formatDate, scrollToTop } from '@/utils'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useCustomerValidate from './useCustomerValidate'

export const initialCustomer: ICustomer = {
  signNda: false,
  name: '',
  branchId: '',
  priority: '',
  serviceIds: [],
  collaborationStartDate: null,
  status: '',
  scale: '',
  website: '',
  contactName: '',
  contactPhoneNumber: '',
  emailAddress: '',
  contactNote: '',
  contactPersonId: {},
  marketId: '',
  provinceIds: [],
  workingTitle: '',
  languageIds: '[]',
  abbreviation: '',
  divisionIds: [],
}

export const initialContract: Optional<IContract> = {
  [CONTRACT_REQUEST_KEY.CODE]: '',
  [CONTRACT_REQUEST_KEY.TYPE]: '',
  [CONTRACT_REQUEST_KEY.GROUP]: '',
  [CONTRACT_REQUEST_KEY.START_DATE]: null,
  [CONTRACT_REQUEST_KEY.END_DATE]: null,
  [CONTRACT_REQUEST_KEY.STATUS]: '',
  [CONTRACT_REQUEST_KEY.VALUE]: '',
  [CONTRACT_REQUEST_KEY.EXPECTED_REVENUE]: '',
  [CONTRACT_REQUEST_KEY.NOTE]: '',
}

export const initialCustomerValid: Optional<ICustomerValid> = {
  [CUSTOMER_REQUEST_KEY.WEBSITE]: { error: false, errorMessage: '' },
}

function useFetchCustomerDetail() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const params = useParams()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)

  const { listContract }: CustomerState = useSelector(selectCustomer)

  const [contract, setContract] = useState<Optional<IContract>>(initialContract)
  const [contracts, setContracts] = useState<Optional<IContract>[]>([])
  const [contractsTemp, setContractsTemp] = useState<Optional<IContract>[]>([])
  const [projects, setProjects] = useState<IProject[]>([])
  const [customerTemp, setCustomerTemp] =
    useState<Optional<ICustomer>>(initialCustomer)
  const [customer, setCustomer] = useState<Optional<ICustomer>>(initialCustomer)
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [contractError, setContractError] = useState(false)

  const { customerValidate } = useCustomerValidate()
  const customerFormik = useFormik({
    initialValues: initialCustomer,
    validationSchema: customerValidate,
    onSubmit: () => {
      handleSaveCustomer()
      setShowDialog(false)
    },
  })

  const convertDateToString = (date: Date | string | null) => {
    if (!date) return date
    return formatDate(new Date(date))
  }

  const isViewDetail: boolean = useMemo(() => {
    return !!params.customerId
  }, [params.customerId])

  const convertContractData = (_contracts: any) => {
    if (!_contracts) return []
    return _contracts.map((item: any) => ({
      ...item,
      startDate: new Date(item.startDate),
      endDate: new Date(item.endDate),
      status: CONTRACT_STATUS[item.status.id],
      type: item.type?.id || '',
      group: item.group.id,
    }))
  }

  const convertCustomerGeneral = (_customer: any) => ({
    ..._customer,
    abbreviation: _customer.abbreviation || '',
    branchId: _customer.branch.id,
    status: _customer.status.id,
    collaborationStartDate: new Date(_customer.collaborationStartDate),
    priority: _customer.priority.id,
    serviceIds: _customer.services.map((item: any) => ({
      ...item,
      value: item.skillSetId,
      label: item.name,
    })),
    provinceIds: _customer.provinces.map((item: any) => ({
      id: item.id,
      value: item.id,
      label: item.name,
    })),
    divisionIds:
      _customer.divisions?.map((item: any) => ({
        id: item.divisionId,
        value: item.divisionId,
        label: item.name,
      })) || [],
    marketId: _customer.market.id,
    contactPersonId: {
      id: _customer.contactPersons?.id?.toString(),
      value: _customer.contactPersons?.id?.toString(),
      label: _customer.contactPersons?.name,
    },
    languageIds: _customer.languageIds || '[]',
    emailAddress: _customer.emailAddress || '',
  })

  const convertDataProject: any = (projects: IProject[]) => {
    return (
      projects?.map((item: IProject) => ({
        ...item,
        ...(item.startDate
          ? { startDate: convertDateToString(item.startDate) }
          : {}),
        ...(item.endDate ? { endDate: convertDateToString(item.endDate) } : {}),
        status: PROJECT_STATUS[item.status.id],
        technologies:
          item.technologies &&
          item.technologies
            .map((technology: any) => technology.name)
            .join(', '),
      })) ?? []
    )
  }

  const getCustomerDetailFromApi = (id: string) => {
    dispatch(updateLoading(true))
    dispatch(getCustomerDetail(id))
      .unwrap()
      .then(({ data }: any) => {
        const { contact, general, projects } = data
        const _customer = { ...general, ...contact }

        const customer = convertCustomerGeneral(_customer)
        setCustomer(customer)
        setCustomerTemp(customer)
        setProjects(convertDataProject(projects))
      })
      .catch(error => {
        if (error[0]?.field === 'id') {
          navigate(CUSTOMER_LIST)
        }
        dispatch(
          alertError({
            message: 'Customer not found',
          })
        )
        throw error
      })
      .finally(() => dispatch(updateLoading(false)))
  }

  const createNewCustomer = () => {
    const payload: any = {}
    payload.customer = {
      ...customerFormik.values,
      collaborationStartDate:
        customerFormik.values.collaborationStartDate?.getTime(),
      serviceIds: customerFormik.values.serviceIds?.map((c: any) => c.value),
      website: customerFormik.values.website?.trim(),
      provinceIds: customerFormik.values.provinceIds?.map(
        (item: OptionItem) => item.value
      ),
      divisionIds: customerFormik.values.divisionIds?.map((c: any) => c.value),
      contactPersonId: customerFormik.values.contactPersonId.id,
    }
    payload.contract = contracts.map((contract: any) => ({
      ...contract,
      startDate: new Date(contract.startDate).getTime(),
      endDate: new Date(contract.endDate).getTime(),
      id: null,
      status: contract.status.type,
      expectedRevenue: +contract.expectedRevenue,
    }))
    dispatch(updateLoading(true))
    dispatch(createCustomer(payload))
      .unwrap()
      .then(({ hasError }) => {
        if (!hasError) {
          navigate(CUSTOMER_LIST)
        }
      })
      .catch((errors: any) => {
        const codes = getListCodeContractError(errors, contracts)
        if (!codes.length) return
        dispatch(
          alertError({
            message: i18Customer('MSG_MANY_CONTRACT_HAD_EXIST', {
              count: !!codes.length ? (`( ${codes.join(', ')} )` as any) : '',
            }),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const updateCustomerInfo = () => {
    const payload: any = {
      ...customerFormik.values,
      collaborationStartDate:
        customerFormik.values.collaborationStartDate?.getTime(),
      serviceIds: customerFormik.values.serviceIds?.map((c: any) => c.value),
      website: customerFormik.values.website?.trim(),
      provinceIds: customerFormik.values.provinceIds?.map(
        (item: OptionItem) => item.value
      ),
      divisionIds:
        customerFormik.values.divisionIds?.map((div: OptionItem) => div.id) ||
        [],
      contactPersonId: customerFormik.values.contactPersonId.id,
    }

    delete payload.services
    delete payload.branch
    delete payload.divisions
    delete payload.contactPersons
    delete payload.provinces

    dispatch(updateLoading(true))
    dispatch(updateCustomer({ customerId: payload.id, data: payload }))
      .unwrap()
      .then(({ hasError }) => {
        if (!hasError) {
          getCustomerDetailFromApi(payload.id)
        }
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleSaveCustomer = () => {
    if (isViewDetail) {
      setIsShowModalConfirm(true)
    } else {
      createNewCustomer()
    }
  }

  useEffect(() => {
    setContracts(convertContractData(listContract))
    setContractsTemp(convertContractData(listContract))
  }, [listContract])

  useEffect(() => {
    if (customerTemp.id) {
      scrollToTop()
    }
  }, [customerTemp])

  return {
    contract,
    setContract,
    contracts,
    setContracts,
    projects,
    getCustomerDetailFromApi,
    createNewCustomer,
    customerFormik,
    isViewDetail,
    customerTemp,
    customer,
    contractsTemp,
    isShowModalConfirm,
    showDialog,
    setIsShowModalConfirm,
    setShowDialog,
    updateCustomerInfo,
    contractError,
    setContractError,
  }
}

export default useFetchCustomerDetail
