import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type AgentRole = 'Analyst' | 'Planner' | 'Operator' | 'Auditor';

export type AgentActionType =
  | 'READ_STATE'
  | 'ANALYZE_INPUT'
  | 'VERIFY_EVIDENCE'
  | 'GENERATE_PLAN'
  | 'PROPOSE_ACTION'
  | 'EXECUTE_MUTATION'
  | 'INVOKE_EXTERNAL_API'
  | 'WRITE_DATABASE'
  | 'AUDIT_LOG'
  | 'VERIFY_INVARIANTS';

export type PermissionStatus = 'GRANTED' | 'DENIED' | 'REQUIRES_FOUNDER_AUTHORIZATION';

export interface RoleState {
  isActive: boolean;
  status: 'IDLE' | 'ANALYZING' | 'PLANNING' | 'EXECUTING' | 'AUDITING' | 'RESTRICTED';
  lastActivity?: string;
  notes?: string;
}

export interface AgentCoreAuditLog {
  id: string;
  timestamp: string;
  role: AgentRole;
  action: AgentActionType;
  resource: string;
  status: PermissionStatus;
  reason?: string;
}

export interface AgentCoreContextValue {
  // Roles state
  roles: Record<AgentRole, RoleState>;
  updateRoleStatus: (role: AgentRole, status: RoleState['status'], notes?: string) => void;
  toggleRoleActive: (role: AgentRole) => void;

  // Permissions & Governance ('default-deny')
  grantedPermissions: Set<string>;
  checkPermission: (role: AgentRole, action: AgentActionType, resource?: string) => PermissionStatus;
  requestAuthorization: (role: AgentRole, action: AgentActionType, resource: string) => boolean;
  revokePermission: (role: AgentRole, action: AgentActionType, resource?: string) => void;

  // Audit Logs
  auditLogs: AgentCoreAuditLog[];
  clearAuditLogs: () => void;

  // Global Execution Guard
  isExecutionLocked: boolean;
  setExecutionLocked: (locked: boolean) => void;
}

const AgentCoreContext = createContext<AgentCoreContextValue | null>(null);

// Canonical Default-Deny Matrix
// By default, ALL actions on ALL resources are DENIED unless explicitly listed here or authorized.
const DEFAULT_PERMITTED_ACTIONS: Record<AgentRole, AgentActionType[]> = {
  Analyst: ['READ_STATE', 'ANALYZE_INPUT', 'VERIFY_EVIDENCE'],
  Planner: ['READ_STATE', 'GENERATE_PLAN', 'PROPOSE_ACTION'],
  Operator: ['READ_STATE'], // Operator cannot mutate without explicit override authorization
  Auditor: ['READ_STATE', 'AUDIT_LOG', 'VERIFY_INVARIANTS', 'VERIFY_EVIDENCE'],
};

// Actions that strictly require explicit founder confirmation
const HIGH_CONSEQUENCE_ACTIONS: AgentActionType[] = [
  'EXECUTE_MUTATION',
  'INVOKE_EXTERNAL_API',
  'WRITE_DATABASE',
];

interface AgentCoreProviderProps {
  children: React.ReactNode;
  initialExecutionLocked?: boolean;
}

export function AgentCoreProvider({
  children,
  initialExecutionLocked = true,
}: AgentCoreProviderProps) {
  const [roles, setRoles] = useState<Record<AgentRole, RoleState>>({
    Analyst: { isActive: true, status: 'IDLE', notes: 'Read-only evidence inspection enabled.' },
    Planner: { isActive: true, status: 'IDLE', notes: 'Bounded planning enabled.' },
    Operator: { isActive: false, status: 'RESTRICTED', notes: 'Operator mutations locked by default.' },
    Auditor: { isActive: true, status: 'IDLE', notes: 'Claim ≤ Evidence invariant monitoring active.' },
  });

  const [grantedPermissions, setGrantedPermissions] = useState<Set<string>>(() => new Set());
  const [auditLogs, setAuditLogs] = useState<AgentCoreAuditLog[]>([]);
  const [isExecutionLocked, setIsExecutionLocked] = useState<boolean>(initialExecutionLocked);

  const logAuditEvent = useCallback(
    (role: AgentRole, action: AgentActionType, resource: string, status: PermissionStatus, reason?: string) => {
      const entry: AgentCoreAuditLog = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        role,
        action,
        resource,
        status,
        reason,
      };
      setAuditLogs((prev) => [entry, ...prev.slice(0, 199)]); // Keep last 200 logs
    },
    []
  );

  const updateRoleStatus = useCallback((role: AgentRole, status: RoleState['status'], notes?: string) => {
    setRoles((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        status,
        notes: notes ?? prev[role].notes,
        lastActivity: new Date().toISOString(),
      },
    }));
  }, []);

  const toggleRoleActive = useCallback((role: AgentRole) => {
    setRoles((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        isActive: !prev[role].isActive,
        lastActivity: new Date().toISOString(),
      },
    }));
  }, []);

  // Strict Default-Deny Gate
  const checkPermission = useCallback(
    (role: AgentRole, action: AgentActionType, resource: string = 'global'): PermissionStatus => {
      const roleConfig = roles[role];

      // 1. If role is inactive, DENY immediately
      if (!roleConfig || !roleConfig.isActive) {
        logAuditEvent(role, action, resource, 'DENIED', 'Role is currently inactive or disabled.');
        return 'DENIED';
      }

      // 2. If execution lock is active and action is mutative, REQUIRE_FOUNDER_AUTHORIZATION
      if (isExecutionLocked && HIGH_CONSEQUENCE_ACTIONS.includes(action)) {
        logAuditEvent(
          role,
          action,
          resource,
          'REQUIRES_FOUNDER_AUTHORIZATION',
          'Execution lock is active; mutation requires explicit founder override.'
        );
        return 'REQUIRES_FOUNDER_AUTHORIZATION';
      }

      // 3. Check explicit permission grants
      const permissionKey = `${role}:${action}:${resource}`;
      const roleActionKey = `${role}:${action}:*`;

      if (grantedPermissions.has(permissionKey) || grantedPermissions.has(roleActionKey)) {
        logAuditEvent(role, action, resource, 'GRANTED', 'Explicit permission grant found.');
        return 'GRANTED';
      }

      // 4. Check base canonical role capability
      const allowedActions = DEFAULT_PERMITTED_ACTIONS[role] || [];
      if (allowedActions.includes(action)) {
        logAuditEvent(role, action, resource, 'GRANTED', 'Base role capability permitted.');
        return 'GRANTED';
      }

      // 5. Default-Deny Fallback
      logAuditEvent(
        role,
        action,
        resource,
        'DENIED',
        'Default-Deny: Action is not permitted in base role matrix and has no active grant.'
      );
      return 'DENIED';
    },
    [roles, isExecutionLocked, grantedPermissions, logAuditEvent]
  );

  const requestAuthorization = useCallback(
    (role: AgentRole, action: AgentActionType, resource: string = 'global'): boolean => {
      const permissionKey = `${role}:${action}:${resource}`;
      setGrantedPermissions((prev) => new Set(prev).add(permissionKey));
      logAuditEvent(role, action, resource, 'GRANTED', 'Explicit authorization granted via requestAuthorization.');
      return true;
    },
    [logAuditEvent]
  );

  const revokePermission = useCallback(
    (role: AgentRole, action: AgentActionType, resource: string = 'global') => {
      const permissionKey = `${role}:${action}:${resource}`;
      const roleActionKey = `${role}:${action}:*`;
      setGrantedPermissions((prev) => {
        const next = new Set(prev);
        next.delete(permissionKey);
        next.delete(roleActionKey);
        return next;
      });
      logAuditEvent(role, action, resource, 'DENIED', 'Explicit permission revoked.');
    },
    [logAuditEvent]
  );

  const clearAuditLogs = useCallback(() => {
    setAuditLogs([]);
  }, []);

  const value = useMemo(
    () => ({
      roles,
      updateRoleStatus,
      toggleRoleActive,
      grantedPermissions,
      checkPermission,
      requestAuthorization,
      revokePermission,
      auditLogs,
      clearAuditLogs,
      isExecutionLocked,
      setExecutionLocked: setIsExecutionLocked,
    }),
    [
      roles,
      updateRoleStatus,
      toggleRoleActive,
      grantedPermissions,
      checkPermission,
      requestAuthorization,
      revokePermission,
      auditLogs,
      clearAuditLogs,
      isExecutionLocked,
    ]
  );

  return <AgentCoreContext.Provider value={value}>{children}</AgentCoreContext.Provider>;
}

export function useAgentCore() {
  const context = useContext(AgentCoreContext);
  if (!context) {
    throw new Error('useAgentCore must be used within an AgentCoreProvider');
  }
  return context;
}

// PermissionGate: Declarative UI component for default-deny access control
interface PermissionGateProps {
  role: AgentRole;
  action: AgentActionType;
  resource?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onUnauthorized?: () => void;
}

export function PermissionGate({
  role,
  action,
  resource = 'global',
  children,
  fallback = null,
  onUnauthorized,
}: PermissionGateProps) {
  const { checkPermission } = useAgentCore();
  const status = checkPermission(role, action, resource);

  if (status === 'GRANTED') {
    return <>{children}</>;
  }

  if (onUnauthorized) {
    onUnauthorized();
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between shadow-xs">
      <div className="space-y-0.5">
        <span className="font-mono font-bold uppercase text-[10px] tracking-wider text-rose-700">
          Default-Deny Security Gate
        </span>
        <p className="text-[11px] text-rose-800">
          Access Denied: Role <strong className="text-rose-950">{role}</strong> requires authorization for action{' '}
          <strong className="text-rose-950">{action}</strong> on resource <code className="text-rose-700 bg-rose-100 px-1 py-0.5 rounded font-mono">{resource}</code>.
        </p>
      </div>
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 border border-rose-300 text-rose-800 font-bold">
        {status}
      </span>
    </div>
  );
}

export { useAgentPermission, withAgentPermission } from '../hooks/useAgentPermission';
export type { UseAgentPermissionOptions, UseAgentPermissionResult, WithAgentPermissionOptions } from '../hooks/useAgentPermission';

export default AgentCoreProvider;
