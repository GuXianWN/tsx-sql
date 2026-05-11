const FRAGMENT_SYMBOL = "tsx-sql.fragment";

// SQL fragments are transparent wrappers for <>...</>.
// compile(...) skips the fragment node itself and reads its children.
export const SqlFragment = Symbol.for(FRAGMENT_SYMBOL);
