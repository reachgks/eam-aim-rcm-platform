export function calculateRPN(severity: number, occurrence: number, detection: number): number { return severity * occurrence * detection; }
export function getRPNPriority(rpn: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' { if (rpn >= 200) return 'CRITICAL'; if (rpn >= 120) return 'HIGH'; if (rpn >= 40) return 'MEDIUM'; return 'LOW'; }
