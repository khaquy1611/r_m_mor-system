import { LangConstant } from '@/const'
import {
  abbreviationRegex,
  contractNumberRegex,
  engJapRegex,
} from '@/utils/yup'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { EXTERNAL, INTERNAL, NDA, ORDER } from './const'
import { ContractStaffInformationRequest } from './models'

export const initContractGeneralInformation = {
  source: EXTERNAL,
  contractNumber: '',
  group: '',
  type: '',
  selectContractGroup: null,
  branchId: '',
  startDate: null,
  endDate: null,
  signDate: null,
  contactPerson: null,
  buyerId: null,
  sellerId: null,
  value: '',
  dueDatePayment: '',
  projectAbbreviationName: '',
  description: '',
  status: '',
  modifiedStatusDate: null,
}

export const initStaffForm: ContractStaffInformationRequest = {
  id: '',
  staffId: '',
  staffName: '',
  positionName: '',
  skillIds: [],
  levelName: '',
  rate: '',
  unitOfTime: '',
  note: '',
  sourceStaff: INTERNAL,
}

export default function useContractFormik() {
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const getMessageSelectRequire = (name: string) =>
    i18('MSG_SELECT_REQUIRE', { name })

  const getMessageDateRequire = (name: string) =>
    i18('MSG_INPUT_DATE_REQUIRE', { name })

  const contractGeneralInformationValidation = Yup.object({
    contractNumber: Yup.string()
      .trim()
      .when('source', {
        is: (source: string) => +source === EXTERNAL,
        then: Yup.string()
          .trim()
          .required(
            i18('MSG_INPUT_REQUIRE', {
              name: i18('LB_CONTRACT_NUMBER'),
            }) as string
          )
          .matches(
            contractNumberRegex,
            i18('MSG_INPUT_NAME_INVALID', {
              name: i18('LB_CONTRACT_NUMBER'),
            }) as string
          ),
      }),
    group: Yup.string().required(
      getMessageSelectRequire(i18('LB_CONTRACT_GROUP'))
    ),
    type: Yup.string().when('group', {
      is: (group: string | number) =>
        group && group.toString() !== NDA.toString(),
      then: Yup.string().required(
        getMessageSelectRequire(i18('LB_CONTRACT_TYPE'))
      ),
    }),
    selectContractGroup: Yup.object()
      .nullable()
      .when(['branchId', 'group'], {
        is: (branchId: string, group: string | number) =>
          branchId && group && group.toString() !== NDA.toString(),
        then: Yup.object().nullable().objectEmpty(getMessageSelectRequire('')),
      }),
    branchId: Yup.string().required(getMessageSelectRequire(i18('LB_BRANCH'))),
    signDate: Yup.number()
      .nullable()
      .required(getMessageDateRequire(i18Contract('LB_CONTRACT_SIGN_DATE'))),
    contactPerson: Yup.object()
      .nullable()
      .when('branchId', {
        is: (branchId: string) => !!branchId,
        then: Yup.object()
          .nullable()
          .objectEmpty(getMessageSelectRequire(i18('LB_CONTACT_PERSON'))),
      }),
    buyerId: Yup.object()
      .nullable()
      .objectEmpty(getMessageSelectRequire(i18Contract('LB_BUYER'))),
    sellerId: Yup.object()
      .nullable()
      .objectEmpty(getMessageSelectRequire(i18Contract('LB_SELLER'))),
    value: Yup.string().when('group', {
      is: (group: string | number) =>
        group && group.toString() === ORDER.toString(),
      then: Yup.string()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18('LB_VALUE'),
          }) as string
        )
        .min(
          5,
          i18('MSG_INVALID_INPUT_MIN', {
            name: i18('LB_VALUE'),
            count: 4,
          }) as string
        ),
    }),
    projectAbbreviationName: Yup.string()
      .trim()
      .when('group', {
        is: (group: string | number) =>
          group && group.toString() === ORDER.toString(),
        then: Yup.string()
          .trim()
          .required(
            i18('MSG_INPUT_REQUIRE', {
              name: i18Contract('LB_PROJECT_ABBREVIATION_NAME'),
            }) as string
          )
          .matches(
            abbreviationRegex,
            i18('MSG_INPUT_NAME_INVALID', {
              name: i18Contract('LB_PROJECT_ABBREVIATION_NAME'),
            }) as string
          ),
      }),
    status: Yup.string().required(getMessageSelectRequire(i18('LB_STATUS'))),
  })

  const staffFormValidation = Yup.object({
    staffName: Yup.string()
      .required(getMessageSelectRequire(i18('LB_STAFF_NAME')))
      .staffNameValidation(
        i18('MSG_INPUT_NAME_INVALID', {
          name: i18('LB_STAFF_NAME'),
        })
      ),
    unitOfTime: Yup.string().required(
      getMessageSelectRequire(i18('LB_UNIT_OF_TIME'))
    ),
    positionName: Yup.string()
      .required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18Contract('LB_STAFF_POSITION'),
        }) as string
      )
      .matches(
        engJapRegex,
        i18('MSG_INPUT_NAME_INVALID', {
          name: i18Contract('LB_STAFF_POSITION'),
        }) as string
      ),
    levelName: Yup.string()
      .required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18Contract('LB_STAFF_LEVEL'),
        }) as string
      )
      .matches(
        engJapRegex,
        i18('MSG_INPUT_NAME_INVALID', {
          name: i18Contract('LB_STAFF_LEVEL'),
        }) as string
      ),
    skillIds: Yup.array()
      .min(1, getMessageSelectRequire(i18Contract('LB_SERVICE_SKILLSET')))
      .max(
        10,
        i18('MSG_SELECT_MAX_ITEM', {
          name: i18Contract('LB_SERVICE_SKILLSET'),
        }) as string
      ),
    rate: Yup.string()
      .required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18('LB_PRICE'),
        }) as string
      )
      .min(
        5,
        i18('MSG_INVALID_INPUT_MIN', {
          name: i18('LB_PRICE'),
          count: 4,
        }) as string
      ),
  })

  return {
    contractGeneralInformationValidation,
    staffFormValidation,
  }
}
