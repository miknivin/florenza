// Utils for sorting products by variant sizes
export const sizeOrder = {
  "50ml": 1,
  "12ml": 2, 
  "20ml": 3,
  "100ml": 4,
  "30ml": 5,  // Adding for completeness

};

/**
 * Sort products by their first variant's size according to the specified order
 * 50ml -> 12ml -> 20ml -> 100ml -> others
 * @param {Array} products - Array of product objects
 * @returns {Array} Sorted products array
 */
export const sortProductsByVariantSize = (products) => {
  if (!Array.isArray(products)) return [];
  
  return [...products].sort((a, b) => {
    // Get the first variant's size for each product
    const sizeA = a.variants?.[0]?.size;
    const sizeB = b.variants?.[0]?.size;
    
    // Get the order priority (lower number = higher priority)
    const orderA = sizeOrder[sizeA] || 999; // Unknown sizes go to the end
    const orderB = sizeOrder[sizeB] || 999;
    
    // Compare the order priorities
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // If same size order, maintain original order (stable sort)
    return 0;
  });
};

/**
 * Sort products by checking all variants for the earliest size in the priority order
 * @param {Array} products - Array of product objects  
 * @returns {Array} Sorted products array
 */
export const sortProductsByBestVariantSize = (products) => {
  if (!Array.isArray(products)) return [];
  
  return [...products].sort((a, b) => {
    // Find the best (lowest order) size among all variants for each product
    const getBestSize = (product) => {
      if (!product.variants?.length) return 999;
      
      return Math.min(
        ...product.variants.map(variant => sizeOrder[variant.size] || 999)
      );
    };
    
    const bestOrderA = getBestSize(a);
    const bestOrderB = getBestSize(b);
    
    return bestOrderA - bestOrderB;
  });
};