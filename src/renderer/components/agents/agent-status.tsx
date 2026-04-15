import { Moon, Loader2 } from 'lucide-react'
import { cn } from '@shared/lib/utils/cn'
import type { ContainerStatus } from '@shared/lib/container/types'

export type AgentActivityStatus = 'sleeping' | 'idle' | 'working' | 'awaiting_input'

const statusLabels: Record<AgentActivityStatus, string> = {
  sleeping: 'sleeping',
  idle: 'idle',
  working: 'working',
  awaiting_input: 'needs input',
}

interface AgentStatusProps {
  status: ContainerStatus
  hasActiveSessions?: boolean
  hasSessionsAwaitingInput?: boolean
  size?: 'sm' | 'default'
  iconOnly?: boolean
  className?: string
}

export function getAgentActivityStatus(
  containerStatus: ContainerStatus,
  hasActiveSessions: boolean,
  hasSessionsAwaitingInput: boolean = false
): AgentActivityStatus {
  if (containerStatus === 'stopped') return 'sleeping'
  if (hasSessionsAwaitingInput) return 'awaiting_input'
  if (hasActiveSessions) return 'working'
  return 'idle'
}

export function AgentStatus({ status, hasActiveSessions = false, hasSessionsAwaitingInput = false, size = 'default', iconOnly = false, className }: AgentStatusProps) {
  const activityStatus = getAgentActivityStatus(status, hasActiveSessions, hasSessionsAwaitingInput)
  const isSmall = size === 'sm'
  const iconSize = isSmall ? 'h-2.5 w-2.5' : 'h-3 w-3'
  const dotSize = isSmall ? 'h-1.5 w-1.5' : 'h-2 w-2'

  const icon =
    activityStatus === 'sleeping' ? (
      <Moon className={cn(iconSize, 'text-muted-foreground shrink-0')} />
    ) : activityStatus === 'idle' ? (
      <div className={cn('rounded-full bg-muted-foreground/60 shrink-0', dotSize)} />
    ) : activityStatus === 'working' ? (
      <Loader2 className={cn(iconSize, 'animate-spin text-foreground shrink-0')} />
    ) : (
      <span className={cn('relative flex shrink-0', dotSize)}>
        <span className="animate-ping [animation-duration:3s] absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
        <span className={cn('relative inline-flex rounded-full bg-blue-500', dotSize)}></span>
      </span>
    )

  return (
    <div
      className={cn('flex items-center shrink-0', !iconOnly && (isSmall ? 'gap-1' : 'gap-1.5'), className)}
      data-testid="agent-status"
      data-status={activityStatus}
    >
      {icon}
      {!iconOnly && (
        <span
          className={cn(isSmall ? 'text-[10px]' : 'text-xs', {
            'text-muted-foreground': activityStatus === 'sleeping' || activityStatus === 'idle',
            'text-foreground': activityStatus === 'working',
            'text-blue-500': activityStatus === 'awaiting_input',
          })}
        >
          {statusLabels[activityStatus]}
        </span>
      )}
    </div>
  )
}
