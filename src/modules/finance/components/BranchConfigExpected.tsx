import ConditionalRender from '@/components/ConditionalRender'
import FormItem from '@/components/Form/FormItem/FormItem'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectBranch from '@/components/select/SelectBranch'
import { LangConstant } from '@/const'
import { commonSelector, CommonState, getDivisions } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { DivisionType, IDivision } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { cloneDeep } from 'lodash'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { IConfigBranchExpected, IConfigDivisionExpected } from '../types/index'

export interface IBranchExpected {
  id?: string | number
  branchId: string
  division: IConfigDivisionExpected[]
  expectedKPI: string
}
interface IProps {
  formikError: any
  formikTouched: any
  formikValues: any
  setData: Dispatch<SetStateAction<IBranchExpected>>
  data: IBranchExpected
  onChange: (data: IConfigBranchExpected) => void
  onChangeBranch: (data: string) => void
}

const BranchConfigExpected = ({
  formikError,
  formikTouched,
  formikValues,
  setData,
  data,
  onChange,
  onChangeBranch,
}: IProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { divisions }: CommonState = useSelector(commonSelector)
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18FinanceLang } = useTranslation(LangConstant.NS_FINANCE)

  const divisionList = useMemo(
    () =>
      divisions.find((item: DivisionType) => item.branches.id === data.branchId)
        ?.divisions ?? [],
    [divisions, data.branchId]
  )
  const branchValidateError = useMemo(
    () =>
      formikError &&
      formikError?.configuration &&
      formikError?.configuration[0],
    [formikError]
  )

  const divisionValidateError = (index: number) => {
    return (
      formikError?.configuration[0].division &&
      formikError?.configuration[0].division[index]
    )
  }
  const handleBranchChange = (value: string) => {
    setData({ ...data, branchId: value, expectedKPI: '' })
    onChangeBranch(value)
  }

  const InputKpiDivision = useCallback(
    (
      value: string | undefined,
      keyName: string | undefined,
      valueTemp: string | undefined | number
    ) => {
      let dataClone = cloneDeep(data)
      if (valueTemp != undefined) {
        dataClone.division[Number(valueTemp)].expectedKPI = value
      }
      setData(dataClone)
    },
    [data]
  )
  const InputKpiBranch = useCallback(
    (value: string | undefined) => {
      setData({ ...data, expectedKPI: value ?? '' })
    },
    [data]
  )

  useEffect(() => {
    setData({
      ...data,
      branchId: data.branchId,
      division: divisionList?.map((item: IDivision) => ({
        divisionId: item.divisionId,
        expectedKPI: '',
      })),
    })
  }, [divisionList, data.branchId])
  useEffect(() => {
    dispatch(getDivisions())
  }, [])
  useEffect(() => {
    onChange(data)
  }, [data])
  useEffect(() => {
    if (formikValues) {
      setData(formikValues)
    } else {
      setData({
        branchId: data.branchId,
        division: divisionList,
        expectedKPI: '',
      })
    }
  }, [formikValues])
  return (
    <Box className={classes.rootBranchConfigExpected}>
      <Box className={classes.branchContainer}>
        <SelectBranch
          require
          label={i18Common('LB_BRANCH')}
          isDashboard
          placeholder={i18Common('PLH_SELECT_BRANCH')}
          error={
            formikTouched.moduleId &&
            (Boolean(
              branchValidateError
                ? formikError?.configuration[0]?.branchId
                : false
            ) ||
              !data.branchId)
          }
          errorMessage={
            data.branchId
              ? (branchValidateError &&
                  formikError?.configuration[0]?.branchId) ||
                (data?.branchId && formikError?.configuration)
                ? (formikError?.configuration[0]?.branchId as string)
                : ''
              : i18Common('MSG_SELECT_REQUIRE', {
                  name: i18Common('LB_BRANCH') ?? '',
                })
          }
          value={data?.branchId}
          onChange={handleBranchChange}
          width={200}
        />
        <ConditionalRender conditional={!!data?.branchId}>
          <Box className={classes.line}></Box>
          <FormItem
            label={i18FinanceLang('LB_EXPECTED_KPI')}
            className={'expected-kpi-branch'}
            error={
              formikTouched.moduleId &&
              formikError &&
              Boolean(
                branchValidateError
                  ? formikError?.configuration[0]?.expectedKPI
                  : false
              )
            }
            errorMessage={
              branchValidateError &&
              formikError &&
              formikError?.configuration[0]?.expectedKPI
                ? (formikError?.configuration[0]?.expectedKPI as string)
                : ''
            }
            require
          >
            <InputCurrency
              placeholder={i18FinanceLang('PLH_INPUT_EXPECTED_KPI') ?? ''}
              suffix={' VND'}
              value={data.expectedKPI}
              error={
                formikTouched.moduleId &&
                Boolean(
                  branchValidateError
                    ? formikError?.configuration[0].expectedKPI
                    : false
                )
              }
              onChange={InputKpiBranch}
            />
          </FormItem>
        </ConditionalRender>
      </Box>
      {!!divisionList.length && (
        <Box component={'ul'} className={classes.divisionContainer}>
          {divisionList.map((item: IDivision, index: number) => (
            <Box component={'li'} key={index}>
              <Box className={classes.divisionItem}>
                <Box className={classes.lineHorizontal}></Box>
                <Box className={'division-input'}>
                  <InputTextLabel
                    label={i18Common('LB_DIVISION') ?? ''}
                    placeholder=""
                    value={item.name}
                    onChange={() => {}}
                  />
                </Box>
                <Box className={classes.line}></Box>
                <FormItem
                  label={i18FinanceLang('LB_EXPECTED_KPI')}
                  className={'expected-kpi-division'}
                  error={
                    formikTouched.moduleId &&
                    Boolean(
                      branchValidateError && divisionValidateError(index)
                        ? formikError?.configuration[0].division[index]
                            ?.expectedKPI
                        : false
                    )
                  }
                  errorMessage={
                    branchValidateError && divisionValidateError(index)
                      ? (formikError?.configuration[0].division[index]
                          ?.expectedKPI as string)
                      : ''
                  }
                  require
                >
                  <InputCurrency
                    placeholder={i18FinanceLang('PLH_INPUT_EXPECTED_KPI') ?? ''}
                    suffix={' VND'}
                    error={
                      formikTouched.moduleId &&
                      Boolean(
                        branchValidateError && divisionValidateError(index)
                          ? formikError?.configuration[0].division[index]
                              ?.expectedKPI
                          : false
                      )
                    }
                    value={data.division[index]?.expectedKPI ?? ''}
                    valueTemp={index}
                    onChange={InputKpiDivision}
                  />
                </FormItem>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootBranchConfigExpected: {},
  branchContainer: {
    marginBottom: '15px',
    display: 'flex',
    '& .icon-drop-down': {
      cursor: 'pointer',
    },
    '& .expected-kpi-branch': {
      width: '300px',
    },
  },
  divisionContainer: {
    width: '100%',
    position: 'relative',
    marginLeft: '0px',
    '& li': {
      listStyle: 'none',
      display: 'flex',
      position: 'relative',
      height: '95px',
    },
  },
  divisionItem: {
    fontSize: '14px',
    display: 'flex',
    position: 'relative',
    '& .division-input': {
      pointerEvents: 'none',
      width: '200px',
      flexShrink: 0,
    },
    '& .expected-kpi-division': {
      width: '250px',
    },
  },
  line: {
    width: '50px',
    borderBottom: `1px solid ${theme.color.grey.primary}`,
    position: 'relative',
    top: '43px',
    height: '1px',
  },
  lineHorizontal: {
    width: '50px',
    borderBottom: `1px solid ${theme.color.grey.primary}`,
    borderLeft: `1px solid ${theme.color.grey.primary}`,
    position: 'relative',
    bottom: '46px',
  },
}))
export default BranchConfigExpected
