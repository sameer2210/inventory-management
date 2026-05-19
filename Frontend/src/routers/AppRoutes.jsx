import { Route, Routes } from 'react-router-dom';
import Products from '../views/Products';

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
