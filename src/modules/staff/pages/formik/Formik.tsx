import { LangConstant } from '@/const'
import { useTranslation } from 'react-i18next'
import StringFormat from 'string-format'
import * as yup from 'yup'
import { status } from '../../const'

export default function formikConfig() {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)

  const getMessageSelectRequire = (name: string) =>
    i18nCommon('MSG_SELECT_REQUIRE', { name })

  const generalSchemaValidation = yup.object({
    staffName: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nCommon('LB_STAFF_NAME'),
        })
      )
      .staffNameValidation(
        i18nCommon('MSG_INPUT_NAME_INVALID', {
          name: i18nCommon('LB_STAFF_NAME'),
        })
      ),
    gender: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_GENDER'))),
    birthday: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nStaff('LB_DATE_OF_BIRTH'),
        }) ?? ''
      ),
    email: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nCommon('LB_EMAIL'),
        })
      )
      .emailValidation(
        StringFormat(
          i18nCommon('MSG_HAS_INVALID_EMAIL'),
          i18nCommon('LB_EMAIL') ?? ''
        )
      )
      .specialCharacters(
        StringFormat(
          i18nCommon('MSG_HAS_CONTAIN_UNAUTHORIZED_CHARACTER__EMAIL'),
          i18nCommon('LB_EMAIL') ?? ''
        )
      ),
    phoneNumber: yup
      .string()
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: i18nCommon('LB_PHONE_NUMBER'),
          count: 4,
        }) as string
      )
      .max(
        20,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nCommon('LB_PHONE_NUMBER'),
        }) as string
      ),
    directManager: yup
      .object()
      .nullable()
      .objectEmpty(getMessageSelectRequire(i18nStaff('LB_DIRECT_MANAGER'))),
    branchId: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_BRANCH'))),
    divisionId: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_DIVISION'))),
    position: yup
      .string()
      .required(getMessageSelectRequire(i18nCommon('LB_POSITION'))),
    onboardDate: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nStaff('LB_ONBOARD_DATE'),
        }) ?? ''
      ),
    lastWorkingDate: yup
      .date()
      .nullable()
      .when('status', {
        is: (stt: number | string) => stt && stt == status[1].value,
        then: yup
          .date()
          .nullable()
          .required(
            i18nCommon('MSG_INPUT_DATE_REQUIRE', {
              name: i18nStaff('LB_LAST_WORKING_DATE'),
            }) ?? ''
          ),
      }),
    status: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_STATUS'))),
  })
  const modalAddSkillSetValidation = yup.object({
    skillGroup: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nStaff('LB_SKILL_GROUP'),
        }) ?? ''
      ),
    }),
    skillName: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nStaff('LB_SKILL_NAME'),
        }) ?? ''
      ),
    }),
    yearsOfExperience: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nStaff('LB_YEAR_OF_EXPERIENCE'),
        })
      )
      .max(
        8,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nStaff('LB_YEAR_OF_EXPERIENCE'),
        }) as string
      ),
    level: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nCommon('LB_LEVEL'),
        }) ?? ''
      ),
    }),
  })
  return {
    generalSchemaValidation,
    modalAddSkillSetValidation,
  }
}
