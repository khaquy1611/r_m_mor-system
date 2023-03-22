import {
  ACCOUNT_SETTING,
  CONTRACT_LIST,
  PROJECT_LIST,
  YOUR_PROFILE,
  STAFF_DASHBOARD,
  STAFF_LIST,
  DAILY_REPORT,
  DAILY_REPORT_LIST,
} from '@/const/path.const'
import {
  AccountCircle,
  Analytics,
  Diversity3,
  EventNote,
  PeopleAlt,
  RequestQuoteSharp,
  LibraryBooks,
} from '@mui/icons-material'
import ModuleContract from './contract'
import ModuleCustomer from './customer'
import ModuleDailyReport from './daily-report'
import ModuleFinance from './finance'
import ModulePersonalProfile from './personal-profile'
import ModuleProject from './project'
import ModuleStaff from './staff'

const modules = [
  {
    id: 1,
    name: 'customer',
    labelName: 'Customer',
    pathNavigate: 'customer',
    pathRoot: 'customer/*',
    roles: [
      'useCustomerList',
      'usePartnerList',
      'useCustomerAndPartnerDashboard',
    ],
    Icon: Diversity3,
    Module: ModuleCustomer,
    features: [
      {
        id: 1,
        label: 'Dashboard',
        pathNavigate: 'customer/dashboard',
        pathRoot: 'dashboard',
        role: 'useCustomerAndPartnerDashboard',
      },
      {
        id: 2,
        label: 'Customer Management',
        pathNavigate: 'customer/list-customers',
        pathRoot: 'list-customers',
        role: 'useCustomerList',
      },
      {
        id: 3,
        label: 'Partner Management',
        pathNavigate: 'customer/list-partners',
        pathRoot: 'list-partners',
        role: 'usePartnerList',
      },
    ],
  },
  {
    id: 2,
    name: 'project',
    labelName: 'Project',
    pathNavigate: 'project',
    pathRoot: 'project/*',
    Icon: Analytics,
    Module: ModuleProject,
    roles: ['useProjectList', 'useProjectDashboard'],
    features: [
      {
        id: 1,
        label: 'Dashboard',
        pathNavigate: 'project/dashboard',
        pathRoot: 'dashboard',
        role: 'useProjectDashboard',
      },
      {
        id: 2,
        label: 'Project Management',
        pathNavigate: PROJECT_LIST,
        pathRoot: 'management',
        role: 'useProjectList',
      },
    ],
  },
  {
    id: 3,
    name: 'staff',
    labelName: 'Staff',
    pathNavigate: 'staff',
    pathRoot: 'staff/*',
    Icon: PeopleAlt,
    Module: ModuleStaff,
    roles: ['useStaffList', 'useStaffDashboard'],
    features: [
      {
        id: 1,
        label: 'Dashboard',
        pathNavigate: STAFF_DASHBOARD,
        pathRoot: 'dashboard',
        role: 'useStaffDashboard',
      },
      {
        id: 2,
        label: 'Staff Management',
        pathNavigate: STAFF_LIST,
        pathRoot: 'management',
        role: 'useStaffList',
      },
    ],
  },
  {
    id: 4,
    name: 'finance',
    labelName: 'Finance',
    pathNavigate: 'finance',
    pathRoot: 'finance/*',
    Icon: RequestQuoteSharp,
    Module: ModuleFinance,
    roles: ['useFinanceDashboard'],
    features: [],
  },
  {
    id: 5,
    name: 'daily-report',
    labelName: 'Daily Report',
    pathNavigate: 'daily-report',
    pathRoot: 'daily-report/*',
    Icon: EventNote,
    Module: ModuleDailyReport,
    roles: ['useDailyReportGeneral'],
    features: [
      {
        id: 1,
        label: 'Daily Report',
        pathNavigate: DAILY_REPORT,
        pathRoot: 'management',
        role: 'useDailyReportGeneral',
      },
      {
        id: 2,
        label: 'Report List',
        pathNavigate: DAILY_REPORT_LIST,
        pathRoot: 'report-list',
        role: 'useDailyReportGeneral',
      },
    ],
  },
  {
    id: 6,
    name: 'setting',
    labelName: 'Setting',
    pathNavigate: 'setting',
    pathRoot: 'setting/*',
    Icon: AccountCircle,
    Module: ModulePersonalProfile,
    roles: [],
    features: [
      {
        id: 1,
        label: 'Your Profile',
        pathNavigate: YOUR_PROFILE,
        pathRoot: 'your-profile',
        role: '',
      },
      {
        id: 2,
        label: 'Account Settings',
        pathNavigate: ACCOUNT_SETTING,
        pathRoot: 'account-setting',
        role: '',
      },
    ],
  },
  {
    id: 7,
    name: 'contract',
    labelName: 'Contract',
    pathNavigate: 'contract',
    pathRoot: 'contract/*',
    Icon: LibraryBooks,
    Module: ModuleContract,
    roles: ['useContractList'],
    features: [
      {
        id: 1,
        label: 'Contract Management',
        pathNavigate: CONTRACT_LIST,
        pathRoot: 'management',
        role: 'useContractList',
      },
    ],
  },
]

export default modules
