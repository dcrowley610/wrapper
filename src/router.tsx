import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';

const HomePage = lazy(() => import('./modules/home/pages/HomePage'));
const EntityListPage = lazy(() => import('./modules/entities/pages/EntityListPage').then(m => ({ default: m.EntityListPage })));
const EntityDetailPage = lazy(() => import('./modules/entities/pages/EntityDetailPage').then(m => ({ default: m.EntityDetailPage })));
const InvestorListPage = lazy(() => import('./modules/investors/pages/InvestorListPage').then(m => ({ default: m.InvestorListPage })));
const InvestorDetailPage = lazy(() => import('./modules/investors/pages/InvestorDetailPage').then(m => ({ default: m.InvestorDetailPage })));
const ControversyListPage = lazy(() => import('./modules/controversy/pages/ControversyListPage').then(m => ({ default: m.ControversyListPage })));
const ControversyDetailPage = lazy(() => import('./modules/controversy/pages/ControversyDetailPage').then(m => ({ default: m.ControversyDetailPage })));
const StructuresModule = lazy(() => import('./modules/structures/index'));
const RequestListPage = lazy(() => import('./modules/requests/pages/RequestListPage').then(m => ({ default: m.RequestListPage })));
const RequestDetailPage = lazy(() => import('./modules/requests/pages/RequestDetailPage').then(m => ({ default: m.RequestDetailPage })));
const RequestLibraryPage = lazy(() => import('./modules/requests/pages/RequestTypeListPage').then(m => ({ default: m.RequestLibraryPage })));
const RequestProcessDetailPage = lazy(() => import('./modules/requests/pages/RequestTypeDetailPage').then(m => ({ default: m.RequestProcessDetailPage })));
const DocumentListPage = lazy(() => import('./modules/documents/pages/DocumentListPage').then(m => ({ default: m.DocumentListPage })));
const DocumentReviewPage = lazy(() => import('./modules/documents/pages/DocumentReviewPage').then(m => ({ default: m.DocumentReviewPage })));
const CalendarApp = lazy(() => import('./modules/calendar/CalendarApp'));
const ProcessTemplateListPage = lazy(() => import('./modules/rules/pages/ProcessTemplateListPage').then(m => ({ default: m.ProcessTemplateListPage })));
const ProcessRunDetailPage = lazy(() => import('./modules/rules/pages/ProcessRunDetailPage').then(m => ({ default: m.ProcessRunDetailPage })));
const ReconciliationWorkspacePage = lazy(() => import('./modules/identity/pages/ReconciliationWorkspacePage'));
const ReportsApp = lazy(() => import('./modules/reports/ReportsApp'));
const DealListPage = lazy(() => import('./modules/deals/pages/DealListPage').then(m => ({ default: m.DealListPage })));
const DealDetailPage = lazy(() => import('./modules/deals/pages/DealDetailPage').then(m => ({ default: m.DealDetailPage })));
const AdminPage = lazy(() => import('./modules/admin/pages/AdminPage').then(m => ({ default: m.AdminPage })));
const UserDetailPage = lazy(() => import('./modules/admin/pages/UserDetailPage').then(m => ({ default: m.UserDetailPage })));
const GroupDetailPage = lazy(() => import('./modules/admin/pages/GroupDetailPage').then(m => ({ default: m.GroupDetailPage })));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'deals', element: <DealListPage /> },
      { path: 'deals/:dealId', element: <DealDetailPage /> },
      { path: 'deals/:dealId/:section', element: <DealDetailPage /> },
      { path: 'entities', element: <EntityListPage /> },
      { path: 'entities/:entityId', element: <EntityDetailPage /> },
      { path: 'entities/:entityId/:section', element: <EntityDetailPage /> },
      { path: 'investors', element: <InvestorListPage /> },
      { path: 'investors/:investorId', element: <InvestorDetailPage /> },
      { path: 'investors/:investorId/:section', element: <InvestorDetailPage /> },
      { path: 'controversy', element: <ControversyListPage /> },
      { path: 'controversy/:recordId', element: <ControversyDetailPage /> },
      { path: 'controversy/:recordId/:section', element: <ControversyDetailPage /> },
      { path: 'structures', element: <StructuresModule /> },
      { path: 'requests', element: <RequestListPage /> },
      { path: 'requests/types', element: <RequestLibraryPage /> },
      { path: 'requests/types/:typeId', element: <RequestProcessDetailPage /> },
      { path: 'requests/types/:typeId/:section', element: <RequestProcessDetailPage /> },
      { path: 'requests/:requestId', element: <RequestDetailPage /> },
      { path: 'requests/:requestId/:section', element: <RequestDetailPage /> },
      { path: 'documents', element: <DocumentListPage /> },
      { path: 'documents/:documentId', element: <DocumentReviewPage /> },
      { path: 'calendar', element: <CalendarApp /> },
      { path: 'rules', element: <ProcessTemplateListPage /> },
      { path: 'rules/process/:runId', element: <ProcessRunDetailPage /> },
      { path: 'rules/process/:runId/:section', element: <ProcessRunDetailPage /> },
      { path: 'review', element: <ReconciliationWorkspacePage /> },
      { path: 'reports', element: <ReportsApp /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'admin/users', element: <AdminPage /> },
      { path: 'admin/groups', element: <AdminPage /> },
      { path: 'admin/users/:userId', element: <UserDetailPage /> },
      { path: 'admin/groups/:groupId', element: <GroupDetailPage /> },
    ],
  },
]);
