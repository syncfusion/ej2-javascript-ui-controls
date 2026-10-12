import { createElement } from '@syncfusion/ej2-base';

/** @private */
export interface AccordionWrapperOptions {
    host: HTMLElement;
    title: string;
    content: HTMLElement;
}

/** @private */
export class AccordionWrapper {
    private host: HTMLElement;
    private title: string;
    private content: HTMLElement;
    private isOpen: boolean;
    private root: HTMLElement | null;
    private header: HTMLElement | null;
    private clickHandler: ((event: Event) => void) | null;
    private keydownHandler: ((event: KeyboardEvent) => void) | null;
    private mouseEnterHandler: ((event: MouseEvent) => void) | null;
    private mouseLeaveHandler: ((event: MouseEvent) => void) | null;

    constructor(opts: AccordionWrapperOptions) {
        this.host = opts.host;
        this.title = opts.title || '';
        this.content = opts.content;
        this.isOpen = false;
        this.root = null;
        this.header = null;
        this.clickHandler = null;
        this.keydownHandler = null;
        this.mouseEnterHandler = null;
        this.mouseLeaveHandler = null;
    }

    /** @private */
    public render(): void {
        this.host.innerHTML = '';

        const root: HTMLElement = createElement('div', {
            className: 'custom-accordion',
            styles: 'overflow: hidden;'
        });
        this.root = root;
        this.host.appendChild(root);

        const header: HTMLElement = createElement('div', {
            className: 'custom-accordion-header',
            attrs: {
                role: 'button',
                tabindex: '0',
                'aria-expanded': 'false',
                'aria-label': this.title,
                'aria-labelledby': 'accordion-content-' + this.title
            },
            styles: 'display: flex; align-items: center; gap: 10px; height: 45px; cursor: pointer; user-select: none;'
        });
        this.header = header;
        root.appendChild(header);

        const icon: HTMLElement = createElement('span', {
            className: 'custom-accordion-icon e-icons e-chevron-right',
            attrs: { 'aria-hidden': 'true' },
            styles: 'margin-left: 10px;'
        });
        header.appendChild(icon);

        const titleLabel: HTMLElement = createElement('span', {
            className: 'custom-accordion-title'
        });
        titleLabel.textContent = this.title;
        header.appendChild(titleLabel);

        this.clickHandler = () => this.toggle();
        this.keydownHandler = (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.toggle();
            }
        };
        this.mouseEnterHandler = () => {
            if (this.header) {
                this.header.classList.add('custom-accordion-header-hover');
            }
        };
        this.mouseLeaveHandler = () => {
            if (this.header) {
                this.header.classList.remove('custom-accordion-header-hover');
            }
        };

        header.addEventListener('click', this.clickHandler);
        header.addEventListener('keydown', this.keydownHandler);
        header.addEventListener('mouseenter', this.mouseEnterHandler);
        header.addEventListener('mouseleave', this.mouseLeaveHandler);

        this.updateVisualState();
    }

    /** @private */
    public destroy(): void {
        if (this.header) {
            if (this.clickHandler) {
                this.header.removeEventListener('click', this.clickHandler);
            }
            if (this.keydownHandler) {
                this.header.removeEventListener('keydown', this.keydownHandler);
            }
            if (this.mouseEnterHandler) {
                this.header.removeEventListener('mouseenter', this.mouseEnterHandler);
            }
            if (this.mouseLeaveHandler) {
                this.header.removeEventListener('mouseleave', this.mouseLeaveHandler);
            }
        }
        if (this.root) {
            this.root.innerHTML = '';
        }
        this.host.innerHTML = '';
    }

    public toggle(): void {
        this.isOpen = !this.isOpen;
        this.updateVisualState();
    }

    public setOpen(open: boolean): void {
        if (this.isOpen === open) {
            return;
        }
        this.isOpen = open;
        this.updateVisualState();
    }

    public getIsOpen(): boolean {
        return this.isOpen;
    }

    private updateVisualState(): void {
        if (!this.header || !this.root) {
            return;
        }

        const icon: HTMLElement | null = this.header.querySelector('.e-icons');
        if (icon) {
            icon.classList.remove('e-chevron-right', 'e-chevron-down');
            icon.classList.add(this.isOpen ? 'e-chevron-down' : 'e-chevron-right');
        }

        this.header.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');

        const existing: HTMLElement | null = this.root.querySelector('.custom-accordion-content');
        this.header.classList.toggle('custom-accordion-header--open', this.isOpen);
        this.header.classList.toggle('custom-accordion-header--closed', !this.isOpen);

        if (this.isOpen) {
            if (!existing) {
                const contentWrapper: HTMLElement = createElement('div', {
                    className: 'custom-accordion-content',
                    attrs: {
                        id: 'accordion-content-' + this.title,
                        role: 'region',
                        'aria-label': this.title
                    },
                    styles: 'padding: 0.5rem 1rem 1rem;'
                });
                contentWrapper.appendChild(this.content);
                this.root.appendChild(contentWrapper);
            }
        } else if (existing) {
            existing.remove();
        }
    }
}
