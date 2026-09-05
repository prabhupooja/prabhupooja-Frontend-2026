/**
 * Safe Image Extraction Helper for Product, Blog, and Event Images
 * Handles:
 * - String arrays: ["https://..."]
 * - JSON stringified arrays: '["https://..."]'
 * - Single image URL string: 'https://...'
 * - Relative paths / undefined / null
 */
export const getSafeImageUrl = (rawImage, fallback = "") => {
  if (!rawImage) return fallback;

  // If already an array of URLs
  if (Array.isArray(rawImage)) {
    const first = rawImage[0];
    return typeof first === "string" && first.trim().length > 0 ? first.trim() : fallback;
  }

  // If string
  if (typeof rawImage === "string") {
    const trimmed = rawImage.trim();
    if (!trimmed) return fallback;

    // Check if JSON-stringified array or object
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const first = parsed[0];
          return typeof first === "string" && first.trim().length > 0 ? first.trim() : fallback;
        }
        if (typeof parsed === "string") {
          return parsed.trim() || fallback;
        }
      } catch (e) {
        // Continue with raw string
      }
    }

    return trimmed;
  }

  return fallback;
};

export default getSafeImageUrl;
