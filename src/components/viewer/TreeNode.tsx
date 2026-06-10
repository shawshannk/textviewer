import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

type TreeValue = string | number | boolean | null | TreeValue[] | Record<string, TreeValue>

interface Props {
  label?: string
  value: TreeValue
  depth?: number
}

export function TreeNode({ label, value, depth = 0 }: Props) {
  const [collapsed, setCollapsed] = useState(depth > 2)
  const isComplex = typeof value === 'object' && value !== null
  const isArray = Array.isArray(value)

  const toggle = () => setCollapsed((c) => !c)

  return (
    <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', lineHeight: 1.7 }}>
        {/* Toggle button for complex nodes */}
        {isComplex && (
          <button
            onClick={toggle}
            className="inline-flex items-center mr-1 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {collapsed
              ? <ChevronRight size={11} />
              : <ChevronDown size={11} />
            }
          </button>
        )}

        {/* Key label */}
        {label !== undefined && (
          <span style={{ color: 'var(--color-tok-key)' }}>
            &quot;{label}&quot;
            <span style={{ color: 'var(--color-muted)' }}>: </span>
          </span>
        )}

        {/* Leaf value */}
        {!isComplex && <LeafValue value={value} />}

        {/* Complex opening bracket */}
        {isComplex && (
          <span style={{ color: 'var(--color-muted)' }}>
            {isArray ? '[' : '{'}
            {collapsed && (
              <span style={{ color: 'var(--color-muted)' }}>
                {isArray ? `${(value as TreeValue[]).length} items` : `${Object.keys(value).length} keys`}
                {isArray ? ']' : '}'}
              </span>
            )}
          </span>
        )}
      </span>

      {/* Children */}
      {isComplex && !collapsed && (
        <div>
          {isArray
            ? (value as TreeValue[]).map((v, i) => (
                <TreeNode key={i} label={String(i)} value={v} depth={depth + 1} />
              ))
            : Object.entries(value as Record<string, TreeValue>).map(([k, v]) => (
                <TreeNode key={k} label={k} value={v} depth={depth + 1} />
              ))
          }
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--color-muted)', marginLeft: depth > 0 ? 16 : 0 }}>
            {isArray ? ']' : '}'}
          </span>
        </div>
      )}
    </div>
  )
}

function LeafValue({ value }: { value: TreeValue }) {
  if (value === null) return <span style={{ color: 'var(--color-tok-null)' }}>null</span>
  if (typeof value === 'boolean') return <span style={{ color: 'var(--color-tok-bool)' }}>{String(value)}</span>
  if (typeof value === 'number') return <span style={{ color: 'var(--color-tok-num)' }}>{value}</span>
  return <span style={{ color: 'var(--color-tok-str)' }}>&quot;{String(value)}&quot;</span>
}
