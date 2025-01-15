import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import TeamPage from './pages/football/TeamPage/TeamPage';
import FootballHome from './pages/football/HomePage/FootballHome';

function App() {
  return (
    <Router basename="/project-front-football-analysis">
      <MainContent />
    </Router>
  );
}

function MainContent() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/football" element={<FootballHome />} />
        <Route path="/football/team/:teamId" element={<TeamPage />} /> {/* Corrigido para :teamId */}
      </Routes>
    </div>
  );
}

export default App;
