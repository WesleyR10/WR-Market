const statusConfig = {
  pending: { label: 'New', className: 'bg-yellow-500/10 text-yellow-500' },
  processing: {
    label: 'On progress',
    className: 'bg-blue-500/10 text-blue-500',
  },
  ready: {
    label: 'Ready to serve',
    className: 'bg-green-500/10 text-green-500',
  },
  delivery: {
    label: 'On delivery',
    className: 'bg-purple-500/10 text-purple-500',
  },
  completed: { label: 'Delivered', className: 'bg-gray-500/10 text-gray-500' },
}

interface StatusBadgeProps {
  status: keyof typeof statusConfig
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
