import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import TableHeadCount, {
  IHeadCell,
} from '@/modules/project/components/HeadCount/TableHeadCount'
import { MONTH, MONTH_INSTANCE } from '@/modules/project/const'
import {
  projectSelector,
  setAssignHeadcounts,
  setContractHeadcount,
  setEndDateChange,
  setIsTotalContractHeadcountChange,
  setStartDateChange,
} from '@/modules/project/reducer/project'
import {
  IAssignHeadCountResponse,
  IContractHeadCountRequest,
  IContractHeadCountResponse,
  ProjectState,
} from '@/modules/project/types'
import { AppDispatch } from '@/store'
import { uuid } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const ZERO = 0

interface IProps {
  disabled?: boolean
}

const HeadCountInformation = ({ disabled = false }: IProps) => {
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()

  const [totalContractEffort, setTotalContractEffort] = useState(0)
  const [totalAssignEffort, setTotalAssignEffort] = useState(0)
  const [totalActualEffort, setTotalActualEffort] = useState(0)

  const {
    generalInfo,
    contractHeadcount,
    isHeadCountChange,
    isRollbackGeneralStep,
    startDate: startDateInStore,
    endDate: endDateInStore,
    isTotalContractHeadcountChange,
    assignHeadcounts,
    isTotalAssignEffortError,
    assignEfforts,
    actualEfforts,
  }: ProjectState = useSelector(projectSelector)

  const { startDate, endDate, totalContract } = generalInfo

  const isViewDetail = useMemo(() => {
    return !!params.projectId
  }, [params.projectId])

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
      {
        key: 'assignHeadcount',
        name: i18nProject('TXT_ASSIGN_EFFORT'),
        editable: false,
        totalCount: totalAssignEffort,
        isShowError: true,
        totalName: i18nProject('TXT_TOTAL_ASSIGN_EFFORT') as string,
      },
      {
        key: 'actualEffort',
        name: i18nProject('LB_ACTUAL_EFFORT'),
        editable: false,
        totalCount: totalActualEffort,
        isShowError: false,
        totalName: i18nProject('TXT_TOTAL_ACTUAL_EFFORT') as string,
      },
    ]
  }, [totalContractEffort, totalAssignEffort, totalActualEffort])

  const headCountRows: any[] = useMemo(() => {
    const startMonth = moment(startDate).month()
    const startYear = moment(startDate).year()
    const endMonth = moment(endDate).month()
    const endYear = moment(endDate).year()

    let _totalContractEffort = 0
    let _totalAssignEffort = 0
    let _totalActualEffort = 0

    const _result = []
    for (let indexY in contractHeadcount) {
      for (let indexM in contractHeadcount[indexY].headcount) {
        if (
          (+contractHeadcount[indexY].year <= startYear &&
            MONTH_INSTANCE[indexM].value < startMonth) ||
          (+contractHeadcount[indexY].year >= endYear &&
            MONTH_INSTANCE[indexM].value > endMonth)
        ) {
          _result.push({})
        } else {
          const _contractHeadcount =
            contractHeadcount[indexY]?.headcount[indexM] ?? ZERO
          const _assignHeadcount =
            assignEfforts?.[indexY]?.headcount?.[indexM] ?? ZERO
          const _actualEffort =
            actualEfforts?.[indexY]?.headcount?.[indexM] ?? ZERO

          _totalContractEffort += +_contractHeadcount
          _totalAssignEffort += +_assignHeadcount
          _totalActualEffort += +_actualEffort

          _result.push({
            id: contractHeadcount[indexY].id ?? uuid(),
            year: contractHeadcount[indexY].year,
            month: `${MONTH_INSTANCE[indexM].label}`,
            monthId: MONTH_INSTANCE[indexM].value,
            contractHeadcount: _contractHeadcount,
            assignHeadcount: _assignHeadcount,
            actualEffort: _actualEffort,
          })
        }
      }
    }

    setTotalContractEffort(_totalContractEffort)
    setTotalAssignEffort(_totalAssignEffort)
    setTotalActualEffort(_totalActualEffort)
    return _result
  }, [contractHeadcount, assignHeadcounts])

  const getNumberFixed = (num: number | string) => {
    const arrayNumber = String(num).split('.')
    return arrayNumber.length > 1
      ? Number(`${arrayNumber[0]}.${arrayNumber[1].slice(0, 2)}`)
      : Number(arrayNumber[0])
  }

  const handleChangeHeadcount = (value: string, itemRow: any) => {
    const result = JSON.parse(JSON.stringify(contractHeadcount))

    result.forEach((item: IContractHeadCountRequest) => {
      if (itemRow.year === item.year) {
        item.headcount[itemRow.monthId] = !!value ? value : 0
      }
    })
    dispatch(setContractHeadcount(result))
  }

  const initDataHeadCountTable = () => {
    const startMonth = moment(startDate).month()
    const startYear = moment(startDate).year()
    const endMonth = moment(endDate).month()
    const endYear = moment(endDate).year()

    const _contractHeadCounts: IContractHeadCountResponse[] = []
    const _assignHeadcounts: IAssignHeadCountResponse[] = []

    for (let y = startYear; y <= endYear; y++) {
      _contractHeadCounts.push({ headcount: [], year: String(y) })
      _assignHeadcounts.push({ headcount: [], year: String(y) })
      for (let m = 0; m <= MONTH.DEC; m++) {
        _assignHeadcounts[y - startYear].headcount.push(ZERO as never)
        if (
          (y <= startYear && m < startMonth) ||
          (y >= endYear && m > endMonth)
        ) {
          _contractHeadCounts[y - startYear].headcount.push(ZERO as never)
        } else {
          const _contractCount = getNumberFixed(Number(totalContract ?? 0))

          if (isRollbackGeneralStep && !isTotalContractHeadcountChange) {
            if (
              !startDateInStore.oldValue ||
              !endDateInStore.oldValue ||
              !startDate ||
              !endDate
            ) {
            } else {
              // handle startDate or endDate Change when rollback
              const headCountItem = contractHeadcount.find(
                item => +item.year === +y
              )
              const _count = headCountItem
                ? headCountItem.headcount?.[m] ?? 0
                : 0
              _contractHeadCounts[y - startYear].headcount.push(_count as never)
            }
          } else {
            _contractHeadCounts[y - startYear].headcount.push(
              _contractCount as never
            )
          }
        }
      }
    }
    dispatch(setContractHeadcount(_contractHeadCounts))
    dispatch(setAssignHeadcounts(_assignHeadcounts))
    dispatch(setStartDateChange({ change: false, oldValue: startDate }))
    dispatch(setEndDateChange({ change: false, oldValue: endDate }))
    dispatch(setIsTotalContractHeadcountChange(false))
  }

  useEffect(() => {
    if (isViewDetail || isHeadCountChange) return
    initDataHeadCountTable()
  }, [startDate, endDate, totalContract])

  return (
    <CardForm title={i18nProject('TXT_HEADCOUNT_INFORMATION')}>
      <TableHeadCount
        disabled={disabled}
        headCells={headCells}
        rows={headCountRows}
        onInputChange={handleChangeHeadcount}
        isTotalAssignEffortError={isTotalAssignEffortError}
      />
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({}))

export default HeadCountInformation
