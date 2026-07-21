import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ThemeEffect from './components/ThemeEffect';
import PlannerPage from './pages/PlannerPage';
import FoodsPage from './pages/FoodsPage';
import MealsPage from './pages/MealsPage';
import CuisinesPage from './pages/CuisinesPage';

function App() {
  return (
    <>
      <ThemeEffect />
      <Layout>
        <Routes>
          <Route path="/" element={<PlannerPage />} />
          <Route path="/foods" element={<FoodsPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/cuisines" element={<CuisinesPage />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
