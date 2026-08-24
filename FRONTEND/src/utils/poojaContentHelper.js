/**
 * Helper to parse dynamic pooja content from backend/admin panel.
 * Handles multiline strings (\n), comma/semicolon separation, and HTML formatted text,
 * converting them to clean array of items for <li> rendering.
 */
export const parseContentToList = (content) => {
  if (!content) return [];
  if (typeof content !== "string") return [];

  const trimmed = content.trim();
  if (!trimmed) return [];

  // Check if string contains <li> tags
  if (trimmed.includes("<li>")) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "text/html");
    const lis = Array.from(doc.querySelectorAll("li"))
      .map((li) => li.textContent.trim())
      .filter((text) => text.length > 0);
    if (lis.length > 0) return lis;
  }

  // Replace common HTML break/paragraph tags with newlines
  const clean = trimmed
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<[^>]+>/g, ""); // Strip any remaining tags

  // Split by newlines, clean up bullet marks/numbers, and filter empty lines
  const lines = clean
    .split("\n")
    .map((line) => line.trim().replace(/^[-*•\d+.)\s]+/, "").trim())
    .filter((line) => line.length > 0);

  return lines;
};
