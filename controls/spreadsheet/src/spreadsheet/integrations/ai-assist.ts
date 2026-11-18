import { Spreadsheet } from '../base/index';
import { AIAssistView, AIAssistViewModel, PromptModel, ToolbarItemClickedEventArgs } from '@syncfusion/ej2-interactive-chat';
import { showAIAssistPane, getSheetProperties, executePrompt, CommandResult } from '../common/index';
import { AssistCommand, AssistAction, renderSidePanel } from '../common/index';
import { PromptRequestEventArgs, locale, focus } from '../common/index';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { CommandExecutor } from './command-executor';

/**
 * AI Assist integration for Spreadsheet.
 */
export class AIAssist {
    private parent: Spreadsheet;
    private executor: CommandExecutor;
    private aiAssistView: AIAssistView;
    private assistHost: HTMLElement;
    private assistPanel: HTMLElement;
    private currentPrompt: string = '';
    private currentPanelWidth: number = 328;
    private isAIPanelResized: boolean = false;
    private storedPrompts: PromptModel[] = [];

    /** @hidden */
    public isAIPaneVisible: boolean = false;

    /**
     * Constructor for the AI Assist module.
     *
     * @param {Spreadsheet} parent - Constructor for the AI Assist module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.executor = new CommandExecutor(parent);
        this.addEventListener();
    }

    /**
     * Adding event listener for success and failure
     *
     * @returns {void} - Adding event listener for success and failure
     */
    private addEventListener(): void {
        this.parent.on(showAIAssistPane, this.showAIAssistPane, this);
        this.parent.on(executePrompt, this.executePromptHandler, this);
    }

    /**
     * Removing event listener for success and failure
     *
     * @returns {void} - Removing event listener for success and failure
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(showAIAssistPane, this.showAIAssistPane);
            this.parent.off(executePrompt, this.executePromptHandler);
        }
    }

    private showAIAssistPane(args: { show: boolean}): void {
        this.parent.notify(renderSidePanel, { show: args.show });
        if (!args.show) {
            this.hideAIAssistPane();
        } else {
            this.updatePaneWidth(true);
            const sidePanel: HTMLElement = this.parent.element.querySelector(`#${this.parent.element.id}_ai-assist_panel`) as HTMLElement;
            if (sidePanel) {
                sidePanel.style.width = `${this.currentPanelWidth}px`;
                sidePanel.innerHTML = '';
                this.assistHost = sidePanel;
                const resizeHandle: HTMLElement = this.parent.createElement('div', {
                    id: `${this.parent.element.id}_ai_assist_resize`,
                    className: 'e-ai-assist-resize-handle'
                });
                this.bindResizeEvents(resizeHandle);
                this.assistHost.appendChild(resizeHandle);
                this.assistPanel = this.parent.createElement('div', {
                    id: `${this.parent.element.id}_ai-assistview_panel`,
                    className: 'e-ai-assistview-panel'
                });
                this.assistHost.appendChild(this.assistPanel);
                if (isNullOrUndefined(this.aiAssistView)) {
                    this.renderAssistView();
                } else if (this.aiAssistView && this.aiAssistView.element &&
                    this.aiAssistView.element.parentElement !== this.assistPanel) {
                    this.assistPanel.appendChild(this.aiAssistView.element);
                    this.aiAssistView.scrollToBottom();
                }
                this.focusAssistTextarea();
                this.syncRibbonAiButtonState(true);
                this.isAIPaneVisible = args.show;
            }
        }
    }

    private hideAIAssistPane(): void {
        this.updatePaneWidth(false);
        const sidePanel: HTMLElement = this.parent.element.querySelector(`#${this.parent.element.id}_ai-assist_panel`) as HTMLElement;
        if (sidePanel && sidePanel.parentElement) {
            sidePanel.parentElement.removeChild(sidePanel);
        }
        this.syncRibbonAiButtonState(false);
        this.isAIPaneVisible = false;
    }

    private updatePaneWidth(show: boolean): void {
        if (this.isAIPanelResized) {
            const host: HTMLElement = this.parent.element;
            const id: string = host.id;
            const sheetEl: HTMLElement = show ? host.querySelector('.e-sheet-with-ai-assist-panel') as HTMLElement :
                host.querySelector(`#${id}_sheet`) as HTMLElement;
            const sheetTabPanel: HTMLElement = show ? host.querySelector('.e-sheet-panel-with-ai-assist-panel') as HTMLElement :
                host.querySelector(`#${id}_sheet_tab_panel`) as HTMLElement;
            sheetEl.style.width = show ? `calc(100% - ${this.currentPanelWidth}px)` : '';
            sheetTabPanel.style.width = show ? `calc(100% - ${this.currentPanelWidth}px)` : '';
        }
    }

    private syncRibbonAiButtonState(isVisible: boolean): void {
        const aiBtn: HTMLElement = this.parent.element.querySelector(
            `#${this.parent.element.id}_aibtn`) as HTMLElement;
        if (aiBtn) {
            if (isVisible) {
                aiBtn.classList.add('e-active');
            } else {
                aiBtn.classList.remove('e-active');
            }
        }
    }

    private bindResizeEvents(handle: HTMLElement): void {
        let startX: number = 0;
        let startWidth: number = 0;
        const onMouseMove: (e: MouseEvent) => void = (e: MouseEvent): void => {
            const isRtl: boolean = this.parent.enableRtl;
            const delta: number = isRtl ? (e.clientX - startX) : (startX - e.clientX);
            let newWidth: number = startWidth + delta;
            newWidth = Math.max(328, Math.min(656, newWidth));
            this.currentPanelWidth = newWidth;
            this.assistHost.style.width = `${newWidth}px`;
            const host: HTMLElement = this.parent.element;
            const sheetEl: HTMLElement = host.querySelector('.e-sheet-with-ai-assist-panel') as HTMLElement;
            const sheetTabPanel: HTMLElement = host.querySelector('.e-sheet-panel-with-ai-assist-panel') as HTMLElement;
            if (sheetEl) {
                sheetEl.style.width = `calc(100% - ${newWidth}px)`;
            }
            if (sheetTabPanel) {
                sheetTabPanel.style.width = `calc(100% - ${newWidth}px)`;
            }
            this.isAIPanelResized = true;
        };
        const onMouseUp: () => void = (): void => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        handle.addEventListener('mousedown', (e: MouseEvent): void => {
            e.preventDefault();
            startX = e.clientX;
            startWidth = this.assistHost.offsetWidth || this.currentPanelWidth;
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    private focusAssistTextarea(): void {
        const textarea: HTMLTextAreaElement = this.assistPanel && this.assistPanel.querySelector(
            '.e-assist-textarea') as HTMLTextAreaElement;
        if (textarea) {
            focus(textarea);
        }
    }
    private renderAssistView(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const bannerTemplate: Function = (): Element[] => {
            const bannerContainer: HTMLElement = this.parent.createElement('div', { className: 'e-banner-container' });
            const icon: HTMLElement = this.parent.createElement('div', { className: 'e-icons e-assistview-icon' });
            const header: HTMLElement = this.parent.createElement('div', { className: 'e-banner-header' });
            header.textContent = l10n.getConstant('AIAssistBannerHeader');
            const content: HTMLElement = this.parent.createElement('div', { className: 'e-banner-content' });
            content.textContent = l10n.getConstant('AIAssistBannerContent');
            bannerContainer.appendChild(icon);
            bannerContainer.appendChild(header);
            bannerContainer.appendChild(content);
            return [bannerContainer];
        };
        const options: AIAssistViewModel = {
            views: [{ type: 'Assist', name: l10n.getConstant('AIAssistHeader') }],
            enableRtl: this.parent.enableRtl,
            prompts: this.storedPrompts.length > 0 ? this.storedPrompts : [],
            promptPlaceholder: l10n.getConstant('AIAssistInputPlaceHolder'),
            bannerTemplate: bannerTemplate,
            promptRequest: this.onPromptRequest.bind(this),
            toolbarSettings: {
                items: [{ iconCss: 'e-icons e-refresh', align: 'Right' }, { iconCss: 'e-icons e-close', align: 'Right' }],
                itemClicked: this.toolbarItemClicked.bind(this)
            }
        };
        if (this.parent.aiAssistSettings) {
            if (this.parent.aiAssistSettings.promptSuggestions && this.storedPrompts.length === 0) {
                options.promptSuggestions = this.parent.aiAssistSettings.promptSuggestions;
            }
            if (this.parent.aiAssistSettings.placeholder) {
                options.promptPlaceholder = this.parent.aiAssistSettings.placeholder;
            }
        }
        this.aiAssistView = new AIAssistView(options);
        this.aiAssistView.createElement = this.parent.createElement;
        (this.aiAssistView as { isInternalTemplate?: boolean }).isInternalTemplate = true;
        this.aiAssistView.appendTo(this.assistPanel);
        if (this.aiAssistView.element) {
            this.aiAssistView.element.addEventListener('click', (): void => {
                this.focusAssistTextarea();
            });
        }
    }

    private toolbarItemClicked(args: ToolbarItemClickedEventArgs): void {
        if (args.item.iconCss === 'e-icons e-refresh') {
            this.aiAssistView.prompts = [];
            this.storedPrompts = [];
            if (this.parent.aiAssistSettings.promptSuggestions) {
                this.aiAssistView.promptSuggestions = this.parent.aiAssistSettings.promptSuggestions;
            }
        }
        if (args.item.iconCss === 'e-icons e-close') {
            this.showAIAssistPane({show: false});
        }
    }

    private async onPromptRequest(args: PromptRequestEventArgs): Promise<void> {
        const prompt: string = args.prompt.trim();
        if (!prompt) {
            return;
        }
        this.currentPrompt = prompt;
        try {
            const command: AssistCommand[] = await this.requestAssistCommand(prompt);
            await this.executeCommand(command);
            this.aiAssistView.promptSuggestions = [];
        } catch (error) {
            this.appendResponse('Unable to process the request.', false);
        }
    }

    private async executePromptHandler(args: { prompt: string }): Promise<void> {
        const prompt: string = args.prompt.trim();
        this.currentPrompt = prompt;
        if (this.aiAssistView && !this.aiAssistView.isDestroyed) {
            this.aiAssistView.executePrompt(prompt);
        } else {
            const promptModel: PromptModel = { prompt: prompt };
            this.storedPrompts = [...this.storedPrompts, promptModel];
            try {
                const command: AssistCommand[] = await this.requestAssistCommand(prompt);
                const responseText: string = await this.executeCommand(command);
                if (responseText && this.storedPrompts && this.storedPrompts[this.storedPrompts.length - 1]) {
                    this.storedPrompts[this.storedPrompts.length - 1].response = responseText;
                }
            } catch (error) {
                if (this.storedPrompts && this.storedPrompts[this.storedPrompts.length - 1]) {
                    this.storedPrompts[this.storedPrompts.length - 1].response = 'Unable to process the request.';
                }
            }
        }
    }

    private async requestAssistCommand(prompt: string): Promise<AssistCommand[]> {
        try {
            const actions: AssistAction[] = await this.requestActionList(prompt);
            if (!actions || actions.length === 0) {
                return [{ action: 'unknown' }];
            }
            return await this.requestCommandsForActions(actions, prompt);
        } catch (error) {
            return [{ action: 'unknown', message: (error as Error).message }];
        }
    }

    private async requestActionList(prompt: string): Promise<AssistAction[]> {
        const request: string =
            'You are a spreadsheet assistant. Identify which actions are needed to fulfill the user request. ' +
            'Return ONLY a valid JSON array of action name strings. No explanation, no extra text. ' +
            '\n\nAvailable actions: analysis, query, reportGeneration, edit, findAndReplace, numberFormat, cellFormat, ' +
            'conditionalFormat, merge, wrap, cut, copy, paste, chart, dataValidation, filter, sort, insert, ' +
            'delete, autofill, freezePanes, hyperlink, save, unknown' +
            '\n\nRules:' +
            '\n- Return ["analysis"] for open-ended analysis or insight requests.' +
            '\n- Return ["query"] for requests asking about specific data values, details from the current sheet. Only if the question can be answered from the loaded sheet data.' +
            '\n- Return ["unknown"] if the question is about data not in the sheet, unrelated topics, or no action applies.' +
            '\n- Insert and delete actions supports only for rows and columns.' +
            '\n- Multiple actions are allowed e.g. ["edit", "cell_format"].' +
            '\n- Return valid JSON array only.' +
            `\n\nUser request: ${prompt}`;
        const response: string = await serverAIRequest(
            this.parent, { messages: [{ role: 'user', content: request }] }) as string;
        if (typeof response === 'string' && response.trim()) {
            try {
                const cleaned: string = response.trim()
                    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const parsed: any = JSON.parse(cleaned);
                if (Array.isArray(parsed)) {
                    return parsed as AssistAction[];
                }
            } catch {
                throw new Error(response);
            }
        }
        return ['unknown'];
    }

    private async requestCommandsForActions(
        actions: AssistAction[], prompt: string): Promise<AssistCommand[]> {
        const combinedSchema: string = actions.map((a: AssistAction) => `${a}: ${this.getActionSchema(a)}`).join('\n\n');
        const sheetData: string = getSheetProperties(
            this.parent, ['rows', 'cells'], this.parent.activeSheetIndex, ['value']);
        const request: string =
            'You are a spreadsheet command parser. ' +
            'Return a JSON array of command objects — one per action needed. ' +
            `\n\nACTION SCHEMAS (populate "args" exactly as described):\n${combinedSchema}` +
            '\n\nCOMMAND FORMAT:' +
            '\nReturn a JSON array: [{ "action": "<action>", "args": { ... } }, ...]' +
            '\nDo NOT wrap in any object. Return ONLY the JSON array.' +
            '\n\nRules:' +
            '\n- For analysis analyze the current spreadsheet sheet data in detail. Identify key patterns, trends, and inconsistencies in the data; summarize important formulas and their purpose; highlight potential issues such as errors, redundant calculations, broken references, performance bottlenecks, or data quality gaps; and provide clear, actionable recommendations for optimization or improvement. Keep the summary not too long, structured, and business - relevant and append the report message ' +
            '\n- For query: Answer only from current sheet data. Detect format keywords (table, list, markdown) and respond accordingly in that format. Be direct, concise, factual, deterministic—no invented data. Return unknown if unanswerable.' +
            '\n- For reportGeneration: base conclusions strictly on provided sheet data — do not invent values. Keep each section concise (prefer bullets). Include up to 5 topRows. For KPIs include a short formula when possible (e.g. "SUM(A2:A100)"). Visual suggestions must include chartType, a valid bounded A1 range, and a one-sentence reason. Do NOT include executable commands or UI actions in the report.' +
            '\n- Use A1, A1:B11, or "Selected" for range references.' +
            '\n- If the user does not mention a specific range, omit the range field entirely — except for chart and autofill which must always have a precise bounded range derived from the sheet data (e.g. "A1:C12"). Never use open-ended references like "A:A", "1:1", or "B:B" under any circumstance.' +
            '\n- Discontinuous chart ranges are supported using e.g. "A1:A10 C1:C10" — use this when the user specifies non-adjacent columns.' +
            '\n- If you cannot map to any action, return {"action":"unknown","message":"<explanation>"}. ' +
            '\n- Preserve formulas with "=" prefix.' +
            '\n- Do not invent missing details.' +
            '\n- Return valid JSON only.' +
            `\n\nCurrent sheet data: ${sheetData}` +
            `\n\nUser request: ${prompt}`;
        const response: string = await serverAIRequest(
            this.parent, { messages: [{ role: 'user', content: request }] }) as string;
        if (typeof response === 'string' && response.trim()) {
            try {
                const cleaned: string = response.trim()
                    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const parsed: any = JSON.parse(cleaned);
                if (Array.isArray(parsed)) {
                    return parsed as AssistCommand[];
                }
            } catch {
                return [{ action: 'unknown', message: response }];
            }
        }
        return [{ action: 'unknown' }];
    }

    private getActionSchema(action: AssistAction): string {
        const schemas: Partial<Record<AssistAction, string>> = {
            analysis: '{ message: string }',
            query: '{ message: string }',
            reportGeneration:
                '{ reportStructure: {' +
                '  summary: string,' +
                '  sections: [{ heading: string, content: string }],' +
                '  kpis: [{ name: string, value: string, formula?: string }],' +
                '  topRows: [{ row: number, values: { [header: string]: string|number } }],' +
                '  visualSuggestions: [{ chartType: string, range: string, reason: string }]' +
                '} }',
            edit:
                '{ address: string, value: string (preserve "=" prefix for formulas) }',
            findAndReplace:
                '{ findValue: string, replaceValue: string, caseSensitive?: boolean (default false), exactMatch?: boolean (default false) }',
            numberFormat:
                '{ range: string, format: General|Number|Currency|Accounting|ShortDate|LongDate|Time|Percentage|Fraction|Scientific|Text }',
            cellFormat:
                '{ range: string, formatting: { bold?: boolean, italic?: boolean, underline?: boolean, strikethrough?: boolean, fontSize?: number, fontFamily?: string, color?: string (hex), backgroundColor?: string (hex) } }',
            conditionalFormat:
                '{ range: string, type: GreaterThan|LessThan|Between|EqualTo|ContainsText|DateOccur|Duplicate|Unique|Top10Items|Bottom10Items|Top10Percentage|Bottom10Percentage|AboveAverage|BelowAverage, value: string (for Between use "min,max"), cFColor: RedFT|YellowFT|GreenFT }',
            merge:
                '{ range: string, direction: "All"|"Vertically"|"Horizontally" (default "All") }',
            wrap:
                '{ range: string, wrap: boolean }',
            cut:
                '{ range: string }',
            copy:
                '{ range: string }',
            paste:
                '{ range: string }',
            chart:
                '{ range: string, chartType: Column|Bar|Line|Area|Pie|Doughnut|Scatter|StackingColumn|StackingColumn100|StackingBar|StackingBar100|StackingLine|StackingLine100|StackingArea|StackingArea100, theme?: Material|Bootstrap|Fabric|Office365|Tailwind, title?: string, isSeriesInRows?: boolean, height?: number, width?: number }',
            dataValidation:
                '{ range: string, dvType: WholeNumber|Decimal|Date|Time|TextLength|List|Custom, dvOperator?: Between|NotBetween|EqualTo|NotEqualTo|GreaterThan|LessThan|GreaterThanOrEqualTo|LessThanOrEqualTo, dvValue1?: string, dvValue2?: string, dvIgnoreBlank?: boolean, dvInCellDropDown?: boolean, isHighlighted?: boolean }',
            filter:
                '{ range: string, filterColumn: string (column letter e.g. "A"), ' +
                'filterOperator: equal|notequal|greaterthan|lessthan|greaterthanorequal|lessthanorequal|contains|startswith|endswith|isempty|isnotempty, ' +
                'filterValue: string, clearFilter?: boolean (true to remove filter) }',
            sort:
                '{ range?: string (omit if user does not mention a specific range), ' +
                'sortColumn?: string (column letter e.g. "A", omit if not specified — first column of range will be used), ' +
                'sortOrder: "Ascending"|"Descending" (default "Ascending"), ' +
                'sortContainsHeader?: boolean (default true) }',
            insert:
                '{ modelType: "Row"|"Column", startIndex: number (1-based row or column number), ' +
                'count?: number (number of rows/columns to insert, default 1) }',
            delete:
                '{ modelType: "Row"|"Column", startIndex: number (1-based row or column number), ' +
                'count?: number (number of rows/columns to delete, default 1) }',
            autofill:
                '{ dataRange: string (source range e.g. "A1:A3"), fillRange: string (target range to fill e.g. "A4:A10"), ' +
                'direction?: "Down"|"Up"|"Left"|"Right" (auto-detected if omitted), ' +
                'fillType?: "FillSeries"|"CopyCells"|"FillFormattingOnly"|"FillWithoutFormatting" (default "FillSeries") }',
            freezePanes:
                '{ freezeType: "Rows"|"Columns"|"Panes"|"Unfreeze", ' +
                'row?: number (number of rows to freeze, 0 to unfreeze rows, default 0), ' +
                'column?: number (number of columns to freeze, 0 to unfreeze columns, default 0) }',
            hyperlink:
                '{ address: string (URL e.g. "https://example.com" or cell/sheet reference e.g. "Sheet1!A1" or defined name), ' +
                'displayText?: string (text to display in the cell, omit to keep existing), ' +
                'range?: string (target cell or range, defaults to selected cell) }',
            save:
                '{ saveType: "xlsx"|"xls"|"csv"|"pdf" (default "xlsx") }'
        };
        return schemas[action as AssistAction];
    }

    private async executeCommand(commands: AssistCommand[]): Promise<string> {
        const results: CommandResult[] = await this.executor.executeHandler(commands);
        const messages: string[] = results
            .map((r: CommandResult) => r.message)
            .filter((m: string) => !isNullOrUndefined(m) && m !== '');
        const responseText: string = messages.join('\n\n');
        if (messages.length > 0) {
            this.appendResponse(responseText);
        }
        return responseText;
    }

    private appendResponse(response: string, isSuccess: boolean = true): void {
        if (response) {
            if (isSuccess) {
                this.parent.trigger('promptResponse', { prompt: this.currentPrompt, response: response });
            }
            if (!isNullOrUndefined(this.aiAssistView)) {
                this.aiAssistView.addPromptResponse(response);
            }
        }
    }

    /**
     * Destroy AIAssist Module.
     *
     * @returns {void} - Destroy AIAssist module.
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.aiAssistView) {
            this.aiAssistView.destroy();
            this.aiAssistView = null;
        }
        if (this.assistPanel) {
            this.assistPanel.innerHTML = '';
            this.assistPanel = null;
        }
        if (this.assistHost && this.assistHost.parentElement) {
            this.assistHost.parentElement.removeChild(this.assistHost);
            this.assistHost = null;
        }
        this.currentPrompt = '';
        this.currentPanelWidth = 328;
        this.isAIPaneVisible = false;
        this.isAIPanelResized = false;
        this.storedPrompts = null;
        this.executor = null;
        this.parent = null;
    }

    /**
     * Get the AIAssist Module Name.
     *
     * @returns {string} - Get the AIAssist module name.
     */
    public getModuleName(): string {
        return 'AIAssist';
    }
}

const serverAIRequest: (context: Spreadsheet, settings: { messages: { role: string, content: string }[] }) =>
Promise<string | { message?: string, response?: string }> = async (
    context: Spreadsheet,
    settings: { messages: { role: string, content: string }[] }): Promise<string | { message?: string, response?: string }> => {
    try {
        const eventArgs: PromptRequestEventArgs = {
            requestData: {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: settings
            }
        };
        context.trigger('promptRequest', eventArgs);
        if (eventArgs.cancel) {
            return 'Request has been cancelled';
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (eventArgs.requestData as any).body = JSON.stringify((eventArgs.requestData as any).body);
        const response: Response = await fetch(context.aiAssistSettings.requestUrl, eventArgs.requestData);
        const result: { ok?: boolean, response?: string, error?: string } = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Network response was not ok');
        }
        return result.response.replace('END_INSERTION', '');
    } catch (error) {
        return (error as Error).message;
    }
};
