import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";
import { ConsultProvider } from "./components/ConsultModal";
import { SiteDataProvider } from "./lib/SiteDataContext";
import SplashScreen from "./components/SplashScreen";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StickyWhatsApp from "./components/StickyWhatsApp";
import FloatingContactWidget from "./components/FloatingContactWidget";
import ExitIntentPopup from "./components/ExitIntentPopup";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import InvoiceView from "./pages/InvoiceView";
import IndustryPage from "./pages/IndustryPage";
import LocationPage from "./pages/LocationPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import AuthorPage from "./pages/AuthorPage";

import AdminRoutes from "./admin/AdminRoutes";

function PublicShell() {
  return (
    <SiteDataProvider>
      {/* Honour the OS "reduce motion" setting for every Framer Motion animation on the public site. */}
      <MotionConfig reducedMotion="user">
      <ConsultProvider>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<ProjectDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/industries/:slug" element={<IndustryPage />} />
            <Route path="/locations/:slug" element={<LocationPage />} />
            <Route path="/authors/:slug" element={<AuthorPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        {/* <StickyWhatsApp /> */}
        <FloatingContactWidget />
        <ExitIntentPopup />
      </ConsultProvider>
      </MotionConfig>
    </SiteDataProvider>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(() =>
    !!sessionStorage.getItem("skyntrix_splash_seen")
  );

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <HelmetProvider>
        {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
        <Routes>
          <Route path="/invoice/:id" element={<InvoiceView />} />
          <Route path="/*" element={<PublicShell />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </HelmetProvider>
    </BrowserRouter>
  );
}
