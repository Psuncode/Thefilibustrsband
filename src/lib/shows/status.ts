const KNOWN_STATUS_LABELS: Record<string, string> = {
  announced: "On sale",
  "on-sale": "On sale",
  "sold-out": "Sold out",
  cancelled: "Cancelled",
  canceled: "Cancelled",
  postponed: "Postponed"
};

export const formatShowStatus = (status: string | undefined | null): string => {
  if (!status) return "Announced";
  const normalized = status.toLowerCase();
  if (KNOWN_STATUS_LABELS[normalized]) return KNOWN_STATUS_LABELS[normalized];
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};
