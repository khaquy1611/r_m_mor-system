import ConditionalRender from '@/components/ConditionalRender'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactNode } from 'react'

interface PropTypes {
  title: string
  padding?: number
  children?: ReactNode
  className?: string
  classNameTitle?: string
  childCompEnd?: any
}

function CardForm(props: PropTypes) {
  const { title, padding, children, classNameTitle, className, childCompEnd } =
    props

  const classes = useStyles()
  return (
    <Box className={clsx(classes.wrapper, className)} style={{ padding }}>
      <Box className={clsx(classes.formTitle, classNameTitle)}>
        <Box className="title">{title}</Box>
        <Box className="button-wrap">
          <ConditionalRender conditional={!!childCompEnd}>
            {childCompEnd}
          </ConditionalRender>
        </Box>
      </Box>
      {children}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: theme.spacing(3),
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: theme.spacing(0.5),
    '&:not(:first-child)': {
      marginTop: theme.spacing(3),
    },
  },
  formTitle: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(0.5),
    background: theme.color.grey.tertiary,
    color: theme.color.black.primary,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: '24px',
    minHeight: theme.spacing(7),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .title': {
      display: 'flex',
      alignItem: 'center',
    },
  },
}))

export default CardForm
