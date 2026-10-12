import React from 'react';
import { 
  useAgentCore, 
  AgentRole, 
  AgentActionType, 
  PermissionStatus 
} from '../components/AgentCoreProvider';

export interface UseAgentPermissionOptions {
  role: AgentRole;
  action: AgentActionType;
  resource?: string;
}

export interface UseAgentPermissionResult {
  isGranted: boolean;
  status: PermissionStatus;
  roleState: {
    isActive: boolean;
    status: string;
    notes?: string;
  };
  isExecutionLocked: boolean;
  requestAuthorization: () => boolean;
  revokePermission: () => void;
}

/**
 * Custom hook that checks AgentCoreContext for authorization to access specific features/actions.
 * Enforces the canonical 'default-deny' security principle: access is denied unless explicitly granted.
 */
export function useAgentPermission({
  role,
  action,
  resource = 'global',
}: UseAgentPermissionOptions): UseAgentPermissionResult {
  const {
    roles,
    checkPermission,
    requestAuthorization,
    revokePermission,
    isExecutionLocked,
  } = useAgentCore();

  const status = checkPermission(role, action, resource);
  const isGranted = status === 'GRANTED';
  const currentRoleState = roles[role] || { isActive: false, status: 'RESTRICTED' };

  return {
    isGranted,
    status,
    roleState: currentRoleState,
    isExecutionLocked,
    requestAuthorization: () => requestAuthorization(role, action, resource),
    revokePermission: () => revokePermission(role, action, resource),
  };
}

export interface WithAgentPermissionOptions {
  role: AgentRole;
  action: AgentActionType;
  resource?: string;
  fallback?: React.ReactNode;
  onUnauthorized?: () => void;
}

/**
 * Higher-Order Component (HOC) that wraps a component with default-deny permission checks.
 * Renders fallback or Default-Deny notice if authorization fails.
 */
export function withAgentPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAgentPermissionOptions
): React.FC<P> {
  const WithAgentPermissionWrapper: React.FC<P> = (props: P) => {
    const { isGranted, status } = useAgentPermission({
      role: options.role,
      action: options.action,
      resource: options.resource,
    });

    if (isGranted) {
      return React.createElement(WrappedComponent, props);
    }

    if (options.onUnauthorized) {
      options.onUnauthorized();
    }

    if (options.fallback !== undefined) {
      return <>{options.fallback}</>;
    }

    return (
      <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="font-mono font-bold uppercase text-[10px] tracking-wider text-rose-400">
            ARR Security Gate · Default-Deny Enforced
          </span>
          <p className="text-[11px] text-rose-200">
            Unauthorized feature access: Role <strong className="text-white">{options.role}</strong> has not been authorized for{' '}
            <strong className="text-white">{options.action}</strong> on resource <code className="text-rose-300">{options.resource || 'global'}</code>.
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 border border-rose-700 text-rose-300">
          {status}
        </span>
      </div>
    );
  };

  WithAgentPermissionWrapper.displayName = `withAgentPermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAgentPermissionWrapper;
}

export default useAgentPermission;
