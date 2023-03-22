import CommonButton from '@/components/buttons/CommonButton'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import FormLayout from '@/components/Form/FormLayout'
import DialogBox from '@/components/modal/DialogBox'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { LangConstant, PathConstant } from '@/const'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import { AuthState, selectAuth } from '@/reducer/auth'
import { alertError, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Division, ErrorResponse, OptionItem, Province } from '@/types'
import { scrollToFirstErrorMessage, scrollToTop } from '@/utils'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createPartner,
  getContractsByPartnerId,
  PartnerState,
  selectPartner,
  setStateContracts,
  updatePartner,
} from '../../reducer/partner'
import { PartnerService } from '../../services'
import { PartnerDetailResponse } from '../../types'
import { getListCodeContractError } from '../../utils'
import PartnerContactInformation from './PartnerContactInformation'
import PartnerContractInformation from './PartnerContractInformation'
import PartnerGeneralInformation from './PartnerGeneralInformation'
import PartnerProjectInformation from './PartnerProjectInformation'
import usePartnerValidate from './usePartnerValidate'

const initialRequestBody: any = {
  branchId: '',
  collaborationStartDate: null,
  companyContactPerson: '',
  emailAddress: '',
  contactName: '',
  contactPhoneNumber: '',
  contracts: [],
  name: '',
  note: '',
  priority: '',
  scale: '',
  signNda: false,
  skillSetIds: [],
  status: '',
  website: '',
  marketId: '',
  provinceIds: [],
  contactPersonId: {},
  workingTitle: '',
  languageIds: '[]',
  abbreviation: '',
  divisionIds: [],
}

interface PartnerDetailProps {
  isDetailPage: boolean
}

const PartnerDetail = ({ isDetailPage }: PartnerDetailProps) => {
  const navigate = useNavigate()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()

  const { permissions }: AuthState = useSelector(selectAuth)
  const { stateContracts }: PartnerState = useSelector(selectPartner)

  const [partnerTemp, setPartnerTemp] = useState(initialRequestBody)
  const [listProjects, setListProjects] = useState([])
  const [skillSetsDetail, setSkillSetsDetail] = useState([])
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [flagSubmit, setFlagSubmit] = useState(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog)

  const { partnerValidate } = usePartnerValidate()

  const partnerFormik = useFormik({
    initialValues: initialRequestBody,
    validationSchema: partnerValidate,
    onSubmit: () => {
      handleSavePartner()
      setShowDialog(false)
    },
  })

  const isChangeData = useMemo(() => {
    return JSON.stringify(partnerFormik.values) != JSON.stringify(partnerTemp)
  }, [isDetailPage, partnerFormik.values])

  const isButtonSubmitDisabled = useMemo(() => {
    if (!isDetailPage) return false
    return !isChangeData
  }, [isDetailPage, isChangeData])

  const handleBackPage = () => {
    navigate(PathConstant.CUSTOMER_PARTNER_LIST)
  }

  const createPartnerFromRedux = () => {
    dispatch(updateLoading(true))
    const payload = {
      partner: {
        ...partnerFormik.values,
        provinceIds: partnerFormik.values.provinceIds.map(
          (item: Province) => item.id
        ),
        divisionIds: partnerFormik.values.divisionIds.map(
          (item: OptionItem) => item.id
        ),
        website: partnerFormik.values.website?.trim(),
        locationId: partnerFormik.values.marketId,
        contactPersonId: partnerFormik.values.contactPersonId.id,
      },
      contracts: partnerFormik.values.contracts,
    }
    dispatch(createPartner(payload))
      .unwrap()
      .then(() => {
        handleBackPage()
      })
      .catch((errors: any) => {
        const codes = getListCodeContractError(
          errors,
          partnerFormik.values.contracts
        )
        if (!codes.length) return
        dispatch(
          alertError({
            message: i18Customer('MSG_MANY_CONTRACT_HAD_EXIST', {
              count: !!codes.length ? (`( ${codes.join(', ')} )` as any) : '',
            }),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const fillPartner = (partner: PartnerDetailResponse) => {
    const { general, contact, projects } = partner
    const {
      branch,
      collaborationStartDate,
      person,
      name,
      priority,
      scale,
      signNda,
      strengths,
      status,
      website,
      location,
      provinces,
      contactPersons,
      languageIds,
      abbreviation,
      divisions,
    } = general
    const {
      emailAddress,
      contactName,
      contactPhoneNumber,
      contactNote,
      workingTitle,
    } = contact
    const skillSetsOptionItem = strengths.map(item => ({
      id: item.skillSetId,
      value: item.skillSetId,
      label: item.name,
    }))
    setListProjects(projects as any)
    setSkillSetsDetail(skillSetsOptionItem as any)
    const partnerDetail = {
      branchId: branch.id as string,
      collaborationStartDate,
      companyContactPerson: person,
      contactName,
      contactPhoneNumber,
      contracts: [],
      name,
      note: contactNote,
      priority: priority.id,
      scale,
      signNda,
      skillSetIds: strengths.map(item => item.skillSetId) as any,
      status: status.id || '',
      website,
      marketId: location?.id || '',
      provinceIds: provinces.map(item => ({ ...item, value: item.id })),
      contactPersonId: {
        id: contactPersons?.id?.toString(),
        value: contactPersons?.id?.toString(),
        label: contactPersons?.name,
      },
      workingTitle,
      languageIds: languageIds || '[]',
      abbreviation: abbreviation || '',
      divisionIds:
        divisions?.map((item: Division) => ({
          id: item.divisionId,
          label: item.name,
          value: item.divisionId,
        })) || [],
      emailAddress: emailAddress || '',
    } as any
    partnerFormik.setValues(partnerDetail)
    setPartnerTemp(partnerDetail)
  }

  const getPartner = async () => {
    const { partnerId } = params
    dispatch(updateLoading(true))
    await PartnerService.getPartner(partnerId as string)
      .then(({ data }: any) => {
        fillPartner(data)
      })
      .catch((errors: ErrorResponse[]) => {
        if (errors[0]?.field === 'id') {
          navigate(PathConstant.CUSTOMER_PARTNER_LIST)
        }
        dispatch(
          alertError({
            message: errors[0]?.message,
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const updatePartnerFromRedux = () => {
    const { partnerId } = params
    dispatch(updateLoading(true))
    dispatch(
      updatePartner({
        id: partnerId as string,
        requestBody: {
          ...partnerFormik.values,
          provinceIds: partnerFormik.values.provinceIds.map(
            (item: Province) => item.id
          ),
          contracts: [],
          website: partnerFormik.values.website?.trim(),
          locationId: partnerFormik.values.marketId,
          divisionIds:
            partnerFormik.values.divisionIds?.map(
              (div: OptionItem) => div.id
            ) || [],
          contactPersonId: partnerFormik.values.contactPersonId.id,
        },
      })
    )
      .unwrap()
      .then(() => {
        getPartner()
      })
    dispatch(updateLoading(false))
  }

  const handleSavePartner = () => {
    if (isDetailPage) {
      setIsShowModalConfirm(true)
    } else {
      createPartnerFromRedux()
    }
  }

  const handleClickSubmit = () => {
    setFlagSubmit(true)
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const handleUpdateCustomer = () => {
    updatePartnerFromRedux()
    handleClickSubmit()
  }

  useEffect(() => {
    if (isDetailPage) {
      ;(async () => {
        const { partnerId } = params
        if (!partnerId) return
        await getPartner()
        dispatch(getContractsByPartnerId(partnerId))
      })()
    }
  }, [])

  useEffect(() => {
    setShowDialog(isChangeData)
  }, [isChangeData])

  useEffect(() => {
    const _partnerDetail = {
      ...partnerFormik.values,
      contracts: stateContracts.map(item => ({
        ...item,
        group: item.group.id,
        type: item.type?.id || '',
        status: item.status.id,
      })) as any,
    }
    partnerFormik.setValues(_partnerDetail)
    setPartnerTemp(_partnerDetail)
  }, [stateContracts])

  useEffect(() => {
    return () => {
      //reset contracts in redux store
      dispatch(setStateContracts([]))
    }
  }, [])

  useEffect(() => {
    if (partnerTemp.name) {
      scrollToTop()
    }
  }, [partnerTemp])

  return (
    <CommonScreenLayout
      useBackPage
      backLabel={i18Customer('LB_BACK_TO_PARTNER_LIST')}
      onBack={handleBackPage}
    >
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      <form onSubmit={partnerFormik.handleSubmit}>
        <PartnerGeneralInformation
          flagSubmit={flagSubmit}
          partnerFormik={partnerFormik}
          skillSetsDetail={skillSetsDetail}
        />
        <PartnerContactInformation partnerFormik={partnerFormik} />
        {isDetailPage && (
          <PartnerContractInformation
            partnerFormik={partnerFormik}
            isDetailPage={isDetailPage}
          />
        )}
        {isDetailPage && (
          <PartnerProjectInformation listProjects={listProjects} />
        )}
        {!!permissions.usePartnerUpdate && (
          <FormLayout
            top={24}
            display={'flex'}
            styles={{ justifyContent: 'end' }}
          >
            <CommonButton
              type="submit"
              height={40}
              width={96}
              disabled={isButtonSubmitDisabled}
              onClick={handleClickSubmit}
            >
              {i18(isDetailPage ? 'LB_UPDATE' : 'LB_SUBMIT')}
            </CommonButton>
          </FormLayout>
        )}
      </form>
      <ModalConfirm
        title={i18('TXT_UPDATE_INFORMATION')}
        description={`Do you wish to update Partner ${params.partnerId || ''}?`}
        open={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        onSubmit={handleUpdateCustomer}
      />
    </CommonScreenLayout>
  )
}

export default PartnerDetail
