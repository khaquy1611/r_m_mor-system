import CardForm from '@/components/Form/CardForm'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ModalPreviewImages from '@/components/modal/ModalPreviewImages'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import { LangConstant, TableConstant } from '@/const'
import {
  ACCEPT_CONTRACT_UPLOAD,
  FILE_MAX_LENGTH,
  FILE_MAX_SIZE,
} from '@/const/app.const'
import UploadFile from '@/modules/staff/components/UploadFile'
import { AuthState, selectAuth } from '@/reducer/auth'
import { deleteFile } from '@/reducer/common'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, IFileUpload } from '@/types'
import { isEmpty, update } from 'lodash'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  contractSelector,
  IContractState,
  setDocuments,
} from '../../reducer/contract'
import { getContractUploadDocuments } from '../../reducer/thunk'
import { ContractService } from '../../services'

interface ContractUploadDocumentProps {
  isDetailPage: boolean
}

const ContractUploadDocuments = ({
  isDetailPage,
}: ContractUploadDocumentProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)
  const { t: i18 } = useTranslation()
  const { documents, totalDocs }: IContractState = useSelector(contractSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [pageUploadCurrent, setPageUploadCurrent] = useState(
    TableConstant.PAGE_CURRENT_DEFAULT
  )
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)
  const [modalDeleteDocument, setModalDeleteDocument] = useState({
    isShow: false,
    id: '',
    name: '',
  })
  const [modalPreviewsImages, setModalPreviewsImages] = useState({
    isShow: false,
    id: '',
    name: '',
    previewImage: '',
    type: '',
  })

  const rowsPageCurrent = useMemo(() => {
    let rowsPage = structuredClone(documents)
    isDetailPage
      ? rowsPage
      : (rowsPage = rowsPage.slice(
          (pageUploadCurrent - 1) * pageLimit,
          (pageUploadCurrent - 1) * pageLimit + pageLimit
        ))
    return rowsPage
  }, [documents, pageUploadCurrent, pageLimit])

  const handleCloseModalDeleteDocument = () => {
    setModalDeleteDocument({ id: '', isShow: false, name: '' })
  }

  const handleDeleteFile = (id: string, file?: IFileUpload) => {
    setModalDeleteDocument({
      isShow: true,
      id,
      name: file?.filename ?? '',
    })
  }

  const sortData = (arrayFile: IFileUpload[]) => {
    return arrayFile.sort((a, b) => a.lastUpdate - b.lastUpdate).reverse()
  }

  const deleteDocumentWithAPI = () => {
    dispatch(updateLoading(true))
    dispatch(
      deleteFile({
        fileName: modalDeleteDocument.name,
        id: modalDeleteDocument.id,
      })
    )
      .unwrap()
      .then(() => {
        getDocuments({ pageNum: 1, pageSize: TableConstant.LIMIT_DEFAULT })
      })
  }

  const handleDeleteDocument = () => {
    let itemFound = rowsPageCurrent.find(
      (item: IFileUpload) => item.id === modalDeleteDocument.id
    )
    if (isDetailPage && itemFound && !isEmpty(itemFound.url)) {
      deleteDocumentWithAPI()
    } else {
      const newFiles = structuredClone(documents)
      const fileIndex = newFiles.findIndex(
        (item: IFileUpload) => item.id === modalDeleteDocument.id
      )
      if (fileIndex > -1) {
        newFiles.splice(fileIndex, 1)
        dispatch(setDocuments(sortData(newFiles)))
        dispatch(
          alertSuccess({
            message: i18('MSG_DELETE_FILE_SUCCESS', {
              fileName: modalDeleteDocument.name,
            }),
          })
        )
      }
    }
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

  const createContractDocumentsWithAPI = (
    filesRequestBody: any,
    listFilesTemp: any
  ) => {
    dispatch(updateLoading(true))
    const { contractId } = params
    let formData = new FormData()
    filesRequestBody.forEach((item: any) => {
      formData.append('certificate', item)
    })
    ContractService.createContractDocuments({
      contractId: contractId as string,
      formData,
    })
      .then(() => {
        alertUploadFileSuccess(
          filesRequestBody.length,
          listFilesTemp[0].filename
        )
        dispatch(setDocuments(listFilesTemp))
        dispatch(
          getContractUploadDocuments({
            contractId: contractId as string,
            queries: {
              pageNum: 1,
              pageSize: TableConstant.LIMIT_DEFAULT,
            },
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
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
    const listFilesTemp = [...newFiles, ...documents]
    const isMaxLengthError = isDetailPage
      ? newFiles.length + totalDocs > FILE_MAX_LENGTH
      : listFilesTemp.length > FILE_MAX_LENGTH
    if (isMaxLengthError) {
      dispatch(
        alertError({
          message: StringFormat(i18('MSG_UPLOAD_MAX_NUMBER_FILE_ERROR'), '25'),
        })
      )
      return
    }
    if (fileRejections && fileRejections?.length > 0) {
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
                'DOC, DOCX, PDF '
              ),
            })
          )
        }
      })
      return
    }
    let fileName = newFiles[0]?.filename
    if (isDetailPage) {
      createContractDocumentsWithAPI(files, listFilesTemp)
    } else {
      dispatch(setDocuments(sortData(listFilesTemp)))
      alertUploadFileSuccess(files.length, fileName)
    }
  }

  const getDocuments = (
    queries: { pageNum: number; pageSize: number },
    callback?: () => void
  ) => {
    dispatch(updateLoading(true))
    const { contractId } = params
    dispatch(
      getContractUploadDocuments({
        contractId: contractId as string,
        queries,
      })
    )
      .unwrap()
      .then(() => {
        !!callback && callback()
      })
      .finally(() => dispatch(updateLoading(false)))
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    if (isDetailPage) {
      getDocuments({ pageNum: newPage, pageSize: pageLimit }, () => {
        setPageUploadCurrent(newPage)
      })
    } else {
      setPageUploadCurrent(newPage)
    }
  }

  const handleRowsPerPageChange = (event: EventInput) => {
    const pageSize = parseInt(event.target.value, 10)
    if (isDetailPage) {
      getDocuments({ pageNum: 1, pageSize }, () => {
        setPageUploadCurrent(1)
        setPageLimit(pageSize)
      })
    } else {
      setPageUploadCurrent(1)
      setPageLimit(pageSize)
    }
  }

  const handleClosePopupPreviews = () => {
    setModalPreviewsImages({ ...modalPreviewsImages, isShow: false })
  }

  const handlePreviewFiles = (id: string, file?: IFileUpload) => {
    setModalPreviewsImages({
      isShow: true,
      id,
      name: file?.filename ?? '',
      previewImage: file?.url ?? '',
      type: file?.type?.split('/')[0] ?? '',
    })
  }

  return (
    <CardForm title={i18Contract('TXT_UPLOAD_DOCUMENTS')}>
      {modalDeleteDocument.isShow && (
        <ModalDeleteRecords
          open
          titleMessage={i18Contract('TXT_DELETE_DOCUMENT')}
          subMessage={StringFormat(
            i18('TXT_DELETE_FILE_CONFIRMED'),
            modalDeleteDocument.name
          )}
          onClose={handleCloseModalDeleteDocument}
          onSubmit={handleDeleteDocument}
        />
      )}
      {modalPreviewsImages.isShow && (
        <ModalPreviewImages
          open
          fileId={modalPreviewsImages.id}
          titleMessage={modalPreviewsImages.name}
          type={modalPreviewsImages.type}
          url={modalPreviewsImages.previewImage}
          onClose={handleClosePopupPreviews}
        />
      )}
      <UploadFile
        useDelete={!isDetailPage || permissions.useContractUpdate}
        readonly={isDetailPage && !permissions.useContractUpdate}
        listFileUpload={rowsPageCurrent}
        acceptUpload={ACCEPT_CONTRACT_UPLOAD}
        onDeleteFile={handleDeleteFile}
        onChangeFiles={handleChangeFiles}
        onPreviewFiles={handlePreviewFiles}
        usePreview={isDetailPage}
      />
      <TablePaginationShare
        rowsPerPageOptions={[]}
        totalElements={isDetailPage ? totalDocs : documents.length}
        pageLimit={pageLimit}
        currentPage={pageUploadCurrent}
        onChangePage={handlePageChange}
        onChangeLimitPage={handleRowsPerPageChange}
      />
    </CardForm>
  )
}

export default ContractUploadDocuments
