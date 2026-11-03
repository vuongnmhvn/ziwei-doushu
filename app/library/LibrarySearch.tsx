'use client';

/**
 * 古籍库搜索框 — client component
 *
 * 输入 → 实时搜索 → 跳转 /library/search?q=xxx
 * Tìm được bằng tiếng Việt (có dấu hay không dấu đều được) hoặc chữ Hán.
 */

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function LibrarySearch({ initialQuery = '' }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = () => {
    const query = q.trim();
    if (!query) return;
    startTransition(() => {
      router.push(`/library/search?q=${encodeURIComponent(query)}`);
    });
  };

  return (
    <form
      role="search"
      onSubmit={e => {
        e.preventDefault();
        submit();
      }}
      style={{
        display: 'flex',
        gap: '8px',
        padding: '6px',
        background: 'var(--bg-card)',
        border: '1px solid rgba(184,146,42,0.3)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(184,146,42,0.08)',
      }}
    >
      <input
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        aria-label="Chữ cần tìm trong sách cổ"
        placeholder="Tìm trong sách, ví dụ: Thất Sát, hoá kỵ, cung Mệnh"
        style={{
          flex: 1,
          minWidth: 0,
          padding: '10px 14px',
          border: 'none',
          outline: 'none',
          fontSize: '14px',
          color: 'var(--tx-0)',
          background: 'transparent',
        }}
      />
      <button
        type="submit"
        disabled={isPending || !q.trim()}
        style={{
          padding: '10px 22px',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(135deg, #d4a948 0%, #b8922a 100%)',
          color: 'white',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          cursor: q.trim() ? 'pointer' : 'not-allowed',
          opacity: q.trim() ? 1 : 0.5,
        }}
      >
        {isPending ? 'Đang tìm…' : 'Tìm'}
      </button>
    </form>
  );
}
