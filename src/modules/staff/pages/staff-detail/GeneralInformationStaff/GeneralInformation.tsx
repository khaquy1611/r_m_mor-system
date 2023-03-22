import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import SelectGrade from '@/components/select/SelectGrade'
import SelectGradeTitle from '@/components/select/SelectGradeTitle'
import SelectLeaderGrade from '@/components/select/SelectLeaderGrade'
import SelectLeaderGradeTitle from '@/components/select/SelectLeaderGradeTitle'
import SelectPosition from '@/components/select/SelectPosition'
import SelectStaff from '@/components/select/SelectStaff'
import { LangConstant } from '@/const'
import { genders, jobType, status } from '@/modules/staff/const'
import { useStaffDetailContext } from '@/modules/staff/context/StaffDetailContext'
import { staffSelector } from '@/modules/staff/reducer/staff'
import { StaffState } from '@/modules/staff/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { getDirectManager } from '@/reducer/common'
import { scrollToTop } from '@/utils'
import { BorderColor, Cancel, Save } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'
import GeneralInformationStaffDetail from '../GeneralInformationStaffDetail'

const GeneralInformation = () => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const { generalInfoStaff }: StaffState = useSelector(staffSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const {
    handleShowModalCancelUpdateInformation,
    handleShowModalEditInformation,
    handleLeaderGradeTitleChange,
    handleGradeTitleChange,
    handleLeaderGradeChange,
    handleGradeChange,
    handleDirectManagerChange,
    handleSelectPosition,
    handleDivisionChange,
    handleBranchChange,
    handleChangeDate,
    handleDateOnBoardError,
    handleBirthDayError,
    handleSelectChange,
    handleInputChange,
    birthDayError,
    dateOnBoardError,
    showEditInformation,
    isViewDetail,
    isDisabledButtonSubmit,
    DATE_FORMAT,
    formik,
  } = useStaffDetailContext()

  useEffect(() => {
    if (generalInfoStaff.code) {
      scrollToTop()
    }
  }, [generalInfoStaff])

  return (
    <>
      <ConditionalRender conditional={showEditInformation || !isViewDetail}>
        <CardForm
          title={i18('TXT_GENERAL_INFORMATION') as string}
          childCompEnd={
            isViewDetail ? (
              <Box style={{ display: 'flex', gap: '5px' }}>
                <Box
                  className={clsx(
                    classes.buttonIcon,
                    isDisabledButtonSubmit ? 'disable' : 'active'
                  )}
                  onClick={formik.handleSubmit}
                >
                  <Save />
                </Box>
                <Box
                  className={clsx(classes.buttonIcon, 'cancel')}
                  onClick={handleShowModalCancelUpdateInformation}
                >
                  <Cancel />
                </Box>
              </Box>
            ) : (
              ''
            )
          }
        >
          <Box className={classes.formWrapper}>
            <FormLayout top={24} gap={24}>
              <InputTextLabel
                keyName={'staffName'}
                label={i18('LB_STAFF_NAME')}
                require
                placeholder={i18Staff('PLH_STAFF_NAME')}
                name="name"
                value={formik.values.staffName}
                onChange={handleInputChange}
                error={
                  formik.touched.staffName && Boolean(formik.errors.staffName)
                }
                errorMessage={
                  formik.touched.staffName ? formik.errors.staffName : ''
                }
              />
              <InputDropdown
                required
                label={i18Staff('LB_GENDER') ?? ''}
                listOptions={genders}
                keyName="gender"
                value={formik.values.gender}
                placeholder={i18Staff('PLH_SELECT_GENDER') || ''}
                error={
                  formik.touched.gender && Boolean(formik.errors.gender ?? '')
                }
                errorMessage={formik.errors.gender ?? ''}
                onChange={handleSelectChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <InputDatepicker
                label={i18Staff('LB_DATE_OF_BIRTH') ?? ''}
                keyName={'birthday'}
                inputFormat={DATE_FORMAT}
                require
                value={formik.values.birthday}
                error={
                  birthDayError ||
                  (formik.touched.birthday && Boolean(formik.errors.birthday))
                }
                errorMessage={
                  birthDayError
                    ? StringFormat(
                        i18Staff('MSG_INVALID'),
                        i18Staff('LB_DATE_OF_BIRTH') ?? ''
                      )
                    : formik.errors.birthday
                }
                width={'100%'}
                maxDate={new Date()}
                onError={handleBirthDayError}
                onChange={handleChangeDate}
              />
              <InputTextLabel
                disabled={isViewDetail}
                keyName={'email'}
                label={i18('LB_EMAIL') ?? ''}
                require
                placeholder={i18('PLH_INPUT_EMAIL') || ''}
                name="name"
                value={formik.values.email}
                onChange={handleInputChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                errorMessage={formik.touched.email ? formik.errors.email : ''}
              />
            </FormLayout>
            <FormLayout top={24}>
              <InputTextLabel
                error={
                  !!formik.errors.phoneNumber && !!formik.touched.phoneNumber
                }
                errorMessage={formik.errors.phoneNumber}
                keyName="phoneNumber"
                type="number"
                label={i18('LB_PHONE_NUMBER')}
                placeholder={i18('PLH_PHONE_NUMBER')}
                value={formik.values.phoneNumber}
                onChange={handleInputChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <SelectStaff
                require
                callback={getDirectManager}
                label={i18Staff('LB_DIRECT_MANAGER') ?? ''}
                placeholder={i18Staff('PLH_SELECT_DIRECT_MANAGER') || ''}
                value={formik.values.directManager}
                error={
                  formik.touched.directManager &&
                  Boolean(formik.errors.directManager)
                }
                errorMessage={
                  Boolean(formik.touched.directManager)
                    ? (formik.errors.directManager as string)
                    : ''
                }
                onChange={handleDirectManagerChange}
              />
              <SelectBranch
                label={i18Staff('LB_BRANCH') ?? ''}
                require
                error={
                  formik.touched.branchId && Boolean(formik.errors.branchId)
                }
                errorMessage={formik.touched.branchId && formik.errors.branchId}
                value={formik.values.branchId}
                onChange={handleBranchChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <SelectDivisionSingle
                label={i18Staff('LB_DIVISION') ?? ''}
                value={formik.values.divisionId}
                require
                isDisable={!formik.values.branchId}
                branchId={formik.values.branchId}
                error={
                  formik.touched.divisionId && Boolean(formik.errors.divisionId)
                }
                errorMessage={
                  formik.touched.divisionId
                    ? (formik.errors.divisionId as string)
                    : ''
                }
                placeholder={i18Staff('PLH_SELECT_DIVISION') ?? ''}
                onChange={handleDivisionChange}
              />
              <SelectPosition
                label={i18('LB_POSITION') ?? ''}
                require
                value={formik.values.position}
                disabled={!formik.values.divisionId}
                divisionIds={[formik.values.divisionId]}
                error={
                  formik.touched.position && Boolean(formik.errors.position)
                }
                errorMessage={formik.errors.position}
                onChange={handleSelectPosition}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <InputDatepicker
                label={i18Staff('LB_ONBOARD_DATE') ?? ''}
                keyName={'onboardDate'}
                inputFormat={DATE_FORMAT}
                require
                value={formik.values.onboardDate}
                error={
                  birthDayError ||
                  (formik.touched.onboardDate &&
                    Boolean(formik.errors.onboardDate))
                }
                errorMessage={
                  dateOnBoardError
                    ? StringFormat(
                        i18Staff('MSG_INVALID'),
                        i18Staff('LB_ONBOARD_DATE') ?? ''
                      )
                    : formik.errors.onboardDate
                }
                width={'100%'}
                onError={handleDateOnBoardError}
                onChange={handleChangeDate}
              />
              <SelectGrade
                label={i18Staff('LB_GRADE') ?? ''}
                option={formik.values.grade}
                positionId={formik.values.position}
                isDisable={!formik.values.position}
                placeholder={i18Staff('PLH_SELECT_GRADE') ?? ''}
                onChange={handleGradeChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <SelectGradeTitle
                label={i18Staff('LB_GRADE_TITLE') ?? ''}
                option={formik.values.gradeTitle}
                isDisable={!formik.values.grade?.id}
                gradeId={formik.values.grade.id as string}
                placeholder={i18Staff('PLH_SELECT_GRADE_TITLE') ?? ''}
                onChange={handleGradeTitleChange}
              />
              <SelectLeaderGrade
                label={i18Staff('LB_LEADER_GRADE') ?? ''}
                option={formik.values.leaderGrade}
                positionId={formik.values.position}
                gradeId={(formik.values.gradeTitle.id as string) ?? ''}
                isDisable={!formik.values.gradeTitle?.id}
                placeholder={i18Staff('PLH_SELECT_LEADER_GRADE') ?? ''}
                onChange={handleLeaderGradeChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <SelectLeaderGradeTitle
                label={i18Staff('LB_LEADER_GRADE_TITLE') ?? ''}
                option={formik.values.leaderGradeTitle}
                isDisable={!formik.values.leaderGrade?.id}
                leaderGradeId={(formik.values.leaderGrade.id as string) ?? ''}
                placeholder={i18Staff('PLH_SELECT_LEADER_GRADE_TITLE') ?? ''}
                onChange={handleLeaderGradeTitleChange}
              />
              <InputDropdown
                required
                keyName={'status'}
                label={i18Staff('LB_STATUS') ?? ''}
                placeholder={i18Staff('PLH_SELECT_STATUS') ?? ''}
                listOptions={status}
                value={formik.values.status}
                error={formik.touched.status && Boolean(formik.errors.status)}
                errorMessage={formik.errors.status}
                onChange={handleSelectChange}
              />
            </FormLayout>
            {/* CASE INACTIVE */}
            {formik.values.status == status[1].value && (
              <FormLayout top={24}>
                <InputDatepicker
                  require
                  maxDate={new Date()}
                  label={i18Staff('LB_LAST_WORKING_DATE')}
                  keyName={'lastWorkingDate'}
                  inputFormat={DATE_FORMAT}
                  value={formik.values.lastWorkingDate}
                  error={
                    formik.touched.lastWorkingDate &&
                    Boolean(formik.errors.lastWorkingDate)
                  }
                  errorMessage={formik.errors.lastWorkingDate}
                  width={'100%'}
                  onError={handleDateOnBoardError}
                  onChange={handleChangeDate}
                />
              </FormLayout>
            )}
            <FormLayout top={24} gap={24}>
              <InputDropdown
                keyName={'jobType'}
                label={i18Staff('LB_JOB_TYPE') ?? ''}
                placeholder={i18Staff('PLH_SELECT_JOB_TYPE') ?? ''}
                listOptions={jobType}
                value={formik.values.jobType}
                onChange={handleSelectChange}
              />
            </FormLayout>
          </Box>
        </CardForm>
      </ConditionalRender>
      <ConditionalRender conditional={!showEditInformation && isViewDetail}>
        <CardForm
          title={i18('TXT_GENERAL_INFORMATION') as string}
          childCompEnd={
            permissions.useStaffUpdate ? (
              <Box
                className={classes.buttonIcon}
                onClick={handleShowModalEditInformation}
              >
                <BorderColor />
              </Box>
            ) : (
              <Box />
            )
          }
        >
          <GeneralInformationStaffDetail dataDetail={generalInfoStaff} />
        </CardForm>
      </ConditionalRender>
    </>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  formWrapper: {
    maxWidth: theme.spacing(75),
  },
  buttonIcon: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    transitionDuration: '100ms',
    '&:hover': {
      backgroundColor: `${theme.color.blue.primary}20`,
    },

    '& svg': {
      fontSize: 25,
      color: theme.color.black.secondary,
    },
    '& svg:hover': {
      color: theme.color.blue.primary,
    },
    '&.disable': {
      pointerEvents: 'none',
    },
    '&.active': {
      backgroundColor: `${theme.color.blue.primary}20`,
      '& svg': {
        color: theme.color.blue.primary,
      },
    },
    '&.cancel': {
      '& svg:hover': {
        color: theme.color.error.primary,
      },
    },
  },
}))
export default GeneralInformation
