import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import DataCatalog from './pages/DataCatalog';
import CropData from './pages/CropData';
import MarketData from './pages/MarketData';
import RiskAnalysis from './pages/RiskAnalysis';
import RegionalInsights from './pages/RegionalInsights';
import CustomSolutions from './pages/CustomSolutions';
// import TestPage from './TestPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/data" element={<DataCatalog />} />
            <Route path="/data/crop-data" element={<CropData />} />
            <Route path="/data/market-data" element={<MarketData />} />
            <Route path="/data/risk-analysis" element={<RiskAnalysis />} />
            <Route path="/data/regional-insights" element={<RegionalInsights />} />
            <Route path="/custom-solutions" element={<CustomSolutions />} />
            {/* <Route path="/test" element={<TestPage />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ScrollToTopButton />
    </Router>
  );
}

export default App;