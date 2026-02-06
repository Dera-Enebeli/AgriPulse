import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DataEthics from './pages/DataEthics';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';

const ScrollToTop: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/reports" component={Reports} />
            <Route path="/payment" component={Payment} />
            <Route path="/data" component={DataCatalog} />
            <Route path="/data/crop-data" component={CropData} />
            <Route path="/data/market-data" component={MarketData} />
            <Route path="/data/risk-analysis" component={RiskAnalysis} />
            <Route path="/regional-insights" component={RegionalInsights} />
            {/* <Route path="/test" component={TestPage} /> */}
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsOfService} />
            <Route path="/ethics" component={DataEthics} />
            <Route path="*" component={Home} /> {/* Fallback to home */}
          </Switch>
        </main>
        <Footer />
      </div>
      <ScrollToTopButton />
    </Router>
  );
}

export default App;