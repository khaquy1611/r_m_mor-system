import { IFileUpload } from '@/modules/staff/components/UploadFile'
import { getIframeLink } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { isEmpty } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConditionalRender from '../ConditionalRender'
import LoadingFallback from '../LoadingFallback/LoadingFallback'
import Modal from '../common/Modal'
import { downLoadImageUrl } from '@/modules/staff/reducer/thunk'
import { AsyncThunkAction, Dispatch, AnyAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store'
import { StaffState } from '@/modules/staff/types'
import { staffSelector } from '@/modules/staff/reducer/staff'
import { downloadFileFromByteArr } from '@/modules/project/utils'

interface ModalPreviewImagesProps {
  titleMessage: string
  open: boolean
  labelSubmit?: any
  onClose: () => void
  url: string
  type?: string
  file?: IFileUpload
  fileId?: string
}

const ModalPreviewImages = ({
  open,
  onClose,
  labelSubmit,
  titleMessage,
  url,
  type,
  fileId,
}: ModalPreviewImagesProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const iframeRef: any = useRef(null)
  const interval: any = useRef()
  const [loaded, setLoaded] = useState(false)
  const { fileContent, fileName }: StaffState = useSelector(staffSelector)
  const dispatch = useDispatch<AppDispatch>()
  const handleClose = () => {
    onClose()
  }
  const handleSubmit = () => {
    if (!isEmpty(url)) {
      downloadFileFromByteArr({ fileName, fileContent })
    }
    handleClose()
  }

  useEffect(() => {
    dispatch(downLoadImageUrl({ fileId: fileId }))
  }, [])
  const clearCheckingInterval = () => {
    clearInterval(interval.current)
    setLoaded(true)
  }
  const onIframeLoaded = () => {
    clearCheckingInterval()
  }

  const handleGetFrameLink: string = useMemo(() => {
    return getIframeLink(url)
  }, [])
  useEffect(() => {
    interval.current = setInterval(() => {
      try {
        if (iframeRef.current.contentDocument.URL === 'about:blank') {
          iframeRef.current.src = getIframeLink(url)
        }
      } catch (e) {
        onIframeLoaded()
      }
    })
    return clearCheckingInterval
  }, [])
  return (
    <Modal
      className={classes.rootModal}
      width={'100%'}
      open={open}
      title={titleMessage}
      labelSubmit={labelSubmit || i18('LB_DOWNLOAD')}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitDisabled={!loaded}
    >
      <Box className={classes.foreground}>
        <ConditionalRender conditional={type === 'image'}>
          <>
            <img
              className={type}
              src={url}
              style={{
                width: 'unset',
              }}
            ></img>
            {!loaded && <LoadingFallback pageLoading={loaded} />}
          </>
        </ConditionalRender>
        <ConditionalRender conditional={type !== 'image'}>
          <>
            <iframe
              ref={iframeRef}
              onLoad={onIframeLoaded}
              className={type}
              loading="lazy"
              frameBorder="0"
              allow="accelerometer; autoplay;
        encrypted-media; gyroscope;
        picture-in-picture"
              src={handleGetFrameLink}
              allowFullScreen
            ></iframe>
            {!loaded && <LoadingFallback pageLoading={loaded} />}
          </>
        </ConditionalRender>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootModal: {
    '& .MuiPaper-root': {
      width: '100vw',
      height: '100vh',
    },
    '& .modal': {
      height: '100%',
    },
    '& .modal-content': {
      padding: '0 !important',
      // height: '',
    },
  },
  description: {
    fontSize: '16px !important',
    wordBreak: 'break-all',
  },
  foreground: {
    background: theme.color.grey.secondary,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
    '& img': {},
    '& iframe': {
      width: '100%',
      height: '100%',
      overflow: 'scroll',
      display: 'flex',
      justifyContent: 'center',
    },
  },
  confirmed: {
    marginTop: theme.spacing(2),
  },
}))

export default ModalPreviewImages
