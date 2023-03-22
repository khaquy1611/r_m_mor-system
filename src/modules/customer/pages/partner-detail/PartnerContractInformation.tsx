import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import FormLayout from '@/components/Form/FormLayout'
import ModalAddNewContract from '@/components/modal/ModalAddNewContract'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, TableConstant } from '@/const'
import { CONTRACT_STATUS } from '@/const/app.const'
import {
  commonSelector,
  CommonState,
  getContractGroups,
  getContractTypes,
} from '@/reducer/common'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem, TableHeaderOption } from '@/types'
import { formatDate, formatNumberToCurrency, uuid } from '@/utils'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  createPartnerContract,
  deletePartnerContract,
  updatePartnerContract,
} from '../../reducer/partner'
import { IContract, Optional } from '../../types'
import { initialContract } from '../customer-detail/hooks/useFetchCustomerDetail'
import usePartnerValidate from './usePartnerValidate'

const headCells: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: 'Contract Number',
  },
  {
    id: 'type',
    align: 'left',
    disablePadding: true,
    label: 'Contract Type',
  },
  {
    id: 'group',
    align: 'left',
    disablePadding: true,
    label: 'Contract Group',
  },
  {
    id: 'startDate',
    align: 'left',
    disablePadding: true,
    label: 'Start Date',
  },
  {
    id: 'endDate',
    align: 'left',
    disablePadding: true,
    label: 'End Date',
  },
  {
    id: 'value',
    align: 'left',
    disablePadding: true,
    label: 'Revenue',
  },
  {
    id: 'expectedRevenue',
    align: 'left',
    disablePadding: true,
    label: 'Expected Revenue',
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: true,
    label: 'Status',
  },
  {
    id: 'note',
    align: 'left',
    disablePadding: true,
    label: 'Note',
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: true,
    label: 'Action',
  },
]

interface ListOptionsFilterContracts {
  contractTypes: OptionItem[]
  contractGroups: OptionItem[]
  listStatus: OptionItem[]
}

const createData = (
  item: any,
  { contractTypes, contractGroups }: ListOptionsFilterContracts
) => {
  return {
    id: item.id,
    code: item.code,
    type: contractTypes.find(
      (contract: OptionItem) => contract.value === item.type
    )?.label,
    group: contractGroups.find(
      (group: OptionItem) => group.value === item.group
    )?.label,
    startDate: formatDate(item.startDate),
    endDate: formatDate(item.endDate),
    value: !!item.value ? `${formatNumberToCurrency(+item.value)} VND` : '',
    expectedRevenue: !!item.expectedRevenue
      ? `${formatNumberToCurrency(+item.expectedRevenue)} VND`
      : '',
    note: item.note || '',
    status: CONTRACT_STATUS[item.status],
    action: [{ type: 'delete' }],
  }
}

interface PartnerContractInformationProps {
  partnerFormik: any
  isDetailPage: boolean
}

const PartnerContractInformation = ({
  partnerFormik,
  isDetailPage,
}: PartnerContractInformationProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const params = useParams()

  const { contractTypes, contractGroups, listStatus }: CommonState =
    useSelector(commonSelector)
  const { contractValidation } = usePartnerValidate()
  const { values } = partnerFormik

  const contractFormik = useFormik({
    initialValues: initialContract,
    validationSchema: contractValidation,
    onSubmit: values => {
      handleAddNewContract(values)
    },
  })

  const [showModalAddNewContract, setShowModalAddNewContract] = useState(false)
  const [isViewContract, setIsViewContract] = useState<boolean>(false)
  const [isShowModalDelete, setIsShowModalDelete] = useState(false)
  const [codeDelete, setCodeDelete] = useState('')
  const [indexDelete, setIndexDelete] = useState(0)
  const [page, setPage] = useState(TableConstant.PAGE_CURRENT_DEFAULT)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)
  const [contractError, setContractError] = useState(false)

  const partnerId = useMemo(() => {
    return params.partnerId
  }, [])

  const rows = useMemo(() => {
    return [...values.contracts]
      .slice((page - 1) * pageLimit, page * pageLimit)
      .map((contract: Optional<IContract>) =>
        createData(contract, { contractTypes, contractGroups, listStatus })
      )
  }, [values.contracts, pageLimit, page])

  const resetForm = () => {
    contractFormik.setValues(initialContract)
    contractFormik.setTouched({}, false)
    setShowModalAddNewContract(false)
  }

  const alertUpdateContractSuccess = (code?: string) => {
    dispatch(
      alertSuccess({
        message: i18Customer('MSG_UPDATE_CONTRACT_SUCCESS', {
          code: code ?? '',
        }),
      })
    )
  }

  const alertCreateContractSuccess = () => {
    dispatch(
      alertSuccess({
        message: i18Customer('MSG_ADD_NEW_CONTRACT_SUCCESS'),
      })
    )
  }

  const alertDeleteContractSuccess = () => {
    dispatch(
      alertSuccess({
        message: i18Customer('MSG_DELETE_CONTRACT_SUCCESS', {
          code: values.contracts[indexDelete].code,
        }),
      })
    )
  }

  const checkContractHadExitsLocal = (newContract: any) => {
    const contractHadExist = values.contracts.some(
      (contract: any) => contract.code === newContract.code
    )
    setContractError(contractHadExist)
    return contractHadExist
  }

  const checkContractHadExistApi = (errors: any) => {
    const hadCodeError = errors.some((error: any) =>
      error.field.includes('code')
    )
    if (!hadCodeError) return
    setContractError(true)
  }

  const handleAddNewContract = (contract: any) => {
    const newContract: any =
      isViewContract || isDetailPage
        ? { ...contract }
        : { ...contract, id: uuid() }

    const _newContract = {
      ...newContract,
      startDate: new Date(newContract.startDate)?.getTime() as number,
      endDate: new Date(newContract.endDate)?.getTime() as number,
      value: +contract.value,
      expectedRevenue: +contract.expectedRevenue,
    }

    if (isViewContract) {
      if (isDetailPage) {
        if (!partnerId) return
        dispatch(
          updatePartnerContract({
            id: partnerId,
            contractId: _newContract.id,
            data: _newContract,
          })
        )
          .unwrap()
          .then(() => {
            alertUpdateContractSuccess(_newContract.code)
            resetForm()
          })
          .catch((errors: any) => checkContractHadExistApi(errors))
      } else {
        if (checkContractHadExitsLocal(_newContract)) return
        const contractIndex = values.contracts.findIndex(
          (contract: Optional<IContract>) => contract.id === _newContract.id
        )
        if (contractIndex > -1) {
          const _contracts = [...values.contracts]
          _contracts.splice(contractIndex, 1)
          _contracts.unshift(_newContract)
          partnerFormik.setFieldValue('contracts', _contracts)
        }
        alertUpdateContractSuccess(_newContract.code)
        resetForm()
      }
    } else {
      if (isDetailPage) {
        if (!partnerId) return
        dispatch(
          createPartnerContract({
            id: partnerId,
            data: _newContract,
          })
        )
          .unwrap()
          .then(() => {
            alertCreateContractSuccess()
            resetForm()
          })
          .catch((errors: any) => checkContractHadExistApi(errors))
      } else {
        if (checkContractHadExitsLocal(_newContract)) return
        const newListContracts = [...values.contracts]
        newListContracts.unshift({ ..._newContract })
        partnerFormik.setFieldValue('contracts', newListContracts)
        alertCreateContractSuccess()
        resetForm()
      }
    }
  }

  const handleDeleteContract = () => {
    const newListContracts = [...values.contracts]
    const itemDeleted = newListContracts.splice(indexDelete, 1)
    if (isDetailPage) {
      if (!itemDeleted.length || !partnerId) return
      dispatch(
        deletePartnerContract({
          id: partnerId,
          contractId: itemDeleted[0].id,
        })
      )
        .unwrap()
        .then(() => {
          alertDeleteContractSuccess()
        })
    } else {
      partnerFormik.setFieldValue('contracts', newListContracts)
      alertDeleteContractSuccess()
    }
  }

  const handleClickDetail = (contractId: string) => {
    const contractSelected: any = values.contracts.find(
      (contract: Optional<IContract>) => contract.id === contractId
    )
    if (contractSelected) {
      const _contract = {
        ...contractSelected,
        value: !!contractSelected.value ? contractSelected.value : '',
        expectedRevenue: !!contractSelected.expectedRevenue
          ? contractSelected.expectedRevenue
          : '',
      }
      contractFormik.setValues(_contract)
      setIsViewContract(true)
      setShowModalAddNewContract(true)
    }
  }

  const openModalAddContract = () => {
    setIsViewContract(false)
    setShowModalAddNewContract(true)
  }

  const handleShowModalDelete = (index: number, code: string) => {
    setCodeDelete(code)
    setIndexDelete(index)
    setIsShowModalDelete(true)
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: EventInput) => {
    setPageLimit(parseInt(event.target.value, 10))
    setPage(1)
  }

  useEffect(() => {
    if (!contractTypes.length) {
      dispatch(getContractTypes())
    }
    if (!contractGroups.length) {
      dispatch(getContractGroups())
    }
  }, [])

  return (
    <CardForm title={i18Customer('TXT_CONTRACT_INFORMATION')}>
      <FormLayout top={24}>
        <TableShare
          keyName="id"
          isShowCheckbox={false}
          headCells={headCells}
          rows={rows}
          childComp={(row: any, index: number) => (
            <ItemRowTableV2
              useClickDetail={false}
              rowClassName={classes.row}
              row={row}
              key={`table-checkbox-${row['id']}`}
              headCells={headCells}
              isShowCheckbox={false}
              uuId={row['id']}
              keyName={'id'}
              onClickDelete={() =>
                handleShowModalDelete(index, row?.contractNumber)
              }
              onClickDetail={() => {}}
            />
          )}
        />
        <ModalDeleteRecords
          open={isShowModalDelete}
          titleMessage={i18Customer('TXT_DELETE_CONTRACT')}
          subMessage={StringFormat(
            i18Customer('MSG_CONFIRM_CONTRACT_DELETE'),
            codeDelete
          )}
          onClose={() => setIsShowModalDelete(false)}
          onSubmit={handleDeleteContract}
        />
      </FormLayout>

      <ConditionalRender conditional={!!values.contracts.length} fallback={''}>
        <TablePaginationShare
          rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
          totalElements={values.contracts.length}
          pageLimit={pageLimit}
          currentPage={page}
          onChangePage={handlePageChange}
          onChangeLimitPage={handleRowsPerPageChange}
        />
      </ConditionalRender>
      <ConditionalRender conditional={showModalAddNewContract}>
        <ModalAddNewContract
          open={showModalAddNewContract}
          setOpen={setShowModalAddNewContract}
          contractFormik={contractFormik}
          isViewMode={isViewContract}
          onSubmit={contractFormik.handleSubmit}
          contractError={contractError}
          setContractError={setContractError}
          contracts={values.contracts}
        />
      </ConditionalRender>
    </CardForm>
  )
}

const useStyles = makeStyles(() => ({
  row: {
    '& .first-item': {
      display: 'inline-block',
      width: '200px',
    },
    '& td:nth-child(8) .row-item-text': {
      display: 'inline-block !important',
      width: '200px !important',
    },
  },
}))

export default PartnerContractInformation
