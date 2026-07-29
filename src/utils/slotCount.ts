function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getSlotCount(): number {
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })
  );

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const period = now.getHours() < 12 ? 0 : 1;

  const seed = year * 1000000 + month * 10000 + day * 100 + period;

  return Math.floor(seededRandom(seed) * 5) + 6;
}
