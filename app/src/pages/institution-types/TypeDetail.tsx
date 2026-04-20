import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { ApiError, ApiResponse, InstitutionType } from '../../lib/types';

export default function TypeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [type, setType] = useState<InstitutionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get<ApiResponse<InstitutionType>>(`/api/institution-types/${id}`)
      .then((res) => setType(res.data))
      .catch((err: ApiError) => {
        if (err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeactivate = async () => {
    try {
      await api.delete(`/api/institution-types/${id}`);
      navigate('/institution-types?msg=비활성화되었습니다');
    } catch {
      // handle error
    }
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (notFound) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">유형을 찾을 수 없습니다</p>
      <Link to="/institution-types" className="text-blue-600 hover:underline">목록으로 돌아가기</Link>
    </div>
  );
  if (!type) return null;

  const rows = [
    ['코드', type.code],
    ['명칭', type.name],
    ['설명', type.description],
    ['정렬 순서', String(type.sortOrder)],
    ['등록일', type.createdAt?.replace('T', ' ').slice(0, 16)],
    ['수정일', type.updatedAt?.replace('T', ' ').slice(0, 16)],
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Link to="/institution-types" className="text-sm text-gray-500 hover:text-gray-700">← 목록으로</Link>
        <div className="flex gap-2">
          <Link to={`/institution-types/${id}/edit`} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50">수정</Link>
          {type.active && (
            <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700">비활성화</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-xl font-semibold mb-4">
          {type.name} <span className="text-gray-400 font-normal">({type.code})</span>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${type.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {type.active ? '활성' : '비활성'}
          </span>
        </h1>
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[120px_1fr] py-2 border-b border-gray-100 text-sm">
            <span className="text-gray-500">{label}</span>
            <span>{value || '-'}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-24 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 font-semibold">
              유형 비활성화 확인
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="px-5 py-4 text-sm space-y-3">
              <p><strong>"{type.name}"</strong> 유형을 비활성화합니다.</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                비활성화 후:<br />
                · 신규 기관 등록 시 선택 불가<br />
                · 기존 참조 기관은 유지됨
              </p>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm">취소</button>
              <button onClick={handleDeactivate} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700">비활성화</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}