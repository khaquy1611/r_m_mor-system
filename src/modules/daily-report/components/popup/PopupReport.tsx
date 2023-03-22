import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import CommonButton from '@/components/buttons/CommonButton'
import Modal from '@/components/common/Modal'
import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputAutocompleteSingle from '@/components/inputs/InputAutocompleteSingle'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputTextArea from '@/components/inputs/InputTextArea'
import ModalConfirm from '@/components/modal/ModalConfirm'
import SelectStaff from '@/components/select/SelectStaff'
import { LangConstant } from '@/const'
import { selectAuth } from '@/reducer/auth'
import { commonSelector, getProjectManagers } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import { formatDate, sortAtoZChartArray, uuid } from '@/utils'
import { DeleteRounded } from '@mui/icons-material'
import { Box, Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { cloneDeep, isEmpty } from 'lodash'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { REPORT_STATUS } from '../../const'
import useValidateReportSchema from '../../hooks/useValidateReportSchema'
import {
  dailyReportSelector,
  getDailyReportDetail,
} from '../../reducer/dailyReport'
import { IReport, ReportStatus } from '../../types'

interface ProjectReport {
  id: string
  projectId: string
  workingHours: string
  workingDescription: string
  impediment?: string
  suggestionForImprovement?: string
}

export interface IReportState {
  reportDate: number | Date | null
  projects: Array<ProjectReport>
  improvement?: string
  dailyReportId: string
  status: { id: ReportStatus; name: string } | null
  projectManager?: OptionItem
  note: string
}

const initialState: IReportState = {
  reportDate: null,
  dailyReportId: '',
  status: null,
  note: '',
  projectManager: {},
  projects: [
    {
      id: uuid(),
      projectId: '',
      workingHours: '',
      workingDescription: '',
    },
  ],
}

interface IProps {
  reportDate: number
  currentReportDate: Date
  open: boolean
  onClose: () => void
  report: IReport | null
  isShowAndUpdate: boolean
  onSubmit: (values: IReportState, isNoClose?: boolean) => void
  onDelete: (values: IReportState) => void
}

function PopupReport({
  reportDate,
  currentReportDate,
  open,
  onClose,
  report,
  isShowAndUpdate,
  onSubmit,
  onDelete,
}: IProps) {
  const classes = useStyles()
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const dispatch = useDispatch<AppDispatch>()

  const [initialReport, setInitialReport] = useState<IReportState>({
    ...initialState,
    reportDate,
  })
  const [openPopupConfirm, setOpenPopupConfirm] = useState(false)
  const [isDeleteReport, setIsDeleteReport] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState<any>('')
  const [oldDate, setOldDate] = useState<any>()
  const [reportTemp, setReportTemp] = useState<IReport>()
  const [validateReason, setValidateReason] = useState(false)

  const { projectStaffs } = useSelector(commonSelector)
  const { reports, staffInfo } = useSelector(dailyReportSelector)
  const { staff } = useSelector(selectAuth)

  const checkReportStatus = (reportStatus: ReportStatus) => {
    return Boolean(
      initialReport.status && initialReport.status.id === reportStatus
    )
  }
  // formik
  const { reportValidateSchema, noReportValidateSchema } =
    useValidateReportSchema()
  const {
    values: formikValues,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    setTouched,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialReport,
    validationSchema:
      moment(new Date()).diff(initialReport.reportDate, 'days') > 1
        ? noReportValidateSchema
        : reportValidateSchema,
    onSubmit: values => {
      checkShowMessageConfirm(values)
    },
  })

  const isPass48h = useMemo(
    () => moment(new Date()).diff(formikValues.reportDate, 'days') > 1,
    [formikValues.reportDate]
  )

  const projectErrors: any = useMemo(() => errors['projects'] || [], [errors])

  const projectTouched: any = useMemo(
    () => touched['projects'] || [],
    [touched]
  )
  const isUpdate = useMemo(() => {
    return (
      isPass48h &&
      (formikValues.status?.id === REPORT_STATUS.HOLIDAY_BREAK ||
        formikValues.status?.id === REPORT_STATUS.DAY_OFF ||
        formikValues.status?.id === REPORT_STATUS.NO_REPORT ||
        formikValues.status === null)
    )
  }, [formikValues])
  const isViewReportDetail = useMemo(() => {
    return !!initialReport?.dailyReportId
  }, [initialReport])
  const isDisabledBtnSubmit = useMemo(() => {
    return (
      !!initialReport?.dailyReportId &&
      JSON.stringify(Object.values(formikValues)) ===
        JSON.stringify(Object.values(initialReport))
    )
  }, [formikValues])

  const checkShowMessageConfirm = (_report: IReportState) => {
    if (_report?.status?.id === REPORT_STATUS.DAY_OFF) {
      setOpenPopupConfirm(true)
      setConfirmMessage(
        isPass48h
          ? i18nDailyReport('MSG_UPDATE_DAILY_REPORT_PASS48H')
          : i18nDailyReport('MSG_CONFIRM_UPDATE_HAS_DATA', {
              date: formatDate(_report.reportDate ?? 0),
            })
      )
    } else if (_report?.status?.id === REPORT_STATUS.HOLIDAY_BREAK) {
      setOpenPopupConfirm(true)
      setConfirmMessage(
        isPass48h
          ? i18nDailyReport('MSG_UPDATE_DAILY_REPORT_PASS48H')
          : i18nDailyReport('MSG_CONFIRM_UPDATE_HOLIDAY_BREAK', {
              date: formatDate(_report.reportDate ?? 0),
            })
      )
    } else if (
      _report?.status?.id === REPORT_STATUS.REPORT ||
      _report?.status?.id === REPORT_STATUS.LATE_REPORT
    ) {
      setOpenPopupConfirm(true)
      setConfirmMessage(
        isPass48h
          ? i18nDailyReport('MSG_UPDATE_DAILY_REPORT_PASS48H')
          : i18nDailyReport('MSG_CONFIRM_UPDATE_HAS_DATA', {
              date: formatDate(_report.reportDate ?? 0),
            })
      )
    } else if (
      _report?.status === null ||
      _report?.status?.id === REPORT_STATUS.NO_REPORT
    ) {
      setOpenPopupConfirm(true)
      isPass48h
        ? setConfirmMessage(i18nDailyReport('MSG_UPDATE_DAILY_REPORT_PASS48H'))
        : handleSubmitConfirm()
    }
  }

  const convertIReportToIReportState = (_report: IReport | null) => {
    if (!_report) return initialState
    return {
      dailyReportId: _report.dailyReportId,
      status: _report.status,
      reportDate: _report.reportDate,
      note: _report.note ?? '',
      projectManager: undefined,
      projects:
        _report.dailyReportDetails?.length > 0
          ? _report.dailyReportDetails.map((event: any) => ({
              id: event.id,
              workingHours: event.workingHours,
              projectId: event.project.id,
              workingDescription: event.workingDescription,
              ...(!!event.improvement ? { impediment: event.improvement } : {}),
              ...(!!event.suggestionForImprovement
                ? { suggestionForImprovement: event.suggestionForImprovement }
                : {}),
            }))
          : initialState.projects,
      ...(!!_report.improvement ? { improvement: _report.improvement } : {}),
    }
  }

  const handleSetInitialReport = (_report: IReport | null) => {
    if (!_report || !_report.dailyReportId)
      return setInitialReport({
        ...initialState,
        reportDate: !!_report ? _report.reportDate : reportDate,
        status: _report?.status ?? null,
      })
    setInitialReport(convertIReportToIReportState(_report))
  }

  const filterProjectStaffs = (projectId: string) => {
    const result = projectStaffs.filter(
      (projectStaff: OptionItem) =>
        projectStaff.value?.toString() === projectId.toString() ||
        formikValues.projects.every(
          project =>
            project.projectId.toString() !== projectStaff.value?.toString()
        )
    )
    return sortAtoZChartArray(result)
  }

  const handleChangeProjectReport = (
    reportIndex: number,
    keyName: keyof ProjectReport,
    value: any
  ) => {
    const _report = cloneDeep(formikValues)
    _report.projects[reportIndex][keyName] = value
    setFieldValue('projects', _report.projects)
  }

  const handleFieldChange = (value: any, keyName: string) => {
    setFieldValue(keyName, value)
  }

  const handleChangeReportDate = (date: Date | null) => {
    if (!date) return
    const isDifferentCurrentMonth = !moment(date).isSame(
      currentReportDate,
      'month'
    )
    if (isDifferentCurrentMonth) {
      if (!staffInfo?.id) return
      dispatch(
        getDailyReportDetail({
          staffId: staffInfo?.id,
          date: date?.getTime(),
        })
      ).then((res: any) => {
        const _resReport = res?.payload?.data
        handleSetInitialReport(_resReport)
        setReportTemp(_resReport)
      })
    } else {
      const _report = reports.find(report =>
        moment(report.reportDate).isSame(date, 'day')
      )
      if (!!_report) {
        handleSetInitialReport(_report)
        setReportTemp(_report)
      }
    }
    setOldDate(formikValues?.reportDate)
    handleFieldChange(date, 'reportDate')
  }

  const handleAddProjectWorking = () => {
    const _report = cloneDeep(formikValues)
    _report.projects.push({
      id: uuid(),
      projectId: '',
      workingHours: '',
      workingDescription: '',
    })
    setFieldValue('projects', _report.projects)
  }

  const handleAddImprovement = () => {
    const _report = cloneDeep(formikValues)
    _report.improvement = ''
    setFieldValue('improvement', _report.improvement)
  }

  const handleDeleteProjectReport = (reportId: string) => {
    if (!reportId) return
    const _report = cloneDeep(formikValues)
    const reportIndex = _report.projects.findIndex(
      (report: ProjectReport) => report.id === reportId
    )
    if (reportIndex < 0) return
    _report.projects.splice(reportIndex, 1)
    setFieldValue('projects', _report.projects)
    setTouched({})
  }

  const handleClickDayOff = () => {
    onSubmit({
      ...formikValues,
      projects: [],
      improvement: '',
      status: {
        id: REPORT_STATUS.DAY_OFF,
        name: 'DAY_OFF',
      },
    })
  }

  const handleCloseModalConfirm = () => {
    setOpenPopupConfirm(false)
  }

  const handleSubmitConfirm = () => {
    let payload = cloneDeep(formikValues)
    if (isDeleteReport) {
      onDelete(payload)
      setIsDeleteReport(false)
    } else {
      payload.reportDate = new Date(oldDate).getTime()
      if (reportTemp) {
        setOpenPopupConfirm(false)
        if (reportTemp?.status?.id === REPORT_STATUS.DAY_OFF) {
          payload.status = {
            id: REPORT_STATUS.REPORT,
            name: 'REPORT',
          }
          payload.improvement = ''
        }
        payload.reportDate = new Date(reportTemp.reportDate).getTime()
        handleSetInitialReport(reportTemp)
        handleFieldChange(
          new Date(reportTemp.reportDate).getTime(),
          'reportDate'
        )
        onSubmit(payload)
      }
    }
  }

  const handleDeleteReport = () => {
    setIsDeleteReport(true)
    setOpenPopupConfirm(true)
    setConfirmMessage(i18nDailyReport('MSG_DELETE_REPORT'))
  }

  const handleStaffChange = (value: OptionItem) => {
    setFieldValue('projectManager', value)
  }

  useEffect(() => {
    handleSetInitialReport(report)
    formikValues.reportDate &&
      handleChangeReportDate(new Date(formikValues.reportDate))
  }, [report])

  const getErrorObject = (value: any): string => {
    return value?.id
  }

  return (
    <Modal
      open={open}
      title={
        isViewReportDetail
          ? `${i18nDailyReport('LB_REPORT_DATE')}: ${formatDate(
              formikValues.reportDate ?? 0
            )}`
          : i18nDailyReport('TXT_REPORT_FORM')
      }
      onClose={onClose}
      onSubmit={() => {}}
      width={1060}
      hideFooter={true}
    >
      <ModalConfirm
        title={i18nDailyReport('TXT_CONFIRMATION')}
        titleSubmit={'CONFIRM'}
        labelButtonCustom={''}
        description={confirmMessage}
        open={openPopupConfirm}
        isButtonCustom={false}
        onClose={handleCloseModalConfirm}
        onSubmit={handleSubmitConfirm}
      />

      <form onSubmit={handleSubmit} className={classes.formWrapper}>
        <Box className={classes.modalContent}>
          <Box className="space-between-root report-date">
            <ConditionalRender
              conditional={
                !report?.dailyReportId &&
                !(
                  report?.status?.id === REPORT_STATUS.HOLIDAY_BREAK ||
                  report?.status?.id === REPORT_STATUS.DAY_OFF
                ) &&
                isShowAndUpdate
              }
              fallback={<Box />}
            >
              <FormItem label={i18nDailyReport('LB_REPORT_DATE')} require>
                <InputDatepicker
                  width={284}
                  minDate={new Date('1-1-2016')}
                  error={touched.reportDate && !!errors.reportDate}
                  errorMessage={errors.reportDate}
                  value={formikValues.reportDate}
                  isShowClearIcon={false}
                  onChange={handleChangeReportDate}
                />
              </FormItem>
            </ConditionalRender>
            {!checkReportStatus(REPORT_STATUS.DAY_OFF) &&
              !checkReportStatus(REPORT_STATUS.HOLIDAY_BREAK) &&
              !isPass48h &&
              isShowAndUpdate && (
                <CommonButton
                  className="btn btn-submit"
                  color="success"
                  width={80}
                  onClick={handleClickDayOff}
                >
                  {i18nDailyReport('TXT_DAY_OFF')}
                </CommonButton>
              )}
          </Box>

          {formikValues.projects.map(
            (projectReport: ProjectReport, index: number) => (
              <Box className="form-wrapper" key={projectReport.id}>
                <FormLayout gap={24}>
                  <FormItem
                    require
                    label={i18nDailyReport('LB_SELECT_PROJECT')}
                  >
                    <InputAutocompleteSingle
                      width={'100%'}
                      listOptions={filterProjectStaffs(projectReport.projectId)}
                      placeholder={i18nDailyReport('PLH_SELECT_PROJECT')}
                      value={projectReport.projectId}
                      onChange={(value: any) =>
                        handleChangeProjectReport(index, 'projectId', value)
                      }
                      error={
                        !!projectErrors[index]?.projectId &&
                        !!projectTouched[index]?.projectId
                      }
                      errorMessage={projectErrors[index]?.projectId}
                    />
                  </FormItem>

                  <FormItem
                    require
                    label={i18nDailyReport('LB_WORKING_HOURS')}
                    error={
                      !!projectErrors[index]?.workingHours &&
                      !!projectTouched[index]?.workingHours
                    }
                    errorMessage={projectErrors[index]?.workingHours}
                  >
                    <InputCurrency
                      suffix=""
                      error={
                        !!projectErrors[index]?.workingHours &&
                        !!projectTouched[index]?.workingHours
                      }
                      placeholder={i18nDailyReport('PLH_WORKING_HOURS')}
                      value={projectReport.workingHours}
                      onChange={(value?: string) =>
                        handleChangeProjectReport(index, 'workingHours', value)
                      }
                    />
                  </FormItem>
                </FormLayout>

                <FormLayout top={24}>
                  <InputTextArea
                    label={i18nDailyReport('LB_WORKING_DESCRIPTION') as string}
                    placeholder={i18nDailyReport('PLH_WORKING_DESCRIPTION')}
                    height={80}
                    defaultValue={projectReport.workingDescription}
                    onChange={(event: EventInput) =>
                      handleChangeProjectReport(
                        index,
                        'workingDescription',
                        event.target.value
                      )
                    }
                  />
                </FormLayout>

                <FormLayout top={24}>
                  <ConditionalRender
                    conditional={
                      projectReport.hasOwnProperty('impediment') ||
                      !isShowAndUpdate
                    }
                    fallback={
                      <ButtonAddPlus
                        label={i18nDailyReport('TXT_ADD_IMPEDIMENT')}
                        onClick={() =>
                          handleChangeProjectReport(index, 'impediment', '')
                        }
                      />
                    }
                  >
                    <InputTextArea
                      label={i18nDailyReport('LB_IMPEDIMENT') as string}
                      placeholder={i18nDailyReport('PLH_WORKING_DESCRIPTION')}
                      height={80}
                      defaultValue={projectReport.impediment ?? ''}
                      onChange={(event: EventInput) =>
                        handleChangeProjectReport(
                          index,
                          'impediment',
                          event.target.value
                        )
                      }
                    />
                  </ConditionalRender>
                </FormLayout>

                <FormLayout top={24}>
                  <ConditionalRender
                    conditional={
                      projectReport.hasOwnProperty(
                        'suggestionForImprovement'
                      ) || !isShowAndUpdate
                    }
                    fallback={
                      <ButtonAddPlus
                        label={i18nDailyReport(
                          'TXT_ADD_SUGGESTION_IMPROVEMENT'
                        )}
                        onClick={() =>
                          handleChangeProjectReport(
                            index,
                            'suggestionForImprovement',
                            ''
                          )
                        }
                      />
                    }
                  >
                    <InputTextArea
                      label={
                        i18nDailyReport(
                          'LB_SUGGESTION_FOR_IMPROVEMENT'
                        ) as string
                      }
                      placeholder={i18nDailyReport(
                        'PLH_SUGGESTION_FOR_IMPROVEMENT'
                      )}
                      height={80}
                      defaultValue={
                        projectReport.suggestionForImprovement ?? ''
                      }
                      onChange={(event: EventInput) =>
                        handleChangeProjectReport(
                          index,
                          'suggestionForImprovement',
                          event.target.value
                        )
                      }
                    />
                  </ConditionalRender>
                </FormLayout>

                <ConditionalRender
                  conditional={
                    formikValues.projects.length > 1 && isShowAndUpdate
                  }
                >
                  <FormLayout top={24}>
                    <DeleteRounded
                      className="btn-delete"
                      data-title="button"
                      onClick={() =>
                        handleDeleteProjectReport(projectReport.id)
                      }
                    />
                  </FormLayout>
                </ConditionalRender>
              </Box>
            )
          )}

          <ConditionalRender conditional={formikValues.projects.length < 10}>
            <FormLayout top={24}>
              {isShowAndUpdate && (
                <ButtonAddPlus
                  label={i18nDailyReport('TXT_ADD_PROJECT_WORKING_HOURS')}
                  onClick={handleAddProjectWorking}
                />
              )}
            </FormLayout>
          </ConditionalRender>
          <FormLayout top={24}>
            <ConditionalRender
              conditional={
                formikValues.hasOwnProperty('improvement') || !isShowAndUpdate
              }
              fallback={
                <ButtonAddPlus
                  textTransform="initial"
                  label={i18nDailyReport('TXT_15_MINUTES_IMPROVEMENT')}
                  onClick={handleAddImprovement}
                />
              }
            >
              <InputTextArea
                label={i18nDailyReport('TXT_15_MINUTES_IMPROVEMENT') as string}
                placeholder={i18nDailyReport('PLH_SUGGESTION_FOR_IMPROVEMENT')}
                height={80}
                defaultValue={formikValues.improvement}
                onChange={(event: EventInput) =>
                  handleFieldChange(event.target.value, 'improvement')
                }
              />
            </ConditionalRender>
          </FormLayout>
          <FormLayout top={24}>
            <FormItem>
              {isPass48h && (
                <SelectStaff
                  label={i18nDailyReport('LB_APPROVER')}
                  placeholder={i18nDailyReport('PLH_SELECT_APPROVER') as string}
                  width={300}
                  require
                  isDesEmailAndPosition
                  blockStaff={staff?.id ?? ''}
                  callback={getProjectManagers}
                  error={
                    touched.projectManager &&
                    !Boolean(formikValues.projectManager?.id)
                  }
                  errorMessage={getErrorObject(errors.projectManager)}
                  value={formikValues.projectManager ?? {}}
                  onChange={handleStaffChange}
                />
              )}
            </FormItem>
          </FormLayout>
          <ConditionalRender conditional={isPass48h}>
            <FormLayout top={24}>
              <InputTextArea
                label={i18nDailyReport('LB_REASON_FOR_LATE') as string}
                placeholder={i18nDailyReport('PLH_REASON_FOR_LATE')}
                height={80}
                require
                defaultValue={formikValues.note}
                error={
                  (!!errors.note && touched.note) ||
                  (validateReason && isPass48h && isEmpty(formikValues.note))
                }
                errorMessage={
                  validateReason && isPass48h && isEmpty(formikValues.note)
                    ? (i18nCommon('MSG_INPUT_REQUIRE', {
                        name: i18nDailyReport('LB_REASON_FOR_LATE'),
                      }) as string)
                    : errors.note
                }
                onChange={(event: EventInput) =>
                  handleFieldChange(event.target.value, 'note')
                }
              />
            </FormLayout>
          </ConditionalRender>
        </Box>

        {isShowAndUpdate && (
          <Box className={classes.modalFooter}>
            {isViewReportDetail && !isPass48h && (
              <Button
                variant="contained"
                className="btn btn-cancel"
                color="error"
                onClick={handleDeleteReport}
              >
                {i18nDailyReport('TXT_CANCEL_REPORT')}
              </Button>
            )}
            <CommonButton
              color="primary"
              variant="contained"
              className="btn btn-submit"
              type="submit"
              disabled={isDisabledBtnSubmit}
            >
              {isUpdate
                ? i18nCommon('LB_UPDATE')
                : !isViewReportDetail
                ? i18nCommon('LB_SUBMIT')
                : i18nCommon('LB_UPDATE')}
            </CommonButton>
          </Box>
        )}
      </form>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  formWrapper: {
    '& .btn': {
      width: 'max-content !important',
      flexShrink: 0,
      height: '100%',
    },
  },
  modalContent: {
    marginBottom: theme.spacing(10),

    '& .report-date': {
      fontWeight: 700,
      paddingBottom: theme.spacing(2),
    },

    '& .btn-redirect': {
      textTransform: 'capitalize',
    },

    '& .form-wrapper': {
      padding: theme.spacing(2),
      border: `1px solid ${theme.color.grey.secondary}`,
      borderRadius: theme.spacing(0.5),

      '&:nth-child(n + 3)': {
        marginTop: theme.spacing(3),
      },

      '& .btn-delete': {
        cursor: 'pointer',
        marginLeft: 'auto',
        color: theme.color.black.secondary,
        textTransform: 'capitalize',
        fontWeight: 400,
      },
    },
  },
  modalFooter: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    background: theme.color.grey.tertiary,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    '& .btn-back': {
      marginRight: 'auto',
      textTransform: 'capitalize',
    },

    '& .btn-submit': {
      width: 'max-content !important',
    },
  },
}))

export default PopupReport
