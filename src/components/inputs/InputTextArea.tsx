import { LangConstant } from '@/const'
import { INPUT_TEXTAREA_MAX_LENGTH } from '@/const/app.const'
import { Box, TextareaAutosize, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { CSSProperties, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import InputErrorMessage from '../common/InputErrorMessage'
import InputTitle from '../common/InputTitle'
import ConditionalRender from '../ConditionalRender'

interface PropType {
  keyName?: string
  placeholder?: any
  defaultValue?: string | number | readonly string[]
  onChange?: Function
  style?: CSSProperties
  minRows?: number
  maxRows?: number
  className?: string
  height?: number
  resize?: 'both' | 'vertical' | 'horizontal' | 'initial' | 'unset' | 'none'
  name?: string
  error?: boolean
  errorMessage?: any
  label?: string
  require?: boolean
  maxLength?: number
  disabled?: boolean
}

function InputTextArea(props: PropType) {
  const {
    placeholder,
    minRows,
    maxRows,
    defaultValue,
    style,
    onChange = () => {},
    height,
    className,
    resize = 'vertical',
    name,
    label,
    require = false,
    error,
    errorMessage,
    keyName = 'description',
    maxLength = INPUT_TEXTAREA_MAX_LENGTH,
    disabled = false,
  } = props
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles()
  const customStyle = { ...style, height, resize }
  const handleChange = useCallback(
    (e: any) => {
      onChange(e, keyName)
    },
    [onChange]
  )
  return (
    <Box
      className={clsx(classes.rootFormItem, error && classes.error, className)}
    >
      {!!label && <InputTitle title={label} required={require} />}
      <Box className={clsx(classes.formContent, error && 'error')}>
        <TextareaAutosize
          disabled={disabled}
          placeholder={placeholder}
          minRows={minRows}
          maxRows={maxRows}
          value={defaultValue}
          onChange={handleChange}
          className={clsx(classes.rootInputTextArea, 'scrollbar', className)}
          style={customStyle}
          name={name}
          maxLength={maxLength}
        />
      </Box>

      <ConditionalRender conditional={!!error && !!errorMessage}>
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage ?? i18nCommon('MSG_REQUIRE_FIELD')}
        />
      </ConditionalRender>
    </Box>
  )
}

export default memo(InputTextArea)

const useStyles = makeStyles((theme: Theme) => ({
  rootInputTextArea: {
    width: '100%',
    height: theme.spacing(19.25),
    padding: theme.spacing(1.5, 1.5),
    fontSize: 14,
    lineHeight: 1.4,
    color: theme.color.black.primary,
    borderColor: theme.color.grey.primary,
    borderRadius: theme.spacing(0.5),
    overflow: 'auto !important',
    minHeight: 50,
    '& *': {
      fontFamily: 'Roboto',
    },
    '&::-webkit-input-placeholder': {
      color: `${theme.color.grey.fourth} !important`,
    },
    '&:hover': {
      border: `1px solid black`,
    },
    '&:focus-visible': {
      border: `2px solid ${theme.color.blue.primary}`,
      outline: 'none',
    },
  },
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: 14,
    lineHeight: 1,
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  formContent: {
    width: '100%',

    '&.error textarea': {
      borderColor: theme.color.error.primary,
    },
  },
  error: {
    '& textarea': {
      borderColor: theme.color.error.primary,
    },
  },
}))
