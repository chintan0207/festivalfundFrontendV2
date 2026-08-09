import { badgeColors, categoryAvatarGradients } from "@/theme/colors";

export const categoryLabels: Record<string, string> = {
  PARENT: "Parents",
  BOY: "Boys",
  GIRL: "Girls",
};

export const categoryBadgeStyles: Record<string, string> = {
  PARENT: badgeColors.parents,
  BOY: badgeColors.boys,
  GIRL: badgeColors.girls,
};

export const categoryOptions: { value: string; label: string }[] = [
  { value: "PARENT", label: "Parents" },
  { value: "BOY", label: "Boys" },
  { value: "GIRL", label: "Girls" },
];

export function categoryLabel(category?: string): string {
  return (category && categoryLabels[category]) || category || "—";
}

export function categoryBadge(category?: string): string {
  return (category && categoryBadgeStyles[category]) || "bg-muted text-muted-foreground";
}

export function categoryAvatarGradient(category?: string): string {
  return (
    (category && categoryAvatarGradients[category]) ||
    categoryAvatarGradients.default
  );
}