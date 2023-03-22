import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { FINANCE_DASHBOARD } from '@/const/path.const'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DashboardChartFinance from '../../components/DashboardChartFinance'
import ModalConfigKPI from '../../components/ModalConfigKPI'
import SelectBarFinance from '../../components/SelectBarFinance'
import { BRANCH_ID_ALL } from '../../const'
import { setConfigKpi } from '../../reducer/finance'
import {
  createNewConfigKpi,
  getListFinanceDashBoard,
  updateConfigKpi,
} from '../../reducer/thunk'
import { IConfigKpi, IDataFilter } from '../../types'
import { AuthState, selectAuth } from '@/reducer/auth'

function FinanceDashBoard() {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nFinance } = useTranslation(LangConstant.NS_FINANCE)
  const { t: i18 } = useTranslation()
  const { permissions }: AuthState = useSelector(selectAuth)
  const [isOpenConfigKpi, setIsOpenConfigKpi] = useState(false)
  const [dataFilter, setDataFilter] = useState<IDataFilter>({
    year: new Date().getFullYear(),
    branchId: BRANCH_ID_ALL,
    divisionId: '',
  })
  const [branchId, setBranchId] = useState('')
  const handleAddNewConfig = (isUpdate: boolean, payload: IConfigKpi) => {
    isUpdate
      ? dispatch(updateConfigKpi(payload))
          .unwrap()
          .then(() => {
            getFinanceDashboard(dataFilter)
            setIsOpenConfigKpi(false)
            dispatch(
              setConfigKpi({
                moduleId: '',
                year: null,
                configuration: [],
              })
            )
            setBranchId('')
          })
      : dispatch(createNewConfigKpi(payload))
          .unwrap()
          .then(() => {
            getFinanceDashboard(dataFilter)
            setIsOpenConfigKpi(false)
            dispatch(
              setConfigKpi({
                moduleId: '',
                year: null,
                configuration: [],
              })
            )
            setBranchId('')
          })
  }

  const handleCloseModal = () => {
    setIsOpenConfigKpi(false)
    dispatch(
      setConfigKpi({
        moduleId: '',
        year: null,
        configuration: [],
      })
    )
  }

  const handleNavigateToAddPage = () => {
    setIsOpenConfigKpi(true)
  }

  const getFinanceDashboard = (queryParams: IDataFilter) => {
    dispatch(updateLoading(true))
    dispatch(getListFinanceDashBoard({ ...queryParams }))
      .unwrap()
      .finally(() => dispatch(updateLoading(false)))
  }

  useEffect(() => {
    getFinanceDashboard(dataFilter)
  }, [dataFilter])

  return (
    <CommonScreenLayout
      title={i18('TXT_FINANCE_DASHBOARD')}
      onBack={() => navigate(FINANCE_DASHBOARD)}
    >
      <Box className={classes.filterBlock}>
        <SelectBarFinance
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
        />
        {permissions.useFinanceKpiConfiguration && (
          <ButtonAddWithIcon onClick={handleNavigateToAddPage}>
            {i18nFinance('LB_KPI_CONFIGURATION')}
          </ButtonAddWithIcon>
        )}
      </Box>
      <DashboardChartFinance />
      {isOpenConfigKpi && (
        <ModalConfigKPI
          setBranchId={setBranchId}
          branchId={branchId}
          onSubmit={handleAddNewConfig}
          onCloseModal={handleCloseModal}
        />
      )}
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootDashboardFinance: {},
  filterBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
    alignItems: 'flex-end',
    '& > div': {
      backgroundColor: theme.color.white,
    },
    [theme.breakpoints.between('xs', 'sm')]: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
    },
    [theme.breakpoints.between('md', 'lg')]: {
      display: 'flex',
      gap: theme.spacing(1),
    },
  },
}))

export default FinanceDashBoard
