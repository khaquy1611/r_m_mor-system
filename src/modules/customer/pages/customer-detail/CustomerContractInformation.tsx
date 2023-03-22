import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import ModalAddNewContract from '@/components/modal/ModalAddNewContract'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ItemRowTable from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, TableConstant } from '@/const'
import { CONTRACT_STATUS } from '@/const/app.const'
import { IContract, Optional } from '@/modules/customer/types'
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
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  createCustomerContract,
  deleteCustomerContract,
  updateCustomerContract,
} from '../../reducer/customer'
import usePartnerValidate from '../partner-detail/usePartnerValidate'
import { initialContract } from './hooks/useFetchCustomerDetail'

const contactHeadCells: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: 'Contract number',
  },
  {
    id: 'contractType',
    align: 'left',
    disablePadding: true,
    label: 'Contract type',
  },
  {
    id: 'contractGroup',
    align: 'left',
    disablePadding: true,
    label: 'Contract group',
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
    label: 'Expected revenue',
  },
  {
    id: 'note',
    align: 'left',
    disablePadding: true,
    label: 'Note',
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: true,
    label: 'Status',
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

export function createData(
  item: any,
  { contractTypes, contractGroups, listStatus }: ListOptionsFilterContracts
) {
  return {
    id: item.id,
    code: item.code,
    contractType: contractTypes.find(
      (contract: OptionItem) => contract.value === item.type
    )?.label,
    contractGroup: contractGroups.find(
      (group: OptionItem) => group.value === item.group
    )?.label,
    startDate: formatDate(new Date(item.startDate)),
    endDate: formatDate(new Date(item.endDate)),
    value: !!item.value ? `${formatNumberToCurrency(+item.value)} VND` : '',
    expectedRevenue: item.expectedRevenue
      ? `${formatNumberToCurrency(+item.expectedRevenue)} VND`
      : '',
    note: item.note || '',
    status: item.status,
    action: [{ type: 'delete' }],
  }
}

interface IProps {
  contracts: Optional<IContract>[]
  setContracts: Dispatch<SetStateAction<Optional<IContract>[]>>
  isViewDetail: boolean
  contractError: boolean
  setContractError: Dispatch<SetStateAction<boolean>>
}

function ContactTable({
  contracts,
  setContracts,
  isViewDetail,
  contractError,
  setContractError,
}: IProps) {
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const classes = useStyles()
  const { contractValidation } = usePartnerValidate()
  const params = useParams()

  const contractFormik = useFormik({
    initialValues: initialContract,
    validationSchema: contractValidation,
    onSubmit: values => {
      handleAddNewContract(values)
    },
  })

  const [isViewContract, setIsViewContract] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [page, setPage] = useState(TableConstant.PAGE_CURRENT_DEFAULT)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)
  const [isShowModalDelete, setIsShowModalDelete] = useState(false)
  const [idDelete, setIdDelete] = useState('')
  const [codeDelete, setCodeDelete] = useState('')

  const { contractTypes, contractGroups, listStatus }: CommonState =
    useSelector(commonSelector)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!contractGroups.length) {
      dispatch(getContractGroups())
    }
    if (!contractTypes.length) {
      dispatch(getContractTypes())
    }
  }, [])

  const customerId = useMemo(() => {
    return params.customerId ?? ''
  }, [])

  const contractsPaginate = useMemo(() => {
    if (!contracts || !contracts.length) return []
    const _contracts = JSON.parse(JSON.stringify(contracts))
    const result = _contracts
      .slice((page - 1) * pageLimit, page * pageLimit)
      .map((contract: IContract) =>
        createData(contract, { contractGroups, contractTypes, listStatus })
      )
    return result
  }, [contracts, pageLimit, page])

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: EventInput) => {
    setPageLimit(parseInt(event.target.value, 10))
    setPage(1)
  }

  const convertContractPayload = (contract: any) => {
    return {
      ...contract,
      startDate: contract.startDate.getTime(),
      endDate: contract.endDate.getTime(),
      status: contract?.status?.type,
      value: +contract.value,
      expectedRevenue: +contract.expectedRevenue,
    }
  }

  const alertUpdateContractSuccess = (code: string) => {
    dispatch(
      alertSuccess({
        message: i18Customer('MSG_UPDATE_CONTRACT_SUCCESS', {
          code: code,
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

  const resetForm = () => {
    contractFormik.setValues(initialContract)
    contractFormik.setTouched({}, false)
    setOpenModal(false)
  }

  const checkContractHadExitsLocal = (newContract: any) => {
    const contractHadExist = contracts.some(
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

  const handleAddNewContract = (contract: Optional<IContract>) => {
    const newContract: any =
      isViewContract || isViewDetail
        ? { ...contract }
        : { ...contract, id: uuid() }

    const _newContract = {
      ...newContract,
      status: CONTRACT_STATUS[newContract.status as number],
    }

    if (isViewContract) {
      if (isViewDetail) {
        if (!customerId) return
        dispatch(
          updateCustomerContract({
            id: customerId,
            contractId: _newContract.id,
            data: convertContractPayload(_newContract),
          })
        )
          .unwrap()
          .then(() => {
            alertUpdateContractSuccess(newContract?.code ?? '')
            resetForm()
          })
          .catch((errors: any) => checkContractHadExistApi(errors))
      } else {
        if (checkContractHadExitsLocal(_newContract)) return
        const contractIndex = contracts.findIndex(
          (contract: Optional<IContract>) => contract.id === _newContract.id
        )
        if (contractIndex > -1) {
          const _contracts = [...contracts]
          _contracts.splice(contractIndex, 1)
          _contracts.unshift(_newContract)
          setContracts([..._contracts])
        }
        alertUpdateContractSuccess(newContract?.code ?? '')
        resetForm()
      }
    } else {
      if (isViewDetail) {
        if (!customerId) return
        dispatch(
          createCustomerContract({
            id: customerId,
            data: convertContractPayload(_newContract),
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
        setContracts(prev => [_newContract, ...prev])
        alertCreateContractSuccess()
        resetForm()
      }
    }
  }

  const handleClickDetail = (contractId: string) => {
    const contractSelected: any = contracts.find(
      (contract: Optional<IContract>) => contract.id === contractId
    )

    if (contractSelected) {
      const _contract = {
        ...contractSelected,
        status: contractSelected.status?.type,
        value: !!contractSelected.value ? contractSelected.value : '',
        expectedRevenue: !!contractSelected.expectedRevenue
          ? contractSelected.expectedRevenue
          : '',
      }
      contractFormik.setValues(_contract)
      setIsViewContract(true)
      setOpenModal(true)
    }
  }

  const openModalAddContract = () => {
    setIsViewContract(false)
    setOpenModal(true)
  }

  const handleDeleteContract = () => {
    const indexContractSelected = contracts.findIndex(
      (contract: Optional<IContract>) => contract.id === idDelete
    )

    if (isViewDetail) {
      if (indexContractSelected < 0) return
      if (!contracts?.[indexContractSelected]?.id) return
      dispatch(
        deleteCustomerContract({
          id: customerId,
          contractId: contracts[indexContractSelected].id ?? '',
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            alertSuccess({
              message: i18Customer('MSG_DELETE_CONTRACT_SUCCESS', {
                code: contracts[indexContractSelected].code,
              }),
            })
          )
        })
    } else {
      if (indexContractSelected > -1) {
        const _contracts = [...contracts]
        _contracts.splice(indexContractSelected, 1)
        setContracts(_contracts)
      }
      dispatch(
        alertSuccess({
          message: i18Customer('MSG_DELETE_CONTRACT_SUCCESS', {
            code: contracts[indexContractSelected].code,
          }),
        })
      )
    }
  }

  const handleShowModalDelete = (contractId: string, code: string) => {
    setIdDelete(contractId)
    setCodeDelete(code)
    setIsShowModalDelete(true)
  }

  return (
    <CardForm title={i18Customer('TXT_CONTRACT_INFORMATION')}>
      <TableShare
        keyName={'id'}
        headCells={contactHeadCells}
        rows={contractsPaginate}
        limitPage={pageLimit}
        pageCurrent={page}
        childComp={(row: any, index: number) => (
          <ItemRowTable
            useClickDetail={false}
            rowClassName={classes.row}
            headCells={contactHeadCells}
            row={row}
            key={`${row['id']}-${index}`}
            uuId={row['id']}
            onClickDelete={(contractId: string) =>
              handleShowModalDelete(contractId, row?.contactNumber)
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

      <ConditionalRender conditional={!!contracts.length}>
        <TablePaginationShare
          rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
          totalElements={contracts.length}
          pageLimit={pageLimit}
          currentPage={page}
          onChangePage={handlePageChange}
          onChangeLimitPage={handleRowsPerPageChange}
        />
      </ConditionalRender>

      <ConditionalRender conditional={openModal}>
        <ModalAddNewContract
          open={openModal}
          setOpen={setOpenModal}
          contractFormik={contractFormik}
          onSubmit={contractFormik.handleSubmit}
          isViewMode={isViewContract}
          contractError={contractError}
          setContractError={setContractError}
          contracts={contracts}
        />
      </ConditionalRender>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonWrapper: {
    paddingTop: theme.spacing(1.5),
  },
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

export default ContactTable
