/**
 * Builds help popup content from plain text, without HTML parsing.
 *
 * Help text uses a small markup: a blank line starts a new paragraph, a line break is kept, and
 * `**text**` is shown in bold. Everything else is shown as typed, so translated or host-supplied
 * text can never inject markup.
 *
 * @private
 */

/**
 * Renders a help heading and body as DOM nodes.
 *
 * @param {string} title - The heading. Omitted when empty.
 * @param {string} body - The body text in help markup.
 * @returns {HTMLDivElement} The content element.
 * @private
 */
export function renderHelpContent(title: string, body: string): HTMLDivElement {
    const content: HTMLDivElement = document.createElement('div');
    content.className = 'e-wf-help-content';
    if (title) {
        const heading: HTMLHeadingElement = document.createElement('h4');
        heading.className = 'e-wf-help-title';
        heading.textContent = title;
        content.appendChild(heading);
    }
    String(body || '').replace(/\r\n/g, '\n').split(/\n{2,}/).forEach((paragraph: string) => {
        if (!paragraph.trim()) {
            return;
        }
        const p: HTMLParagraphElement = document.createElement('p');
        p.className = 'e-wf-help-text';
        paragraph.split('\n').forEach((line: string, index: number) => {
            if (index > 0) {
                p.appendChild(document.createElement('br'));
            }
            appendInline(p, line);
        });
        content.appendChild(p);
    });
    return content;
}

/**
 * Appends one line, turning `**text**` into bold text.
 *
 * @param {HTMLElement} parent - The element to append to.
 * @param {string} line - The line.
 * @returns {void}
 */
function appendInline(parent: HTMLElement, line: string): void {
    const parts: string[] = line.split('**');
    parts.forEach((part: string, index: number) => {
        if (!part) {
            return;
        }
        // Odd segments sit between a pair of `**`; an unpaired trailing `**` stays as text.
        if (index % 2 === 1 && index < parts.length - 1) {
            const strong: HTMLElement = document.createElement('strong');
            strong.textContent = part;
            parent.appendChild(strong);
        } else {
            parent.appendChild(document.createTextNode(index % 2 === 1 ? '**' + part : part));
        }
    });
}
