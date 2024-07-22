import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/pages/Home';
import { Login } from '../src/pages/Login.tsx';
import { Signup } from '../src/pages/Signup.tsx';
import { Account } from '../src/pages/Account.tsx';
import { Products } from "../src/pages/Products.tsx";
import { ProductView } from './pages/ProductView.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/products/:category" element={<Products />}/>
        <Route path="/productView/:productId" element={<ProductView/>}/>

      </Routes>
    </Router>
  );
}

export default App;
