import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import TaskPage from './pages/TaskPage/TaskPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import AccountPage from './pages/AccountPage/AccountPage';
import MainLayout from './layouts/MainLayout';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <BrowserRouter basename='/productivity-frontend'>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<TaskPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/account' element={<AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
