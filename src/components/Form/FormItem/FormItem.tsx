import InputErrorMessage from '@/components/common/InputErrorMessage'
import ConditionalRender from '@/components/ConditionalRender'
import { LangConstant } from '@/const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type TypeProps = {
  children: ReactNode
  className?: string
  classLabel?: string
  label?: any
  require?: boolean
  errorMessage?: string
  error?: boolean
}

function FormItem({
  children,
  className,
  classLabel,
  label,
  errorMessage,
  error,
  require,
}: TypeProps): JSX.Element {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles()

  return (
    <Box className={clsx(classes.rootFormItem, className)}>
      <ConditionalRender conditional={!!label}>
        <Box className={clsx(classes.label, classLabel)}>
          {label}
          {require && <span className={clsx(classes.mark)}>*</span>}
        </Box>
      </ConditionalRender>

      <Box className={classes.formContent}>{children}</Box>

      <ConditionalRender conditional={!!error}>
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage ?? i18nCommon('MSG_REQUIRE_FIELD')}
        />
      </ConditionalRender>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: 14,
    lineHeight: 1,
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
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  formContent: {
    width: '100%',
  },
}))

export default memo(FormItem)
