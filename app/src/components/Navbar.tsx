import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path: string) => {
    const active = location.pathname.startsWith(path);
    return `px-3 py-1.5 rounded-md text-sm ${
      active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <header className="flex items-center px-5 py-3 border-b border-gray-200 bg-white">
      <Link to="/institutions" className="font-semibold text-gray-900 mr-8">
        연구기관 관리
      </Link>
      <nav className="flex gap-2 flex-1">
        <Link to="/institutions" className={linkClass('/institutions')}>기관 목록</Link>
        <Link to="/institution-types" className={linkClass('/institution-types')}>기관 유형</Link>
      </nav>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-700">admin</span>
        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-semibold">ADMIN</span>
        <button className="text-gray-500 hover:text-gray-700">로그아웃</button>
      </div>
    </header>
  );
}