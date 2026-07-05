export function toSnakeCase(str: string): string { return str.replace(/[A-Z]/g, l => '_' + l.toLowerCase()).replace(/^_/, ''); }
export function toCamelCase(str: string): string { return str.replace(/_([a-z])/g, (_, l) => l.toUpperCase()); }
export function toTagNumber(prefix: string, seq: number, pad: number = 6): string { return prefix + '-' + String(seq).padStart(pad, '0'); }
