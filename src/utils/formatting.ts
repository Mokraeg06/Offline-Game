export function formatMoney(n: number): string {
  if (n < 0) return '0$';
  if (n >= 1e15) return (n / 1e15).toFixed(2) + ' Qa$';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + ' T$';
  if (n >= 1e9)  return (n / 1e9).toFixed(2)  + ' B$';
  if (n >= 1e6)  return (n / 1e6).toFixed(2)  + ' M$';
  if (n >= 1e3)  return (n / 1e3).toFixed(1)  + ' K$';
  return n.toFixed(2) + '$';
}

export function formatNumber(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(1);
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
