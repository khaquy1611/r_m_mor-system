import Processing from '@/components/common/Processing'
import { PathConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('../../../components/common/Home'))

const PrivateRoute = lazy(
  () => import('../../../components/common/PrivateRoute')
)

// Module Customer
const ModuleCustomer = lazy(() => import('../../../modules/customer'))
const CustomerDetail = lazy(
  () => import('../../../modules/customer/pages/customer-detail')
)
const CustomerList = lazy(
  () => import('../../../modules/customer/pages/customer-list')
)
const PartnerDetail = lazy(
  () => import('../../../modules/customer/pages/partner-detail')
)
const PartnerList = lazy(
  () => import('../../../modules/customer/pages/partner-list')
)
const CustomerDashboard = lazy(
  () => import('../../../modules/customer/pages/customer-dashboard')
)

// Module Project
const ModuleProject = lazy(() => import('../../../modules/project'))
const ProjectDashboard = lazy(
  () => import('../../../modules/project/pages/project-dashboard')
)
const ProjectDetailProvider = lazy(
  () => import('../../../modules/project/context/ProjectDetailContext')
)
const ProjectDetail = lazy(
  () => import('../../../modules/project/pages/project-detail/index')
)
const ProjectList = lazy(
  () => import('../../../modules/project/pages/project-list')
)

// Module Staff
const ModuleStaff = lazy(() => import('../../../modules/staff'))
const StaffDetail = lazy(
  () => import('../../../modules/staff/pages/staff-detail')
)
const StaffDashboard = lazy(
  () => import('../../../modules/staff/pages/staff-dashboard')
)
const StaffList = lazy(() => import('../../../modules/staff/pages/staff-list'))

// Module Daily Report
const ModuleDailyReport = lazy(() => import('../../../modules/daily-report'))
const DailyReport = lazy(
  () => import('../../../modules/daily-report/pages/DailyReport')
)
const DailyReportList = lazy(
  () => import('../../../modules/daily-report/pages/DailyReportList')
)

// Module Finance
const ModuleFinance = lazy(() => import('../../../modules/finance'))
const FinanceDashBoard = lazy(
  () => import('../../../modules/finance/pages/finance-dashboard')
)

// Module Setting
const ModulePersonalProfile = lazy(
  () => import('../../../modules/personal-profile')
)
const AccountSetting = lazy(
  () => import('../../../modules/personal-profile/pages/account-setting')
)
const YourProfile = lazy(
  () => import('../../../modules/personal-profile/pages/your-profile')
)

// Module Contract
const ModuleContract = lazy(() => import('../../../modules/contract'))
const ContractList = lazy(
  () => import('../../../modules/contract/pages/contract-list/ContractList')
)
const ContractDetail = lazy(
  () => import('../../../modules/contract/pages/contract-detail/ContractDetail')
)

const AllRoutesOfFeatures = () => {
  const { permissions }: AuthState = useSelector(selectAuth)
  const {
    useCustomerList,
    useCustomerDetail,
    useCustomerCreate,
    usePartnerList,
    usePartnerDetail,
    usePartnerCreate,
    useProjectList,
    useProjectDetail,
    useProjectCreate,
    useStaffList,
    useStaffDetail,
    useStaffCreate,
    useCustomerAndPartnerDashboard,
    useProjectDashboard,
    useStaffDashboard,
    useFinanceDashboard,
    useDailyReportGeneral,
    useContractCreate,
    useContractList,
  } = permissions

  return (
    <Suspense fallback={<Processing open />}>
      <Routes>
        <Route path={PathConstant.MAIN} element={<Home />} />
        {/* Module Customer */}
        <Route
          path={PathConstant.MODULE_CUSTOMER}
          element={
            <PrivateRoute
              isAuth={Boolean(
                useCustomerList |
                  usePartnerList |
                  useCustomerAndPartnerDashboard
              )}
            >
              <ModuleCustomer />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_DASHBOARD}
          element={
            <PrivateRoute isAuth={useCustomerAndPartnerDashboard}>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_LIST}
          element={
            <PrivateRoute isAuth={useCustomerList}>
              <CustomerList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_DETAIL}
          element={
            <PrivateRoute isAuth={useCustomerDetail}>
              <CustomerDetail />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_CREATE}
          element={
            <PrivateRoute isAuth={useCustomerCreate}>
              <CustomerDetail />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_PARTNER_LIST}
          element={
            <PrivateRoute isAuth={usePartnerList}>
              <PartnerList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_PARTNER_DETAIL}
          element={
            <PrivateRoute isAuth={usePartnerDetail}>
              <PartnerDetail isDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_PARTNER_CREATE}
          element={
            <PrivateRoute isAuth={usePartnerCreate}>
              <PartnerDetail isDetailPage={false} />
            </PrivateRoute>
          }
        />
        {/* Module Project */}
        <Route
          path={PathConstant.MODULE_PROJECT}
          element={
            <PrivateRoute
              isAuth={Boolean(useProjectList | useProjectDashboard)}
            >
              <ModuleProject />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.PROJECT_DASHBOARD}
          element={
            <PrivateRoute isAuth={useProjectDashboard}>
              <ProjectDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.PROJECT_LIST}
          element={
            <PrivateRoute isAuth={useProjectList}>
              <ProjectList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.PROJECT_CREATE}
          element={
            <PrivateRoute isAuth={useProjectCreate}>
              <ProjectDetailProvider>
                <ProjectDetail isDetailPage={false} />
              </ProjectDetailProvider>
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.PROJECT_DETAIL}
          element={
            <PrivateRoute isAuth={useProjectDetail}>
              <ProjectDetailProvider>
                <ProjectDetail isDetailPage />
              </ProjectDetailProvider>
            </PrivateRoute>
          }
        />
        {/* Module Staff */}
        <Route
          path={PathConstant.MODULE_STAFF}
          element={
            <PrivateRoute isAuth={Boolean(useStaffList || useStaffDashboard)}>
              <ModuleStaff />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_LIST}
          element={
            <PrivateRoute isAuth={useStaffList}>
              <StaffList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_DETAIL}
          element={
            <PrivateRoute isAuth={useStaffDetail}>
              <StaffDetail isDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_CREATE}
          element={
            <PrivateRoute isAuth={useStaffCreate}>
              <StaffDetail isDetailPage={false} />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_DASHBOARD}
          element={
            <PrivateRoute isAuth={useStaffDashboard}>
              <StaffDashboard />
            </PrivateRoute>
          }
        />
        {/* Module Daily Report */}
        <Route
          path={PathConstant.MODULE_DAILY_REPORT}
          element={
            <PrivateRoute isAuth={useDailyReportGeneral}>
              <ModuleDailyReport />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.DAILY_REPORT}
          element={
            <PrivateRoute isAuth={useDailyReportGeneral}>
              <DailyReport />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.DAILY_REPORT_LIST}
          element={
            <PrivateRoute isAuth={useDailyReportGeneral}>
              <DailyReportList />
            </PrivateRoute>
          }
        />

        {/* Module Finance */}
        <Route
          path={PathConstant.MODULE_FINANCE}
          element={
            <PrivateRoute isAuth={Boolean(useFinanceDashboard)}>
              <ModuleFinance />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.FINANCE_DASHBOARD}
          element={
            <PrivateRoute isAuth={useFinanceDashboard}>
              <FinanceDashBoard />
            </PrivateRoute>
          }
        />
        {/* Module Setting */}
        <Route
          path={PathConstant.MODULE_SETTING}
          element={
            <PrivateRoute isAuth={true}>
              <ModulePersonalProfile />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.YOUR_PROFILE}
          element={
            <PrivateRoute isAuth={true}>
              <YourProfile />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.ACCOUNT_SETTING}
          element={
            <PrivateRoute isAuth={true}>
              <AccountSetting />
            </PrivateRoute>
          }
        />
        {/* Module Contract */}
        <Route
          path={PathConstant.MODULE_CONTRACT}
          element={
            <PrivateRoute isAuth={useContractList}>
              <ModuleContract />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CONTRACT_LIST}
          element={
            <PrivateRoute isAuth={useContractList}>
              <ContractList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CONTRACT_DETAIL}
          element={
            <PrivateRoute isAuth>
              <ContractDetail isDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CONTRACT_CREATE}
          element={
            <PrivateRoute isAuth={useContractCreate}>
              <ContractDetail isDetailPage={false} />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={PathConstant.PAGE_404} replace />}
        />
      </Routes>
    </Suspense>
  )
}

export default AllRoutesOfFeatures
