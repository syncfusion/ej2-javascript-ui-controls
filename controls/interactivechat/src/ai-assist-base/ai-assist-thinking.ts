import { createElement, EventHandler, getUniqueID, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { ThinkingContextItem, ThinkingStage } from '../ai-assistview/interface';
import { ThinkingContextBadge } from '../ai-assistview/interface';
import { AIAssistBase } from './ai-assist-base';
import { Timeline, TimelineOrientation } from '@syncfusion/ej2-layouts';
import { MarkdownConverter } from '@syncfusion/ej2-markdown-converter';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { ThinkingBlock } from '../ai-assistview/interface';
import { EditableContextClickedEventArgs } from '../ai-assistview/index';

export const CONTEXT_TYPE_META: Record<string, {
    iconCss: string;
    cssClass: string;
}> = {
    'file': {
        iconCss: 'e-icons e-file-document',
        cssClass: 'e-context-file'
    },
    'variable': {
        iconCss: '',
        cssClass: 'e-context-variable'
    },
    'search': {
        iconCss: 'e-icons e-search',
        cssClass: 'e-context-search'
    },
    'tool': {
        iconCss: 'e-icons e-settings',
        cssClass: 'e-context-tool'
    },
    'result': {
        iconCss: 'e-icons e-circle-info',
        cssClass: 'e-context-result'
    },
    'context': {
        iconCss: '',
        cssClass: 'e-context-generic'
    }
};

/**
 * Defines the Thinking of AIAssist.
 * @hidden
 */
export class AssistThinking {
    private parent!: AIAssistBase;
    private collapsedStates: Map<string, boolean> = new Map();
    private timelineInstances: Map<string, Timeline> = new Map();
    private spinnerInstances: Map<string, HTMLElement> = new Map();

    constructor(parent: AIAssistBase) {
        this.parent = parent;
    }

    protected getModuleName(): string {
        return 'assistThinking';
    }

    public destroy(): void {
        //this.parent = null;
        this.collapsedStates.clear();

        // Destroy all timeline instances
        this.timelineInstances.forEach((timeline: Timeline) => {
            if (timeline) {
                timeline.destroy();
            }
        });
        this.timelineInstances.clear();

        // Hide and cleanup all spinner instances
        this.spinnerInstances.forEach((spinnerElement: HTMLElement) => {
            if (spinnerElement && spinnerElement.parentElement) {
                hideSpinner(spinnerElement);
            }
        });
        this.spinnerInstances.clear();
    }

    /**
     * Creates thinking wrapper for all thinking items.
     *
     * @param {ThinkingBlock} item - Gets the thinking item model.
     * @param {HTMLElement} responseWrapper - The response wrapper element.
     * @param {number} blockIndex - Index of thinking block in blocks array.
     * @returns {void} Nothing returned.
     * @hidden
     */
    public createThinkingWrapper(item: ThinkingBlock, responseWrapper: HTMLElement, blockIndex?: number): void {
        this.renderThinkingItemEle(item, responseWrapper, blockIndex);
    }

    private renderThinkingItemEle(item: ThinkingBlock, responseWrapper: HTMLElement, blockIndex?: number): void {
        const itemId: string = item.id || getUniqueID('e-thinking-item');
        // Store initial collapsed state - default to true (collapsed) if not specified
        const isInitiallyCollapsed: boolean = item.collapsed !== false;  // true by default
        this.collapsedStates.set(itemId, isInitiallyCollapsed);

        responseWrapper.classList.add(`${item.isActive ? 'e-thinking-active' : 'e-thinking-finished'}`);
        responseWrapper.id = itemId;

        // Check if blockTemplate is provided - if yes, use custom template rendering
        if ((this.parent as any).blockTemplate) {
            this.renderThinkingWithTemplate(item, responseWrapper, blockIndex);
        } else {
            // Default hardcoded rendering
            // Render header with icon, title, and toggle button (spec: item first, then containerId)
            const headerEle: HTMLElement = this.renderThinkingHeader(item, itemId);
            responseWrapper.append(headerEle);

            // Render stages body
            if (item.stages && item.stages.length > 0) {
                if (item.stages.length === 1) {
                    // Single stage: render directly as child of thinking container (no timeline wrapper)
                    const singleStageElement: HTMLElement = this.renderSingleStageContainerElement(
                        item.stages[0], itemId, isInitiallyCollapsed);
                    responseWrapper.append(singleStageElement);
                } else {
                    // Multiple stages: use Timeline component wrapped in timeline container (spec: item first, then containerId)
                    const bodyEle: HTMLElement = this.renderThinkingBody(item, itemId, isInitiallyCollapsed);
                    responseWrapper.append(bodyEle);
                }
            }

            // Render description if present (always visible, separate from stages)
            const descEle: HTMLElement | null = this.renderThinkingDescription(item);
            if (descEle) {
                responseWrapper.append(descEle);
            }
        }

        // Show spinner after DOM is fully rendered and element is attached to document
        if ((isNOU((this.parent as any).blockTemplate) || (this.parent as any).blockTemplate === '') && item.isActive) {
            const activeSpanElement: HTMLElement = responseWrapper.querySelector('.e-active-spinner');
            if (activeSpanElement && activeSpanElement.parentElement) {
                showSpinner(activeSpanElement);
            }
        }
    }

    private renderThinkingHeader(item: ThinkingBlock, containerId: string): HTMLElement {
        const header: HTMLElement = createElement('div', {
            attrs: { class: 'e-aiassist-thinking-header' }
        });

        let isDisabled: boolean = !item.collapsible || isNOU(item.stages);
        if (item.stages) {
            isDisabled = isDisabled || item.stages.length === 0;
        }

        // Default collapsed state to true (start collapsed) if not specified
        const isCollapsed: boolean = item.collapsed !== false;

        // Native button element
        const toggleButton: HTMLButtonElement = createElement('button', {
            attrs: {
                id: `${containerId}-toggle-button`,
                type: 'button',
                class: 'e-aiassist-thinking-toggle',
                'aria-expanded': (!isCollapsed).toString(),
                'aria-disabled': isDisabled.toString()
            }
        }) as HTMLButtonElement;

        if (isDisabled) {
            toggleButton.disabled = true;
        }

        // Active span
        const activeSpan: HTMLElement = createElement('span', {
            attrs: { class: `${item.isActive ? 'e-active-spinner' : 'e-icons e-check'}` }
        });

        // Initialize Spinner component when isActive is true
        if (item.isActive) {
            // Create Syncfusion spinner using utility function (do NOT show yet - DOM not ready)
            createSpinner({ target: activeSpan, type: 'Bootstrap' });
            // Store reference for lifecycle management and cleanup
            this.spinnerInstances.set(containerId, activeSpan);
        }

        toggleButton.append(activeSpan);

        // Text span
        const textSpan: HTMLElement = createElement('span', {
            attrs: { class: 'e-toggle-text' }
        });
        textSpan.innerHTML = item.title || 'Thinking...';
        toggleButton.append(textSpan);

        // Icon span
        const toggleIconSpan: HTMLElement = createElement('span', {
            attrs: {
                class: `e-icons ${isCollapsed ? 'e-chevron-right' : 'e-chevron-down'} e-toggle-icon`
            }
        });
        if (!isDisabled) {
            toggleButton.append(toggleIconSpan);
        }
        header.append(toggleButton);

        // Click handler
        EventHandler.add(toggleButton, 'click', () => {this.toggleCollapse(containerId, toggleButton); }, this);
        return header;
    }

    private renderThinkingWithTemplate(item: ThinkingBlock, responseWrapper: HTMLElement, blockIndex?: number): void {
        const template: string | Function = (this.parent as any).blockTemplate;
        const context: object = {
            block: item,
            blockIndex: blockIndex !== undefined ? blockIndex : -1
        };
        (this.parent as any).updateContent(template, responseWrapper, context, 'blockTemplate');
    }

    private getMarkdownContent(response: string): string {
        const htmlResponse: string | Promise<string> = MarkdownConverter.toHtml(response);
        return htmlResponse as string;
    }

    private renderThinkingBody(item: ThinkingBlock, containerId: string, isCollapsed: boolean): HTMLElement {
        // Spec: renderThinkingBody handles 2+ stages only
        if (!item.stages || item.stages.length < 2) {
            return createElement('div');
        }

        const bodyContainer: HTMLElement = createElement('div', {
            attrs: {
                class: `e-aiassist-thinking-timeline ${isCollapsed ? 'e-timeline-collapsed' : 'e-timeline-expanded'}`,
                'data-thinking-id': containerId,
                id: `e-thinking-timeline-${containerId}`
            }
        });

        // Multiple stages: use Timeline component
        this.renderTimelineComponent(containerId, item.stages, bodyContainer);
        return bodyContainer;
    }

    private renderThinkingDescription(item: ThinkingBlock): HTMLElement | null {
        // Spec: Extract description rendering as separate method
        if (!item.content) {
            return null;
        }

        const descEle: HTMLElement = createElement('div', {
            attrs: {
                class: 'e-thinking-response-content'
            }
        });
        descEle.innerHTML = this.getMarkdownContent(item.content);
        return descEle;
    }

    private renderContentWithContextPlaceholders(content: string, editableContext?: ThinkingContextItem[]): string {
        if (!content || !editableContext || editableContext.length === 0) {
            return this.getMarkdownContent(content);
        }

        // Clone so we can track which context items were consumed
        const usedContextIndexes: Set<number> = new Set<number>();

        const sanitizedContent: string = this.getMarkdownContent(content);

        const replacedContent: string = sanitizedContent.replace(
            /\{(\d+)\}/g,
            (match: string, indexStr: string) => {
                const index: number = Number(indexStr);
                const context: ThinkingContextItem = editableContext[parseInt(index.toString(), 10)];

                if (!context) {
                    // No matching context → keep placeholder
                    return match;
                }

                usedContextIndexes.add(index);
                return this.renderInlineContextItem(context);
            }
        );

        return replacedContent;
    }

    private renderInlineContextItem(context: ThinkingContextItem): string {
        const typeMeta: {iconCss: string; cssClass: string} | undefined = context.type ? CONTEXT_TYPE_META[context.type] : undefined;

        const tooltipAttr: string = context.tooltipText ? context.tooltipText : '';

        const badge: HTMLElement = this.renderBadgeElement(context);
        const clickableClass: string = context.clickable ? 'e-context-clickable' : '';
        const typeClass: string = !isNOU(typeMeta) ? typeMeta.cssClass : '';
        const iconHtml: HTMLElement = createElement('span', { attrs: {
            class: `e-context-icon ${!isNOU(typeMeta) ? typeMeta.iconCss : ''}`
        }});

        const contextItem: HTMLElement = createElement('span', { attrs: {
            class: `e-inline-context-item ${typeClass} ${clickableClass}`,
            title: tooltipAttr,
            'data-clickable': context.clickable ? 'true' : 'false'
        }});

        const contextName: HTMLElement = createElement('span', { attrs: {
            class: 'e-inline-context-name'
        }});
        contextName.innerText = context.name || '';

        contextItem.append(iconHtml, contextName);
        if (badge) {
            contextItem.append(badge);
        }

        return contextItem.outerHTML;
    }

    private attachContextItemClickHandlers(container: HTMLElement, contexts: ThinkingContextItem[]): void {
        const contextItems: NodeListOf<Element> = container.querySelectorAll('.e-inline-context-item.e-context-clickable');
        const contextMap: Map<string, ThinkingContextItem> = new Map();

        // Build context map by name (since we don't have direct reference after innerHTML)
        contexts.forEach((ctx: ThinkingContextItem) => {
            if (ctx.name) {
                contextMap.set(ctx.name, ctx);
            }
        });

        contextItems.forEach((item: Element) => {
            const contextName: string | null = !isNOU(item.textContent) ? item.textContent.trim() : null;
            const context: ThinkingContextItem | undefined = contextName ? contextMap.get(contextName) : undefined;

            EventHandler.add(item, 'click', (e: Event) => {
                if (context && context.clickable) {
                    const eventArgs: EditableContextClickedEventArgs = {
                        event: e,
                        contextItem: context
                    };
                    this.parent.trigger('editableContextClicked', eventArgs);
                }
            }, this.parent);
        });
    }

    private renderBadgeElement(context: ThinkingContextItem): HTMLElement {
        const badge: HTMLElement = createElement('span', {
            attrs: { class: 'e-context-badge'}
        });

        if (context.badge && context.badge !== ThinkingContextBadge.None) {
            let iconName: string = '';
            switch (context.badge) {
            case 'success':
                iconName = 'e-check';
                break;
            case 'warning':
                iconName = 'e-warning';
                break;
            case 'failed':
                iconName = 'e-error-treeview';
                break;
            case 'pending':
                iconName = 'e-pending';
                break;
            case 'info':
                iconName = 'e-circle-info';
                break;
            default:
                iconName = context.badge;
                break;
            }
            badge.className += ` e-icons ${iconName}`;
            return badge;
        }
        return null;
    }

    private renderSingleStageContainerElement(stage: ThinkingStage, containerId: string, isCollapsed: boolean): HTMLElement {
        const stageContainer: HTMLElement = createElement('div', {
            attrs: {
                class: `e-single-stage-container e-stage-${stage.status || 'pending'} ${isCollapsed ? 'e-timeline-collapsed' : 'e-timeline-expanded'}`,
                'data-thinking-id': containerId,
                id: `e-thinking-timeline-${containerId}`
            }
        });

        if (stage.iconCss) {
            const icon: HTMLElement = createElement('span', {
                attrs: { class: `e-stage-icon ${stage.iconCss}` }
            });
            stageContainer.append(icon);
        }

        // Stage content
        if (stage.content) {
            const content: HTMLElement = createElement('div', {
                attrs: { class: 'e-single-stage-content' }
            });
            content.innerHTML = this.renderContentWithContextPlaceholders(stage.content, stage.editableContext);
            stageContainer.append(content);

            // Attach click handlers to context items after DOM insertion
            if (stage.editableContext && stage.editableContext.length > 0) {
                this.attachContextItemClickHandlers(content, stage.editableContext);
            }
        }

        return stageContainer;
    }

    private renderTimelineComponent(containerId: string, stages: ThinkingStage[],
                                    container: HTMLElement): void {
        // Create timeline wrapper element
        const timelineWrapper: HTMLElement = createElement('div', {
            attrs: {
                class: 'e-timeline-wrapper',
                id: `timeline-${containerId}`
            }
        });
        container.append(timelineWrapper);

        // Map thinking stages to Timeline items
        const timelineItems: any[] = stages.map((stage: ThinkingStage, index: number): any => {
            // Build detailed HTML content for timeline item
            let itemContent: string = '';
            // Stage content
            if (stage.content) {
                const processedContent: string =
                    this.renderContentWithContextPlaceholders(
                        stage.content,
                        stage.editableContext
                    );

                itemContent += `
                <div class="e-timeline-content">
                    ${processedContent}
                </div>`;
            }

            return {
                content: itemContent,
                dotCss: stage.iconCss || this.getStatusIcon(stage.status),
                cssClass: 'e-timeline-stage',
                lastIndex: stages.length,
                stage: stage,
                stageIndex: index,
                isStageInProgress: !isNOU(stage.status) ? stage.status.toLowerCase() === 'inprogress' : ''
            };
        });

        let timelineTemplate: string | Function;

        if (isNOU((this.parent as any).itemTemplate) || (this.parent as any).itemTemplate === '') {
            timelineTemplate = this.renderTimelineTemplate.bind(this);
        } else {
            timelineTemplate = (this.parent as any).itemTemplate;
        }

        // Create and initialize Timeline component
        const timeline: Timeline = new Timeline({
            items: timelineItems,
            template: timelineTemplate,
            orientation: TimelineOrientation.Vertical,
            align: 'After'
        });
        // Render Timeline into the wrapper
        timeline.appendTo(timelineWrapper);

        // Initialize spinners for inProgress stages after timeline render
        this.initializeStageSpinners(timelineWrapper, timelineItems);

        // Attach click handlers to context items after timeline render
        stages.forEach((stage: ThinkingStage) => {
            if (stage.editableContext && stage.editableContext.length > 0) {
                // Find the content containers for this stage and attach handlers
                const contentElements: NodeListOf<Element> = timelineWrapper.querySelectorAll('.e-timeline-content');
                contentElements.forEach((contentEl: Element) => {
                    this.attachContextItemClickHandlers(contentEl as HTMLElement, stage.editableContext!);
                });
            }
        });

        // Store reference for lifecycle management and updates
        this.timelineInstances.set(containerId, timeline);
    }

    private renderTimelineTemplate(data: any): string {
        const item: any = data.item;
        const itemIndex: number = data.itemIndex || 0;
        const stage: ThinkingStage = item.stage;
        const stageIndex: number = item.stageIndex !== undefined ? item.stageIndex : itemIndex;
        const isStageInProgress: boolean = item.isStageInProgress || false;

        // Get total items from the timeline (data.itemsCount should be available)
        const isLastItem: boolean = itemIndex === item.lastIndex - 1;

        // Build indicator element: spinner for inProgress, icon otherwise
        const indicatorElement: string = isStageInProgress
            ? `<span class="indicator e-stage-spinner" id="e-stage-spinner-${itemIndex}"></span>`
            : `<span class="indicator ${item.dotCss}"></span>`;

        // Default hardcoded template
        const templateHtml: string = `
            <div class='e-thinking-timeline-item-container ${isLastItem ? 'e-timeline-last-item' : ''}'>
                <div class="e-progress-line">
                    ${indicatorElement}
                </div>
                <div class="e-stage-content">
                    <div class="e-stage-content-container">
                        ${item.content}
                    </div>
                </div>
            </div>
        `;

        return templateHtml;
    }

    private toggleCollapse(containerId: string, toggleBtn: HTMLElement): void {
        const container: HTMLElement | null = this.parent.element.querySelector(`#${containerId}`);

        // Try to find either timeline wrapper or single stage container
        let stageElement: HTMLElement | null = container.querySelector('.e-aiassist-thinking-timeline');

        if (!stageElement) {
            // No timeline wrapper found, check for direct single stage container
            stageElement = container.querySelector('.e-single-stage-container');
        }

        const currentState: boolean = this.isCollapsed(container.id);
        const newState: boolean = !currentState;

        // Update state map
        this.collapsedStates.set(container.id, newState);

        const toggleIconSpan: HTMLElement | null = container.querySelector('.e-aiassist-thinking-toggle .e-toggle-icon');

        if (isNOU(toggleIconSpan)) {
            return;
        }

        // Update aria-expanded attribute (inverse of newState: newState is collapsed, aria-expanded is expanded)
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', (!newState).toString());
        }

        // Toggle CSS class for animation (smooth max-height transition)
        if (newState) {
            stageElement.classList.remove('e-timeline-expanded');
            stageElement.classList.add('e-timeline-collapsed');
            toggleIconSpan.classList.remove('e-chevron-down');
            toggleIconSpan.classList.add('e-chevron-right');
        } else {
            stageElement.classList.remove('e-timeline-collapsed');
            stageElement.classList.add('e-timeline-expanded');
            toggleIconSpan.classList.remove('e-chevron-right');
            toggleIconSpan.classList.add('e-chevron-down');
        }
    }

    private isCollapsed(containerId: string): boolean {
        return this.collapsedStates.get(containerId) != null ? this.collapsedStates.get(containerId) as boolean : false;
    }

    private getStatusIcon(status: string | undefined): string {
        // Map stage status to appropriate icon CSS
        // If status not provided, default to check icon (Completed state)
        if (!status) {
            return 'e-icons e-check';  // Default: check icon for completed
        }

        const normalizedStatus: string = status.toLowerCase();

        switch (normalizedStatus) {
        case 'completed':
            return 'e-icons e-check';  // Check icon for completed
        case 'inprogress':
            return '';  // Empty - spinner will be rendered instead
        case 'failed':
            return 'e-icons e-error-treeview';  // Error/cross icon for failed
        default:
            return 'e-icons e-check';  // Fallback to check icon
        }
    }

    private initializeStageSpinners(timelineWrapper: HTMLElement, timelineItems: any[]): void {
        // Single CSS selector query for all spinner elements - O(n) but batched
        const spinnerElements: NodeListOf<HTMLElement> = timelineWrapper.querySelectorAll('.e-stage-spinner');

        if (spinnerElements.length === 0) {
            return;  // No spinners to initialize
        }

        // Synchronous batch processing - no RAF/setTimeout overhead
        spinnerElements.forEach((element: HTMLElement, index: number) => {
            // Create spinner (synchronous DOM operation)
            createSpinner({ target: element, type: 'Bootstrap' });
            // Remove hide class immediately - spinner pane created synchronously by createSpinner
            // Use non-null assertion since we just created the pane above
            const spinnerPane: HTMLElement = element.querySelector('.e-spinner-pane');
            // Sync call to showSpinner - already batched in single forEach
            showSpinner(element);
            // Store for lifecycle cleanup
            this.spinnerInstances.set(`e-stage-spinner-${index}`, element);
        });
    }
}
