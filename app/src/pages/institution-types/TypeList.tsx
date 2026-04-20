import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import type { ApiResponse, InstitutionType } from '../../lib/types';
import Banner from '../../components/Banner';

export default function TypeList() {
  const [types, setTypes] = useState<InstitutionType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<ApiResponse<InstitutionType[]>>('/api/institution-types')
      .then((res) => setTypes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Banner />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">기관 유형</h1>
        <Link to="/institution-types/new" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
          + 유형 등록
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}
        </div>
      ) : types.length === 0 ? (
        <p className="text-gray-500 text-center py-16">등록된 유형이 없습니다</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="text-left px-4 py-3 font-semibold">코드</th>
                <th className="text-left px-4 py-3 font-semibold">명칭</th>
                <th className="text-left px-4 py-3 font-semibold">설명</th>
                <th className="text-left px-4 py-3 font-semibold">정렬</th>
                <th className="text-left px-4 py-3 font-semibold">활성</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/institution-types/${t.id}`)}
                >
                  <td className="px-4 py-3">{t.code}</td>
                  <td className="px-4 py-3">{t.name}</td>
                  <td className="px-4 py-3 text-gray-500">{t.description || '-'}</td>
                  <td className="px-4 py-3">{t.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {t.active ? '활성' : '비활성'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}