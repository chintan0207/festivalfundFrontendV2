import { badgeColors, gradientColors } from "@/theme/colors";

export const contributorCategoryLabels: Record<string, string> = {
  PARENT: "Parents",
  BOY: "Boys",
  GIRL: "Girls",
};

export const contributorCategoryBadgeStyles: Record<string, string> = {
  PARENT: badgeColors.parents,
  BOY: badgeColors.boys,
  GIRL: badgeColors.girls,
};

export const contributorCategoryAvatarGradients: Record<string, string> = {
  PARENT: gradientColors[2],
  BOY: gradientColors[1],
  GIRL: gradientColors[0],
};

export const DEFAULT_AVATAR_GRADIENT = gradientColors[5];

export const contributorCategoryOptions: { value: string; label: string }[] = [
  { value: "PARENT", label: "Parents" },
  { value: "BOY", label: "Boys" },
  { value: "GIRL", label: "Girls" },
];

export function contributorCategoryLabel(category?: string): string {
  return (category && contributorCategoryLabels[category]) || category || "—";
}

export function contributorCategoryBadge(category?: string): string {
  return (category && contributorCategoryBadgeStyles[category]) || "bg-muted text-muted-foreground";
}

export function contributorAvatarGradient(category?: string): string {
  return (category && contributorCategoryAvatarGradients[category]) || DEFAULT_AVATAR_GRADIENT;
}
