export const ipToInt = (ip: string): number =>
  ip.split('.').reduce((acc, o) => ((acc << 8) + Number(o)) >>> 0, 0) >>> 0;

export const intToIp = (n: number): string =>
  [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');

export const prefixToMaskInt = (p: number): number => (p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0);
export const prefixToMask = (p: number): string => intToIp(prefixToMaskInt(p));

export function maskToPrefix(mask: string): number | null {
  const n = ipToInt(mask);
  const bin = n.toString(2).padStart(32, '0');
  if (!/^1*0*$/.test(bin)) return null;
  return bin.indexOf('0') === -1 ? 32 : bin.indexOf('0');
}

export function isValidIp(ip: string): boolean {
  const parts = ip.trim().split('.');
  return parts.length === 4 && parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255);
}

export interface SubnetInfo {
  network: string;
  broadcast: string;
  first: string;
  last: string;
  mask: string;
  hosts: number;
  block: number;
  octet: number; // 1..4 interessantes Oktett
}

export function subnetInfo(ip: string, prefix: number): SubnetInfo {
  const m = prefixToMaskInt(prefix);
  const n = ipToInt(ip) & m;
  const b = (n | (~m >>> 0)) >>> 0;
  const size = 2 ** (32 - prefix);
  const octet = prefix >= 32 ? 4 : Math.floor(prefix / 8) + 1;
  const maskOct = (m >>> ((4 - Math.min(4, octet)) * 8)) & 255;
  return {
    network: intToIp(n >>> 0),
    broadcast: intToIp(b),
    first: prefix >= 31 ? intToIp(n >>> 0) : intToIp((n + 1) >>> 0),
    last: prefix >= 31 ? intToIp(b) : intToIp((b - 1) >>> 0),
    mask: intToIp(m),
    hosts: prefix >= 31 ? (prefix === 31 ? 2 : 1) : size - 2,
    block: prefix % 8 === 0 ? 256 : 256 - maskOct,
    octet,
  };
}

export const toBin8 = (n: number) => n.toString(2).padStart(8, '0');

/** IPv6 nach RFC 5952 kürzen */
export function shortenIpv6(full: string): string {
  const blocks = full.split(':').map((b) => b.replace(/^0+(?=.)/, '').toLowerCase());
  let bestStart = -1, bestLen = 0;
  for (let i = 0; i < blocks.length; ) {
    if (blocks[i] === '0') {
      let j = i;
      while (j < blocks.length && blocks[j] === '0') j++;
      if (j - i > bestLen && j - i >= 2) { bestStart = i; bestLen = j - i; }
      i = j;
    } else i++;
  }
  if (bestStart === -1) return blocks.join(':');
  const left = blocks.slice(0, bestStart).join(':');
  const right = blocks.slice(bestStart + bestLen).join(':');
  return `${left}::${right}`;
}
