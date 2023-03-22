import Modal from '@/components/common/Modal'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

interface ModalProjectDetailProps {
  onClose: () => void
  open: boolean
  title: string
  dataProps: any
}

const ModalProjectDetail = ({
  title,
  open,
  onClose,
  dataProps,
}: ModalProjectDetailProps) => {
  const classes = useStyles()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      onSubmit={() => {}}
      hideFooter
    >
      <Box className={classes.projectDetail}>
        <FormLayout gap={24}>
          <FormItem label={'Project Code'}>
            <Box className="text__content">{dataProps.code}</Box>
          </FormItem>
          <FormItem label={'Project Name'}>
            <Box className="text__content">{dataProps.name}</Box>
          </FormItem>
        </FormLayout>
        <FormLayout gap={24} top={24}>
          <FormItem label={'Technology'}>
            <Box className="text__content">{dataProps.technology}</Box>
          </FormItem>
          <FormItem label={'Team Size'}>
            <Box className="text__content">
              {dataProps.teamSize ?? ''}
              {' MM'}
            </Box>
          </FormItem>
        </FormLayout>
        <FormLayout gap={24} top={24}>
          <FormItem label={'Project Start Date'}>
            <Box className="text__content">{dataProps.projectStartDate}</Box>
          </FormItem>
          <FormItem label={'Project End Date'}>
            <Box className="text__content">{dataProps.projectEndDate}</Box>
          </FormItem>
        </FormLayout>
        <FormLayout gap={24} top={24}>
          <FormItem label={'Assign Start Date'}>
            <Box className="text__content">{dataProps.assignStartDate}</Box>
          </FormItem>
          <FormItem label={'Assign End Date'}>
            <Box className="text__content">{dataProps.assignEndDate}</Box>
          </FormItem>
        </FormLayout>
        <FormLayout gap={24} top={24}>
          <FormItem label={'Assign Effort'}>
            <Box className="text__content">{dataProps.projectHeadcount}</Box>
          </FormItem>
          <FormItem label={'Role'}>
            <Box className="text__content">{dataProps.role ?? ''}</Box>
          </FormItem>
        </FormLayout>
        <FormLayout top={24}>
          <FormItem label={'Description'}>
            <Box className="text__content textarea">
              {dataProps.description ?? ''}
            </Box>
          </FormItem>
        </FormLayout>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  projectDetail: {
    '& .text__content': {
      padding: theme.spacing(0.5, 1.5),
      border: `1px solid ${theme.color.grey.secondary}`,
      borderRadius: theme.spacing(0.5),
      minHeight: theme.spacing(5),
      lineHeight: 1.6,
      display: 'flex',
      alignItems: 'center',
    },
    '& .textarea': {
      height: theme.spacing(19.25),
      minHeight: theme.spacing(19.25),
      overflow: 'auto',
      wordBreak: 'break-word',
      alignItems: 'start !important',
    },
  },
}))

export default ModalProjectDetail
