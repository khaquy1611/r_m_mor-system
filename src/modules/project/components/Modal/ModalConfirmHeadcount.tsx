import Modal from '@/components/common/Modal'
import Typography from '@/components/common/Typography'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { MONTH, MONTH_INSTANCE } from '../../const'
import { projectSelector } from '../../reducer/project'
import {
  IContractHeadCountRequest,
  IContractHeadCountResponse,
  ProjectState,
} from '../../types'
import TableHeadCount, { IHeadCell } from '../HeadCount/TableHeadCount'

const ZERO = 0

interface IProps {
  open: boolean
  title: string
  description: string
  onClose: () => void
  onSubmit: (
    contractHeadcount: any[],
    totalContractHeadcount?: string | number
  ) => void
  startDate: Date | null
  endDate: Date | null
}

const ModalConfirmHeadcount = ({
  open,
  title,
  description,
  onClose,
  onSubmit,
  startDate,
  endDate,
}: IProps) => {
  const classes = useStyles()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)

  const { generalInfo, contractHeadcount }: ProjectState =
    useSelector(projectSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [contractHeadcountLocal, setContractHeadcountLocal] = useState<
    IContractHeadCountResponse[]
  >([])
  const [totalContractEffort, setTotalContractEffort] = useState(0)

  const isDetailPage = useMemo(() => {
    return !!params.projectId
  }, [params.projectId])

  const formDisabled = useMemo(() => {
    if (!isDetailPage) return false
    return !permissions.useProjectUpdateHeadcountInfo
  }, [permissions.useProjectUpdateHeadcountInfo])

  const headCells: IHeadCell[] = useMemo(() => {
    return [
      { key: 'year', name: 'Year', editable: false },
      { key: 'month', name: 'Month', editable: false },
      {
        key: 'contractHeadcount',
        name: i18nProject('TXT_ACTUAL_EFFORT'),
        editable: true,
        totalCount: totalContractEffort,
        isShowError: false,
        totalName: i18nProject('TXT_TOTAL_CONTRACT_EFFORT') as string,
      },
    ]
  }, [totalContractEffort])

  const headCountRows: any[] = useMemo(() => {
    const startMonth = moment(startDate).month()
    const startYear = moment(startDate).year()
    const endMonth = moment(endDate).month()
    const endYear = moment(endDate).year()

    const _result = []
    let _totalContractEffort = 0

    for (let _contractHeadcount of contractHeadcountLocal) {
      for (let i in _contractHeadcount.headcount) {
        if (
          (+_contractHeadcount.year <= startYear &&
            MONTH_INSTANCE[i].value < startMonth) ||
          (+_contractHeadcount.year >= endYear &&
            MONTH_INSTANCE[i].value > endMonth)
        ) {
          _result.push({})
        } else {
          const contractHeadcount = _contractHeadcount?.headcount[i] ?? 0
          _totalContractEffort += +contractHeadcount

          _result.push({
            id: _contractHeadcount.id ?? uuid(),
            year: _contractHeadcount.year,
            month: `${MONTH_INSTANCE[i].label}`,
            monthId: MONTH_INSTANCE[i].value,
            contractHeadcount: contractHeadcount,
          })
        }
      }
    }

    setTotalContractEffort(_totalContractEffort)
    return _result
  }, [contractHeadcountLocal])

  const initDataHeadCountTable = () => {
    const startMonth = moment(startDate).month()
    const startYear = moment(startDate).year()
    const endMonth = moment(endDate).month()
    const endYear = moment(endDate).year()
    const _contractHeadCounts: IContractHeadCountResponse[] = []

    for (let y = startYear; y <= endYear; y++) {
      const headCountItem = contractHeadcount.find(item => +item.year === +y)
      if (headCountItem) {
        _contractHeadCounts.push({
          ...headCountItem,
          headcount: [],
          year: String(y),
        })
      } else {
        _contractHeadCounts.push({ headcount: [], year: String(y) })
      }
      for (let m = 0; m <= MONTH.DEC; m++) {
        if (
          (y <= startYear && m < startMonth) ||
          (y >= endYear && m > endMonth)
        ) {
          _contractHeadCounts[y - startYear].headcount.push(ZERO as never)
        } else {
          const headCountItem = contractHeadcount.find(
            item => +item.year === +y
          )
          const _count = headCountItem ? headCountItem.headcount?.[m] ?? 0 : 0
          _contractHeadCounts[y - startYear].headcount.push(_count as never)
        }
      }
    }

    setContractHeadcountLocal(_contractHeadCounts)
  }

  const handleChangeHeadcount = (value: string, itemRow: any) => {
    const result = JSON.parse(JSON.stringify(contractHeadcountLocal))
    result.forEach((item: IContractHeadCountRequest) => {
      if (itemRow.year === item.year) {
        item.headcount[itemRow.monthId] = !!value ? value : 0
      }
    })

    setContractHeadcountLocal(result)
  }

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    onSubmit(contractHeadcountLocal, totalContractEffort)
    handleClose()
  }

  useEffect(() => {
    if (open) {
      initDataHeadCountTable()
    }
  }, [open])

  return (
    <Modal
      open={open}
      title={title}
      color="primary"
      onClose={handleClose}
      width="100%"
      labelSubmit={i18('LB_UPDATE')}
      onSubmit={handleSubmit}
    >
      <Box className={classes.modalContent}>
        <Box className={classes.foreground}>
          <Typography className={classes.description}>{description}</Typography>
        </Box>

        <TableHeadCount
          disabled={formDisabled}
          headCells={headCells}
          rows={headCountRows}
          onInputChange={handleChangeHeadcount}
        />
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  modalContent: {
    minWidth: 800,
    maxWidth: '80vw',
  },
  description: {
    fontSize: '16px !important',
  },
  foreground: {
    background: theme.color.black.porcelain,
    padding: theme.spacing(2, 3),
  },
  confirmed: {
    marginTop: theme.spacing(2),
    display: 'inline-block',
  },
  buttonCancel: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    color: `${theme.color.black.secondary} !important`,
  },
  btnSubmit: {
    width: 'max-content !important',
  },
}))

export default ModalConfirmHeadcount
