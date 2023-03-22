import Modal from '@/components/common/Modal'
import InputDateFns from '@/components/Datepicker/InputDateFns'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectMultiplePosition from '@/components/select/SelectMultiplePosition'
import SelectStaff from '@/components/select/SelectStaff'
import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { EventInput, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import formikConfig from '../pages/project-detail/formik/Formik'
import { IStaff } from './HeadCount/TableAssignStaff'

interface IProps {
  open: boolean
  onCloseModal: () => void
  isProjectDetail: boolean
  flagTriggerGetListStaff: boolean
  isAssignNewStaff: boolean
  dataStaff: IStaff
  disabled: boolean
  onSubmit: (assignStaff: any, isAssignNewStaff: boolean) => void
}

const initialValues = {
  id: '',
  staffId: '',
  staffCode: '',
  staffName: '',
  branch: {},
  division: {},
  position: {},
  assignStartDate: null,
  assignEndDate: null,
  projectHeadcount: '',
  role: '',
}

const ModalAddAssignStaff = ({
  open,
  onCloseModal,
  isProjectDetail,
  flagTriggerGetListStaff,
  isAssignNewStaff,
  dataStaff,
  onSubmit,
  disabled,
}: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { modalAssignStaffValidation } = formikConfig()
  const { generalInfo } = useSelector(projectSelector)
  const { startDate, endDate, divisions } = generalInfo

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: modalAssignStaffValidation,
    onSubmit: (values: any, actions) => {
      if (startDateError || endDateError) return
      !open &&
        actions.resetForm({
          values: initialValues,
        })
      onSubmit(values, isAssignNewStaff)
    },
  })

  //state
  const [startDateError, setStartDateError] = useState(false)
  const [endDateError, setEndDateError] = useState(false)
  const [position, setPosition] = useState<OptionItem[]>([])
  const [staff, setStaff] = useState<any>({})

  const divisionIds = useMemo(() => {
    return divisions.map((division: OptionItem) => String(division.value))
  }, [divisions])

  const compareStartDateWithEndDate = useMemo(() => {
    if (!formik.values.assignStartDate || !formik.values.assignEndDate)
      return false
    return formik.values.assignStartDate > formik.values.assignEndDate
  }, [formik.values.assignStartDate, formik.values.assignEndDate])

  const startDateErrorMessage = useMemo(() => {
    if (startDateError || endDateError) {
      if (
        formik.values.assignStartDate &&
        formik.values.assignEndDate &&
        formik.values.assignStartDate > formik.values.assignEndDate
      ) {
        return i18nProject('MSG_INVALID_START_DATE_RANGE') as string
      } else {
        return i18nProject('MSG_PROJECT_START_DATE_INVALID') as string
      }
    } else {
      return !!formik.touched.assignStartDate
        ? (formik.errors.assignStartDate as string)
        : ''
    }
  }, [
    startDateError,
    formik.touched.assignStartDate,
    formik.errors.assignStartDate,
    formik.values.assignStartDate,
    formik.values.assignEndDate,
  ])

  const querySelectStaff = useMemo(() => {
    return {
      divisionIds: divisionIds,
      positionIds: position.map((position: any) => position.id),
    }
  }, [divisionIds, position, flagTriggerGetListStaff])

  const handleClose = () => {
    onCloseModal()
  }

  const handleStartDateChange = useCallback((value: Date | null) => {
    formik.setFieldValue('assignStartDate', value)
  }, [])

  const handleEndDateChange = useCallback((value: Date | null) => {
    formik.setFieldValue('assignEndDate', value)
  }, [])

  const handleProjectHeadcountChange = useCallback((value?: string) => {
    formik.setFieldValue('projectHeadcount', value ?? '')
  }, [])

  const handleInputChange = useCallback((event: EventInput) => {
    formik.setFieldValue('role', event.target.value ?? '')
  }, [])

  const handlePositionChange = useCallback((value: OptionItem[]) => {
    setPosition(value)
  }, [])

  const handleStaffChange = useCallback((value: OptionItem) => {
    setStaff(value)
  }, [])

  const fillDataDetail = () => {
    const values = {
      id: dataStaff?.id || '',
      staffId: dataStaff?.staffId || '',
      staffCode: dataStaff?.staffCode || '',
      staffName: dataStaff?.staffName || '',
      branch: dataStaff?.branch || {},
      division: dataStaff?.division || {},
      position: dataStaff.position || {},
      assignStartDate: dataStaff.assignStartDate || null,
      assignEndDate: dataStaff?.assignEndDate || null,
      projectHeadcount: dataStaff?.projectHeadcount || '',
      role: dataStaff?.role || '',
    }
    formik.setValues(values)
  }

  const fillStaffSelected = () => {
    const values = {
      id: staff.id || '',
      staffId: staff.id || '',
      staffCode: staff.code || '',
      staffName: staff.name || '',
      branch: staff.branch || {},
      division: staff.division || {},
      position: staff.position || {},
      assignStartDate: formik.values.assignStartDate || null,
      assignEndDate: formik.values.assignStartDate || null,
      projectHeadcount: formik.values.projectHeadcount || '',
      role: formik.values.role || '',
    }
    formik.setValues(values)
  }

  useEffect(() => {
    if (!isAssignNewStaff) {
      fillDataDetail()
    }
  }, [dataStaff.id])

  useEffect(() => {
    if (isAssignNewStaff) {
      fillStaffSelected()
    }
  }, [staff])

  return (
    <Modal
      hideFooter={disabled}
      width={500}
      open={open}
      title={i18nProject(
        isProjectDetail
          ? 'TXT_UPDATE_PROJECT_STAFF_HEADCOUNT'
          : 'TXT_CREATE_PROJECT_STAFF_HEADCOUNT'
      )}
      onClose={handleClose}
      onSubmit={formik.handleSubmit}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box className={clsx(classes.listFields, 'scrollbar')}>
          {isAssignNewStaff && (
            <Fragment>
              <SelectMultiplePosition
                maxLength={10}
                width={'100%'}
                value={position}
                label={i18('LB_POSITION') as string}
                placeholder={i18('PLH_SELECT_POSITION')}
                onChange={handlePositionChange}
                divisionIds={divisionIds}
              />
              <FormLayout top={24}>
                <SelectStaff
                  require
                  error={!!formik.touched.id && !!formik.errors.id}
                  errorMessage={formik.errors.id as string}
                  isShowEffortUsed
                  label={i18('LB_STAFF')}
                  placeholder={i18('PLH_SELECT_STAFF') as string}
                  value={staff}
                  onChange={handleStaffChange}
                  queries={querySelectStaff}
                  customZIndex
                />
              </FormLayout>
            </Fragment>
          )}

          {((isAssignNewStaff && staff.id) || !isAssignNewStaff) && (
            <Fragment>
              <FormLayout gap={24} top={isAssignNewStaff ? 24 : 0}>
                <FormItem label={i18nProject('LB_STAFF_CODE')}>
                  <Box className="text__content">{formik.values.staffCode}</Box>
                </FormItem>
                <FormItem label={i18('LB_STAFF_NAME')}>
                  <Box className="text__content">{formik.values.staffName}</Box>
                </FormItem>
              </FormLayout>

              <FormLayout top={24} gap={24}>
                <FormItem label={i18nProject('LB_BRANCH')}>
                  <Box className="text__content">
                    {formik.values.branch.name ?? ''}
                  </Box>
                </FormItem>
                <FormItem label={i18nProject('LB_DIVISION')}>
                  <Box className="text__content">
                    {formik.values.division.name ?? ''}
                  </Box>
                </FormItem>
              </FormLayout>
            </Fragment>
          )}
          <FormLayout gap={24} top={24}>
            <FormItem
              require
              label={i18nProject('LB_PROJECT_STAFF_HEADCOUNT')}
              error={
                formik.touched.projectHeadcount &&
                !!formik.errors.projectHeadcount
              }
              errorMessage={
                formik.touched.projectHeadcount
                  ? (formik.errors.projectHeadcount as string)
                  : ''
              }
            >
              <InputCurrency
                suffix="%"
                disabled={disabled}
                maxLength={5}
                placeholder={'E.g: 80%'}
                value={formik.values.projectHeadcount}
                onChange={handleProjectHeadcountChange}
                error={
                  formik.touched.projectHeadcount &&
                  !!formik.errors.projectHeadcount
                }
              />
            </FormItem>

            <InputTextLabel
              require
              disabled={disabled}
              name="role"
              label={i18nProject('LB_ROLE')}
              placeholder={'Input Role'}
              value={formik.values.role}
              onChange={handleInputChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              errorMessage={
                formik.touched.role ? (formik.errors.role as string) : ''
              }
            />
          </FormLayout>
          <FormLayout gap={24} top={24}>
            <InputDateFns
              require
              isShowClearIcon={!disabled}
              disabled={disabled}
              defaultCalendarMonth={startDate}
              label={i18nProject('LB_ASSIGN_START_DATE')}
              minDate={startDate}
              maxDate={formik.values.assignEndDate}
              value={formik.values.assignStartDate}
              onChange={handleStartDateChange}
              error={
                (formik.touched.assignStartDate &&
                  Boolean(formik.errors.assignStartDate)) ||
                startDateError
              }
              errorMessage={startDateErrorMessage}
              onError={(error: string | null) => setStartDateError(!!error)}
            />

            <InputDateFns
              require
              isShowClearIcon={!disabled}
              disabled={disabled}
              defaultCalendarMonth={endDate}
              label={i18nProject('LB_ASSIGN_END_DATE')}
              error={
                (formik.touched.assignEndDate &&
                  Boolean(formik.errors.assignEndDate)) ||
                endDateError
              }
              errorMessage={
                endDateError
                  ? compareStartDateWithEndDate
                    ? ''
                    : (i18nProject('MSG_ASSIGN_END_DATE_INVALID') as string)
                  : !!formik.touched.assignEndDate
                  ? (formik.errors.assignEndDate as string)
                  : ''
              }
              minDate={formik.values.assignStartDate}
              maxDate={endDate}
              value={formik.values.assignEndDate}
              onChange={handleEndDateChange}
              onError={(error: string | null) => setEndDateError(!!error)}
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
    paddingRight: theme.spacing(1),
    '& .text__content': {
      padding: theme.spacing(1.5),
      border: `1px solid ${theme.color.grey.secondary}`,
      borderRadius: theme.spacing(0.5),
      minHeight: theme.spacing(5),
    },

    '& .value-single': {
      maxWidth: '100% !important',
    },
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
  modalBody: {
    padding: theme.spacing(3),
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
}))

export default ModalAddAssignStaff
