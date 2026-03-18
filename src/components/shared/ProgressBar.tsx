interface Props {
  value: number;
  max: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ value, max, color = 'var(--color-money)', height = 6 }: Props) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{
      height,
      borderRadius: 'var(--radius-full)',
      background: 'rgba(255,255,255,0.08)',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: color,
        borderRadius: 'var(--radius-full)',
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}
