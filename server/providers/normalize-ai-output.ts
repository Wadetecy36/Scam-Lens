export function normalizeWarningSigns(
  value: unknown,
): unknown[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      item &&
      typeof item === "object" &&
      !Array.isArray(item)
    ) {
      return [item];
    }

    if (typeof item === "string" && item.trim()) {
      return [
        {
          type: item.trim(),
          severity: "medium",
          explanation:
            `The AI identified "${item.trim()}" as a potential warning sign.`,
        },
      ];
    }

    return [];
  });
}
