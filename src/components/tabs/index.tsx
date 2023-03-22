import { StepConfig } from '@/types'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

interface IProps {
  configTabs: StepConfig[]
  activeTab: number
  className?: string
  nonLinear?: boolean
  onClickTab?: (step: number) => void
  listStepHadFillData?: number[]
}

export default function CommonTabs(props: IProps) {
  const { configTabs, activeTab, className, onClickTab = () => {} } = props

  const classes = useStyles()

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    onClickTab(newTab)
  }

  return (
    <Box
      className={clsx(classes.rootTab, className)}
      sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}
    >
      <Tabs value={activeTab} onChange={handleChange}>
        {configTabs.map((item: StepConfig) => (
          <Tab
            key={item.step}
            label={item.label}
            style={{ textTransform: 'none' }}
            value={item.step}
          />
        ))}
      </Tabs>
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  rootTab: {
    marginBottom: '20px',
    '& .readonly': {
      pointerEvents: 'none',
    },
  },
}))
