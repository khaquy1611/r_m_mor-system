import { INPUT_CURRENCY_MAX_LENGTH } from '@/const/app.const'
import { EventInput } from '@/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { memo } from 'react'
import CurrencyInput from 'react-currency-input-field'

interface InputCurrencyProps {
  value: string | number | undefined
  placeholder?: any
  keyName?: string
  error?: boolean
  suffix?: string
  disabled?: boolean
  valueTemp?: string | number
  onChange: (
    value?: string,
    keyName?: string,
    valueTemp?: string | number | undefined
  ) => void
  useDot?: boolean
  maxLength?: number
  onFocus?: () => void
  ignoreChars?: string[]
}

const InputCurrency = ({
  value,
  placeholder,
  error,
  suffix = ' VND',
  disabled = false,
  onChange,
  valueTemp,
  useDot = true,
  maxLength = INPUT_CURRENCY_MAX_LENGTH,
  keyName = '',
  onFocus,
  ignoreChars = [],
}: InputCurrencyProps) => {
  const classes = useStyles()

  const handleChange = (newValue: any) => {
    onChange(newValue || '', keyName, valueTemp)
  }

  const onKeyDown = (e: any) => {
    if (
      ignoreChars.includes(e.key) ||
      e.key === '-' ||
      (e.key === '.' && !useDot)
    ) {
      e.preventDefault()
    }
  }

  const handleFocus = () => {
    !!onFocus && onFocus()
  }

  return (
    <Box className={classes.rootInputCurrency}>
      <CurrencyInput
        maxLength={maxLength}
        disabled={disabled}
        className={`currency-input ${error && 'error'}`}
        allowDecimals
        placeholder={placeholder}
        suffix={suffix}
        value={value}
        onValueChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputCurrency: {
    '& input': {
      color: theme.color.black.primary,
      fontSize: 14,

      '&.error': {
        borderColor: `${theme.color.error.primary} !important`,
      },

      '&::placeholder': {
        color: `${theme.color.grey.fourth} !important`,
      },
    },
    '& input[type="text"]:disabled': {
      background: theme.color.grey.tertiary,
    },
  },
}))

export default memo(InputCurrency)
