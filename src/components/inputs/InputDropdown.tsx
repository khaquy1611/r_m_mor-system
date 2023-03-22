import { EventInput, OptionItem } from '@/types'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import InputErrorMessage from '@/components/common/InputErrorMessage'
import clsx from 'clsx'
import { memo, useEffect, useMemo, useState } from 'react'
import CloseIcon from '../icons/CloseIcon'
import { getTextEllipsis } from '@/utils'
import { useTranslation } from 'react-i18next'
import { LangConstant } from '@/const'
import InputTitle from '../common/InputTitle'

interface InputDropdownProps {
  width?: number | string
  value: string
  useLabel?: boolean
  label?: any
  placeholder?: any
  listOptions: OptionItem[]
  error?: boolean
  errorMessage?: any
  isDisable?: boolean
  onChange: (value: string, option?: OptionItem, keyName?: string) => void
  isShowInput?: boolean
  inputValue?: string
  onInputChange?: (value: string, event?: EventInput) => void
  inputError?: boolean
  ignoreOptionById?: string | number | undefined
  onOpen?: () => void
  isShowClearIcon?: boolean
  keyName?: string
  required?: boolean
}

const InputDropdown = ({
  value,
  listOptions,
  width = '100%',
  useLabel,
  placeholder,
  label,
  error,
  errorMessage,
  isDisable = false,
  onChange,
  isShowInput = false,
  inputValue,
  onInputChange = () => {},
  inputError = false,
  ignoreOptionById,
  onOpen,
  isShowClearIcon = true,
  keyName = '',
  required = false,
}: InputDropdownProps) => {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles()
  const [isShowCloseIcon, setIsShowCloseIcon] = useState(false)

  const conditionRenderPlaceholder = useMemo(() => {
    return (
      value !== '' &&
      listOptions
        .map((option: OptionItem) => option.id?.toString())
        .includes(value?.toString())
    )
  }, [value, listOptions])

  const valueLocal = useMemo(() => {
    const val = listOptions.find((option: OptionItem) => option.value == value)
    return val?.value?.toString() || ''
  }, [listOptions, value])

  const handleInputDropdownChange = (e: SelectChangeEvent) => {
    const value = e.target.value as string
    onChange(
      value,
      listOptions.find((option: OptionItem) => option.value == value),
      keyName ?? ''
    )
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
    onChange('', {}, keyName ?? '')
  }

  const handleInputChange = (event: EventInput) => {
    const { value } = event.target
    onInputChange(value, event)
  }

  const handleOpen = () => {
    !!onOpen && onOpen()
  }

  const handleBlur = () => {
    setIsShowCloseIcon(false)
  }
  return (
    <Box className={classes.rootFormItem} style={{ width }}>
      {!!label && <InputTitle title={label} required={required} />}
      <Box
        className={clsx(classes.rootInputDropdown, value && classes.valueExist)}
      >
        <FormControl
          className={error ? classes.error : ''}
          fullWidth
          error={error}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {useLabel && <InputLabel>{label}</InputLabel>}
          <Box
            className={clsx(
              isShowCloseIcon && value && !isDisable && isShowClearIcon
                ? classes.show
                : 'hidden',
              'custom-close-icon'
            )}
            onClick={handleClearValue}
          >
            <CloseIcon />
          </Box>
          <Select
            className={classes.select}
            value={valueLocal}
            label={useLabel && label}
            disabled={isDisable}
            MenuProps={{ PaperProps: { sx: { maxHeight: 500 } } }}
            displayEmpty
            onChange={handleInputDropdownChange}
            renderValue={
              conditionRenderPlaceholder
                ? undefined
                : () => <Box className={classes.placeholder}>{placeholder}</Box>
            }
            onClose={() => setIsShowCloseIcon(false)}
            onOpen={handleOpen}
            onBlur={handleBlur}
          >
            {!!listOptions.length ? (
              listOptions.map((option: OptionItem) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  className={option.id === ignoreOptionById ? 'hidden' : ''}
                >
                  <Box title={option.label}>
                    {getTextEllipsis(option.label as string)}
                  </Box>
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">
                <Box>{i18nCommon('MSG_NO_DATA_AVAILABLE')}</Box>
              </MenuItem>
            )}
          </Select>

          {isShowInput && false && (
            <TextField
              error={inputError}
              placeholder="Note"
              className="input__text"
              value={inputValue}
              onChange={handleInputChange}
            />
          )}
        </FormControl>
        {(error || inputError) && (
          <InputErrorMessage
            className={classes.errorMessage}
            content={errorMessage}
          />
        )}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 14,
    lineHeight: 1,
  },
  rootInputDropdown: {
    width: '100%',
    '& .MuiFormLabel-root': {
      transform: 'translate(14px, 10px) scale(1)',
      color: theme.color.black.tertiary,
      fontSize: 14,

      '&.Mui-focused': {
        transform: 'translate(14px, -9px) scale(0.75)',
        fontSize: 16,
      },
    },

    '& .MuiSelect-select > div': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },

    '& .input__text': {
      marginTop: theme.spacing(2),
      '& input': {
        height: theme.spacing(5),
        padding: theme.spacing(0, 2),
      },
    },
  },
  valueExist: {
    '& .MuiFormLabel-root': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
  clearValue: {
    fontWeight: '700 !important',
  },
  placeholder: {
    color: `${theme.color.grey.fourth} !important`,
    fontSize: 14,
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  error: {
    '& fieldset': {
      borderColor: theme.color.error.primary,
    },
  },
  select: {
    backgroundColor: '#FFFFFF',
    height: theme.spacing(5),
    '& .MuiSelect-select': {
      paddingRight: '60px !important',
    },
    '&.Mui-disabled': {
      textFillColor: 'rgb(0 0 0 / 80%) !important',
      backgroundColor: theme.color.grey.tertiary,
    },
  },
  show: {},
}))

export default memo(InputDropdown)
