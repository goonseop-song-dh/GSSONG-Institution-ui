import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Banner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = searchParams.get('msg');
    if (msg) {
      setMessage(msg);
      const next = new URLSearchParams(searchParams);
      next.delete('msg');
      setSearchParams(next, { replace: true });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  if (!message) return null;

  return (
    <div className="mb-4 px-4 py-2.5 rounded-md bg-green-50 text-green-700 text-sm">
      {message}
    </div>
  );
}