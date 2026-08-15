export function formatINR(
  value?: number,
  opts: { decimals?: number; compact?: boolean } = {},
): string {
  const n = Number(value || 0);
  if (opts.compact) {
    return `₹${new Intl.NumberFormat("en-IN", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n)}`;
  }
  const decimals = opts.decimals ?? (Number.isInteger(n) ? 0 : 2);
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatDate(value?: string | number | Date | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value?: string | number | Date | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
}

export function formatPct(pct: number | null): string {
  if (pct == null) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct}%`;
}

export interface ActivityLinkTarget {
  to: string;
  params: Record<string, string | undefined>;
}

/**
 * Maps an activity event to a deep link into the entity that generated it.
 * Falls back to the module list page when the target is missing.
 */
export function activityLinkFor(event: {
  type?: string;
  targetType?: string;
  targetId?: string;
}): ActivityLinkTarget {
  if (event?.targetType === "contribution" && event.targetId) {
    return {
      to: "/dashboard/contributions/$contributionId",
      params: { contributionId: event.targetId },
    };
  }
  if (event?.targetType === "expense" && event.targetId) {
    return {
      to: "/dashboard/expenses/$expenseId",
      params: { expenseId: event.targetId },
    };
  }
  if (event?.targetType === "contributor" && event.targetId) {
    return {
      to: "/dashboard/contributors/$contributorId",
      params: { contributorId: event.targetId },
    };
  }

  const fallback =
    event?.type === "EXPENSE" || event?.type === "EXPENSE_STATUS"
      ? "/dashboard/expenses"
      : event?.type === "CONTRIBUTOR"
        ? "/dashboard/contributors"
        : "/dashboard/contributions";
  return { to: fallback, params: {} };
}
