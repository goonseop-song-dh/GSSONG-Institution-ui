import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import type { ApiResponse, Institution } from '../../lib/types';
import Banner from '../../components/Banner';

export default function InstitutionList() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<ApiResponse<Institution[]>>('/api/institutions')
      .then((res) => setInstitutions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Banner />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">기관 목록</h1>
        <Link to="/institutions/new" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
          + 기관 등록
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : institutions.length === 0 ? (
        <p className="text-gray-500 text-center py-16">등록된 기관이 없습니다</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="text-left px-4 py-3 font-semibold">기관명</th>
                <th className="text-left px-4 py-3 font-semibold">코드</th>
                <th className="text-left px-4 py-3 font-semibold">유형</th>
                <th className="text-left px-4 py-3 font-semibold">대표자</th>
                <th className="text-left px-4 py-3 font-semibold">설립일</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((inst) => (
                <tr
                  key={inst.id}
                  className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/institutions/${inst.id}`)}
                >
                  <td className="px-4 py-3">{inst.name}</td>
                  <td className="px-4 py-3">{inst.code}</td>
                  <td className="px-4 py-3">{inst.institutionType.name}</td>
                  <td className="px-4 py-3">{inst.representative}</td>
                  <td className="px-4 py-3">{inst.establishedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}