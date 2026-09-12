/**
 * Safe Image Extraction Helper for Product, Blog, and Order Images
 * Handles:
 * - Nested arrays: [["https://..."]]
 * - JSON stringified arrays: '["https://..."]' or '[["https://..."]]'
 * - Single image URL string: 'https://...'
 * - Relative paths / undefined / null
 * - Corrupted bracket tokens like "["
 */

export const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&auto=format&fit=crop&q=80";

export const normalizeImageUrl = (raw, fallback = DEFAULT_FALLBACK_IMAGE) => {
  if (!raw) return fallback;

  // If array, unwrap recursively
  if (Array.isArray(raw)) {
    if (raw.length === 0) return fallback;
    return normalizeImageUrl(raw[0], fallback);
  }

  if (typeof raw === "string") {
    let str = raw.trim();
    if (!str) return fallback;

    // Handle JSON stringified arrays or objects (e.g. '[ "https://..." ]' or '[ [ "https://..." ] ]')
    if (str.startsWith("[") || str.startsWith("{")) {
      try {
        const parsed = JSON.parse(str);
        return normalizeImageUrl(parsed, fallback);
      } catch (e) {
        // Continue cleaning string
      }
    }

    // Strip wrapping quotes, brackets, and whitespace
    str = str.replace(/^[\[\"\'\`\s]+|[\]\"\'\`\s]+$/g, "").trim();

    // Check if what's left is a lone bracket, comma, or too short to be a valid URL/path
    if (!str || str === "[" || str === "]" || str.length < 3) {
      return fallback;
    }

    // Check if already full URL or data URI
    if (
      str.startsWith("http://") ||
      str.startsWith("https://") ||
      str.startsWith("data:")
    ) {
      return str;
    }

    // Relative path handling
    const backendBase =
      process.env.REACT_APP_BACKEND_URL ||
      process.env.REACT_APP_BASE_URL ||
      "http://localhost:5000";

    const cleanBase = backendBase.replace(/\/+$/, "");
    return str.startsWith("/")
      ? `${cleanBase}${str}`
      : `${cleanBase}/uploads/${str}`;
  }

  return fallback;
};

export const getSafeImageUrl = (rawImage, fallback = DEFAULT_FALLBACK_IMAGE) => {
  return normalizeImageUrl(rawImage, fallback);
};

export const getAllSafeImageUrls = (rawImage, fallback = DEFAULT_FALLBACK_IMAGE) => {
  if (!rawImage) return [fallback];

  let list = [];
  if (Array.isArray(rawImage)) {
    list = rawImage.flat(Infinity);
  } else if (typeof rawImage === "string") {
    const trimmed = rawImage.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          list = parsed.flat(Infinity);
        } else if (typeof parsed === "string") {
          list = [parsed];
        }
      } catch (e) {}
    }
    if (list.length === 0 && trimmed.includes(",")) {
      list = trimmed.split(",");
    }
    if (list.length === 0 && trimmed.length > 0) {
      list = [trimmed];
    }
  }

  const normalized = list
    .map((item) => normalizeImageUrl(item, ""))
    .filter((url) => url && url.length > 4 && url !== "[" && url !== "]");

  return normalized.length > 0 ? normalized : [fallback];
};

export default getSafeImageUrl;

