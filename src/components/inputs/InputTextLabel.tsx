import { LangConstant } from '@/const'
import { INPUT_TEXT_MAX_LENGTH } from '@/const/app.const'
import { EventInput } from '@/types'
import { Box, TextField, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import InputErrorMessage from '../common/InputErrorMessage'

interface PropTypes {
  keyName?: string
  type?: string
  name?: string
  label?: any
  require?: boolean
  placeholder?: any
  value?: string | null
  onChange?: Function
  maxLength?: number
  errorMessage?: string
  readonly?: boolean
  disabled?: boolean
  iconLeft?: ReactElement
  error?: boolean
  onFocus?: () => void
  endAdornment?: ReactElement | null
  onBlur?: () => void
  onMouseOver?: () => void
  onMouseOut?: () => void
  ignoreChars?: string[]
}

function InputTextLabel(props: PropTypes) {
  const {
    keyName = '',
    type = 'text',
    name,
    label,
    require,
    placeholder,
    value,
    onChange = () => {},
    errorMessage = '',
    readonly,
    iconLeft,
    error,
    maxLength = INPUT_TEXT_MAX_LENGTH,
    onFocus,
    disabled,
    endAdornment,
    onBlur,
    onMouseOver,
    onMouseOut,
    ignoreChars = [],
  } = props
  const classes = useStyles()
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)

  const inValid = useMemo(() => {
    return !!require ? !!error : !!error && !!errorMessage
  }, [errorMessage, error])

  const localValue: string = useMemo(() => {
    return value ? value : ''
  }, [value])

  const handleChange = (e: EventInput) => {
    onChange(e, keyName ?? '')
  }

  const onKeydown = (e: any) => {
    if (
      (e.code === 'Space' && !localValue.trim().length) ||
      ignoreChars.includes(e.key)
    ) {
      e.preventDefault()
    }
  }

  const handleFocus = () => {
    !!onFocus && onFocus()
  }

  const handleBlur = () => {
    !!onBlur && onBlur()
  }

  const handleMouseOver = () => {
    !!onMouseOver && onMouseOver()
  }

  const handleMouseOut = () => {
    !!onMouseOut && onMouseOut()
  }

  return (
    <Box className={classes.rootInputTextLabel}>
      {label && (
        <label
          htmlFor={name && `form-input-${name}`}
          className={clsx(classes.label)}
        >
          {label}
          {require ? <span className={clsx(classes.mark)}>*</span> : null}
        </label>
      )}
      <Box
        className={clsx(classes.inputWrapper, inValid && classes.errorInput)}
      >
        {iconLeft && iconLeft}
        <TextField
          label=""
          variant="outlined"
          type={type}
          name={name}
          id={'form-input-' + name}
          placeholder={placeholder}
          className={clsx(classes.input, disabled && classes.disabled)}
          value={localValue}
          disabled={disabled}
          error={inValid}
          onChange={handleChange}
          inputProps={{
            maxLength,
            readOnly: readonly,
          }}
          onKeyDown={onKeydown}
          onFocus={handleFocus}
          onWheel={(event: any) => event.target.blur()}
          onBlur={handleBlur}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        />
        {endAdornment && (
          <Box
            className={classes.endAdorment}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            {endAdornment}
          </Box>
        )}
      </Box>
      {inValid && (
        <InputErrorMessage
          className={classes.errorMessage}
          content={
            errorMessage ? errorMessage : i18nCommon('MSG_REQUIRE_FIELD')
          }
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputTextLabel: {
    color: theme.color.black.primary,
    fontSize: theme.typography.fontSize,
    lineHeight: '14px',
    width: '100%',
  },
  inputWrapper: {
    height: theme.spacing(5),
    position: 'relative',
    '& input': {
      color: theme.color.black.primary,
      fontSize: theme.typography.fontSize,
      lineHeight: '14px',
      borderRadius: theme.spacing(0.5),
      height: 40,
      padding: theme.spacing(0, 5, 0, 1.5),
    },
  },
  label: {
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  mark: {
    color: theme.color.error.secondary,
    marginLeft: theme.spacing(0.5),
  },
  input: {
    width: '100%',
    height: '100%',
    outline: 'none',
    border: 'none',
    borderRadius: theme.spacing(0.5),
    backgroundColor: '#FFFFFF',
  },
  errorInput: {
    borderColor: theme.color.error.primary,
  },
  disabled: {
    cursorPointer: 'none',
    background: theme.color.grey.tertiary,
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  endAdorment: {
    position: 'absolute',
    top: '50%',
    right: theme.spacing(2),
  },
}))

export default memo(InputTextLabel)
