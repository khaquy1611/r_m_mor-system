import { LangConstant } from '@/const'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

function ValidationFormik() {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const reportValidateSchema = Yup.object({
    reportDate: Yup.lazy((value: Date | number | null) => {
      return typeof value === 'number'
        ? Yup.number()
            .min(
              1,
              i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                name: 'Report Date',
              }) as string
            )
            .required(
              i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                name: 'Report Date',
              }) as string
            )
        : Yup.date()
            .nullable()
            .required(
              i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                name: 'Report Date',
              }) as string
            )
    }),
    projects: Yup.array().of(
      Yup.object({
        projectId: Yup.string().required(
          i18nCommon('MSG_SELECT_REQUIRE', {
            name: 'Project',
          }) as string
        ),
        workingHours: Yup.string()
          .required(
            i18nCommon('MSG_INPUT_REQUIRE', { name: 'Working Hours' }) as string
          )
          .test(
            'hours',
            'Working Hours cannot be more than 24 hours of all projects combined',
            (val: any) => +val <= 24
          ),
      })
    ),
  })
  const noReportValidateSchema = Yup.object({
    reportDate: Yup.lazy((value: Date | number | null) => {
      return typeof value === 'number'
        ? Yup.number()
            .min(
              1,
              i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                name: 'Report Date',
              }) as string
            )
            .required(
              i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                name: 'Report Date',
              }) as string
            )
        : Yup.date()
            .nullable()
            .required(
              i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                name: 'Report Date',
              }) as string
            )
    }),
    projects: Yup.array().of(
      Yup.object({
        projectId: Yup.string().required(
          i18nCommon('MSG_SELECT_REQUIRE', {
            name: 'Select Project',
          }) as string
        ),
        workingHours: Yup.string()
          .required(
            i18nCommon('MSG_INPUT_REQUIRE', { name: 'Working Hours' }) as string
          )
          .test(
            'hours',
            'Working Hours cannot be more than 24 hours of all projects combined',
            (val: any) => +val <= 24
          ),
      })
    ),
    note: Yup.string()
      .trim()
      .required(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nDailyReport('LB_REASON_FOR_LATE'),
        }) as string
      ),
    projectManager: Yup.object({
      id: Yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: 'Select Approver',
        }) as string
      ),
    }),
  })

  return { reportValidateSchema, noReportValidateSchema }
}

export default ValidationFormik
