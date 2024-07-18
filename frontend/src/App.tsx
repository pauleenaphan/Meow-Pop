import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from '../src/pages/Home';
import { Login } from '../src/pages/Login.tsx';
import { Signup } from '../src/pages/Signup.tsx';
import { Account } from '../src/pages/Account.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
