import { LangConstant } from '@/const'
import { phoneRegex } from '@/utils'
import { abbreviationRegex, contractNumberRegex } from '@/utils/yup'
import { useTranslation } from 'react-i18next'
import StringFormat from 'string-format'
import * as Yup from 'yup'

const usePartnerValidate = () => {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const partnerValidate = Yup.object({
    name: Yup.string()
      .textRequired('Partner Name required to have input')
      .customerNameValidation(
        'Partner Name cannot contain unauthorized character. Please update this information'
      ),
    abbreviation: Yup.string()
      .textRequired('Partner Abbreviation required to have input')
      .matches(
        abbreviationRegex,
        'Partner Abbreviation cannot contain unauthorized character. Please update this information'
      ),
    branchId: Yup.string().required('Branch must be selected'),
    skillSetIds: Yup.array()
      .min(1, 'Strength must be selected')
      .max(10, 'Strength must not have more than 10 items'),
    priority: Yup.string().required('Priority must be selected'),
    // website: Yup.string()
    //   .trim()
    //   .matches(urlWebsiteRegex, 'Partner Website is not valid'),
    status: Yup.string().required('Status must be selected'),
    collaborationStartDate: Yup.number()
      .nullable()
      .required('Collaboration Start Date must have a specific date'),
    contactName: Yup.string().required('Contact Name required to have input'),
    contactPhoneNumber: Yup.string()
      .trim()
      .matches(
        phoneRegex,
        'Contact Phone Number cannot contain unauthorized character. Please update this information'
      )
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: 'Contact Phone Number',
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: 'Contact Phone Number',
        }) as string
      ),
    emailAddress: Yup.string()
      .trim()
      .emailValidation(
        StringFormat(
          i18nCommon('MSG_HAS_INVALID_EMAIL'),
          i18nCommon('LB_EMAIL_ADDRESS') ?? ''
        )
      )
      .specialCharacters(
        StringFormat(
          i18nCommon('MSG_HAS_CONTAIN_UNAUTHORIZED_CHARACTER__EMAIL'),
          i18nCommon('LB_EMAIL_ADDRESS') ?? ''
        )
      ),
    marketId: Yup.string().textRequired('Market must be selected'),
    provinceIds: Yup.array().max(
      10,
      'Province must not have more than 10 items'
    ),
    scale: Yup.string()
      .trim()
      .scaleValidation(
        'Customer Scale cannot contain unauthorized character. Please update this information'
      ),
  })

  const contractValidation = Yup.object({
    code: Yup.string()
      .trim()
      .required('Contract Number required to have input')
      .matches(
        contractNumberRegex,
        'Contract Number cannot contain unauthorized character. Please update this information'
      ),
    type: Yup.string().required('Contract Type must be selected'),
    group: Yup.string().required('Contract Group must be selected'),
    value: Yup.string()
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: 'Revenue',
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: 'Revenue',
        }) as string
      ),
    expectedRevenue: Yup.string()
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: 'Expected Revenue',
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: 'Expected Revenue',
        }) as string
      ),
    status: Yup.string().required('Contract Status must be selected'),
    startDate: Yup.lazy((value: Date | number | null) => {
      return typeof value === 'number'
        ? Yup.number().required('Contract Start Date must have a specific date')
        : Yup.date()
            .nullable()
            .required('Contract Start Date must have a specific date')
    }),
    endDate: Yup.lazy((value: Date | number | null) => {
      return typeof value === 'number'
        ? Yup.number().required('Contract End Date must have a specific date')
        : Yup.date()
            .nullable()
            .required('Contract End Date must have a specific date')
    }),
  })

  return {
    partnerValidate,
    contractValidation,
  }
}

export default usePartnerValidate
