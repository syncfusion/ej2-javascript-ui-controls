/**
 * Identity type used to spell a literal field type (`readonly kind: Literal<'x'> = 'x'`)
 * without a literal type annotation next to a same-literal initializer, which
 * `prefer-as-const` flags, while staying valid for toolchains older than TS 3.4
 * (no `as const`).
 *
 * @private
 */
export type Literal<T extends string | boolean | number> = T;
