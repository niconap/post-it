import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

export default function App() {
  if (localStorage.getItem('token')) {
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
