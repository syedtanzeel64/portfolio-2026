import { AnimatePresence } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import AdminShell from './admin/AdminShell'
import AdminLogin from './admin/AdminLogin'
import NotAuthorized from './admin/NotAuthorized'
import SettingsPage from './admin/SettingsPage'
import ProjectsAdmin from './admin/ProjectsAdmin'
import ServicesAdmin from './admin/ServicesAdmin'
import TestimonialsAdmin from './admin/TestimonialsAdmin'
import MediaAdmin from './admin/MediaAdmin'

export default function Router() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/not-authorized" element={<NotAuthorized />} />
        <Route path="/admin" element={<AdminShell />}>
          <Route path="settings" element={<SettingsPage />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="media" element={<MediaAdmin />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

