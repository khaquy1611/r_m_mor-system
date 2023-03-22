import { MAX_ELLIPSIS } from '@/const/app.const'
import { ErrorResponse, OptionItem, TableHeaderOption } from '@/types'
import FileSaver from 'file-saver'
import i18next from 'i18next'
import { isEmpty, pickBy } from 'lodash'
import moment from 'moment'
import * as XLSX from 'xlsx'
import QueryString from 'query-string'

export const changeLang = (langCode: string) => {
  i18next.changeLanguage(langCode)
  document.documentElement.lang = langCode
}

export function uuid() {
  var temp_url = URL.createObjectURL(new Blob())
  var uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url)
  return uuid.substr(uuid.lastIndexOf('/') + 1) // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
}

export function formatDate(date: Date | number, format?: string) {
  let _format = i18next.t('common:LB_DATE_FORMAT')
  if (format) _format = format
  return moment(new Date(date)).format(_format)
}

export const urlWebsiteRegex =
  /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z0-9]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/gm

export const phoneRegex = /^[0-9.]{1,999}$/g
export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const specialCharacters = /^([a-zA-Z\-0-9\@\-\_\.]+)$/

export function checkUrlValid(url: string) {
  return urlWebsiteRegex.test(url)
}

export const formatCurrency = (value: number) => {
  const temp = value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const vndLabelValue = temp.replace('$', ' VND ').split(' ')
  const flagMinus = vndLabelValue[0]
  const suffix = vndLabelValue[1]
  const val = vndLabelValue[2]

  return [
    val.split('.')[1] === '00'
      ? `${flagMinus}${val.split('.')[0]}`
      : `${flagMinus}${val}`,
    suffix,
  ].join(' ')
}

export const getErrorFromApi = (field: string, errors: ErrorResponse[]) => {
  const fieldError = errors.find(
    (error: ErrorResponse) => error.field === field
  )
  if (fieldError?.field) {
    return {
      error: !!fieldError.field,
      message: fieldError.message,
    }
  } else {
    return {
      error: false,
      message: '',
    }
  }
}

export const cleanObject = (obj: any) => {
  if (typeof obj !== 'object') return obj
  Object.keys(obj).forEach(
    key => typeof obj[key] === 'string' && obj[key].trim()
  )
  return pickBy(obj, item => {
    switch (true) {
      case typeof item === 'string':
        return !isEmpty(item)
      case item === null || item === undefined:
        return false
      default:
        return true
    }
  })
}

export const getTextEllipsis = (
  text: string,
  maxEllipsis?: number | undefined
) => {
  const _maxEllipsis = maxEllipsis || MAX_ELLIPSIS
  if (text?.length < _maxEllipsis) {
    return text
  }
  return `${text?.slice(0, _maxEllipsis)}...`
}

export function sortAtoZChartArray(options: OptionItem[]) {
  if (!options || (options && options.length === 0)) {
    return []
  }
  return options.sort((a, b) =>
    a.label && b.label ? a.label.localeCompare(b.label) : 1
  )
}

export const scrollToFirstErrorMessage = () => {
  const errorMessages = document.querySelectorAll('.error-message-scroll')
  if (!errorMessages) return
  const firstErrorMessage = errorMessages[0] as HTMLElement
  if (firstErrorMessage) {
    const mainLayoutEl = document.getElementById('main__layout')
    mainLayoutEl?.scrollTo({
      top: firstErrorMessage.offsetTop - 140,
      behavior: 'smooth',
    })
  }
}

export const scrollToTop = () => {
  setTimeout(() => {
    const mainLayoutEl = document.getElementById('main__layout')
    mainLayoutEl?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}

export const filterFollowKeyword = (
  listOption: OptionItem[],
  keyword: string
) => {
  return listOption.filter((option: OptionItem) => {
    return !!String(option.label)
      .toLocaleLowerCase()
      .match(keyword.trim().toLocaleLowerCase())
  })
}

export const formatToOptionItem = (
  list: any[],
  option?: {
    keyValue?: string
    keyLabel?: string
  }
): OptionItem[] => {
  let result: OptionItem[] = []
  const keyValue = option?.keyValue || 'id'
  const keyLabel = option?.keyLabel || 'name'
  result = list.map((item: any) => ({
    ...item,
    id: item.id ? item.id.toString() : item[keyValue].toString(),
    label: item[keyLabel],
    value: item[keyValue].toString(),
  }))
  return result
}

export const formatNumberToCurrency = (num: number | string) => {
  const _num = Number(num)
  return new Intl.NumberFormat().format(_num)
}

export const formatNumberToCurrencyBigInt = (num: number | string) => {
  const arrNumbers = String(num).split('.')
  const naturalPart: any = BigInt(arrNumbers[0])
  const result = new Intl.NumberFormat().format(naturalPart)
  return !arrNumbers[1] || arrNumbers[1] === '00'
    ? result
    : `${result}.${arrNumbers[1]}`
}

export const replaceChars = (value: string, options: any) => {
  let result = ''
  for (let each of value) {
    for (const keyReplace in options) {
      const _val = options[keyReplace]
      if (each == keyReplace) {
        each = _val
      }
    }
    result += each
  }
  return result
}

export const compareTwoObject = (object1: any, object2: any) => {
  function sortObj(obj: any) {
    return Object.keys(obj)
      .sort()
      .reduce(function (result: any, key: any) {
        result[key] = obj[key]
        return result
      }, {})
  }

  return JSON.stringify(sortObj(object1)) === JSON.stringify(sortObj(object2))
}

export const checkValidateFormik = async (formik: any) => {
  await formik.validateForm().then((errors: any) => {
    const possibleErrors = Object.keys(errors)
    if (possibleErrors.length === 0) {
      formik.validateForm()
      formik.setTouched({})
    }
    if (possibleErrors) {
      formik.setTouched({ ...formik.touched, ...formik.errors })
    }
  })
  const possibleErrors = !!Object.keys(formik.errors).length
  setTimeout(() => {
    scrollToFirstErrorMessage()
  })
  return possibleErrors
}

export const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64)
  const binaryLen = binaryString.length
  const bytes = new Uint8Array(binaryLen)
  for (let i = 0; i < binaryLen; i++) {
    let ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes
}

export const exportToExcelTable = (
  fileName: string,
  options: {
    dataExport: any[]
    listColumnApply: TableHeaderOption[]
  }
) => {
  const _fileName = `${fileName}-${moment(new Date()).format(
    'YYYY-MM-DD HH:mm:ss'
  )}`.replace(' ', '-')
  const objectKeyMergeLabel: any = {}
  const header: string[] = []
  options.listColumnApply.forEach((option: TableHeaderOption) => {
    objectKeyMergeLabel[option.id] = option.label
    header.push(option.id)
  })
  const ws = XLSX.utils.json_to_sheet([objectKeyMergeLabel], {
    header: header,
    skipHeader: true,
  })
  const _dataExport = options.dataExport.map((item: any) => {
    const rs: any = {}
    header.forEach((key: string) => {
      rs[key] = item[key]
    })
    return rs
  })
  ws['!cols'] = header.map((key: string) => {
    return {
      wch: Math.max(
        ...options.dataExport.map(item => item[key].length + 3),
        key.length + 3,
        objectKeyMergeLabel[key].length + 3
      ),
    }
  })
  XLSX.utils.sheet_add_json(ws, _dataExport, {
    header: header,
    skipHeader: true,
    origin: -1,
  })
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  })
  FileSaver.saveAs(data, _fileName + '.xlsx')
}

export const getDateFromDayOfYear = (year: number, day: number) => {
  if (isNaN(year) || isNaN(day) || !year) {
    return null
  } else {
    return new Date(Date.UTC(year, 0, day))
  }
}

export const getArrayMinMax = (min: number, max: number) => {
  if (min > max) return []
  const result: string[] = []
  for (let i = min; i <= max; i++) {
    result.push(i.toString())
  }
  return result
}

export const getIframeLink = (previewImage: string) => {
  return `https://docs.google.com/viewerng/viewer?url=${encodeURIComponent(
    previewImage
  )}&embedded=true`
}

export const allowedYears = (initYear?: number, endYear?: number): string[] => {
  const currentYear = endYear || new Date().getFullYear()
  const result: string[] = []
  for (let i = initYear || currentYear - 1; i <= currentYear; i++) {
    result.push(String(i))
  }
  return result
}
export const getAbbreviations = (str: string) => {
  var names = str.split(' '),
    initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase()
  }
  return initials
}

export const convertTimestampToDate = (timestamp: number | null) => {
  if (timestamp) {
    return new Date(timestamp)
  }
  return null
}
const padZero = (str?: string, len?: number | string) => {
  len = len || 2
  var zeros = new Array(len).join('0')
  return (zeros + str).slice(-len)
}

export const invertColor = (hex: string, bw?: boolean) => {
  //This has a bw option that will decide whether to invert to black or white; so you'll get more contrast which is generally better for the human eye.
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }

  let r = parseInt(hex.slice(0, 2), 16)
  let g = parseInt(hex.slice(2, 4), 16)
  let b = parseInt(hex.slice(4, 6), 16)
  if (!bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
  }
  // invert color components
  r = 255 - r
  g = 255 - g
  b = 255 - b
  // pad each with zeros and return
  return (
    '#' +
    padZero(r.toString(16)) +
    padZero(g.toString(16)) +
    padZero(b.toString(16))
  )
}

export const formatNumberDecimal = (value: number, fixed: number) => {
  let num = Number(value)
  return Number(num.toFixed(fixed) ?? 0)
}

export const formatNumber = (value: string | number) => {
  return new Intl.NumberFormat('en-US').format(Number(value))
}

export const convertKeyArrayToString = (
  listData: Array<any>,
  keyName = 'name'
) => {
  let result = ''
  if (listData && listData.length > 0) {
    listData.forEach((item: any, index: number) => {
      if (index === 0) {
        result = result.concat('', item[keyName])
      } else {
        result = result.concat(', ', item[keyName])
      }
    })
  }
  return result
}

export const removeItemObjectEmpty = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([__, v]) => v != null && v != '' && v != undefined
    )
  )
}
export const queryStringParam = (params: any) => {
  return QueryString.stringify(removeItemObjectEmpty(params))
}
