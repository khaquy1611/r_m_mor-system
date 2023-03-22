import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import CardForm from '@/components/Form/CardForm'
import FormLayout from '@/components/Form/FormLayout'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, TableConstant } from '@/const'
import { UNIT_OF_TIME } from '@/const/app.const'
import { EventInput, OptionItem, TableHeaderOption } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ContractStepAction from '../../components/ContractStepAction'
import ModalStaff from '../../components/ModalStaff'
import { ContractStaffInformationRequest } from '../../models'
import { contractSelector, IContractState } from '../../reducer/contract'
import { CONFIG_CONTRACT_STEPS } from './ContractDetail'
import ContractUploadDocuments from './ContractUploadDocuments'
import StringFormat from 'string-format'
import { AppDispatch } from '@/store'
import {
  getContractStaffInformation,
  getContractUploadDocuments,
} from '../../reducer/thunk'
import { useParams } from 'react-router-dom'
import { updateLoading } from '@/reducer/screen'
import i18next from 'i18next'
import { formatNumberToCurrencyBigInt, uuid } from '@/utils'
import { initStaffForm } from '../../contractFormik'
import { AuthState, selectAuth } from '@/reducer/auth'
import clsx from 'clsx'

interface ContractStaffInformationProps {
  isDetailPage: boolean
  staffList: ContractStaffInformationRequest[]
  onCreateNewContract: Function
  onCreateNewStaff: (staff: ContractStaffInformationRequest) => void
  setShowModalStaff: Dispatch<SetStateAction<boolean>>
  showModalStaff: boolean
  branchId: string
  onUpdateStaff: (
    staff: ContractStaffInformationRequest,
    staffIndex: number
  ) => void
  onDeleteStaff: (
    staffName: string,
    staffId: string,
    staffIndex: number
  ) => void
}

const headCells: TableHeaderOption[] = [
  {
    id: 'staffName',
    align: 'left',
    disablePadding: true,
    label: i18next.t('common:LB_STAFF_NAME'),
  },
  {
    id: 'positionName',
    align: 'left',
    disablePadding: true,
    label: i18next.t('contract:LB_STAFF_POSITION'),
  },
  {
    id: 'skillIds',
    align: 'left',
    disablePadding: true,
    label: 'Service/Skillset',
  },
  {
    id: 'level',
    align: 'left',
    disablePadding: true,
    label: i18next.t('contract:LB_STAFF_LEVEL'),
  },
  {
    id: 'rate',
    align: 'left',
    disablePadding: true,
    label: i18next.t('common:LB_PRICE'),
  },
  {
    id: 'unitOfTime',
    align: 'left',
    disablePadding: true,
    label: 'Unit Of Time',
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: true,
    label: 'Action',
  },
]

const createStaffListRows = (staff: ContractStaffInformationRequest) => {
  return {
    ...staff,
    id: staff.id,
    rate: formatNumberToCurrencyBigInt(staff.rate),
    unitOfTime: UNIT_OF_TIME.find(
      unit => unit.id === staff?.unitOfTime?.toString()
    )?.label,
    skillIds: staff.skillIds
      ?.map((skill: OptionItem) => skill.label)
      .join(', '),
    action: [{ type: 'delete' }],
    level: staff.levelName,
  }
}

const ContractStaffInformation = ({
  isDetailPage,
  staffList,
  onCreateNewContract,
  onCreateNewStaff,
  setShowModalStaff,
  showModalStaff,
  onUpdateStaff,
  onDeleteStaff,
  branchId,
}: ContractStaffInformationProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const { activeStep }: IContractState = useSelector(contractSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [isDetailStaff, setIsDetailStaff] = useState(false)
  const [staffDetailLocal, setStaffDetailLocal] =
    useState<ContractStaffInformationRequest>(initStaffForm)
  const [indexStaffSelected, setIndexStaffSelected] = useState(0)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [staffNameSelected, setStaffNameSelected] = useState('')
  const [staffPageSize, setStaffPageSize] = useState(
    TableConstant.LIMIT_DEFAULT
  )
  const [staffPageNum, setStaffPageNum] = useState(1)
  const [staffIdSelected, setStaffIdSelected] = useState('')

  const staffListRows = useMemo(() => {
    if (!staffList.length) return []
    let _staffList = staffList.map((staff: ContractStaffInformationRequest) =>
      createStaffListRows(staff)
    )
    return _staffList.slice(
      (staffPageNum - 1) * staffPageSize,
      (staffPageNum - 1) * staffPageSize + staffPageSize
    )
  }, [staffList, staffPageNum, staffPageSize])

  const staffIds = useMemo(() => {
    if (!staffList.length) return []
    return staffList.map((staff: ContractStaffInformationRequest) =>
      staff?.staffId?.toString()
    )
  }, [staffList])

  const staffHeadCells = useMemo(() => {
    if (permissions.useContractUpdate) return headCells
    return headCells.slice(0, -1)
  }, [permissions.useContractUpdate])

  const handleCloseModalStaff = () => setShowModalStaff(false)

  const handleShowModalAddNewStaff = () => {
    setIsDetailStaff(false)
    setShowModalStaff(true)
  }

  const handleShowModalDetailStaff = (
    rowParam: ContractStaffInformationRequest
  ) => {
    const index = staffList.findIndex(
      (row: ContractStaffInformationRequest) => row.id == rowParam.id
    )
    if (index !== -1) {
      setStaffDetailLocal(staffList[index])
      setIndexStaffSelected(index)
      setIsDetailStaff(true)
      setShowModalStaff(true)
    }
  }

  const handleShowModalDeleteStaff = (
    rowParam: ContractStaffInformationRequest
  ) => {
    const index = staffList.findIndex(
      (row: ContractStaffInformationRequest) => row.id == rowParam.id
    )
    if (index !== -1) {
      setIndexStaffSelected(index)
      setStaffNameSelected(staffList[index].staffName || '')
      setStaffIdSelected(staffList[index].id || '')
      setShowModalDelete(true)
    }
  }

  const handleCreateNewContract = () => {
    onCreateNewContract()
  }

  const handleDeleteStaff = () => {
    if (staffListRows.length === 1 && staffPageNum !== 1) {
      setStaffPageNum(staffPageNum - 1)
    }
    onDeleteStaff(staffNameSelected, staffIdSelected, indexStaffSelected)
  }

  const handleSubmitModalStaff = (staff: ContractStaffInformationRequest) => {
    if (isDetailStaff) {
      onUpdateStaff(staff, indexStaffSelected)
    } else {
      onCreateNewStaff(staff)
    }
  }

  const getStaffInformationAndDocs = () => {
    const { contractId } = params
    dispatch(updateLoading(true))
    Promise.all([
      dispatch(getContractStaffInformation(contractId as string)),
      dispatch(
        getContractUploadDocuments({
          contractId: contractId as string,
          queries: {
            pageNum: staffPageNum,
            pageSize: TableConstant.LIMIT_DEFAULT,
          },
        })
      ),
    ]).finally(() => {
      dispatch(updateLoading(false))
    })
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setStaffPageNum(newPage)
  }

  const handlePageSizeChange = (event: EventInput) => {
    setStaffPageSize(+event.target.value)
    setStaffPageNum(1)
  }

  useEffect(() => {
    if (isDetailPage) {
      getStaffInformationAndDocs()
    }
  }, [])

  return (
    <Box className={classes.rootContractStaffInformation}>
      {showModalStaff && (
        <ModalStaff
          branchId={branchId}
          staffIds={staffIds as string[]}
          isDetail={isDetailStaff}
          staffDetail={staffDetailLocal}
          onClose={handleCloseModalStaff}
          onSubmit={handleSubmitModalStaff}
        />
      )}
      {showModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Contract('TXT_DELETE_STAFF')}
          subMessage={StringFormat(
            i18Contract('MSG_CONFIRM_STAFF_DELETE'),
            staffNameSelected
          )}
          onClose={() => setShowModalDelete(false)}
          onSubmit={handleDeleteStaff}
        />
      )}
      <CardForm title={i18('TXT_STAFF_INFORMATION')}>
        <TableShare
          keyName="id"
          isShowCheckbox={false}
          headCells={staffHeadCells}
          rows={staffListRows}
          childComp={(row: ContractStaffInformationRequest, index: number) => (
            <ItemRowTableV2
              row={row}
              key={`table-checkbox-${row['id']}`}
              headCells={staffHeadCells}
              isShowCheckbox={false}
              uuId={row['id'] ?? uuid()}
              keyName={'id'}
              onClickDelete={() => handleShowModalDeleteStaff(row)}
              onClickDetail={() => handleShowModalDetailStaff(row)}
            />
          )}
        />
        <FormLayout
          className={clsx(
            !permissions.useContractUpdate
              ? classes.dFlexEnd
              : 'space-between-root'
          )}
        >
          {permissions.useContractUpdate && (
            <ButtonAddPlus
              label={i18('LB_ADD_NEW_STAFF')}
              onClick={handleShowModalAddNewStaff}
            />
          )}
          <TablePaginationShare
            rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
            totalElements={staffList.length}
            pageLimit={staffPageSize}
            currentPage={staffPageNum}
            onChangePage={handlePageChange}
            onChangeLimitPage={handlePageSizeChange}
          />
        </FormLayout>
      </CardForm>
      <ContractUploadDocuments isDetailPage={isDetailPage} />
      {!isDetailPage && (
        <ContractStepAction
          configSteps={CONFIG_CONTRACT_STEPS}
          activeStep={activeStep}
          onNext={handleCreateNewContract}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractStaffInformation: {},
  staffActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dFlexEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

export default ContractStaffInformation
