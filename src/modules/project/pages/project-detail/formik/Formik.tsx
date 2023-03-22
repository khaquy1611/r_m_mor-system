import { LangConstant } from '@/const'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

export default function formikConfig() {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)

  const getMessageDateRequire = (name: string) =>
    i18nCommon('MSG_INPUT_DATE_REQUIRE', { name })
  const getMessageSelectRequire = (name: string) =>
    i18nCommon('MSG_SELECT_REQUIRE', { name })
  const getMessageSelectMax = (name: string) =>
    i18nCommon('MSG_SELECT_MAX_ITEM', { name })

  const generalSchemaValidation = yup.object({
    name: yup
      .string()
      .textRequired(i18nCommon('MSG_INPUT_REQUIRE', { name: 'Project Name' }))
      .projectNameValidation(
        i18nCommon('MSG_INPUT_NAME_INVALID', { name: 'Project Name' })
      ),
    branchId: yup
      .string()
      .required(getMessageSelectRequire(i18nProject('LB_RESPONSIBLE_BRANCH'))),
    divisions: yup
      .array()
      .min(1, getMessageSelectRequire(i18nProject('LB_PARTICIPATE_DIVISION')))
      .max(
        10,
        i18nCommon('MSG_SELECT_MAX_ITEM', {
          name: 'Participate Division',
        }) as string
      ),
    technologies: yup
      .array()
      .min(1, getMessageSelectRequire(i18nProject('LB_TECHNOLOGY')))
      .max(10, getMessageSelectMax(i18nProject('LB_TECHNOLOGY'))),
    customer: yup
      .object()
      .nullable()
      .objectEmpty(getMessageSelectRequire(i18nProject('LB_CUSTOMER'))),
    partner: yup
      .array()
      .max(
        10,
        i18nCommon('MSG_SELECT_MAX_ITEM', { name: 'Partner' }) as string
      ),
    type: yup
      .string()
      .required(getMessageSelectRequire(i18nProject('lB_PROJECT_TYPE'))),
    // noteType: yup.string().when('type', {
    //   is: (type: any) => +type === PROJECT_TYPE_ID.OTHER,
    //   then: yup
    //     .string()
    //     .textRequired(
    //       i18nCommon('MSG_INPUT_REQUIRE', { name: 'Project Type' })
    //     ),
    // }),
    status: yup
      .string()
      .required(getMessageSelectRequire(i18nProject('lB_PROJECT_STATUS'))),
    startDate: yup
      .date()
      .nullable()
      .required(getMessageDateRequire(i18nProject('lB_PROJECT_START_DATE'))),
    endDate: yup
      .date()
      .nullable()
      .required(getMessageDateRequire(i18nProject('lB_PROJECT_END_DATE'))),
    manager: yup.array().max(
      10,
      i18nCommon('MSG_SELECT_MAX_ITEM', {
        name: i18nCommon('LB_PROJECT_MANAGER'),
      }) as string
    ),
    totalRevenue: yup
      .string()
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: 'Total Project Revenue',
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: 'Total Project Revenue',
        }) as string
      ),
    revenueRate: yup.string().max(
      8,
      i18nCommon('MSG_INVALID_INPUT_MAX', {
        name: 'Revenue Rate',
      }) as string
    ),
    totalContract: yup.string().max(
      8,
      i18nCommon('MSG_INVALID_INPUT_MAX', {
        name: 'Total Project Revenue',
      }) as string
    ),
    description: yup.string(),
    workChannelLink: yup.string(),
  })
  const modalCostValidation = yup.object({
    costOrigin: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nProject('LB_COST_ORIGIN'),
        }) ?? ''
      ),
    }),
    source: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nCommon('LB_SOURCE'),
        }) ?? ''
      ),
    }),
    currency: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nProject('LB_CURRENCY'),
        }) ?? ''
      ),
    }),
    cost: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', { name: i18nProject('LB_COST') })
      )
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: 'Cost',
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: 'Cost',
        }) as string
      ),
    rate: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', { name: i18nProject('LB_RATE') })
      )
      .max(
        8,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: 'Cost Rate',
        }) as string
      ),
    date: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nProject('LB_INPUT_DATE'),
        }) ?? ''
      ),
  })

  const modalRevenueValidationByProject = yup.object({
    actualRevenue: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nProject('LB_ACTUAL_REVENUE') ?? '',
        })
      )
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: i18nProject('LB_ACTUAL_REVENUE') ?? '',
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nProject('LB_ACTUAL_REVENUE') ?? '',
        }) as string
      ),
    expectedRevenue: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nProject('LB_EXPECTED_REVENUE') ?? '',
        })
      )
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: i18nProject('LB_EXPECTED_REVENUE') ?? '',
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nProject('LB_EXPECTED_REVENUE') ?? '',
        }) as string
      ),
    status: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nProject('LB_INPUT_REVENUE_STATUS') ?? '' ?? '',
        }) ?? ''
      ),
    }),
    currency: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nProject('LB_CURRENCY') ?? '',
        }) ?? ''
      ),
    }),
    rate: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', { name: i18nProject('LB_RATE') ?? '' })
      )
      .max(
        8,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nProject('LB_REVENUE_RATE'),
        }) as string
      ),
    date: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nProject('LB_INPUT_DATE') ?? '',
        }) ?? ''
      ),
  })

  const modalRevenueValidationByDivision = yup.object({
    actualRevenue: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nProject('LB_ACTUAL_REVENUE') ?? '',
        })
      )
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: i18nProject('LB_ACTUAL_REVENUE') ?? '',
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nProject('LB_ACTUAL_REVENUE') ?? '',
        }) as string
      ),
    expectedRevenue: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nProject('LB_EXPECTED_REVENUE') ?? '',
        })
      )
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: i18nProject('LB_EXPECTED_REVENUE') ?? '',
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nProject('LB_EXPECTED_REVENUE') ?? '',
        }) as string
      ),
    division: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nProject('LB_DIVISION') ?? '',
        }) ?? ''
      ),
    }),
    status: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: 'Revenue Status' ?? '',
        }) ?? ''
      ),
    }),
    currency: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nProject('LB_CURRENCY') ?? '',
        }) ?? ''
      ),
    }),
    rate: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', { name: i18nProject('LB_RATE') ?? '' })
      )
      .max(
        8,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nProject('LB_REVENUE_RATE'),
        }) as string
      ),
    date: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nProject('LB_INPUT_DATE') ?? '',
        }) ?? ''
      ),
  })

  const modalAssignStaffValidation = yup.object({
    assignStartDate: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nProject('LB_ASSIGN_START_DATE') ?? '',
        }) ?? ''
      ),
    assignEndDate: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nProject('LB_ASSIGN_END_DATE') ?? '',
        }) ?? ''
      ),
    projectHeadcount: yup
      .string()
      .max(
        5,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: 'Revenue Rate',
        }) as string
      )
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nProject('LB_PROJECT_STAFF_HEADCOUNT'),
        })
      ),
    role: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', { name: i18nProject('LB_ROLE') })
      ),
    id: yup.number().required(i18nCommon('MSG_STAFF_REQUIRED') as string),
  })
  return {
    generalSchemaValidation,
    modalCostValidation,
    modalRevenueValidationByDivision,
    modalRevenueValidationByProject,
    modalAssignStaffValidation,
  }
}
