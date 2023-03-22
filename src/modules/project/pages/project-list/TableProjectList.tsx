import ConditionalRender from '@/components/ConditionalRender'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { AppDispatch } from '@/store'
import { TableHeaderOption } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  projectSelector,
  setProjectQueryParameters,
} from '../../reducer/project'
import { IListProjectsParams, ProjectState } from '../../types'

interface ITableProjectList {
  params: IListProjectsParams
  listChecked: string[]
  setListChecked: Dispatch<SetStateAction<string[]>>
  onDeleteProject: (idProject: string, projectCode: string) => void
  headCells: TableHeaderOption[]
  rows: any
}
interface IShowModalDeleteProject {
  status: boolean
  idProject: string
  projectCode: string
}

const TableProjectList = ({
  params,
  listChecked,
  setListChecked,
  onDeleteProject,
  headCells,
  rows,
}: ITableProjectList) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const [showModalDeleteProject, setShowModalDeleteProject] =
    useState<IShowModalDeleteProject>({
      status: false,
      idProject: '',
      projectCode: '',
    })
  const { projectsTotalElements, projectQueryParameters }: ProjectState =
    useSelector(projectSelector)

  const handleCloseModalDeleteProject = () => {
    setShowModalDeleteProject({
      status: false,
      idProject: '',
      projectCode: '',
    })
  }

  const handleSubmitModalDeleteProject = () => {
    onDeleteProject(
      showModalDeleteProject.idProject,
      showModalDeleteProject.projectCode
    )
  }

  const handlePageChange = (_: any, newPage: number) => {
    const newQueryParameters = {
      ...projectQueryParameters,
      pageNum: newPage,
    }
    dispatch(setProjectQueryParameters(newQueryParameters))
    setListChecked([])
  }

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    setListChecked([])
    const newQueryParameters = {
      ...projectQueryParameters,
      pageNum: 1,
      pageSize: newLimit,
    }
    dispatch(setProjectQueryParameters(newQueryParameters))
  }

  const handleCheckAll = (
    event: ChangeEvent<HTMLInputElement>,
    newListChecked: Array<any>
  ) => {
    setListChecked(newListChecked)
  }

  const handleCheckItem = (id: string) => {
    const newListChecked = [...listChecked]
    const indexById = listChecked.findIndex(_id => _id === id)
    if (indexById !== -1) {
      newListChecked.splice(indexById, 1)
    } else {
      newListChecked.push(id)
    }
    setListChecked(newListChecked)
  }

  const handleNavigateToDetailPage = (projectId: string) => {
    const url = StringFormat(PathConstant.PROJECT_DETAIL_FORMAT, projectId)
    navigate(url)
  }

  const handleDeleteProject = (id: string, row: any) => {
    setShowModalDeleteProject({
      status: true,
      idProject: id,
      projectCode: row.code ?? '',
    })
  }
  return (
    <>
      <Box className={classes.rootTableProjectList}>
        <ModalDeleteRecords
          titleMessage={i18Project('TXT_DELETE_PROJECT')}
          subMessage={StringFormat(
            i18Project('MSG_CONFIRM_PROJECT_DELETE'),
            showModalDeleteProject.projectCode
          )}
          open={showModalDeleteProject.status}
          onClose={handleCloseModalDeleteProject}
          onSubmit={handleSubmitModalDeleteProject}
        />
        <TableShare
          keyName={'id'}
          isShowCheckbox
          headCells={headCells}
          selected={listChecked}
          rows={rows}
          onSelectAllClick={handleCheckAll}
          childComp={(row: any) => (
            <ItemRowTableV2
              row={row}
              useRightClickOpenNewTab
              link={StringFormat(
                PathConstant.PROJECT_DETAIL_FORMAT,
                row.id
              )}
              key={`table-checkbox-${row['id']}`}
              isShowCheckbox
              uuId={row['id']}
              headCells={headCells}
              selected={listChecked}
              keyName={'id'}
              onClickItem={handleCheckItem}
              onClickDetail={handleNavigateToDetailPage}
              onClickDelete={(id: string) => handleDeleteProject(id, row)}
            />
          )}
        />
        <ConditionalRender conditional={!!rows.length} fallback={''}>
          <TablePaginationShare
            rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
            totalElements={projectsTotalElements}
            pageLimit={params.pageSize as number}
            currentPage={params.pageNum as number}
            onChangePage={handlePageChange}
            onChangeLimitPage={handleRowsPerPageChange}
          />
        </ConditionalRender>
      </Box>
    </>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootTableProjectList: {
    marginTop: theme.spacing(4),
  },
}))
export default TableProjectList
