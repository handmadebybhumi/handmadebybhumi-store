import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AdminAuthProvider } from '@/lib/AdminAuthContext';

const { Pages, Layout, mainPage, AdminPages } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AdminAuthProvider>
        <Router>
          <NavigationTracker />
          <Routes>
            <Route path="/" element={
              <LayoutWrapper currentPageName={mainPageKey}>
                <MainPage />
              </LayoutWrapper>
            } />
            {Object.entries(Pages).map(([path, Page]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                }
              />
            ))}
            {/* Admin routes — rendered without the storefront Layout.
                AdminLogin renders standalone; other admin pages use AdminLayout internally. */}
            {Object.entries(AdminPages).map(([path, Page]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={<Page />}
              />
            ))}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AdminAuthProvider>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
