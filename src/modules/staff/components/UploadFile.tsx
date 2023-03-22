import { LangConstant } from '@/const'
import { FILE_MAX_LENGTH, FILE_MAX_SIZE } from '@/const/app.const'
import {
  CloudUpload,
  DeleteRounded,
  VisibilityRounded,
} from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import moment from 'moment'
import { useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
interface IProps {
  listFileUpload: IFileUpload[]
  acceptUpload?: any
  maxFile?: number
  maxSize?: number
  onChangeFiles: (listFiles: any[], fileRejections?: any[]) => void
  onDeleteFile: (id: string, file?: IFileUpload) => void
  onPreviewFiles: (id: string, file?: IFileUpload) => void
  usePreview?: boolean
  useDelete?: boolean
  readonly?: boolean
}
export interface IFileUpload {
  file?: any
  status: 'success' | 'error' | 'loading' | string
  loading: number
  filename: string
  id: string | number
  lastUpdate: number
  uploadDate?: number
  size?: number
  type?: string
  url?: string
  maxFile?: number
  maxSize?: number
}
const UploadFile = ({
  listFileUpload,
  acceptUpload = {},
  maxFile = FILE_MAX_LENGTH,
  maxSize = FILE_MAX_SIZE,
  onChangeFiles,
  onDeleteFile,
  onPreviewFiles,
  usePreview = true,
  useDelete = true,
  readonly = false,
}: IProps) => {
  const classes = useStyles()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)

  const onDrop = useCallback(
    (acceptedFiles: any[], fileRejections: any) => {
      onChangeFiles(acceptedFiles, fileRejections)
    },
    [listFileUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptUpload ?? {},
    maxFiles: maxFile,
    maxSize: maxSize,
  })

  const textFormatFile = useMemo(() => {
    let result = ''
    Object.values(acceptUpload).forEach((item: any, index: number) => {
      result = result + item.toString().toUpperCase().replaceAll('.', ' ')
      if (index < Object.values(acceptUpload).length - 1) {
        result = result + ','
      }
    })
    return result
  }, [acceptUpload])

  return (
    <Box className={classes.rootUploadFile}>
      {!readonly && (
        <Box
          className={clsx('dropzone', !readonly && classes.dropzoneHover)}
          {...getRootProps()}
          sx={{ pointerEvents: readonly ? 'none' : '' }}
        >
          <input {...getInputProps()} />
          <Box className="detail-upload">
            <CloudUpload className="icon-upload" />
            {isDragActive ? (
              <Box className="title-upload">
                {i18Staff('TXT_TITLE_DROP')}{' '}
                <span>{i18Staff('TXT_BROWSER')}</span>
              </Box>
            ) : (
              <Box className="title-upload">
                {i18Staff('TXT_TITLE_DRAG_AND_DROP')} <span></span>
              </Box>
            )}
            <Box className="sub-title-upload">
              {i18Staff('TXT_SUB_TITLE_DRAG_AND_DROP')}
              {textFormatFile}
            </Box>
          </Box>
        </Box>
      )}
      <Box className="files-upload">
        {listFileUpload.map((item: any, index: number) => (
          <Box key={index}>
            <Box key={item.id} className={clsx('file-item', item?.status)}>
              <Box className={'file-name'} title={item.filename}>
                <span className="name">{item.filename}: </span>
                <span className="modified">
                  {moment(item.lastUpdate).format('DD/MM/YYYY')}
                </span>
              </Box>
              <Box className="file-action">
                {!!usePreview && (
                  <VisibilityRounded
                    sx={{ cursor: 'pointer' }}
                    onClick={() => onPreviewFiles(item.id, item)}
                  />
                )}
                {useDelete && (
                  <DeleteRounded
                    sx={{ cursor: 'pointer' }}
                    onClick={() => onDeleteFile(item.id, item)}
                  />
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  dropzoneHover: {
    '&:hover': {
      backgroundColor: `${theme.color.grey.secondary} !important`,
    },
  },
  rootUploadFile: {
    '& .dropzone': {
      marginBottom: theme.spacing(3),
      background: '#F8F8FF',
      width: '100%',
      height: '156px',
      border: `1px solid ${theme.color.grey.secondary}`,
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      '& .detail-upload': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        '& .icon-upload': {
          color: theme.color.blue.primary,
          width: '70px',
          height: '50px',
        },
        '& .title-upload': {
          fontWeight: '700',
          fontSize: '16px',
          lineHeight: '24px',
          color: ' #0F0F0F',
          '& span': {
            color: 'blue',
            textDecorationLine: 'underline',
          },
        },
        '& .sub-title-upload': {
          fontWeight: '400',
          fontSize: '12px',
          lineHeight: '28px',
          color: '#676767',
        },
      },
    },
    '& .files-upload': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      '& .file-item': {
        padding: theme.spacing(1, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&.success': {
          border: `1px solid ${theme.color.grey.secondary}`,
          borderRadius: theme.spacing(0.5),
        },
        '&.error': {
          border: '1px solid #ff0000',
          borderRadius: theme.spacing(0.5),
        },
        '& .file-name': {
          width: '40%',
          wordBreak: 'break-word',
          '& .name': {
            fontWeight: 700,
            marginRight: theme.spacing(1),
          },
          '& .modified': {
            fontSize: 14,
          },
        },
        '& .file-date': {
          padding: '5px',
          fontSize: '14px',
          width: '40%',
          wordBreak: 'break-word',
        },
        '& .file-action': {
          display: 'flex',
          justifyContent: 'end',
          color: theme.color.black.secondary,
          alignItems: 'center',
          gap: theme.spacing(1),
        },
        '& .action__icon': {
          cursor: 'pointer',
          padding: theme.spacing(0.2),
          borderRadius: '50%',
        },
      },
    },
  },
  download: {},
  fileName: {
    marginTop: '5px',
    display: 'inline-block',
  },
}))
export default UploadFile
