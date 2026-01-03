import { Suspense, lazy } from 'react'
import { Toaster } from 'sonner'
import { Routes, Route, Navigate } from 'react-router-dom'

import ErrorBoundary from '@/components/FallbackUI/ErrorBoundary'
import NotFound from '@/components/FallbackUI/NotFound'
import LoadingSpinner from '@/components/FallbackUI/LoadingSpinner'
import ScrollToTop from '@/components/ScrollToTop'

// Lazy loaded route components
const UserRoutes = lazy(() => import('@/pages/user/UserIndex'))
const TutorRoutes = lazy(() => import('@/pages/tutor/TutorIndex'))
const AdminRoutes = lazy(() => import('@/pages/admin/AdminIndex'))
const Home = lazy(() => import('@/pages/Home/Index'))

// Explore pages
const Explore = lazy(() => import('@/pages/explore/Index'))
const ExplorePage = lazy(() => import('@/pages/explore/ExplorePage'))
const CourseDetails = lazy(() => import('@/pages/explore/CourseDetails'))

// Checkout pages
const Index = lazy(() => import('@/pages/checkout/Index'))
const CourseEnrollment = lazy(() => import('@/pages/checkout/CourseEnrollment'))
const PaymentSuccess = lazy(() => import('@/pages/checkout/PaymentSuccess'))
const PaymentFailure = lazy(() => import('@/pages/checkout/PaymentFailure'))

// Non-lazy components (needed immediately or lightweight)
import ProtectedRoute from '@/protectors/ProtectedRoute'
import BlockedUI from '@/components/FallbackUI/BlockedUI'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'


const App = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Toaster richColors position='top-right' duration={2000} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Navigate to="/user/login" replace />} />

          <Route path='/explore' element={<Explore />}>
            <Route index element={<ExplorePage />} />
            <Route path='courses/:courseId' element={<CourseDetails />} />
          </Route>

          <Route path='/explore/courses/:courseId/checkout' element={
            <ProtectedRoute role={'user'}>
              <BlockedUI>
                <Navbar />
                <Index />
                <Footer />
              </BlockedUI>
            </ProtectedRoute>
          }>
            <Route index element={<CourseEnrollment />} />
            <Route path='payment-success' element={<PaymentSuccess />} />
            <Route path='payment-failed' element={<PaymentFailure />} />
          </Route>

          <Route path="/user/*" element={<UserRoutes />} />

          <Route path="/tutor/*" element={<TutorRoutes />} />

          <Route path="/admin/*" element={<AdminRoutes />} />

          <Route path='*' element={<NotFound />} />

        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App

