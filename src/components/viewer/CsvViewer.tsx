import { useMemo } from 'react'
import { parseCSV } from '@/lib/parsers/csvParser'

interface Props { content: string }

export function CsvViewer({ content }: Props) {
  const rows = useMemo(() => parseCSV(content), [content])

  if (rows.length === 0) {
    return <div className="p-4 text-xs" style={{ color: 'var(--color-muted)' }}>Empty CSV</div>
  }

  const [headers, ...body] = rows

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-3 py-2 border whitespace-nowrap sticky top-0"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface2)',
                  color: 'var(--color-tok-key)',
                  fontWeight: 700,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr
              key={ri}
              className="transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface2)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-1.5 border whitespace-nowrap"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
