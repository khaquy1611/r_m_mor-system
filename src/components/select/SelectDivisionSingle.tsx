import InputDropdown from '@/components/inputs/InputDropdown'
import { BRANCH_TYPE } from '@/const/app.const'
import {
  commonSelector,
  CommonState,
  getDivisions,
  getDivisionsByProject,
  getDivisionsDashboard,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import {
  DivisionType,
  IDivision,
  IDivisionByProjectType,
  OptionItem,
} from '@/types'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface IProps {
  value?: string
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem) => void
  error?: boolean
  errorMessage?: string
  placeholder?: string
  label?: string
  branchId?: string
  require?: boolean
  listDivision?: OptionItem[]
  isFullData?: boolean
  isDisable?: boolean
  ignoreOptionById?: string | number | undefined
  isProject?: boolean
  isDashboard?: boolean
}

const SelectDivisionSingle = ({
  width,
  value = '',
  useLabel,
  placeholder = '',
  branchId = '',
  onChange,
  error,
  errorMessage,
  label,
  require = false,
  listDivision = [],
  isFullData = true,
  isDisable = false,
  ignoreOptionById,
  isProject = false,
  isDashboard = false,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const { divisions, divisionByProject }: CommonState =
    useSelector(commonSelector)

  const listOptions: OptionItem[] = useMemo(() => {
    const result: any[] = []
    if (!branchId && isFullData && isProject) {
      return divisionByProject.map((item: IDivisionByProjectType) => ({
        label: item.name,
        value: item.divisionId,
        id: item.divisionId,
      }))
    }
    if (!branchId && isFullData && !isProject) {
      divisions.forEach((item: DivisionType) => {
        result.push(...item.divisions)
      })
      return result.map((item: IDivision) => ({
        ...item,
        label: item.name,
        value: item.divisionId,
        id: item.divisionId,
      }))
    } else if (branchId && !isProject) {
      divisions.forEach((item: DivisionType) => {
        if (branchId && branchId !== BRANCH_TYPE.ALL_BRANCH.id) {
          if (branchId === item.branches.id) {
            result.push(...item.divisions)
          }
        } else {
          result.push(...item.divisions)
        }
      })
      return result.map((item: IDivision) => ({
        ...item,
        label: item.name,
        value: item.divisionId,
        id: item.divisionId,
      }))
    } else if (branchId && isProject) {
      divisionByProject.forEach((item: IDivisionByProjectType) => {
        if (branchId && branchId !== BRANCH_TYPE.ALL_BRANCH.id) {
          if (branchId === item.branchId) {
            result.push(item)
          }
        } else {
          result.push(item)
        }
      })
      return result.map((item: IDivisionByProjectType) => ({
        label: item.name,
        value: item.divisionId,
        code: item.divisionId,
        id: item.divisionId,
      }))
    } else return listDivision ?? []
  }, [listDivision, branchId, divisionByProject])
  const handleChange = (value: string) => {
    const optionFound = listOptions.find(
      (item: OptionItem) => item.id === value
    )
    if (optionFound) onChange(optionFound)
    else onChange({})
  }

  useEffect(() => {
    if (isProject && !isDashboard) {
      dispatch(getDivisionsByProject())
    } else if (!isProject && !isDashboard) {
      dispatch(getDivisions())
    } else {
      dispatch(getDivisionsDashboard())
    }
  }, [])

  return (
    <InputDropdown
      required={require}
      ignoreOptionById={ignoreOptionById}
      useLabel={useLabel}
      label={label ?? ''}
      isDisable={isDisable}
      placeholder={placeholder ?? ''}
      width={width ?? '100%'}
      value={value}
      listOptions={listOptions}
      onChange={(value: string) => handleChange(value)}
      error={error}
      errorMessage={errorMessage}
    />
  )
}

export default SelectDivisionSingle
