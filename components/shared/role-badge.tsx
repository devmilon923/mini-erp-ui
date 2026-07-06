import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';

const roleStyle: Record<Role, string> = {
  Admin: 'bg-ember/10 text-ember',
  Manager: 'bg-brass/10 text-brass',
  Employee: 'bg-fog text-steel',
};

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium',
        roleStyle[role],
        className
      )}
    >
      {role}
    </span>
  );
}
