import Modal from '@/components/common/Modal'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import SelectCurrency from '@/components/select/SelectCurrency'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import { LangConstant } from '@/const'
import { CURRENCY_CODE } from '@/const/app.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { convertCurrency } from '@/modules/project/utils'
import { IAction, OptionItem } from '@/types'
import { formatDate, formatNumberToCurrency, getArrayMinMax } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'
import {
  INIT_DATA_REVENUE,
  LIST_REVENUE_STATUS,
  TAB_PROJECT_REVENUE_PROJECT,
} from '../const'
import formikConfig from '../pages/project-detail/formik/Formik'
import { ProjectState } from '../types'
interface IModalAddNewRevenueProps {
  open: boolean
  onCreate?: (projectRevenue: IProjectRevenue) => void
  onUpdate?: (projectRevenue: IProjectRevenue, id: string | undefined) => void
  onCloseModal: () => void
  isViewMode: boolean
  id?: string
  projectId?: string
  activeTab?: number
  disabled: boolean
}
export interface IProjectRevenue {
  id?: string
  no?: number
  date: string
  division?: any
  status?: any
  rate: string
  note: string
  currency: any
  actualRevenue?: string | number
  expectedRevenue?: string | number
  action?: IAction[]
}

const ModalAddRevenue = ({
  open,
  onCloseModal,
  onCreate,
  onUpdate,
  isViewMode,
  id,
  projectId,
  activeTab,
  disabled,
}: IModalAddNewRevenueProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const {
    generalInfo,
    projectRevenueDetail,
    projectRevenuesByDivision,
    projectRevenuesByProject,
  }: ProjectState = useSelector(projectSelector)
  const { modalRevenueValidationByDivision, modalRevenueValidationByProject } =
    formikConfig()

  //state
  const [disableRate, setDisableRate] = useState(false)
  const [dateError, setDateError] = useState(false)

  const isTabProject = useMemo(
    () => activeTab === TAB_PROJECT_REVENUE_PROJECT,
    [activeTab]
  )

  const formik = useFormik({
    initialValues: INIT_DATA_REVENUE,
    validationSchema: isTabProject
      ? modalRevenueValidationByProject
      : modalRevenueValidationByDivision,
    onSubmit: (values: IProjectRevenue, actions) => {
      const dataSubmit = cloneDeep(values)
      !open &&
        actions.resetForm({
          values: INIT_DATA_REVENUE,
        })
      if (isViewMode) {
        onUpdate ? onUpdate(dataSubmit, id) : ''
      } else {
        onCreate ? onCreate(dataSubmit) : ''
      }
    },
  })

  const divisions = useMemo(() => {
    return generalInfo ? generalInfo.divisions : []
  }, [generalInfo])

  const isReadOnly = useMemo(() => {
    if (!isViewMode) return false
    if (isViewMode && isTabProject) return false
    return formik.values.division?.id
      ? !divisions.some(div => div.id === formik.values.division?.id)
      : false
  }, [divisions, formik.values.division, isTabProject])

  const revenueStatus = useMemo(() => {
    return LIST_REVENUE_STATUS
  }, [])
  const getErrorObject = (value: any): string => {
    return value?.id
  }
  const handleClose = () => {
    onCloseModal()
    formik.resetForm({
      values: INIT_DATA_REVENUE,
    })
  }
  const fillData = (data: any) => {
    const fields = [
      'division',
      'status',
      'actualRevenue',
      'expectedRevenue',
      'currency',
      'rate',
      'date',
      'note',
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

  //Effect
  useEffect(() => {
    if (isViewMode && open && id) {
      if (isTabProject) {
        const projectRevenue = projectRevenuesByProject.find(
          (item: IProjectRevenue) => item.id === id
        )
        if (projectRevenue) {
          fillData(projectRevenue)
        }
      } else {
        const projectRevenue = projectRevenuesByDivision.find(
          (item: IProjectRevenue) => item.id === id
        )
        if (projectRevenue) {
          fillData(projectRevenue)
        }
      }
    }
  }, [isViewMode, id, open, projectId])

  useEffect(() => {
    if (projectRevenueDetail.id && isViewMode) {
      fillData(projectRevenueDetail)
    }
  }, [projectRevenueDetail, isViewMode, isTabProject])

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        formik.resetForm({
          values: INIT_DATA_REVENUE,
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Modal
      open={open}
      title={i18Project(
        isViewMode ? 'LB_UPDATE_PROJECT_REVENUE' : 'LB_CREATE_PROJECT_REVENUE'
      )}
      labelSubmit={i18(isViewMode ? 'LB_UPDATE' : 'LB_SUBMIT')}
      onClose={handleClose}
      onSubmit={formik.handleSubmit}
      submitDisabled={disabled}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box className={clsx(classes.listFields, 'scrollbar')}>
          <Box className={classes.modalBody}>
            {!isTabProject ? (
              <Box className={clsx(classes.boxFormItem)}>
                <FormItem
                  label={i18Project('LB_DIVISION')}
                  className={classes.halfWidth}
                  require
                >
                  {isReadOnly ? (
                    <Box className={classes.textContent}>
                      {formik.values.division.label}
                    </Box>
                  ) : (
                    <SelectDivisionSingle
                      isDisable={disabled}
                      value={formik.values.division.id}
                      require
                      error={
                        formik.touched.division &&
                        Boolean(formik.errors.division)
                      }
                      isFullData={false}
                      listDivision={divisions}
                      errorMessage={getErrorObject(formik.errors.division)}
                      placeholder={i18Project('PLH_SELECT_DIVISION') || ''}
                      onChange={(value: any) => {
                        if (value) {
                          formik.setFieldValue('division', value)
                        } else {
                          formik.setFieldValue('division', { id: '' })
                        }
                      }}
                    />
                  )}
                </FormItem>
              </Box>
            ) : (
              ''
            )}

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
                  <InputDatepicker
                    isShowClearIcon={!disabled}
                    disabled={disabled}
                    allowedYears={getArrayMinMax(2016, 2099)}
                    inputFormat={'MM/YYYY'}
                    views={['year', 'month']}
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
                    onChange={(value: Date) => {
                      formik.setFieldValue('date', value)
                    }}
                    onError={handleDateError}
                  />
                )}
              </FormItem>
              <FormItem
                className={classes.halfWidth}
                label={i18Project('LB_INPUT_REVENUE_STATUS') ?? ''}
                require
              >
                {isReadOnly ? (
                  <Box className={classes.textContent}>
                    {formik.values.status?.label}
                  </Box>
                ) : (
                  <InputDropdown
                    isDisable={disabled}
                    listOptions={revenueStatus}
                    value={formik.values.status?.id ?? ''}
                    placeholder={i18Project('PLH_SELECT_REVENUE_STATUS') ?? ''}
                    error={
                      formik.touched.status && Boolean(formik.errors?.status)
                    }
                    errorMessage={getErrorObject(formik.errors?.status)}
                    onChange={(
                      value: string,
                      option: OptionItem | undefined
                    ) => {
                      formik.setFieldValue('status', {
                        id: option?.id?.toString() ?? '',
                        label: option?.label ?? '',
                      })
                    }}
                  />
                )}
              </FormItem>
            </Box>
            <Box className={classes.boxFormItem}>
              <FormItem
                label={i18Project('LB_EXPECTED_REVENUE')}
                className={classes.halfWidth}
                require
                errorMessage={formik.errors.expectedRevenue}
                error={
                  formik.touched.expectedRevenue &&
                  Boolean(formik.errors.expectedRevenue)
                }
              >
                {isReadOnly ? (
                  <Box className={classes.textContent}>
                    {formatNumberToCurrency(formik.values.expectedRevenue)}
                  </Box>
                ) : (
                  <InputCurrency
                    disabled={disabled}
                    placeholder={i18Project('PLH_INPUT_TOTAL_REVENUE')}
                    error={
                      formik.touched.expectedRevenue &&
                      Boolean(formik.errors.expectedRevenue)
                    }
                    suffix={''}
                    value={formik.values.expectedRevenue}
                    onChange={(value: any) => {
                      formik.setFieldValue('expectedRevenue', value ?? '')
                    }}
                  />
                )}
              </FormItem>
              <FormItem
                label={i18Project('LB_ACTUAL_REVENUE')}
                className={classes.halfWidth}
                require
                errorMessage={formik.errors.actualRevenue}
                error={
                  formik.touched.actualRevenue &&
                  Boolean(formik.errors.actualRevenue)
                }
              >
                {isReadOnly ? (
                  <Box className={classes.textContent}>
                    {formatNumberToCurrency(formik.values.actualRevenue)}
                  </Box>
                ) : (
                  <InputCurrency
                    disabled={disabled}
                    placeholder={i18Project('PLH_INPUT_TOTAL_REVENUE')}
                    error={
                      formik.touched.actualRevenue &&
                      Boolean(formik.errors.actualRevenue)
                    }
                    suffix={''}
                    value={formik.values.actualRevenue}
                    onChange={(value: any) => {
                      formik.setFieldValue('actualRevenue', value ?? '')
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
                    {formik.values.currency?.label || ''}
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
                      formik.setFieldValue('rate', value)
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
                    {formik.values.expectedRevenue}
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
    width: '100%',
    padding: theme.spacing(0, 1),
  },
  halfWidth: {
    width: '50%',
    padding: theme.spacing(0, 1),
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

export default ModalAddRevenue
