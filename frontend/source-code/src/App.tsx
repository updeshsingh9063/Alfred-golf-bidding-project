import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

// Marketing pages
import Home from './pages/marketing/Home';
import HowItWorks from './pages/marketing/HowItWorks';
import Charities from './pages/marketing/Charities';
import CharityProfile from './pages/marketing/CharityProfile';
import Pricing from './pages/marketing/Pricing';
import Trust from './pages/marketing/Trust';
import Login from './pages/marketing/Login';
import Subscribe from './pages/marketing/Subscribe';

// Dashboard pages
import DashboardHome from './pages/dashboard/DashboardHome';
import MyScores from './pages/dashboard/MyScores';
import MyCharity from './pages/dashboard/MyCharity';
import Draws from './pages/dashboard/Draws';
import Winnings from './pages/dashboard/Winnings';
import Settings from './pages/dashboard/Settings';

// Admin pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDraws from './pages/admin/AdminDraws';
import AdminCharities from './pages/admin/AdminCharities';
import AdminWinners from './pages/admin/AdminWinners';
import AdminReports from './pages/admin/AdminReports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Marketing (public) */}
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/charities" element={<Charities />} />
          <Route path="/charities/:id" element={<CharityProfile />} />
          <Route path="/pricing" element={
            <ProtectedRoute requiredRole="subscriber">
              <Pricing />
            </ProtectedRoute>
          } />
          <Route path="/trust" element={<Trust />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/subscribe" element={
            <ProtectedRoute requiredRole="subscriber">
              <Subscribe />
            </ProtectedRoute>
          } />

          {/* Subscriber Dashboard (protected - subscriber role) */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="subscriber">
              <DashboardHome />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/scores" element={
            <ProtectedRoute requiredRole="subscriber">
              <MyScores />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/charity" element={
            <ProtectedRoute requiredRole="subscriber">
              <MyCharity />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/draws" element={
            <ProtectedRoute requiredRole="subscriber">
              <Draws />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/winnings" element={
            <ProtectedRoute requiredRole="subscriber">
              <Winnings />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute requiredRole="subscriber">
              <Settings />
            </ProtectedRoute>
          } />

          {/* Admin Console (protected - admin role) */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminOverview />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/draws" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDraws />
            </ProtectedRoute>
          } />
          <Route path="/admin/charities" element={
            <ProtectedRoute requiredRole="admin">
              <AdminCharities />
            </ProtectedRoute>
          } />
          <Route path="/admin/winners" element={
            <ProtectedRoute requiredRole="admin">
              <AdminWinners />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requiredRole="admin">
              <AdminReports />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
