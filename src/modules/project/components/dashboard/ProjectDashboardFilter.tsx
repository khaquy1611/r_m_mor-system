import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import { getArrayMinMax } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { IDataFilter } from '../../pages/project-dashboard'

interface IProps {
  dataFilter: IDataFilter
  setDataFilter: Dispatch<SetStateAction<IDataFilter>>
}

function DashboardFilter({ dataFilter, setDataFilter }: IProps) {
  const classes = useStyles()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)

  const handleBranchChange = useCallback((value: string) => {
    setDataFilter((prev: IDataFilter) => ({
      ...prev,
      branchId: value,
      divisionId: '',
    }))
  }, [])

  const handleDivisionChange = useCallback((value: OptionItem) => {
    setDataFilter((prev: IDataFilter) => ({
      ...prev,
      divisionId: value?.value?.toString() ?? '',
    }))
  }, [])

  const handleDateChange = useCallback((value: Date | null) => {
    setDataFilter((prev: IDataFilter) => ({
      ...prev,
      date: value,
    }))
  }, [])

  return (
    <Box className={classes.rootDashboardFilter}>
      <SelectBranch
        isDashboard
        width={240}
        label={i18nProject('LB_BRANCH')}
        isShowClearIcon={false}
        value={dataFilter.branchId}
        onChange={handleBranchChange}
      />
      <SelectDivisionSingle
        width={240}
        label={i18nProject('LB_DIVISION') as string}
        placeholder={i18nProject('PLH_SELECT_DIVISION') as string}
        branchId={dataFilter.branchId}
        isDisable={!dataFilter.branchId}
        value={dataFilter.divisionId}
        onChange={handleDivisionChange}
      />
      <FormItem label="Project Date">
        <InputDatepicker
          allowedYears={getArrayMinMax(2016, 2099)}
          width={240}
          value={dataFilter.date}
          onChange={handleDateChange}
          views={['year', 'month']}
          openTo="year"
          inputFormat={'MM/YYYY'}
        />
      </FormItem>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootDashboardFilter: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(3),

    '& > div': {
      width: 'fit-content',
    },
  },
}))

export default DashboardFilter
