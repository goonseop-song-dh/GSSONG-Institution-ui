import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { ApiError, ApiResponse, Institution, InstitutionType } from '../../lib/types';

interface FormData {
  name: string;
  code: string;
  institutionTypeId: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  representative: string;
  establishedDate: string;
}

const empty: FormData = {
  name: '', code: '', institutionTypeId: '', address: '',
  phone: '', email: '', website: '', representative: '', establishedDate: '',
};

export default function InstitutionForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(empty);
  const [types, setTypes] = useState<InstitutionType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<ApiResponse<InstitutionType[]>>('/api/institution-types')
      .then((res) => setTypes(res.data.filter((t) => t.active)));

    if (isEdit) {
      api.get<ApiResponse<Institution>>(`/api/institutions/${id}`).then((res) => {
        const d = res.data;
        setForm({
          name: d.name, code: d.code,
          institutionTypeId: String(d.institutionType.id),
          address: d.address, phone: d.phone || '', email: d.email || '',
          website: d.website || '', representative: d.representative || '',
          establishedDate: d.establishedDate || '',
        });
      });
    }
  }, [id, isEdit]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '필수 항목입니다';
    if (form.name.length > 200) e.name = '최대 200자';
    if (!form.code.trim()) e.code = '필수 항목입니다';
    if (!/^[A-Z0-9_-]+$/.test(form.code)) e.code = 'A-Z, 0-9, _, - 만 가능합니다';
    if (!form.institutionTypeId) e.institutionTypeId = '필수 항목입니다';
    if (!form.address.trim()) e.address = '필수 항목입니다';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '이메일 형식이 올바르지 않습니다';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const body = { ...form, institutionTypeId: Number(form.institutionTypeId) };

    try {
      if (isEdit) {
        await api.put(`/api/institutions/${id}`, body);
        navigate(`/institutions/${id}?msg=수정되었습니다`);
      } else {
        const res = await api.post<ApiResponse<Institution>>('/api/institutions', body);
        navigate(`/institutions/${res.data.id}?msg=등록되었습니다`);
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

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-md text-sm ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <>
      <h1 className="text-xl font-semibold mb-6">{isEdit ? '기관 수정' : '기관 등록'}</h1>
      {errors._global && <div className="mb-4 px-4 py-2.5 rounded-md bg-red-50 text-red-700 text-sm">{errors._global}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Field label="기관명" required error={errors.name}>
          <input type="text" value={form.name} onChange={set('name')} placeholder="최대 200자" className={inputClass('name')} />
        </Field>
        <Field label="코드" required error={errors.code}>
          <input type="text" value={form.code} onChange={set('code')} placeholder="A-Z, 0-9, _, -" className={inputClass('code')} />
        </Field>
        <Field label="유형" required error={errors.institutionTypeId}>
          <select value={form.institutionTypeId} onChange={set('institutionTypeId')} className={inputClass('institutionTypeId')}>
            <option value="">선택</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
        <Field label="주소" required error={errors.address}>
          <input type="text" value={form.address} onChange={set('address')} className={inputClass('address')} />
        </Field>
        <Field label="전화" error={errors.phone}>
          <input type="text" value={form.phone} onChange={set('phone')} className={inputClass('phone')} />
        </Field>
        <Field label="이메일" error={errors.email}>
          <input type="text" value={form.email} onChange={set('email')} className={inputClass('email')} />
        </Field>
        <Field label="홈페이지" error={errors.website}>
          <input type="text" value={form.website} onChange={set('website')} className={inputClass('website')} />
        </Field>
        <Field label="대표자" error={errors.representative}>
          <input type="text" value={form.representative} onChange={set('representative')} className={inputClass('representative')} />
        </Field>
        <Field label="설립일" error={errors.establishedDate}>
          <input type="date" value={form.establishedDate} onChange={set('establishedDate')} className={inputClass('establishedDate')} />
        </Field>

        <div className="flex justify-end gap-2 pt-4">
          <Link to={isEdit ? `/institutions/${id}` : '/institutions'} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm">취소</Link>
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