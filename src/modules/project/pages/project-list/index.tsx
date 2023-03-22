import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { PROJECT_STATUS } from '@/const/app.const'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Division, ISkillSet, IStatus, TableHeaderOption } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { projectSelector } from '../../reducer/project'
import { deleteProject, getListProjects } from '../../reducer/thunk'
import { IListProjectsParams, ProjectState } from '../../types'
import ProjectListAction from './ProjectListAction'
import TableProjectList from './TableProjectList'

const projectListHeadCells: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: 'Project Code',
    checked: false,
  },
  {
    id: 'projectName',
    align: 'left',
    disablePadding: true,
    label: 'Project Name',
    checked: false,
  },
  {
    id: 'customerName',
    align: 'left',
    disablePadding: true,
    label: 'Customer',
    checked: false,
  },
  {
    id: 'projectType',
    align: 'left',
    disablePadding: true,
    label: 'Project Type',
    checked: false,
  },
  {
    id: 'responsibleBranch',
    align: 'left',
    disablePadding: true,
    label: 'Responsible Branch',
    checked: false,
  },
  {
    id: 'participateDivision',
    align: 'left',
    disablePadding: true,
    label: 'Division',
    checked: false,
  },
  {
    id: 'technology',
    align: 'left',
    disablePadding: true,
    label: 'Technology',
    checked: false,
  },
  {
    id: 'projectStartDate',
    align: 'left',
    disablePadding: true,
    label: 'Start Date',
    checked: false,
  },
  {
    id: 'projectEndDate',
    align: 'left',
    disablePadding: true,
    label: 'End Date',
    checked: false,
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: true,
    label: 'Status',
    checked: false,
  },
]
const convertDataStatus = (item: any): IStatus => {
  let _resultData = { status: '', label: '' }
  if (PROJECT_STATUS[item?.id]) {
    return PROJECT_STATUS[item?.id]
  }
  return _resultData
}

const createData = (item: any) => {
  return {
    id: item.id,
    code: item.code,
    projectName: item.name,
    customerName: item.customer?.name,
    projectType: item.type.name,
    projectStartDate: formatDate(item.startDate),
    projectEndDate: item.endDate != 0 ? formatDate(item.endDate) : '',
    status: convertDataStatus(item?.status),
    responsibleBranch: item.branch.name ? item.branch.name : '',
    participateDivision: item.divisions
      .map((skillSet: Division) => skillSet.name)
      .join(', '),
    technology: item.technologies
      .map((skillSet: ISkillSet) => skillSet.name)
      .join(', '),
  }
}

const ProjectList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { projectList, isListFetching, projectQueryParameters }: ProjectState =
    useSelector(projectSelector)

  const [listChecked, setListChecked] = useState<string[]>([])

  const rows = useMemo(() => {
    return projectList?.map((item: any) => createData(item)) ?? []
  }, [projectList])

  const dataExport = useMemo(() => {
    return rows
      .filter(item => listChecked.includes(item.id))
      .map(item => ({
        ...item,
        status: item.status.label,
      }))
  }, [rows, listChecked])

  const handleDeleteProject = (id: string, code: string) => {
    dispatch(updateLoading(true))
    dispatch(deleteProject({ id, code }))
      .unwrap()
      .then(() => {
        getListPartnersApi(projectQueryParameters)
      })
    dispatch(updateLoading(false))
  }

  const getListPartnersApi = (params: IListProjectsParams = {}) => {
    const _params = {
      ...params,
      divisionIds: !!params.divisionIds?.length
        ? params.divisionIds?.map((item: any) => item.value).join(',')
        : null,
      technologyIds: !!params.technologyIds?.length
        ? params.technologyIds?.map((item: any) => item.value).join(',')
        : null,
      customerId: params.customerId?.id,
    }
    dispatch(getListProjects({ ..._params }))
  }

  useEffect(() => {
    getListPartnersApi(projectQueryParameters)
  }, [projectQueryParameters])

  useEffect(() => {
    dispatch(updateLoading(isListFetching))
  }, [isListFetching])

  return (
    <CommonScreenLayout title={i18Project('TXT_PROJECT_MANAGEMENT_TITLE')}>
      <Box className={classes.projectContainer}>
        <ProjectListAction
          listChecked={listChecked}
          headCells={projectListHeadCells}
          dataExport={dataExport}
        />
        <TableProjectList
          rows={rows}
          headCells={projectListHeadCells}
          listChecked={listChecked}
          setListChecked={setListChecked}
          params={projectQueryParameters}
          onDeleteProject={handleDeleteProject}
        />
      </Box>
    </CommonScreenLayout>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootProjectList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  projectContainer: {
    marginTop: theme.spacing(3),
  },
}))
export default ProjectList
