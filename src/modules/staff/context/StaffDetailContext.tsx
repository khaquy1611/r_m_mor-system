import { createContext, useContext, useRef } from 'react'
import useGeneralInformation from '../pages/staff-detail/GeneralInformationStaff/hook/useGeneralInformation'

const ProjectDetailContext = createContext<any>(null)

export function useStaffDetailContext() {
  const contextValue = useContext(ProjectDetailContext)
  if (contextValue === null) throw Error('context has not been Provider')
  return contextValue
}

export default function StaffDetailProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    handleShowModalCancelUpdateInformation,
    handleShowModalEditInformation,
    handleLeaderGradeTitleChange,
    handleGradeTitleChange,
    handleLeaderGradeChange,
    handleGradeChange,
    handleSubmit,
    handleDirectManagerChange,
    handleSelectPosition,
    handleDivisionChange,
    handleBranchChange,
    handleChangeDate,
    handleDateOnBoardError,
    handleBirthDayError,
    handleSelectChange,
    handleInputChange,
    handleNextStep,
    handleChangeFile,
    birthDayError,
    dateOnBoardError,
    setIsChangeCertificate,
    isShowModalConfirm,
    setIsShowModalConfirm,
    showEditInformation,
    setShowEditInformation,
    isShowModalConfirmCancelUpdate,
    setShowModalConfirmCancelUpdate,
    staffId,
    isViewDetail,
    isChangeData,
    isChangeDataCreate,
    isDisabledButtonSubmit,
    DATE_FORMAT,
    formik,
    resetFormik,
  } = useGeneralInformation()

  return (
    <ProjectDetailContext.Provider
      value={{
        handleShowModalCancelUpdateInformation,
        handleShowModalEditInformation,
        handleLeaderGradeTitleChange,
        handleGradeTitleChange,
        handleLeaderGradeChange,
        handleGradeChange,
        handleSubmit,
        handleDirectManagerChange,
        handleSelectPosition,
        handleDivisionChange,
        handleBranchChange,
        handleChangeDate,
        handleDateOnBoardError,
        handleBirthDayError,
        handleSelectChange,
        handleInputChange,
        handleNextStep,
        handleChangeFile,
        birthDayError,
        dateOnBoardError,
        setIsChangeCertificate,
        isShowModalConfirm,
        setIsShowModalConfirm,
        showEditInformation,
        setShowEditInformation,
        isShowModalConfirmCancelUpdate,
        setShowModalConfirmCancelUpdate,
        staffId,
        isViewDetail,
        isChangeData,
        isChangeDataCreate,
        isDisabledButtonSubmit,
        DATE_FORMAT,
        formik,
        resetFormik,
      }}
    >
      {children}
    </ProjectDetailContext.Provider>
  )
}
