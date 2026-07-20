import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LogPage from './pages/LogPage';
import FoodsPage from './pages/FoodsPage';
import MealsPage from './pages/MealsPage';
import CuisinesPage from './pages/CuisinesPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LogPage />} />
        <Route path="/foods" element={<FoodsPage />} />
        <Route path="/meals" element={<MealsPage />} />
        <Route path="/cuisines" element={<CuisinesPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
