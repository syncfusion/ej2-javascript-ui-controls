/**
 * Check whether the text is formula or not.
 * @param text 
 */
export function checkIsFormula(text: string): boolean {
    return text && text[0] === '=' && text.length > 1;
}