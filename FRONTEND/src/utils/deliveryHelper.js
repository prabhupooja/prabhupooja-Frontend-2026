import api from "../Components/Axios/api.js";

let cachedSettings = {
  universal_delivery_charge: 40,
  free_delivery_above: 1000,
  delivery_charge_active: true,
};
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute cache

export const getCachedDeliverySettings = () => cachedSettings;

export const fetchDeliverySettings = async (force = false) => {
  const now = Date.now();
  if (!force && now - lastFetchTime < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const res = await api.get("/settings/delivery-charge");
    const data = res.data?.data || res.data;
    if (data) {
      cachedSettings = {
        universal_delivery_charge: Number(data.universal_delivery_charge ?? 40),
        free_delivery_above: Number(data.free_delivery_above ?? 1000),
        delivery_charge_active: data.delivery_charge_active !== false && data.delivery_charge_active !== "0" && data.delivery_charge_active !== 0,
      };
      lastFetchTime = now;
    }
  } catch (err) {
    console.warn("Could not fetch delivery settings, using default/cached:", err);
  }
  return cachedSettings;
};

/**
 * 🧮 Calculates delivery fee, subtotal, remaining threshold, and grand total.
 * 
 * @param {Array|Object} items - Array of cart items OR a single product object
 * @param {Number} [singleQty=1] - Quantity if single product is passed
 * @param {Object} [settings] - Optional live settings override
 * @returns {Object} { subtotal, deliveryFee, grandTotal, isFree, freeThreshold, remainingForFree, universalFee }
 */
export const calculateDeliveryFee = (items, singleQty = 1, settings = null) => {
  const currentSettings = settings || cachedSettings || {
    universal_delivery_charge: 40,
    free_delivery_above: 1000,
    delivery_charge_active: true,
  };

  const universalFee = Number(currentSettings.universal_delivery_charge ?? 40);
  const freeThreshold = Number(currentSettings.free_delivery_above ?? 1000);
  const isActive = currentSettings.delivery_charge_active !== false;

  // Normalize input to array
  let itemArray = [];
  if (Array.isArray(items)) {
    itemArray = items;
  } else if (items && typeof items === "object") {
    itemArray = [{ ...items, quantity: singleQty || items.quantity || 1 }];
  }

  // 1. Calculate Items Subtotal
  const subtotal = itemArray.reduce((sum, item) => {
    const product = item.product || item;
    const price = Number(
      product.offerPrice ||
      product.sellingPrice ||
      product.price ||
      item.offerPrice ||
      item.price ||
      0
    );
    const qty = Number(item.quantity || singleQty || 1);
    return sum + (price * qty);
  }, 0);

  // If system disabled -> 100% Free
  if (!isActive) {
    return {
      subtotal,
      deliveryFee: 0,
      grandTotal: subtotal,
      isFree: true,
      freeThreshold,
      remainingForFree: 0,
      universalFee,
    };
  }

  // 2. Check if subtotal crosses Free Delivery Threshold
  if (freeThreshold > 0 && subtotal >= freeThreshold) {
    return {
      subtotal,
      deliveryFee: 0,
      grandTotal: subtotal,
      isFree: true,
      freeThreshold,
      remainingForFree: 0,
      universalFee,
    };
  }

  // 3. For subtotal < freeThreshold: calculate item-level or universal fee
  if (itemArray.length === 0) {
    return {
      subtotal: 0,
      deliveryFee: 0,
      grandTotal: 0,
      isFree: true,
      freeThreshold,
      remainingForFree: freeThreshold,
      universalFee,
    };
  }

  const itemFees = itemArray.map((item) => {
    const p = item.product || item;
    const rawCharge = p.delivery_charge ?? p.deliveryCharge ?? item.delivery_charge ?? item.deliveryCharge;
    
    // If product has custom delivery charge set > 0, use it
    if (rawCharge !== null && rawCharge !== undefined && rawCharge !== "" && Number(rawCharge) > 0) {
      return Number(rawCharge);
    }
    // Fallback to universal fee (e.g. ₹40)
    return universalFee;
  });

  const deliveryFee = itemFees.length > 0 ? Math.max(...itemFees) : universalFee;
  const remainingForFree = freeThreshold > subtotal ? (freeThreshold - subtotal) : 0;
  const grandTotal = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    grandTotal,
    isFree: deliveryFee === 0,
    freeThreshold,
    remainingForFree,
    universalFee,
  };
};

/**
 * 🏷️ Generates shipping badge info for UI cards and banners
 */
export const getDeliveryBadgeInfo = (priceOrSubtotal, productCustomCharge = null, settings = null) => {
  const currentSettings = settings || cachedSettings;
  const subtotal = Number(priceOrSubtotal || 0);
  const freeThreshold = Number(currentSettings.free_delivery_above ?? 1000);
  const universalFee = Number(currentSettings.universal_delivery_charge ?? 40);
  const isActive = currentSettings.delivery_charge_active !== false;

  if (!isActive || (freeThreshold > 0 && subtotal >= freeThreshold)) {
    return {
      isFree: true,
      fee: 0,
      badgeText: "🚚 FREE Delivery",
      fullBadgeText: "🎉 FREE Delivery Across India",
      threshold: freeThreshold,
    };
  }

  const fee = (productCustomCharge !== null && productCustomCharge !== undefined && productCustomCharge !== "" && Number(productCustomCharge) > 0)
    ? Number(productCustomCharge)
    : universalFee;

  return {
    isFree: false,
    fee,
    badgeText: `🚚 Delivery: ₹${fee}`,
    fullBadgeText: `🚚 Delivery: ₹${fee} (FREE on orders above ₹${freeThreshold})`,
    threshold: freeThreshold,
  };
};

const deliveryHelper = {
  fetchDeliverySettings,
  calculateDeliveryFee,
  getDeliveryBadgeInfo,
  getCachedDeliverySettings,
};

export default deliveryHelper;
