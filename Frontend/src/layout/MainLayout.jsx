import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Nav from '../components/Nav';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4 bg-amber-600">
        <Nav />
      </nav>
      <main className="grow p-3 bg-blue-800">
        <Outlet />
      </main>
      <footer className=" p-2 bg-red-100">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
