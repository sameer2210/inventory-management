import { NavLink } from 'react-router-dom';

const Nav = () => {
  const baseClass = 'px-3 py-1 rounded transition-colors';

  return (
    <nav className="bg-blue-500 text-white p-4 flex gap-6">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${baseClass} ${isActive ? 'bg-white text-blue-500 font-semibold' : ''}`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? 'bg-white text-blue-500 font-semibold' : ''}`
        }
      >
        About
      </NavLink>

      <NavLink
        to="/products"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? 'bg-white text-blue-500 font-semibold' : ''}`
        }
      >
        Products
      </NavLink>

    </nav>
  );
};

export default Nav;
