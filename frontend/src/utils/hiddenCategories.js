const HIDDEN_CATEGORY_NAMES = new Set([
  'featured collections',
  'new arrivals',
  'unclassified',
  'accessories',
]);

export function isHiddenCategory(category) {
  const name = String(category?.name || '').trim().toLowerCase();
  const slug = String(category?.slug || '').trim().toLowerCase().replace(/-/g, ' ');
  return HIDDEN_CATEGORY_NAMES.has(name) || HIDDEN_CATEGORY_NAMES.has(slug);
}
