import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ModalPreviewImages from '@/components/modal/ModalPreviewImages'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import { LangConstant, TableConstant } from '@/const'
import { ACCEPT_CONTRACT_UPLOAD, FILE_MAX_LENGTH } from '@/const/app.const'
import StaffStepAction from '@/modules/staff/components/StaffStepAction'
import UploadFile, { IFileUpload } from '@/modules/staff/components/UploadFile'
import { CONFIG_STAFF_STEP } from '@/modules/staff/const'
import { setContracts, staffSelector } from '@/modules/staff/reducer/staff'
import { createContract, getContracts } from '@/modules/staff/reducer/thunk'
import { StaffState } from '@/modules/staff/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { deleteFile } from '@/reducer/common'
import { alertError, alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { cloneDeep, isEmpty } from 'lodash'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'

interface IProps {
  onSubmit: () => void
}
const Contract = ({ onSubmit }: IProps) => {
  //const
  const params = useParams()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const { t: i18 } = useTranslation()

  const { permissions }: AuthState = useSelector(selectAuth)

  const alertUploadFileSuccess = (num: number, fileName: string) => {
    dispatch(
      alertSuccess({
        message:
          num > 1
            ? i18('MSG_CREATE_CONTRACT_SUCCESS')
            : StringFormat(i18('MSG_UPLOAD_FILE_SUCCESS'), fileName),
      })
    )
  }

  const [pageUploadCurrent, setPageUploadCurrent] = useState(
    TableConstant.PAGE_CURRENT_DEFAULT
  )
  const { activeStep, contracts, totalElementsContract }: StaffState =
    useSelector(staffSelector)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)
  const [popupDeleteContract, setPopupDeleteContract] = useState({
    isShow: false,
    id: '',
    name: '',
  })
  const [popupPreviewsImages, setPopupPreviewsImages] = useState({
    isShow: false,
    id: '',
    name: '',
    previewImage: '',
    type: '',
  })

  const staffId: string | number = useMemo(() => {
    return params.staffId ?? ''
  }, [params.staffId])

  const isViewDetail = useMemo(() => {
    return !!staffId
  }, [staffId])

  const rowsPageCurrent: any[] = useMemo(() => {
    let rowsPage = cloneDeep(contracts)
    if (!isViewDetail) {
      rowsPage = rowsPage.slice(
        (pageUploadCurrent - 1) * pageLimit,
        (pageUploadCurrent - 1) * pageLimit + pageLimit
      )
    }
    return rowsPage
  }, [contracts, pageUploadCurrent, pageLimit])

  const sortData = (arrayFile: IFileUpload[]) => {
    return arrayFile.sort((a, b) => a.lastUpdate - b.lastUpdate).reverse()
  }
  const handleChangeFiles = (files: any[], fileRejections?: any[]) => {
    const newFiles = files.map((item: any, index: number) => ({
      file: item,
      status: 'success',
      loading: 100,
      filename: item?.path,
      id: `${item?.lastModified}-${index}-${item?.size}`,
      size: item?.size,
      lastUpdate: new Date().getTime(),
      type: item?.type,
      url: '',
    }))
    const listFilesTemp = [...contracts, ...newFiles]
    const isMaxLengthError = isViewDetail
      ? newFiles.length + totalElementsContract > FILE_MAX_LENGTH
      : listFilesTemp.length > FILE_MAX_LENGTH
    if (isMaxLengthError) {
      dispatch(
        alertError({
          message: StringFormat(i18('MSG_UPLOAD_MAX_NUMBER_FILE_ERROR'), '25'),
        })
      )
    } else if (fileRejections && fileRejections?.length > 0) {
      fileRejections.forEach((item: any) => {
        if (item.errors[0]?.code === 'file-too-large') {
          dispatch(
            alertError({
              message: StringFormat(i18('MSG_UPLOAD_FILE_MAX_SIZE_ERROR'), '5'),
            })
          )
        } else {
          dispatch(
            alertError({
              message: StringFormat(
                i18('MSG_UPLOAD_FILE_TYPE_ERROR'),
                'DOX, DOCX, PDF '
              ),
            })
          )
        }
      })
    } else {
      let fileName = newFiles[0]?.filename
      if (isViewDetail) {
        dispatch(setContracts(listFilesTemp))
        let formData = new FormData()
        files.forEach((item: any) => {
          formData.append('contract', item)
        })
        dispatch(createContract({ staffId, data: formData }))
          .unwrap()
          .then(() => {
            alertUploadFileSuccess(files.length, fileName)
            dispatch(
              getContracts({
                staffId: staffId,
                queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
              })
            )
          })
      } else {
        dispatch(setContracts(sortData(listFilesTemp)))
        alertUploadFileSuccess(files.length, fileName)
      }
    }
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    if (isViewDetail) {
      dispatch(
        getContracts({
          staffId: staffId,
          queries: { pageNum: newPage, pageSize: pageLimit },
        })
      )
    }
    setPageUploadCurrent(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const pageCurrent = TableConstant.PAGE_CURRENT_DEFAULT
    const pageSize = parseInt(event.target.value, 10)
    setPageUploadCurrent(pageCurrent)
    setPageLimit(pageSize)
    if (isViewDetail) {
      dispatch(
        getContracts({
          staffId: staffId,
          queries: { pageNum: pageCurrent, pageSize },
        })
      )
    }
  }

  const handleNext = () => {
    onSubmit()
  }

  const handleDeleteFile = (id: string, file?: IFileUpload) => {
    setPopupDeleteContract({ id, isShow: true, name: file?.filename ?? '' })
  }

  const handlePreviewFiles = (id: string, file?: IFileUpload) => {
    setPopupPreviewsImages({
      isShow: true,
      id,
      name: file?.filename ?? '',
      previewImage: file?.url ?? '',
      type: file?.type?.split('/')[0] ?? '',
    })
  }

  const handleSubmitPopupDelete = () => {
    let itemFound = rowsPageCurrent.find(
      (item: IFileUpload) => item.id === popupDeleteContract.id
    )
    if (isViewDetail && itemFound && !isEmpty(itemFound.url)) {
      dispatch(
        deleteFile({
          fileName: popupDeleteContract.name,
          id: popupDeleteContract.id,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            getContracts({
              staffId: staffId,
              queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
            })
          )
        })
    } else {
      const newFiles = cloneDeep(contracts)
      const fileIndex = newFiles.findIndex(
        (item: IFileUpload) => item.id === popupDeleteContract.id
      )
      if (fileIndex > -1) {
        newFiles.splice(fileIndex, 1)
        dispatch(setContracts(newFiles))
        dispatch(
          alertSuccess({
            message: i18next.t('common:MSG_DELETE_FILE_SUCCESS', {
              fileName: popupDeleteContract.name,
            }),
          })
        )
      }
    }
  }

  const handleClosePopupDelete = () => {
    setPopupDeleteContract({ id: '', isShow: false, name: '' })
  }
  
  const handleClosePopupPreviews = () => {
    setPopupPreviewsImages({ ...popupPreviewsImages, isShow: false })
  }

  useEffect(() => {
    if (isViewDetail) {
      dispatch(
        getContracts({
          staffId: staffId,
          queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
        })
      )
    }
  }, [])

  return (
    <>
      <CardForm
        title={i18Staff('TXT_CONTRACT_INFORMATION') as string}
        className={classes.rootContract}
      >
        <UploadFile
          useDelete={!isViewDetail || permissions.useStaffUpdate}
          readonly={isViewDetail && !permissions.useStaffUpdate}
          listFileUpload={rowsPageCurrent}
          acceptUpload={ACCEPT_CONTRACT_UPLOAD}
          onDeleteFile={handleDeleteFile}
          onChangeFiles={handleChangeFiles}
          onPreviewFiles={handlePreviewFiles}
          usePreview={isViewDetail}
        />

        <ConditionalRender conditional={!!contracts.length} fallback={''}>
          <TablePaginationShare
            rowsPerPageOptions={[]}
            totalElements={
              isViewDetail ? totalElementsContract : contracts.length
            }
            pageLimit={pageLimit}
            currentPage={pageUploadCurrent}
            onChangePage={handleChangePage}
            onChangeLimitPage={handleChangeRowsPerPage}
          />
        </ConditionalRender>
      </CardForm>
      <ConditionalRender conditional={!isViewDetail} fallback={''}>
        <StaffStepAction
          configSteps={CONFIG_STAFF_STEP}
          activeStep={activeStep}
          onNext={handleNext}
        />
      </ConditionalRender>

      <ModalDeleteRecords
        titleMessage={i18Staff('TXT_DELETE_STAFF_CONTRACT')}
        subMessage={StringFormat(
          i18('TXT_DELETE_FILE_CONFIRMED'),
          popupDeleteContract.name
        )}
        open={popupDeleteContract.isShow}
        onClose={handleClosePopupDelete}
        onSubmit={handleSubmitPopupDelete}
      />
      {popupPreviewsImages.isShow && (
        <ModalPreviewImages
          fileId={popupPreviewsImages.id}
          titleMessage={popupPreviewsImages.name}
          type={popupPreviewsImages.type}
          url={popupPreviewsImages.previewImage}
          open={popupPreviewsImages.isShow}
          onClose={handleClosePopupPreviews}
        />
      )}
    </>
  )
}
const useStyles = makeStyles((themeMui: Theme) => ({
  rootContract: {
    height: '100%',
  },
}))
export default Contract
