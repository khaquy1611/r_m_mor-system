import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ModalPreviewImages from '@/components/modal/ModalPreviewImages'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import { LangConstant, TableConstant } from '@/const'
import { FILE_MAX_LENGTH, FILE_MAX_SIZE } from '@/const/app.const'
import UploadFile, { IFileUpload } from '@/modules/staff/components/UploadFile'
import { ACCEPT_DEFAULT_UPLOAD } from '@/const/app.const'
import { setCertificates, staffSelector } from '@/modules/staff/reducer/staff'
import {
  createCertificate,
  getCertificates,
} from '@/modules/staff/reducer/thunk'
import { StaffState } from '@/modules/staff/types'
import { alertError, alertSuccess, updateAlert } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { cloneDeep, isEmpty } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import StringFormat from 'string-format'
import { deleteFile } from '@/reducer/common'
import { AuthState, selectAuth } from '@/reducer/auth'
interface IProps {
  isViewDetail: boolean
  staffId: string
}

function CertificateCard({ isViewDetail, staffId }: IProps) {
  //Const
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const dispatch = useDispatch<AppDispatch>()

  const { certificates, totalElementsCertificate }: StaffState =
    useSelector(staffSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  //State
  const [pageUploadCurrent, setPageUploadCurrent] = useState(
    TableConstant.PAGE_CURRENT_DEFAULT
  )
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)
  const [popupDeleteCertificate, setPopupDeleteCertificate] = useState({
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

  const rowsPageCurrent = useMemo(() => {
    let rowsPage = cloneDeep(certificates)
    isViewDetail
      ? rowsPage
      : (rowsPage = rowsPage.slice(
          (pageUploadCurrent - 1) * pageLimit,
          (pageUploadCurrent - 1) * pageLimit + pageLimit
        ))
    return rowsPage
  }, [certificates, pageUploadCurrent, pageLimit])

  const totalElements = useMemo(
    () => (isViewDetail ? totalElementsCertificate : certificates.length),
    [totalElementsCertificate, isViewDetail, certificates]
  )

  const sortData = (arrayFile: IFileUpload[]) => {
    return arrayFile.sort((a, b) => a.lastUpdate - b.lastUpdate).reverse()
  }

  const handleChangeFiles = (files: any, fileRejections?: any[]) => {
    const newFiles = files.map((item: any, index: number) => ({
      file: item,
      status: item?.size <= FILE_MAX_SIZE ? 'success' : 'error',
      loading: 100,
      filename: item?.path,
      id: `${item?.lastModified}-${index}-${item?.size}`,
      size: item?.size,
      lastUpdate: new Date().getTime(),
      type: item?.type,
      url: '',
    }))
    const listFilesTemp = [...certificates, ...newFiles]
    const isMaxLengthError = isViewDetail
      ? newFiles.length + totalElementsCertificate > FILE_MAX_LENGTH
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
                'PNG, JPG, DOX, DOCX, PDF '
              ),
            })
          )
        }
      })
    } else {
      let fileName = newFiles[0]?.filename
      if (isViewDetail) {
        dispatch(setCertificates(listFilesTemp.reverse()))
        let formData = new FormData()
        files.forEach((item: any) => {
          formData.append('certificate', item)
        })
        dispatch(createCertificate({ staffId, data: formData }))
          .unwrap()
          .then(() => {
            alertUploadFileSuccess(files.length, fileName)
            dispatch(
              getCertificates({
                staffId: staffId,
                queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
              })
            )
          })
      } else {
        dispatch(setCertificates(sortData(listFilesTemp)))
        alertUploadFileSuccess(files.length, fileName)
      }
    }
  }

  const handleDeleteFile = (id: string, file?: IFileUpload) => {
    setPopupDeleteCertificate({ isShow: true, id, name: file?.filename ?? '' })
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
  const handleChangePage = (_: unknown, newPage: number) => {
    if (isViewDetail) {
      dispatch(
        getCertificates({
          staffId: staffId,
          queries: { pageNum: newPage, pageSize: pageLimit },
        })
      )
    }
    setPageUploadCurrent(newPage)
  }

  const handleChangeRowsPerPage = (event: EventInput) => {
    const pageCurrent = TableConstant.PAGE_CURRENT_DEFAULT
    const pageSize = parseInt(event.target.value, 10)
    setPageUploadCurrent(pageCurrent)
    setPageLimit(pageSize)
    if (isViewDetail) {
      dispatch(
        getCertificates({
          staffId: staffId,
          queries: { pageNum: pageCurrent, pageSize },
        })
      )
    }
  }

  const handleSubmitPopupDelete = () => {
    let itemFound = rowsPageCurrent.find(
      (item: IFileUpload) => item.id === popupDeleteCertificate.id
    )
    if (isViewDetail && itemFound && !isEmpty(itemFound.url)) {
      dispatch(
        deleteFile({
          fileName: popupDeleteCertificate.name,
          id: popupDeleteCertificate.id,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            getCertificates({
              staffId: staffId,
              queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
            })
          )
        })
    } else {
      const newFiles = cloneDeep(certificates)
      const fileIndex = newFiles.findIndex(
        (item: IFileUpload) => item.id === popupDeleteCertificate.id
      )
      if (fileIndex > -1) {
        newFiles.splice(fileIndex, 1)
        dispatch(setCertificates(sortData(newFiles)))
        dispatch(
          alertSuccess({
            message: i18next.t('common:MSG_DELETE_FILE_SUCCESS', {
              fileName: popupDeleteCertificate.name,
            }),
          })
        )
      }
    }
  }

  const handleClosePopupDelete = () => {
    setPopupDeleteCertificate({ id: '', isShow: false, name: '' })
  }

  const handleClosePopupPreviews = () => {
    setPopupPreviewsImages({ ...popupPreviewsImages, isShow: false })
  }

  const alertUploadFileSuccess = (num: number, fileName: string) => {
    dispatch(
      alertSuccess({
        message:
          num > 1
            ? i18('MSG_UPLOAD_FILE_CERTIFICATE_SUCCESS')
            : StringFormat(i18('MSG_UPLOAD_FILE_SUCCESS'), fileName),
      })
    )
  }

  //Effect
  useEffect(() => {
    if (isViewDetail) {
      dispatch(
        getCertificates({
          staffId,
          queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
        })
      )
    }
  }, [isViewDetail])

  return (
    <CardForm
      title={i18Staff('TXT_CERTIFICATE_INFORMATION') as string}
      className={classes.rootCertificateCard}
    >
      <UploadFile
        useDelete={!isViewDetail || permissions.useStaffUpdate}
        readonly={isViewDetail && !permissions.useStaffUpdate}
        listFileUpload={rowsPageCurrent}
        acceptUpload={ACCEPT_DEFAULT_UPLOAD}
        onChangeFiles={handleChangeFiles}
        onDeleteFile={handleDeleteFile}
        onPreviewFiles={handlePreviewFiles}
        usePreview={isViewDetail}
      />
      <ConditionalRender conditional={!!totalElements} fallback={''}>
        <TablePaginationShare
          rowsPerPageOptions={[]}
          totalElements={totalElements}
          pageLimit={pageLimit}
          currentPage={pageUploadCurrent}
          onChangePage={handleChangePage}
          onChangeLimitPage={handleChangeRowsPerPage}
        />
      </ConditionalRender>
      {popupDeleteCertificate.isShow && (
        <ModalDeleteRecords
          open
          titleMessage={i18Staff('TXT_DELETE_STAFF_CERTIFICATE')}
          subMessage={StringFormat(
            i18('TXT_DELETE_FILE_CONFIRMED'),
            popupDeleteCertificate.name
          )}
          onClose={handleClosePopupDelete}
          onSubmit={handleSubmitPopupDelete}
        />
      )}
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
    </CardForm>
  )
}
const useStyles = makeStyles((themeMui: Theme) => ({
  rootCertificateCard: {
    height: '100%',
  },
}))
export default CertificateCard
