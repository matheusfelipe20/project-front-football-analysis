import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Header from './components/header/Header';

function App() {
  
  return (
    <Router basename="/">
      <MainContent />
    </Router>
  );
}

function MainContent() {

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
