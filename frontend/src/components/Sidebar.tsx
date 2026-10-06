import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getLinks = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin' },
          { name: 'Reports', path: '/admin/reports' },
          { name: 'Assign Expert', path: '/admin/assign' },
        ];
      case 'CYBER_EXPERT':
        return [
          { name: 'Dashboard', path: '/expert' },
          { name: 'Investigations', path: '/expert/investigation' },
        ];
      case 'USER':
      default:
        return [
          { name: 'Dashboard', path: '/user' },
          { name: 'Report Cybercrime', path: '/user/report' },
          { name: 'My Reports', path: '/user/my-reports' },
          { name: 'Link Check', path: '/user/link-check' },
          { name: 'Safety Guidance', path: '/user/guidance' },
        ];
    }
  };

  const links = getLinks();

  return (
    <div className="w-64 bg-gray-100 min-h-screen border-r border-gray-200 p-4">
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-4 py-2 rounded ${
                location.pathname === link.path ? 'bg-blue-800 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
