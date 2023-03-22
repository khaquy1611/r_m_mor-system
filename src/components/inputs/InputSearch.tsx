import { EventInput } from '@/types'
import { Search } from '@mui/icons-material'
import { InputAdornment, TextField, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

interface InputSearchProps {
  width?: number | string
  label?: any
  value: string
  placeholder?: any
  onChange: (newVal: string) => void
}

const InputSearch = ({
  width = 320,
  value,
  label,
  placeholder = '',
  onChange,
}: InputSearchProps) => {
  const classes = useStyles({ width })

  const handleChange = (e: EventInput) => {
    onChange(e.target.value)
  }

  return (
    <TextField
      placeholder={placeholder}
      className={classes.rootInputSearch}
      value={value}
      variant="outlined"
      label={label}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      onChange={handleChange}
    />
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputSearch: {
    width: ({ width }: any) => width,
    height: theme.spacing(5),
    '& .MuiInputBase-root': {
      height: theme.spacing(5),
    },
  },
}))

export default InputSearch
