import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { ApiError, ApiResponse, Institution } from '../../lib/types';

export default function InstitutionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteName, setDeleteName] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    api.get<ApiResponse<Institution>>(`/api/institutions/${id}`)
      .then((res) => setInstitution(res.data))
      .catch((err: ApiError) => {
        if (err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/institutions/${id}`, { code: deleteCode, name: deleteName });
      navigate('/institutions?msg=삭제되었습니다');
    } catch (err) {
      const e = err as ApiError;
      setDeleteError(e.message || '삭제 확인 정보가 일치하지 않습니다');
    }
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (notFound) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">기관을 찾을 수 없습니다</p>
      <Link to="/institutions" className="text-blue-600 hover:underline">목록으로 돌아가기</Link>
    </div>
  );
  if (!institution) return null;

  const rows = [
    ['유형', institution.institutionType.name],
    ['주소', institution.address],
    ['전화', institution.phone],
    ['이메일', institution.email],
    ['홈페이지', institution.website],
    ['대표자', institution.representative],
    ['설립일', institution.establishedDate],
    ['등록일', institution.createdAt?.replace('T', ' ').slice(0, 16)],
    ['수정일', institution.updatedAt?.replace('T', ' ').slice(0, 16)],
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Link to="/institutions" className="text-sm text-gray-500 hover:text-gray-700">← 목록으로</Link>
        <div className="flex gap-2">
          <Link to={`/institutions/${id}/edit`} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50">수정</Link>
          <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700">삭제</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-xl font-semibold mb-4">
          {institution.name} <span className="text-gray-400 font-normal">({institution.code})</span>
        </h1>
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[120px_1fr] py-2 border-b border-gray-100 text-sm">
            <span className="text-gray-500">{label}</span>
            <span>{value || '-'}</span>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-24 z-50" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 font-semibold">
              기관 삭제 확인
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="px-5 py-4 space-y-4 text-sm">
              <p>삭제를 진행하려면 아래 값을 정확히 입력해 주세요.</p>
              <div>
                <label className="block text-gray-500 mb-1">기관 코드</label>
                <input type="text" value={deleteCode} onChange={(e) => setDeleteCode(e.target.value)} placeholder={institution.code} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">기관명</label>
                <input type="text" value={deleteName} onChange={(e) => setDeleteName(e.target.value)} placeholder={institution.name} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              {deleteError && <p className="text-red-600 text-xs">{deleteError}</p>}
              <p className="text-red-600 text-xs">삭제된 기관은 복구할 수 없습니다.</p>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm">취소</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700">삭제</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}