import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { ApiError, ApiResponse, InstitutionType } from '../../lib/types';

interface FormData {
  code: string;
  name: string;
  description: string;
  sortOrder: string;
}

const empty: FormData = { code: '', name: '', description: '', sortOrder: '' };

export default function TypeForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get<ApiResponse<InstitutionType>>(`/api/institution-types/${id}`).then((res) => {
        const d = res.data;
        setForm({ code: d.code, name: d.name, description: d.description || '', sortOrder: String(d.sortOrder) });
      });
    }
  }, [id, isEdit]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = '필수 항목입니다';
    if (!form.name.trim()) e.name = '필수 항목입니다';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const body = { ...form, sortOrder: form.sortOrder ? Number(form.sortOrder) : 0 };

    try {
      if (isEdit) {
        await api.put(`/api/institution-types/${id}`, body);
        navigate(`/institution-types/${id}?msg=수정되었습니다`);
      } else {
        const res = await api.post<ApiResponse<InstitutionType>>('/api/institution-types', body);
        navigate(`/institution-types/${res.data.id}?msg=등록되었습니다`);
      }
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.fieldErrors) {
        setErrors(apiErr.fieldErrors);
      } else {
        setErrors({ _global: apiErr.message || '오류가 발생했습니다' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-md text-sm ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <>
      <h1 className="text-xl font-semibold mb-6">{isEdit ? '유형 수정' : '유형 등록'}</h1>
      {errors._global && <div className="mb-4 px-4 py-2.5 rounded-md bg-red-50 text-red-700 text-sm">{errors._global}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Field label="코드" required error={errors.code}>
          <input type="text" value={form.code} onChange={set('code')} placeholder="FOREIGN_UNIV" className={inputClass('code')} />
        </Field>
        <Field label="명칭" required error={errors.name}>
          <input type="text" value={form.name} onChange={set('name')} placeholder="해외 대학" className={inputClass('name')} />
        </Field>
        <Field label="설명" error={errors.description}>
          <textarea value={form.description} onChange={set('description')} rows={3} className={inputClass('description')} />
        </Field>
        <Field label="정렬 순서" error={errors.sortOrder}>
          <input type="text" value={form.sortOrder} onChange={set('sortOrder')} placeholder="10" className={inputClass('sortOrder')} />
        </Field>

        <div className="flex justify-end gap-2 pt-4">
          <Link to={isEdit ? `/institution-types/${id}` : '/institution-types'} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm">취소</Link>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50">
            {submitting ? '처리 중…' : isEdit ? '저장' : '등록'}
          </button>
        </div>
      </form>
    </>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 items-start">
      <label className="text-sm text-gray-500 pt-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
}