import Modal from '@/components/common/Modal'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { getDateFromDayOfYear } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { listModule } from '../const'
import formikConfig from '../hook/FormikConfigKpi'
import { financeSelector, setConfigKpi } from '../reducer/finance'
import { getFinanceKpi } from '../reducer/thunk'
import { IConfigBranchExpected, IConfigKpi } from '../types'
import BranchConfigExpected, { IBranchExpected } from './BranchConfigExpected'

export interface IProps {
  setBranchId: Dispatch<SetStateAction<string>>
  branchId: string
  onSubmit: (isUpdate: boolean, payload: IConfigKpi) => void
  onCloseModal: () => void
}

const ModalConfigKpi = ({
  setBranchId,
  branchId,
  onCloseModal,
  onSubmit,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { configKpi, configurations } = useSelector(financeSelector)
  const { t: i18 } = useTranslation()
  const { t: i18FinanceLang } = useTranslation(LangConstant.NS_FINANCE)
  const { modalConfigKpiValidation } = formikConfig()
  const classes = useStyles()
  const [dataBranch, setDataBranch] = useState<IBranchExpected>({
    id: '',
    branchId: '',
    division: [],
    expectedKPI: '',
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: configKpi,
    validationSchema: modalConfigKpiValidation,
    onSubmit: (values: IConfigKpi, actions) => {
      const isUpdate = values.configuration?.every(item => item.id)
      if (dataBranch.branchId) {
        onSubmit(Boolean(isUpdate), values)
      }
    },
  })

  const branchExpectedCurrent = useMemo(
    () =>
      configurations?.find(
        (item: IConfigBranchExpected) => item.branchId == branchId
      ) ?? null,
    [configurations, branchId]
  )

  const allowedYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return [(currentYear - 1).toString(), currentYear.toString()]
  }, [])

  const handleChangeConfig = (value: IConfigBranchExpected) => {
    formik.setFieldValue('configuration', [value])
  }

  const handleChangeBranch = (value: string) => {
    setBranchId(value)
  }

  const handleClose = () => {
    onCloseModal()
    setBranchId('')
  }

  useEffect(() => {
    if (formik.values?.moduleId || formik.values?.year) {
      dispatch(updateLoading(true))
    }
    dispatch(
      getFinanceKpi({
        module: formik.values?.moduleId,
        year: formik.values?.year,
      })
    )
      .unwrap()
      .then((res: any) => {
        dispatch(updateLoading(false))
      })
      .finally(() => {
        updateLoading(false)
      })
  }, [formik.values?.moduleId, formik.values?.year])

  useEffect(() => {
    dispatch(
      setConfigKpi({
        moduleId: formik.values.moduleId,
        year: formik.values.year,
        configuration: configurations,
      })
    )
    if (configurations) {
      setDataBranch({
        id: configurations[0]?.id ?? '',
        branchId: configurations[0]?.branchId ?? '',
        division: configurations[0]?.division ?? [],
        expectedKPI: configurations[0]?.expectedKPI?.toString() ?? '',
      })
    }
  }, [configurations])

  return (
    <Modal
      open
      labelSubmit={i18('LB_UPDATE')}
      title={i18FinanceLang('LB_KPI_CONFIGURATION')}
      onClose={handleClose}
      onSubmit={formik.handleSubmit}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box className={clsx(classes.listFields, 'scrollbar')}>
          <FormLayout gap={24}>
            <InputDropdown
              label={i18FinanceLang('LB_MODULE') ?? ''}
              listOptions={listModule}
              value={formik.values?.moduleId ?? ''}
              placeholder={i18FinanceLang('PLH_SELECT_MODULE') ?? ''}
              required
              error={
                formik.touched.moduleId && Boolean(formik.errors?.moduleId)
              }
              errorMessage={
                formik.errors?.moduleId
                  ? (formik.errors?.moduleId as string)
                  : ''
              }
              onChange={(value: string) => {
                formik.setFieldValue('moduleId', value)
              }}
            />
            <InputDatepicker
              require
              allowedYears={allowedYears}
              label={i18FinanceLang('LB_YEAR')}
              inputFormat={'YYYY'}
              views={['year']}
              openTo={'year'}
              placeholder={i18FinanceLang('PLH_SELECT_YEAR') ?? ''}
              value={getDateFromDayOfYear(Number(formik.values?.year ?? ''), 1)}
              error={formik.touched.year && Boolean(formik.errors?.year)}
              errorMessage={
                formik.errors?.year ? (formik.errors?.year as string) : ''
              }
              onChange={(value: Date) => {
                formik.setFieldValue(
                  'year',
                  value ? value?.getFullYear() : value
                )
              }}
            />
          </FormLayout>
          <FormLayout gap={24} top={24}>
            <BranchConfigExpected
              formikError={formik.errors}
              formikTouched={formik.touched}
              formikValues={branchExpectedCurrent}
              setData={setDataBranch}
              data={dataBranch}
              onChange={handleChangeConfig}
              onChangeBranch={handleChangeBranch}
            />
          </FormLayout>
        </Box>
      </form>
    </Modal>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    maxHeight: '600px',
    overflowX: 'hidden',
  },
  modalBody: {
    padding: theme.spacing(0, 3),
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
export default ModalConfigKpi
