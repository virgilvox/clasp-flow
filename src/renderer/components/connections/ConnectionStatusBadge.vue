<script setup lang="ts">
/**
 * ConnectionStatusBadge
 *
 * A small, reusable status indicator dot for connection status.
 * Displays color-coded status with optional pulse animation.
 */

import { computed } from 'vue'
import type { ConnectionStatus } from '@/services/connections/types'

const props = withDefaults(
  defineProps<{
    /** Connection status */
    status: ConnectionStatus
    /** Size variant */
    size?: 'sm' | 'md' | 'lg'
    /** Whether to show pulse animation for connecting states */
    pulse?: boolean
    /** Optional label to show on hover */
    label?: string
  }>(),
  {
    size: 'md',
    pulse: true,
  }
)

const sizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
}

const statusColors: Record<ConnectionStatus, string> = {
  connected: 'bg-emerald-500',
  connecting: 'bg-amber-500',
  reconnecting: 'bg-amber-500',
  disconnected: 'bg-neutral-400',
  error: 'bg-red-500',
}

const statusLabels: Record<ConnectionStatus, string> = {
  connected: 'Connected',
  connecting: 'Connecting...',
  reconnecting: 'Reconnecting...',
  disconnected: 'Disconnected',
  error: 'Error',
}

const shouldPulse = computed(() => {
  return props.pulse && (props.status === 'connecting' || props.status === 'reconnecting')
})
</script>

<template>
  <span
    :class="[
      'inline-block rounded-full',
      sizeClasses[props.size],
      statusColors[props.status],
      shouldPulse && 'animate-pulse',
    ]"
    :title="props.label || statusLabels[props.status]"
  />
</template>
