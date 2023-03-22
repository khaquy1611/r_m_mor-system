import Modal from '@/components/common/Modal'
import InputDatePicker from '@/components/Datepicker/InputDatepicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import SelectCurrency from '@/components/select/SelectCurrency'
import { LangConstant } from '@/const'
import { CURRENCY_CODE } from '@/const/app.const'
import { AppDispatch } from '@/store'
import { IAction } from '@/types'
import { formatDate, formatNumberToCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import StringFormat from 'string-format'
import { COST } from '../const'
import formikConfig from '../pages/project-detail/formik/Formik'
import { listCostOrigin } from '../pages/project-list/instance'
import { projectSelector } from '../reducer/project'
import { getProjectCostDetail } from '../reducer/thunk'
import { ProjectState } from '../types'
import { convertCurrency } from '../utils'
interface IModalAddNewCostProps {
  open: boolean
  setOpen: Function
  onSubmit?: (projectCost: IProjectCost) => void
  onUpdate?: (projectRevenue: IProjectCost, id: string | undefined) => void
  onCloseModal: () => void
  isViewMode: boolean
  id?: string
  projectId?: string
  disabled?: boolean
}
export interface IProjectCost {
  id?: string
  no?: number
  costOrigin: any
  source: any
  currency: any
  date: string
  cost: string
  note: string
  rate: string
  action?: IAction[]
}

const ModalAddCost = ({
  open,
  onCloseModal,
  onSubmit,
  onUpdate,
  isViewMode,
  id,
  projectId,
  disabled = false,
}: IModalAddNewCostProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { generalInfo, projectCostDetail, projectCosts }: ProjectState =
    useSelector(projectSelector)
  const dispatch = useDispatch<AppDispatch>()
  const initialValues = {
    costOrigin: { id: '', label: '' },
    currency: { id: '', value: '', label: '' },
    source: { id: '', label: '' },
    date: '',
    cost: '',
    note: '',
    rate: '',
  }
  // State
  const [disableRate, setDisableRate] = useState(false)
  const { modalCostValidation } = formikConfig()
  const [dateError, setDateError] = useState(false)

  // Library
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: modalCostValidation,
    onSubmit: (values: IProjectCost, actions) => {
      const dataSubmit = cloneDeep(values)
      !open &&
        actions.resetForm({
          values: initialValues,
        })

      if (isViewMode) {
        onUpdate ? onUpdate(dataSubmit, id) : ''
      } else {
        onSubmit ? onSubmit(dataSubmit) : ''
      }
    },
  })

  const divisions = useMemo(
    () => (generalInfo && generalInfo.divisions ? generalInfo.divisions : []),
    [generalInfo]
  )

  const partners = useMemo(
    () => (generalInfo && generalInfo.partner ? generalInfo.partner : []),
    [generalInfo]
  )
  const listSources = useMemo(() => {
    if (formik.values.costOrigin.id === COST.DIVISION) {
      return divisions
    } else if (formik.values.costOrigin.id === COST.PARTNER) {
      return partners
    } else {
      return []
    }
  }, [formik.values.costOrigin])

  const isReadOnly = useMemo(() => {
    if (!isViewMode) return false
    return (
      listSources.findIndex(source => source.id === formik.values.source.id) ===
      -1
    )
  }, [listSources, formik.values.source])

  const getErrorObject = (value: any): string => {
    return value?.id
  }

  const handleClose = () => {
    onCloseModal()

    formik.resetForm({
      values: initialValues,
    })
  }
  const filterData = (data: any) => {
    const fields = [
      'costOrigin',
      'source',
      'currency',
      'date',
      'cost',
      'note',
      'rate',
    ]

    fields.forEach(field => {
      if (field !== 'currency') {
        formik.setFieldValue(field, data[field], false)
      } else {
        formik.setFieldValue(field, data[field], false)
        if (data[field].value === 'VND') {
          setDisableRate(true)
        } else {
          setDisableRate(false)
        }
      }
    })
  }

  const handleDateError = (error: string | null) => {
    setDateError(!!error)
  }

  const updateCurrencyAndRate = (option: any) => {
    const dataCurrency = convertCurrency(option)
    if (+dataCurrency.value === CURRENCY_CODE.VND) {
      formik.setValues({
        ...formik.values,
        currency: dataCurrency,
        rate: '1',
      })
      setDisableRate(true)
    } else if (dataCurrency.id === undefined) {
      formik.setValues({
        ...formik.values,
        currency: { id: '', value: '', label: '' },
        rate: '',
      })
    } else {
      formik.setValues({
        ...formik.values,
        currency: dataCurrency,
        rate: '',
      })
      setDisableRate(false)
    }
  }

  useEffect(() => {
    if (isViewMode && open && id && projectId) {
      dispatch(getProjectCostDetail({ projectId, costId: id }))
    } else if (isViewMode && open && !projectId && id) {
      const projectCost = projectCosts.find(
        (item: IProjectCost) => item.id === id
      )
      if (projectCost) {
        filterData(projectCost)
      }
    }
  }, [isViewMode, id, open, projectId])

  useEffect(() => {
    if (projectCostDetail.id && isViewMode) {
      filterData(projectCostDetail)
    }
  }, [projectCostDetail, isViewMode])

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        formik.resetForm({
          values: initialValues,
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Modal
      open={open}
      title={i18Project(
        isViewMode ? 'LB_UPDATE_PROJECT_COST' : 'LB_ADD_NEW_COST'
      )}
      labelSubmit={i18(isViewMode ? 'LB_UPDATE' : 'LB_SUBMIT')}
      onClose={handleClose}
      onSubmit={formik.handleSubmit}
      submitDisabled={disabled}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box className={clsx(classes.listFields, 'scrollbar')}>
          <Box className={classes.modalBody}>
            <Box className={classes.boxFormItem}>
              <FormItem
                label={i18Project('LB_COST_ORIGIN')}
                className={classes.halfWidth}
                require
              >
                {isReadOnly ? (
                  <Box className={classes.textContent}>
                    {formik.values.costOrigin.label}
                  </Box>
                ) : (
                  <InputDropdown
                    isDisable={disabled}
                    listOptions={listCostOrigin}
                    value={formik.values.costOrigin.id}
                    placeholder={i18Project('PLH_SELECT_COST_ORIGIN') || ''}
                    error={
                      formik.touched.costOrigin &&
                      Boolean(formik.errors.costOrigin)
                    }
                    errorMessage={getErrorObject(formik.errors.costOrigin)}
                    onChange={(value: string, option: any) => {
                      formik.setValues({
                        ...formik.values,
                        costOrigin: option,
                        source: { id: '', label: '' },
                      })
                    }}
                  />
                )}
              </FormItem>
              <FormItem
                label={i18('LB_SOURCE')}
                className={classes.halfWidth}
                require
              >
                {isReadOnly ? (
                  <Box className={classes.textContent}>
                    {formik.values.source.label}
                  </Box>
                ) : (
                  <InputDropdown
                    isDisable={disabled}
                    listOptions={listSources}
                    value={formik.values.source.id}
                    placeholder={i18('PLH_SELECT_SOURCE') || ''}
                    error={
                      formik.touched.source && Boolean(formik.errors.source)
                    }
                    errorMessage={getErrorObject(formik.errors.source)}
                    onChange={(value: string, option: any) => {
                      formik.setFieldValue('source', option)
                    }}
                  />
                )}
              </FormItem>
            </Box>
            <Box className={classes.boxFormItem}>
              <FormItem
                label={i18Project('LB_INPUT_DATE')}
                className={classes.halfWidth}
                require
              >
                {isReadOnly ? (
                  <Box className={classes.textContent}>
                    {formatDate(
                      new Date(formik.values.date).getTime(),
                      'MM/YYYY'
                    )}
                  </Box>
                ) : (
                  <InputDatePicker
                    isShowClearIcon={!disabled}
                    disabled={disabled}
                    inputFormat={'MM/YYYY'}
                    value={Date.parse(formik.values.date)}
                    error={
                      dateError ||
                      (formik.touched.date && Boolean(formik.errors.date))
                    }
                    errorMessage={
                      dateError
                        ? StringFormat(
                            i18Project('MSG_INVALID'),
                            i18Project('LB_REVENUE_DATE') ?? ''
                          )
                        : formik.errors.date
                    }
                    width={'100%'}
                    onError={handleDateError}
                    onChange={(value: Date) => {
                      formik.setFieldValue('date', value)
                    }}
                  />
                )}
              </FormItem>
              <FormItem
                label={i18Project('LB_COST')}
                className={classes.halfWidth}
                require
                errorMessage={formik.errors.cost}
                error={formik.touched.cost && Boolean(formik.errors.cost)}
              >
                {isReadOnly ? (
                  <Box className={classes.textContent}>
                    {formatNumberToCurrency(formik.values.cost)}
                  </Box>
                ) : (
                  <InputCurrency
                    disabled={disabled}
                    placeholder={i18Project('PLH_INPUT_TOTAL_REVENUE')}
                    error={formik.touched.cost && Boolean(formik.errors.cost)}
                    suffix={''}
                    value={formik.values.cost}
                    onChange={(value: any) => {
                      formik.setFieldValue('cost', value ?? '')
                    }}
                  />
                )}
              </FormItem>
            </Box>
            <Box className={clsx(classes.boxFormItem, classes.currencyInput)}>
              <FormItem
                label={i18Project('LB_CURRENCY')}
                className={classes.halfWidth}
                require
              >
                {isReadOnly ? (
                  <Box className={classes.textContent}>
                    {formik.values.currency.label}
                  </Box>
                ) : (
                  <SelectCurrency
                    require
                    disabled={disabled}
                    error={
                      formik.touched.currency?.id &&
                      Boolean(formik.errors.currency?.id)
                    }
                    errorMessage={getErrorObject(formik.errors.currency)}
                    value={formik.values.currency.id ?? ''}
                    onChange={(value: string, option: any) => {
                      updateCurrencyAndRate(option)
                    }}
                  />
                )}
              </FormItem>
              <FormItem
                label={i18Project('LB_RATE')}
                className={classes.halfWidth}
                require
                errorMessage={formik.errors.rate}
                error={formik.touched.rate && Boolean(formik.errors.rate)}
              >
                {isReadOnly ? (
                  <Box className={classes.textContent}>
                    {formatNumberToCurrency(formik.values.rate)}
                  </Box>
                ) : (
                  <InputCurrency
                    disabled={disableRate || disabled}
                    placeholder={i18Project('PLH_INPUT_REVENUE_RATE')}
                    error={formik.touched.rate && Boolean(formik.errors.rate)}
                    suffix={''}
                    value={formik.values.rate}
                    onChange={(value: any) => {
                      formik.setFieldValue('rate', value || '')
                    }}
                  />
                )}
              </FormItem>
            </Box>
            <Box className={classes.boxFormItem}>
              <FormItem
                label={i18Project('LB_NOTE')}
                className={classes.fullWidth}
              >
                {isReadOnly ? (
                  <Box className={clsx(classes.textContent, classes.textArea)}>
                    {formik.values.note}
                  </Box>
                ) : (
                  <InputTextArea
                    disabled={disabled}
                    placeholder={i18Project('PLH_INPUT_NOTE')}
                    defaultValue={formik.values.note}
                    onChange={(e: any) => {
                      formik.setFieldValue('note', e.target.value)
                    }}
                  />
                )}
              </FormItem>
            </Box>
          </Box>
        </Box>
      </form>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    overflow: 'auto',
    maxHeight: '600px',
    overflowX: 'hidden',
    paddingRight: theme.spacing(1),
  },
  flex: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  boxFormItem: {
    display: 'flex',
    paddingBottom: theme.spacing(2),
  },
  fullWidth: {
    padding: theme.spacing(0, 1),
    width: '100%',
  },
  halfWidth: {
    padding: theme.spacing(0, 1),
    width: '50%',
  },
  formItem: {
    width: 'unset !important',
  },
  modalBody: {},
  modalFooter: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    background: theme.color.grey.tertiary,
  },
  buttonCancel: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    color: `${theme.color.black.secondary} !important`,
  },
  btnSubmit: {
    width: 'max-content !important',
  },
  currencyInput: {
    '& .currency-input:disabled': {
      color: '#5d5f60',
    },
  },
  textContent: {
    padding: theme.spacing(0.5, 1.5),
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: theme.spacing(0.5),
    minHeight: theme.spacing(5),
    lineHeight: 1.6,
    display: 'flex',
    alignItems: 'center',
  },
  textArea: {
    height: theme.spacing(19.25),
    minHeight: theme.spacing(19.25),
    overflow: 'auto',
    wordBreak: 'break-word',
    alignItems: 'start !important',
  },
}))

export default ModalAddCost
