import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import { getDateFromDayOfYear } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BRANCH_ID_ALL } from '../const'
import { IDataFilter } from '../types'

interface Props {
  dataFilter: IDataFilter
  setDataFilter: (query: IDataFilter | any) => void
}
const SelectBarFinance = ({ dataFilter, setDataFilter }: Props) => {
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18nFinance } = useTranslation(LangConstant.NS_FINANCE)
  const classes = useStyles()

  const allowedYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return [(currentYear - 1).toString(), currentYear.toString()]
  }, [])

  const handleSelectBranch = useCallback((value: string) => {
    setDataFilter((prev: any) => ({ ...prev, branchId: value, divisionId: '' }))
  }, [])
  const handleDivisionChange = useCallback((value: OptionItem) => {
    setDataFilter((prev: any) => ({
      ...prev,
      divisionId: value?.value?.toString() ?? '',
    }))
  }, [])
  const handleDateChange = useCallback((value: Date | null) => {
    setDataFilter((prev: any) => ({ ...prev, year: value?.getFullYear() }))
  }, [])
  return (
    <Box className={classes.rootSelectBarFinance}>
      <Box className="filter-item">
        {' '}
        <SelectBranch
          width={260}
          label={i18Common('LB_BRANCH')}
          value={dataFilter?.branchId ?? ''}
          onChange={handleSelectBranch}
          isShowClearIcon={false}
          isDashboard
        />
      </Box>
      <Box className="filter-item">
        {' '}
        <SelectDivisionSingle
          width={260}
          value={dataFilter?.divisionId ?? ''}
          label={i18nFinance('LB_DIVISION') as string}
          placeholder={i18nFinance('PLH_SELECT_DIVISION') as string}
          onChange={handleDivisionChange}
          branchId={
            dataFilter?.branchId === BRANCH_ID_ALL ? '' : dataFilter?.branchId
          }
          isDisable={dataFilter?.branchId === BRANCH_ID_ALL}
          isDashboard
        />
      </Box>
      <Box className="filter-item">
        <InputDatepicker
          isShowClearIcon={false}
          label={'Year'}
          width={260}
          value={getDateFromDayOfYear(Number(dataFilter?.year ?? ''), 1)}
          onChange={handleDateChange}
          views={['year']}
          openTo="year"
          inputFormat={'YYYY'}
          allowedYears={allowedYears}
          placeholder={i18nFinance('PLH_SELECT_YEAR') as string}
        />
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootSelectBarFinance: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(3),
    '& .filter-item': {},
  },
}))
export default SelectBarFinance
