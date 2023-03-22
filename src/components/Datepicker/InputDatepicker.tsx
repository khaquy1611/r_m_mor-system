import { LangConstant } from '@/const'
import { EventInput } from '@/types'
import { Box, Theme } from '@mui/material'
import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import clsx from 'clsx'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputErrorMessage from '../common/InputErrorMessage'
import InputTitle from '../common/InputTitle'
import ConditionalRender from '../ConditionalRender'
import CloseIcon from '../icons/CloseIcon'

interface PropTypes {
  keyName?: string
  placeholder?: string
  onChange?: Function
  className?: string
  disabled?: boolean
  inputRef?: any
  maxDate?: Date | null
  minDate?: Date | null
  value?: Date | number | null
  inputFormat?: string
  error?: boolean
  errorMessage?: string
  label?: string | null
  require?: boolean
  useLabel?: boolean
  width?: string | number
  flagReset?: boolean
  onError?: (error: string | null) => void
  views?: Array<'day' | 'month' | 'year'>
  openTo?: 'day' | 'month' | 'year'
  isShowClearIcon?: boolean
  allowedYears?: string[]
  defaultOpen?: boolean
  onClose?: () => void
}

function InputDatePicker(props: PropTypes) {
  const {
    placeholder,
    onChange = (dateSelected?: any, keyName?: string) => {},
    value,
    inputFormat = 'DD/MM/YYYY',
    label = '',
    error,
    require = false,
    errorMessage,
    useLabel,
    className,
    minDate,
    maxDate,
    width,
    disabled,
    onError,
    flagReset,
    keyName = '',
    views = ['year', 'day'],
    openTo = 'day',
    isShowClearIcon = true,
    allowedYears = [],
    defaultOpen = false,
    onClose,
  } = props
  const classes = useStyles()
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const styleRootFormItem = { width }

  const inputRef = useRef<HTMLInputElement | null>(null)
  const rootPopoverRef = useRef<HTMLInputElement | Element | null>(null)

  const [valueLocal, setValueLocal] = useState<Date | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [isShowCloseIcon, setIsShowCloseIcon] = useState(false)
  const [open, setOpen] = useState(defaultOpen)

  const errorLocal = useMemo(() => {
    return !!error && !!errorMessage
  }, [error])

  const onDatePickerChange = (newValue: any) => {
    let dateSelected = null
    if (newValue && newValue.isValid()) {
      dateSelected = newValue.toDate()
    }
    setValueLocal(newValue)
    onChange(dateSelected, keyName ?? '')
  }

  const handleInputChange = ({ target }: EventInput) => {
    setInputValue(target.value)
  }

  const handleMouseOver = () => {
    if (!isShowClearIcon) return
    setIsShowCloseIcon(true)
  }
  const handleMouseOut = () => {
    if (!isShowClearIcon) return
    setIsShowCloseIcon(false)
  }
  const handleClearValue = () => {
    setInputValue('')
    setValueLocal(null)
    onChange(null, keyName ?? '')
  }

  const setYearOptionDisabled = () => {
    const rootContainer = document.querySelector('.MuiPickersPopper-root')
    rootPopoverRef.current = rootContainer
    const yearsEl = Array.from(
      document.querySelectorAll<HTMLElement>('.PrivatePickersYear-root button')
    )
    if (yearsEl) {
      yearsEl.forEach(year => {
        if (!allowedYears.includes(year.innerText)) {
          year.style.color = '#C4C4C4'
          year.style.pointerEvents = 'none'
        }
      })
    }
  }

  useEffect(() => {
    if (value) {
      setValueLocal(typeof value !== 'number' ? value : new Date(+value))
    } else {
      if (!inputValue) {
        setValueLocal(null)
      }
    }
  }, [value])

  useEffect(() => {
    if (flagReset) {
      setValueLocal(null)
    }
  }, [flagReset])

  useEffect(() => {
    if (open && allowedYears.length) {
      setTimeout(() => {
        setYearOptionDisabled()
      })
    }
  }, [open, allowedYears])

  useEffect(() => {
    setOpen(defaultOpen)
  }, [defaultOpen])

  return (
    <Box
      className={clsx(classes.rootFormItem, className)}
      style={styleRootFormItem}
    >
      {!useLabel && !!label && <InputTitle title={label} required={require} />}
      <Box className={classes.formContent} style={styleRootFormItem}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label={!!useLabel ? label : ''}
            value={valueLocal}
            onChange={onDatePickerChange}
            renderInput={params => (
              <Box
                className={classes.datepickerView}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true,
                    placeholder:
                      placeholder || (i18Common('PLH_SELECT_DATE') as string),
                  }}
                  onChange={handleInputChange}
                  onClick={() => setOpen(true)}
                />
                { 
                  <Box
                    className={clsx(
                      isShowCloseIcon && props.value && isShowClearIcon
                        ? ''
                        : 'hidden',
                      'custom-close-icon'
                    )}
                    onClick={handleClearValue}
                  >
                    <CloseIcon />
                  </Box>
                }
              </Box>
            )}
            inputFormat={inputFormat}
            className={clsx(classes.rootDatePicker, error && classes.error)}
            inputRef={inputRef}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            onError={onError}
            views={views}
            openTo={openTo}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => {
              setOpen(false)
              !!onClose && onClose()
            }}
          />
        </LocalizationProvider>
      </Box>

      <ConditionalRender conditional={errorLocal}>
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage || ''}
        />
      </ConditionalRender>
    </Box>
  )
}

export default memo(InputDatePicker)

const useStyles = makeStyles((theme: Theme) => ({
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: 14,
    lineHeight: 1,
  },
  formContent: {
    width: theme.spacing(20),
    minWidth: theme.spacing(20),
  },
  rootDatePicker: {
    width: '100%',
    height: theme.spacing(5),
    cursor: 'pointer',
    '& > div': {
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
    },
    '& input': {
      padding: '8px 14px',
      fontSize: 14,
      lineHeight: 1,
      color: theme.color.black.primary,
      cursor: 'pointer',
    },
  },
  error: {
    '& fieldset': {
      borderColor: theme.color.error.primary,
    },
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  datepickerView: {
    width: '100%',
    position: 'relative',
    display: 'inline-block',
  },
}))
