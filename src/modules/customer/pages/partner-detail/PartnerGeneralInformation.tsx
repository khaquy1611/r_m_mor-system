import InputDatePicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivision from '@/components/select/SelectDivision'
import SelectMarket from '@/components/select/SelectMarket'
import SelectPriority from '@/components/select/SelectPriority'
import SelectProvinces from '@/components/select/SelectProvinces'
import SelectService from '@/components/select/SelectService'
import SelectStaffContactPerson from '@/components/select/SelectStaffContactPerson'
import { LangConstant } from '@/const'
import {
  ABBREVIATION_MAX_LENGTH,
  LIST_OF_LANGUAGES,
  YEAR_2016,
} from '@/const/app.const'
import { CUSTOMER_STATUS } from '@/const/app.const'
import { commonSelector, CommonState } from '@/reducer/common'
import { EventInput, MarketType, OptionItem } from '@/types'
import { Box } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'
import SelectLanguage from '../../components/SelectLanguage'
import { convertStatusInSelectOption } from '../../utils'

interface PartnerGeneralInformationProps {
  skillSetsDetail: OptionItem[]
  partnerFormik: any
  flagSubmit: boolean
}

const customerStatus = convertStatusInSelectOption(
  Object.values(CUSTOMER_STATUS)
)

const PartnerGeneralInformation = ({
  skillSetsDetail,
  partnerFormik,
  flagSubmit,
}: PartnerGeneralInformationProps) => {
  const { t: i18 } = useTranslation()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { errors, values, touched } = partnerFormik
  const { listMarket }: CommonState = useSelector(commonSelector)

  const [skillSets, setSkillSets] = useState<OptionItem[]>([])
  const [dateError, setDateError] = useState(false)

  const isShowVietnamCities = useMemo(() => {
    const vietnam: MarketType =
      listMarket.find((market: MarketType) => market.acronym === 'VNM') || {}
    return vietnam.id == values.marketId
  }, [listMarket, values.marketId])

  const handleNameChange = useCallback((event: EventInput) => {
    const { value } = event.target
    partnerFormik.setFieldValue('name', value)
  }, [])

  const handleAbbreviationChange = useCallback((event: EventInput) => {
    const { value } = event.target
    partnerFormik.setFieldValue('abbreviation', value)
  }, [])

  const handleBranchChange = useCallback((branchId: string) => {
    partnerFormik.setFieldValue('branchId', branchId)
  }, [])

  const handleSkillSetsChange = useCallback((skillSets: OptionItem[]) => {
    setSkillSets(skillSets)
    const skillSetIds = skillSets.map((skillSet: OptionItem) => skillSet.value)
    partnerFormik.setFieldValue('skillSetIds', skillSetIds)
  }, [])

  const handlePriorityChange = useCallback((priority: string) => {
    partnerFormik.setFieldValue('priority', priority)
  }, [])

  const handleScaleChange = useCallback((event: EventInput) => {
    const { value } = event.target
    partnerFormik.setFieldValue('scale', value)
  }, [])

  const handleWebsiteChange = useCallback((event: EventInput) => {
    const { value } = event.target
    partnerFormik.setFieldValue('website', value)
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    partnerFormik.setFieldValue('status', status)
  }, [])

  const handleCollaborationStartDateChange = useCallback((date: Date) => {
    const timestamp = date?.getTime() || null
    partnerFormik.setFieldValue('collaborationStartDate', timestamp)
  }, [])

  const handleCollaborationStartDateError = useCallback(
    (error: string | null) => {
      setDateError(!!error)
    },
    []
  )

  const handleSignNdaChange = useCallback(() => {
    partnerFormik.setFieldValue('signNda', !values.signNda)
  }, [values.signNda])

  const handleMarketChange = useCallback((marketId: string) => {
    partnerFormik.setFieldValue('marketId', marketId || '')
    partnerFormik.setFieldValue('provinceIds', [])
  }, [])

  const handleCitiesChange = useCallback((provinceIds: OptionItem[]) => {
    partnerFormik.setFieldValue('provinceIds', provinceIds)
  }, [])

  const handleContactPersonIdChange = useCallback(
    (contactPersonId: OptionItem) => {
      partnerFormik.setFieldValue('contactPersonId', contactPersonId)
    },
    []
  )

  const handleLanguageChange = useCallback((languageIds: OptionItem[]) => {
    partnerFormik.setFieldValue(
      'languageIds',
      JSON.stringify(languageIds.map((lang: OptionItem) => lang.id))
    )
  }, [])

  const handleDivisionsChange = useCallback((divisions: OptionItem[]) => {
    partnerFormik.setFieldValue('divisionIds', divisions)
  }, [])

  const getLanguages = (languageIdsJSON: string) => {
    const languageIds = JSON.parse(languageIdsJSON)
    if (languageIds.length) {
      const result: OptionItem[] = []
      LIST_OF_LANGUAGES.forEach((lang: OptionItem) => {
        if (languageIds.includes(lang.id)) {
          result.push(lang)
        }
      })
      return JSON.stringify(result)
    }
    return '[]'
  }

  useEffect(() => {
    if (skillSetsDetail.length) {
      setSkillSets(skillSetsDetail)
    }
  }, [skillSetsDetail])

  return (
    <CardForm title={i18('TXT_GENERAL_INFORMATION')}>
      <Box style={{ maxWidth: '600px' }}>
        <FormLayout>
          <InputTextLabel
            require
            error={errors.name && touched.name}
            errorMessage={errors.name}
            value={values.name}
            label={i18Customer('LB_PARTNER_NAME')}
            placeholder={i18Customer('PLH_PARTNER_NAME')}
            onChange={handleNameChange}
          />
        </FormLayout>
        <FormLayout top={24} gap={24}>
          <InputTextLabel
            require
            maxLength={ABBREVIATION_MAX_LENGTH}
            error={!!errors.abbreviation && !!touched.abbreviation}
            errorMessage={errors.abbreviation}
            value={values.abbreviation}
            label={StringFormat(i18Customer('LB_ABBREVIATION'), 'Partner')}
            placeholder={i18('PLH_ABBREVIATION')}
            onChange={handleAbbreviationChange}
          />
          <SelectLanguage
            value={JSON.parse(getLanguages(values.languageIds))}
            onChange={handleLanguageChange}
          />
        </FormLayout>
        <FormLayout top={24} gap={24}>
          <SelectBranch
            require
            label={i18Customer('LB_BRANCH')}
            error={errors.branchId && touched.branchId}
            errorMessage={errors.branchId}
            value={values.branchId}
            onChange={handleBranchChange}
          />
          <SelectDivision
            label={i18('LB_DIVISION')}
            branchId={values.branchId}
            disabled={!values.branchId}
            placeholder={i18('PLH_SELECT_DIVISION')}
            value={values.divisionIds}
            onChange={handleDivisionsChange}
          />
        </FormLayout>
        <FormLayout top={24} gap={24}>
          <SelectService
            require
            width={'100%'}
            label={i18Customer('LB_STRENGTH')}
            placeholder={i18Customer('PLH_SELECT_STRENGTH')}
            error={errors.skillSetIds && touched.skillSetIds}
            errorMessage={errors.skillSetIds}
            value={skillSets}
            onChange={handleSkillSetsChange}
          />
        </FormLayout>
        <FormLayout top={24} gap={24}>
          <SelectPriority
            required
            label={i18Customer('LB_PRIORITY') as string}
            error={errors.priority && touched.priority}
            errorMessage={errors.priority}
            value={values.priority}
            onChange={handlePriorityChange}
          />
          <SelectMarket
            require
            label={i18('LB_LOCATION')}
            placeholder={i18('PLH_SELECT_LOCATION') as string}
            error={!values.marketId && flagSubmit}
            errorMessage={'Location must be selected'}
            value={values.marketId}
            onChange={handleMarketChange}
          />
        </FormLayout>
        {isShowVietnamCities && (
          <FormLayout top={24}>
            <SelectProvinces
              error={!!errors.provinceIds && !!touched.provinceIds}
              errorMessage={errors.provinceIds}
              label="Province"
              value={values.provinceIds}
              onChange={handleCitiesChange}
            />
          </FormLayout>
        )}
        <FormLayout top={24} gap={24}>
          <InputTextLabel
            error={!!errors.scale && !!touched.scale}
            errorMessage={errors.scale}
            value={values.scale}
            label={i18Customer('LB_PARTNER_SCALE')}
            placeholder={i18Customer('PLH_PARTNER_SCALE')}
            onChange={handleScaleChange}
          />
          <SelectStaffContactPerson
            error={!!errors.contactPersonId && !!touched.contactPersonId}
            errorMessage={errors.contactPersonId}
            label="Contact Person"
            value={values.contactPersonId}
            onChange={handleContactPersonIdChange}
          />
        </FormLayout>
        <FormLayout top={24}>
          <InputTextLabel
            // error={errors.website && touched.website}
            // errorMessage={errors.website}
            value={values.website}
            label={i18Customer('LB_PARTNER_WEBSITE')}
            placeholder={i18Customer('PLH_WEBSITE')}
            onChange={handleWebsiteChange}
          />
        </FormLayout>
        <FormLayout top={24} gap={24}>
          <FormItem label={i18Customer('LB_STATUS')} require>
            <InputDropdown
              width={'100%'}
              error={errors.status && touched.status}
              errorMessage={errors.status}
              listOptions={customerStatus}
              placeholder={i18Customer('PLH_SELECT_STATUS')}
              value={values.status}
              onChange={handleStatusChange}
            />
          </FormItem>
          <InputDatePicker
            require
            width="100%"
            minDate={YEAR_2016}
            label={i18Customer('LB_COLLABORATION_START_DATE')}
            error={
              (errors.collaborationStartDate &&
                touched.collaborationStartDate) ||
              dateError
            }
            errorMessage={
              dateError
                ? 'Collaboration Start Date has invalid date'
                : touched.collaborationStartDate
                ? errors.collaborationStartDate
                : ''
            }
            value={values.collaborationStartDate}
            onChange={handleCollaborationStartDateChange}
            onError={handleCollaborationStartDateError}
          />
        </FormLayout>
        <FormLayout top={24}>
          <InputCheckbox
            label={i18Customer('LB_SIGN_NDA')}
            checked={values.signNda}
            onClick={handleSignNdaChange}
          />
        </FormLayout>
      </Box>
    </CardForm>
  )
}

export default PartnerGeneralInformation
