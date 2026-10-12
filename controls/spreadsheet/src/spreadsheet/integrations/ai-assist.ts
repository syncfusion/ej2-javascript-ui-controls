import { Spreadsheet } from '../base/index';
import { AIAssistView, AIAssistViewModel, PromptModel, ToolbarItemClickedEventArgs } from '@syncfusion/ej2-interactive-chat';
import { showAIAssistPane, completeAction, copy, paste, getSheetProperties, initiateFilterUI, applySort, executePrompt } from '../common/index';
import { AssistCommand, AssistAction, AnalyticalReport, renderSidePanel, cut, BeforeWrapEventArgs } from '../common/index';
import { AutoFillEventArgs, ICellRenderer, PromptRequestEventArgs, locale, focus } from '../common/index';
import { beginAction, cellValidation, deleteModel, exportDialog, insertModel, replaceAll, setAutoFill, setCFRule, setChart, setMerge, workbookEditOperation } from '../../workbook/common/event';
import { getFormatFromType, SheetModel, Workbook, wrap } from '../../workbook/index';
import { setCellFormat, SetCellFormatArgs, applyNumberFormatting, selectionComplete, isReadOnlyCells, getRangeIndexes, getSwapRange, BeforeCellFormatArgs, ChartModel, getIndexesFromAddress, getColumnHeaderText, CFArgs, ChartType, AutoFillDirection, AutoFillType, ChartTheme } from '../../workbook/common/index';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';

/**
 * AI Assist integration for Spreadsheet.
 */
export class AIAssist {
    private parent: Spreadsheet;
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
        const responses: string[] = [];
        const batchableActions: Set<string> = new Set(['edit', 'cellFormat', 'numberFormat']);
        let i: number = 0;
        while (i < commands.length) {
            const command: AssistCommand = commands[i as number];
            let response: string = '';
            if (batchableActions.has(command.action)) {
                const batchAction: string = command.action;
                const batch: AssistCommand[] = [];
                while (i < commands.length && commands[i as number].action === batchAction) {
                    batch.push(commands[i as number]);
                    i++;
                }
                response = batch.length > 1
                    ? this.applyCommandBatch(batchAction, batch)
                    : this.applyBatchableAction(batchAction, batch[0].args);
            } else {
                switch (command.action) {
                case 'analysis':
                    response = command.args.message;
                    break;
                case 'query':
                    response = this.formatQueryResponse(command.args.message);
                    break;
                case 'reportGeneration':
                    response = command.args.reportStructure ? this.buildReportNarrative(command.args.reportStructure)
                        : 'Report generation failed: no report structure returned.';
                    break;
                case 'findAndReplace':
                    response = this.applyFindReplace(command.args);
                    break;
                case 'conditionalFormat':
                    response = this.applyConditionalFormat(command.args);
                    break;
                case 'merge':
                    response = this.applyMerge(command.args);
                    break;
                case 'cut':
                    response = await this.applyCut(command.args);
                    break;
                case 'copy':
                    response = await this.applyCopy(command.args);
                    break;
                case 'paste':
                    response = this.applyPaste(command.args);
                    break;
                case 'wrap':
                    response = this.applyWrap(command.args);
                    break;
                case 'chart':
                    response = this.applyChart(command.args);
                    break;
                case 'dataValidation':
                    response = this.applyDataValidation(command.args);
                    break;
                case 'filter':
                    response = this.applyFilterAction(command.args);
                    break;
                case 'sort':
                    response = this.applySortAction(command.args);
                    break;
                case 'insert':
                    response = this.applyInsert(command.args);
                    break;
                case 'delete':
                    response = this.applyDelete(command.args);
                    break;
                case 'autofill':
                    response = this.applyAutoFill(command.args);
                    break;
                case 'freezePanes':
                    response = this.applyFreezePanes(command.args);
                    break;
                case 'hyperlink':
                    response = this.applyHyperlink(command.args);
                    break;
                case 'save':
                    response = this.applySave(command.args);
                    break;
                default:
                    response = command.message || 'I can analyze the sheet, update values, replace content, or apply number formats.';
                    break;
                }
                i++;
            }
            if (response) {
                responses.push(response);
            }
        }
        const responseText: string = responses.length > 0 ? responses.join('\n\n') : '';
        if (responseText) {
            this.appendResponse(responseText);
        }
        return responseText;
    }

    private applyBatchableAction(action: string, args: AssistCommand['args']): string {
        switch (action) {
        case 'edit': return this.applyEdit(args);
        case 'cellFormat': return this.applyCellFormat(args);
        case 'numberFormat': return this.applyNumberFormat(args);
        default: return '';
        }
    }

    private applyCommandBatch(action: string, commands: AssistCommand[]): string {
        for (const cmd of commands) {
            this.applyBatchableAction(action, cmd.args);
        }
        const ranges: string[] = commands
            .map((cmd: AssistCommand) => cmd.args && (cmd.args.range || cmd.args.address))
            .filter((r: string) => !isNullOrUndefined(r) && r !== '');
        const rangeText: string = ranges.length > 0 ? ranges.join(', ') : 'selected cells';
        switch (action) {
        case 'edit': {
            const addresses: string[] = commands
                .map((cmd: AssistCommand) => cmd.args && cmd.args.address)
                .filter((a: string) => !isNullOrUndefined(a) && a !== '');
            const uniqueValues: string[] = Array.from(new Set<string>(
                commands.map((cmd: AssistCommand) => cmd.args && cmd.args.value)
            ));
            const compactRange: string = addresses.length > 0
                ? this.buildAddressRangeText(addresses) : 'selected cells';
            const valueText: string = uniqueValues.length === 1
                ? `${uniqueValues[0]}` : `${commands.length} different values`;
            return `Updated cell range ${compactRange} with ${valueText}.`;
        }
        case 'cellFormat':
            return `Applied cell formatting across ${commands.length} range(s): ${rangeText}.`;
        case 'numberFormat': {
            const formats: string[] = Array.from(new Set<string>(
                commands.map((cmd: AssistCommand) => cmd.args && cmd.args.format).filter(Boolean)
            ));
            const formatText: string = formats.length === 1 ? formats[0] : 'multiple formats';
            return `Applied ${formatText} number format to ${commands.length} range(s): ${rangeText}.`;
        }
        default:
            return `Applied ${action} to ${commands.length} range(s): ${rangeText}.`;
        }
    }

    private buildAddressRangeText(addresses: string[]): string {
        if (addresses.length === 0) { return ''; }
        if (addresses.length === 1) { return addresses[0]; }
        try {
            const indices: number[][] = addresses.map((a: string) => getRangeIndexes(a));
            const minRow: number = Math.min(...indices.map((idx: number[]) => idx[0]));
            const minCol: number = Math.min(...indices.map((idx: number[]) => idx[1]));
            const maxRow: number = Math.max(...indices.map(
                (idx: number[]) => idx[2] !== undefined ? idx[2] : idx[0]));
            const maxCol: number = Math.max(...indices.map(
                (idx: number[]) => idx[3] !== undefined ? idx[3] : idx[1]));
            const startCell: string = `${getColumnHeaderText(minCol + 1)}${minRow + 1}`;
            const endCell: string = `${getColumnHeaderText(maxCol + 1)}${maxRow + 1}`;
            return startCell === endCell ? startCell : `${startCell}:${endCell}`;
        } catch {
            return `${addresses[0]}:${addresses[addresses.length - 1]}`;
        }
    }

    private formatQueryResponse(message: string | object): string {
        if (typeof message === 'string') {
            return message;
        }
        return JSON.stringify(message);
    }

    private buildReportNarrative(report: AnalyticalReport | string): string {
        if (typeof report === 'string') {
            try {
                report = JSON.parse(report) as AnalyticalReport;
            } catch {
                return 'Report generation failed: invalid report structure format.';
            }
        }
        const escapeCell: (s: string | number | boolean) => string = (s: string | number | boolean): string => {
            if (s === null || s === undefined) { return ''; }
            return `${s}`.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
        };
        let narrative: string = '**Report Summary**\n\n';
        if (report.summary) {
            narrative += `${report.summary}\n\n`;
        }
        if (report.kpis && report.kpis.length > 0) {
            narrative += '**Key KPIs:**\n';
            report.kpis.forEach((kpi: { name: string; value: string; formula?: string }) => {
                narrative += `- ${kpi.name}: ${kpi.value}` + (kpi.formula ? ` (formula: ${kpi.formula})` : '') + '\n';
            });
            narrative += '\n';
        }
        if (report.topRows && report.topRows.length > 0) {
            const rows: { row: number; values: Record<string, string | number | boolean>; }[] =
                report.topRows.slice(0, 5) as Array<{ row: number; values: Record<string, string | number | boolean> }>;
            const firstValues: Record<string, string | number | boolean> = (rows[0] && rows[0].values);
            const headers: string[] = Object.keys(firstValues);
            if (headers.length > 0) {
                narrative += '**Top Rows (sample):**\n\n';
                narrative += `| ${headers.map((h: string) => escapeCell(h)).join(' | ')} |\n`;
                narrative += `| ${headers.map(() => '---').join(' | ')} |\n`;
                rows.forEach((r: { row: number; values: Record<string, string | number | boolean> }) => {
                    const vals: string[] = headers.map((h: string) => {
                        return escapeCell((r.values && r.values[h as string] !== undefined)
                            ? (r.values[h as string] as string | number | boolean) : '');
                    });
                    narrative += `| ${vals.join(' | ')} |\n`;
                });
                narrative += '\n';
            }
        }
        if (report.visualSuggestions && report.visualSuggestions.length > 0) {
            narrative += '**Visual Suggestions:**\n';
            report.visualSuggestions.forEach((v: { chartType: string; range: string; reason?: string }) => {
                narrative += `- ${v.chartType}: range ${v.range}` + (v.reason ? ` — ${v.reason}` : '') + '\n';
            });
            narrative += '\n';
        }
        if (report.sections && report.sections.length > 0) {
            report.sections.forEach((section: { heading: string; content: string }) => {
                narrative += `**${section.heading}**\n${section.content}\n\n`;
            });
        }
        if (report.kpis && report.kpis.some((k: { name: string; value: string; formula?: string; }) =>
            k.formula && k.formula.length > 0)) {
            narrative += '**Suggested Formulas:**\n';
            report.kpis.forEach((k: { name: string; value: string; formula?: string }) => {
                if (k.formula) {
                    narrative += `- ${k.name}: ${k.formula}\n`;
                }
            });
            narrative += '\n';
        }
        return narrative.trim();
    }

    private applyEdit(data: AssistCommand['args']): string {
        const address: string = this.getTargetAddress(data && (data.address));
        const value: string = data.value;
        const sheetName: string = this.parent.getActiveSheet().name;
        const eventArgs: { address: string; value: string } = { address: `${sheetName}!${address}`, value: value };
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'cellSave' });
        this.parent.notify(workbookEditOperation, {
            action: 'updateCellValue',
            address: address,
            value: value,
            sheetIndex: this.parent.activeSheetIndex
        });
        const range: number[] = getRangeIndexes(address);
        const cellRenderer: ICellRenderer = this.parent.serviceLocator.getService<ICellRenderer>('cell');
        cellRenderer.refresh(range[0], range[1], true, null, true);
        this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'cellSave' });
        return `Updated ${address} to ${value}.`;
    }

    private applyFindReplace(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.findValue) || isNullOrUndefined(data.replaceValue)) {
            return 'Please provide both the value to replace and the replacement value.';
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const findOptions: any = {
            value: (data.findValue).toString(),
            replaceValue: (data.replaceValue).toString(),
            mode: 'Sheet',
            sheetIndex: this.parent.activeSheetIndex,
            isCSen: data.caseSensitive === true,
            isEMatch: data.exactMatch === true,
            searchBy: 'By Row',
            isAction: true
        };
        this.parent.notify(replaceAll, findOptions);
        const caseInfo: string = data.caseSensitive === true ? ' (case-sensitive)' : '';
        const matchInfo: string = data.exactMatch === true ? ' with exact match' : '';
        return `Replaced all occurrences of "${data.findValue}" with "${data.replaceValue}"${caseInfo}${matchInfo}.`;
    }

    private applyNumberFormat(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.format)) {
            return 'Please provide a number format pattern.';
        }
        const range: string = this.getTargetRange(data.range);
        const sheetName: string = this.parent.getActiveSheet().name;
        const eventArgs: { format: string, range?: string, cancel?: boolean, curSym?: string } = {
            format: getFormatFromType(data.format),
            range: range, cancel: false
        };
        const actionArgs: BeforeCellFormatArgs = {
            range: sheetName + '!' + range, format: getFormatFromType(data.format), requestType: 'NumberFormat'
        } as BeforeCellFormatArgs;
        const isReadonly: boolean = isReadOnlyCells(this.parent, getSwapRange(getRangeIndexes(eventArgs.range)));
        if (!isReadonly) {
            this.parent.trigger('beforeCellFormat', eventArgs);
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'format' });
            if (eventArgs.cancel) {
                return '';
            }
        }
        this.parent.notify(applyNumberFormatting, eventArgs);
        this.parent.notify(selectionComplete, <MouseEvent>{ type: 'mousedown' });
        if (!isReadonly) {
            this.parent.notify(completeAction, { eventArgs: actionArgs, action: 'format' });
        }
        return `Applied number format ${data.format} to ${range}.`;
    }

    private applyCellFormat(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.formatting) || Object.keys(data.formatting).length === 0) {
            return 'Please provide style properties to apply.';
        }
        const range: string = this.getTargetRange(data.range);
        const sheetName: string = this.parent.getActiveSheet().name;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const src: { [key: string]: any } = data.formatting;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const style: { [key: string]: any } = {};
        if (src.bold !== undefined) { style.fontWeight = src.bold === true ? 'bold' : 'normal'; }
        if (src.italic !== undefined) { style.fontStyle = src.italic === true ? 'italic' : 'normal'; }
        const hasUnderline: boolean = src.underline === true;
        const hasStrike: boolean = src.strikethrough === true;
        if (hasUnderline || hasStrike) {
            style.textDecoration = hasUnderline && hasStrike ? 'underline line-through' : (hasUnderline ? 'underline' : 'line-through');
        }
        if (src.fontSize !== undefined) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const fs: any = src.fontSize;
            if (typeof fs === 'number') { style.fontSize = `${fs}pt`; }
            else if (typeof fs === 'string' && /^\d+$/.test(fs)) { style.fontSize = `${fs}pt`; }
            else { style.fontSize = fs; }
        }
        if (src.fontFamily) { style.fontFamily = src.fontFamily; }
        if (src.color) { style.color = src.color; }
        if (src.backgroundColor) { style.backgroundColor = src.backgroundColor; }
        Object.keys(src).forEach((k: string) => {
            if (['bold', 'italic', 'underline', 'strikethrough', 'fontSize', 'fontFamily', 'color', 'backgroundColor'].indexOf(k) === -1) {
                style[k as string] = src[k as string];
            }
        });
        const eventArgs: BeforeCellFormatArgs = { style: style, range: sheetName + '!' + range, cancel: false, requestType: 'CellFormat' };
        const actionArgs: BeforeCellFormatArgs = {
            range: sheetName + '!' + range, style: style, requestType: 'CellFormat'
        } as BeforeCellFormatArgs;
        const isReadonly: boolean = isReadOnlyCells(this.parent, getSwapRange(getRangeIndexes(eventArgs.range)));
        if (!isReadonly) {
            this.parent.trigger('beforeCellFormat', eventArgs);
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'format' });
            if (eventArgs.cancel) {
                return '';
            }
        }
        this.parent.notify(setCellFormat, {
            range: actionArgs.range, style: style,
            onActionUpdate: true, refreshRibbon: true
        } as SetCellFormatArgs);
        this.parent.notify(selectionComplete, <MouseEvent>{ type: 'mousedown' });
        if (!isReadonly) {
            this.parent.notify(completeAction, { eventArgs: actionArgs, action: 'format' });
        }
        return `Applied cell style to ${range}.`;
    }

    private applyConditionalFormat(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide conditional format details.';
        }
        const range: string = this.getTargetRange(data.range);
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const cfModel: any = {
            range: range,
            type: this.normalizeCFType(data.type),
            value: !isNullOrUndefined(data.value) ? String(data.value) : undefined,
            cFColor: this.normalizeCFColor(data.cFColor),
            format: data.format
        };
        const args: CFArgs = { cfModel: cfModel, isAction: true };
        this.parent.notify(setCFRule, args);
        return `Applied conditional format (${cfModel.type}) to ${range}.`;
    }

    private normalizeCFType(type?: string): string {
        if (isNullOrUndefined(type) || type === '') { return 'GreaterThan'; }
        const map: { [key: string]: string } = {
            'greaterthan': 'GreaterThan', 'greater': 'GreaterThan', 'gt': 'GreaterThan',
            'lessthan': 'LessThan', 'less': 'LessThan', 'lt': 'LessThan',
            'between': 'Between',
            'equalto': 'EqualTo', 'equal': 'EqualTo', 'eq': 'EqualTo',
            'containstext': 'ContainsText', 'contains': 'ContainsText',
            'dateoccur': 'DateOccur', 'date': 'DateOccur',
            'duplicate': 'Duplicate',
            'unique': 'Unique',
            'top10items': 'Top10Items', 'top10': 'Top10Items',
            'bottom10items': 'Bottom10Items', 'bottom10': 'Bottom10Items',
            'top10percentage': 'Top10Percentage', 'toppercent': 'Top10Percentage',
            'bottom10percentage': 'Bottom10Percentage', 'bottompercent': 'Bottom10Percentage',
            'aboveaverage': 'AboveAverage', 'above': 'AboveAverage',
            'belowaverage': 'BelowAverage', 'below': 'BelowAverage'
        };
        return map[type.toLowerCase().replace(/\s/g, '')] || 'GreaterThan';
    }

    private normalizeCFColor(color?: string): string {
        if (isNullOrUndefined(color) || color === '') { return 'RedFT'; }
        const map: { [key: string]: string } = {
            'redft': 'RedFT', 'lightredfillwithdarkredtext': 'RedFT', 'red': 'RedFT',
            'yellowft': 'YellowFT', 'yellowfillwithdarkyellowtext': 'YellowFT', 'yellow': 'YellowFT',
            'greenft': 'GreenFT', 'greenfillwithdarkgreentext': 'GreenFT', 'green': 'GreenFT',
            'redf': 'RedF', 'redfill': 'RedFT'
        };
        return map[color.toLowerCase().replace(/\s/g, '')] || 'RedFT';
    }

    private applyMerge(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide merge range or address.';
        }
        const range: string = this.getTargetRange(data.range);
        const mergeType: string = data.direction;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const args: any = { range: range, type: mergeType, merge: true, isAction: true, refreshRibbon: true };
        this.parent.notify(setMerge, args);
        return `Merged ${range} as ${mergeType}.`;
    }

    private async applyCut(data: AssistCommand['args']): Promise<string> {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.range)) {
            return 'Please provide a range to cut.';
        }
        const rangeStr: string = this.getTargetRange(data.range);
        const indices: number[] = getSwapRange(getRangeIndexes(rangeStr));
        this.parent.notify(cut, { range: indices, sId: this.parent.getActiveSheet().id, invokeCopy: true });
        return `Cut ${rangeStr}. Use paste to place it at the target location.`;
    }

    private async applyCopy(data: AssistCommand['args']): Promise<string> {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.range)) {
            return 'Please provide a range to copy.';
        }
        const rangeStr: string = this.getTargetRange(data.range);
        const indices: number[] = getSwapRange(getRangeIndexes(rangeStr));
        this.parent.notify(copy, { range: indices, sId: this.parent.getActiveSheet().id, invokeCopy: true });
        return `Copied ${rangeStr}.`;
    }

    private applyPaste(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.range)) {
            return 'Please provide a paste target address.';
        }
        const rangeStr: string = this.getTargetRange(data.range);
        const indices: number[] = getSwapRange(getRangeIndexes(rangeStr));
        const sheetIndex: number = this.parent.activeSheetIndex;
        this.parent.notify(paste, { range: indices, sIdx: sheetIndex, isAction: true, isInternal: true });
        return `Pasted into ${rangeStr}.`;
    }

    private applyWrap(data: AssistCommand['args']): string {
        const address: string = this.getTargetRange(data && (data.range));
        const wrapFlag: boolean = data.wrap;
        const sheetName: string = this.parent.getActiveSheet().name;
        const range: string = address;
        const eventArgs: BeforeWrapEventArgs = { address: `${sheetName}!${range}`, wrap: wrapFlag, cancel: false };
        if (isReadOnlyCells(this.parent, getSwapRange(getRangeIndexes(range)))) {
            return 'Cannot change wrap on read-only range.';
        }
        this.parent.notify(beginAction, { action: 'beforeWrap', eventArgs: eventArgs });
        if (eventArgs.cancel) {
            return '';
        }
        wrap(range, wrapFlag, this.parent as Workbook);
        this.parent.notify(completeAction, { action: 'wrap', eventArgs: { address: `${sheetName}!${range}`, wrap: wrapFlag } });
        return `${wrapFlag ? 'Enabled' : 'Disabled'} wrap for ${address}.`;
    }

    private applyChart(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide chart details such as type and range.';
        }
        const range: string = this.getTargetRange(data.range);
        const sheetName: string = this.parent.getActiveSheet().name;
        const chartModel: ChartModel = {
            type: this.normalizeChartType(data.chartType),
            range: `${sheetName}!${range}`,
            theme: (data.theme as ChartTheme) || 'Material',
            title: data.title || '',
            isSeriesInRows: data.isSeriesInRows === true,
            height: data.height || 290,
            width: data.width || 480,
            markerSettings: { visible: false, isFilled: true }
        };
        this.parent.notify(setChart, { chart: [chartModel] });
        return `Inserted ${chartModel.type} chart for range ${range}.`;
    }

    private normalizeChartType(type?: string): ChartType {
        if (isNullOrUndefined(type) || type === '') { return 'Column'; }
        const map: { [key: string]: string } = {
            'column': 'Column', 'clusteredcolumn': 'Column',
            'stackedcolumn': 'StackingColumn', 'stackedcolumn100': 'StackingColumn100',
            'bar': 'Bar', 'clusteredbar': 'Bar',
            'stackedbar': 'StackingBar', 'stackedbar100': 'StackingBar100',
            'line': 'Line', 'stackedline': 'StackingLine', 'stackedline100': 'StackingLine100',
            'area': 'Area', 'stackedarea': 'StackingArea', 'stackedarea100': 'StackingArea100',
            'pie': 'Pie', 'doughnut': 'Doughnut', 'scatter': 'Scatter'
        };
        return (map[type.toLowerCase().replace(/\s/g, '')] || 'Column') as ChartType;
    }

    private applyDataValidation(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.dvType)) {
            return 'Please provide data validation details (type and range).';
        }
        const range: string = this.getTargetRange(data.range);
        const sheetName: string = this.parent.getActiveSheet().name;
        const fullRange: string = sheetName + '!' + range;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const eventArgs: any = {
            range: fullRange,
            value1: data.dvValue1,
            value2: data.dvValue2 || '',
            ignoreBlank: data.dvIgnoreBlank !== false,
            type: this.normalizeDVType(data.dvType),
            operator: this.normalizeDVOperator(data.dvOperator),
            inCellDropDown: data.dvInCellDropDown !== false,
            cancel: false
        };
        const isReadonly: boolean = isReadOnlyCells(this.parent, getSwapRange(getRangeIndexes(range)));
        if (isReadonly) {
            return 'Cannot apply data validation to a read-only range.';
        }
        this.parent.trigger('beforeCellFormat', eventArgs);
        if (eventArgs.cancel) {
            return '';
        }
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'validation' });
        this.parent.notify(cellValidation, {
            rules: {
                type: eventArgs.type,
                operator: eventArgs.operator,
                value1: eventArgs.value1,
                value2: eventArgs.value2,
                ignoreBlank: eventArgs.ignoreBlank,
                inCellDropDown: eventArgs.inCellDropDown,
                isHighlighted: data.isHighlighted === true
            },
            range: fullRange,
            isAction: true
        });
        this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'validation' });
        return `Applied ${eventArgs.type} validation (${eventArgs.operator}) to ${range}.`;
    }

    private normalizeDVType(type?: string): string {
        if (isNullOrUndefined(type) || type === '') { return 'WholeNumber'; }
        const map: { [key: string]: string } = {
            'whole': 'WholeNumber', 'wholenumber': 'WholeNumber', 'integer': 'WholeNumber',
            'decimal': 'Decimal', 'number': 'Decimal',
            'date': 'Date', 'datetime': 'Date',
            'time': 'Time',
            'textlength': 'TextLength', 'text': 'TextLength',
            'list': 'List', 'dropdown': 'List', 'dropdownlist': 'List',
            'custom': 'Custom', 'formula': 'Custom'
        };
        return map[type.toLowerCase().replace(/\s/g, '')] || 'WholeNumber';
    }

    private normalizeDVOperator(op?: string): string {
        if (isNullOrUndefined(op) || op === '') { return 'Between'; }
        const map: { [key: string]: string } = {
            'between': 'Between', 'range': 'Between', 'notbetween': 'NotBetween',
            'equalto': 'EqualTo', 'equals': 'EqualTo', 'equal': 'EqualTo', 'eq': 'EqualTo',
            'notequalto': 'NotEqualTo', 'notequals': 'NotEqualTo', 'notequal': 'NotEqualTo', 'neq': 'NotEqualTo',
            'greaterthan': 'GreaterThan', 'greater': 'GreaterThan', 'gt': 'GreaterThan',
            'lessthan': 'LessThan', 'less': 'LessThan', 'lt': 'LessThan',
            'greaterthanorequal': 'GreaterThanOrEqualTo', 'gte': 'GreaterThanOrEqualTo',
            'lessthanorequal': 'LessThanOrEqualTo', 'lte': 'LessThanOrEqualTo'
        };
        return map[op.toLowerCase().replace(/\s/g, '').replace(/>/g, 'than').replace(/</g, 'than')];
    }

    private applyFilterAction(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide filter details such as column and value.';
        }
        const range: string = this.getTargetRange(data.range);
        const sheetIndex: number = this.parent.activeSheetIndex;
        if (data.clearFilter === true) {
            this.parent.notify(initiateFilterUI, { range: range, sIdx: sheetIndex, predicates: [], isInternal: false });
            return `Cleared filter on ${range}.`;
        }
        if (isNullOrUndefined(data.filterColumn) || data.filterColumn === '') {
            return 'Please provide a column to filter.';
        }
        const colLetter: string = data.filterColumn.toUpperCase().replace(/[^A-Z]/g, '');
        const colIndex: number = getIndexesFromAddress(`${colLetter}1`)[1];
        const field: string = getColumnHeaderText(colIndex + 1);
        const operator: string = this.normalizeFilterOperator(data.filterOperator);
        const predicates: object[] = [{
            field: field,
            operator: operator,
            value: data.filterValue,
            matchCase: false,
            ignoreAccent: false,
            predicate: 'and',
            type: 'string'
        }];
        this.parent.notify(initiateFilterUI, {
            predicates: predicates,
            range: range,
            sIdx: sheetIndex,
            isInternal: false
        });
        return `Applied filter on column ${colLetter}: ${operator} "${data.filterValue}".`;
    }

    private normalizeFilterOperator(op?: string): string {
        if (isNullOrUndefined(op) || op === '') { return 'equal'; }
        const map: { [key: string]: string } = {
            'equal': 'equal', 'eq': 'equal', 'equals': 'equal',
            'notequal': 'notequal', 'neq': 'notequal', 'notequals': 'notequal',
            'greaterthan': 'greaterthan', 'gt': 'greaterthan', 'greater': 'greaterthan',
            'lessthan': 'lessthan', 'lt': 'lessthan', 'less': 'lessthan',
            'greaterthanorequal': 'greaterthanorequal', 'gte': 'greaterthanorequal',
            'lessthanorequal': 'lessthanorequal', 'lte': 'lessthanorequal',
            'contains': 'contains',
            'startswith': 'startswith', 'beginswith': 'startswith',
            'endswith': 'endswith',
            'isempty': 'isempty', 'empty': 'isempty',
            'isnotempty': 'isnotempty', 'notempty': 'isnotempty'
        };
        return map[op.toLowerCase().replace(/\s/g, '')] || 'equal';
    }

    private applySortAction(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide sort details.';
        }
        const sheet: SheetModel = this.parent.getActiveSheet();
        const hasRange: boolean = !isNullOrUndefined(data.range) && data.range !== '' &&
            data.range.toLowerCase() !== 'selected';
        const range: string = hasRange ? data.range : undefined;
        const effectiveRange: string = range || sheet.selectedRange;
        let field: string;
        if (!isNullOrUndefined(data.sortColumn) && data.sortColumn !== '') {
            const colLetter: string = data.sortColumn.toUpperCase().replace(/[^A-Z]/g, '');
            const colIndex: number = getIndexesFromAddress(`${colLetter}1`)[1];
            field = getColumnHeaderText(colIndex + 1);
        } else {
            const rangeIdx: number[] = getRangeIndexes(effectiveRange);
            field = getColumnHeaderText(rangeIdx[1] + 1);
        }
        const order: string = this.normalizeSortOrder(data.sortOrder);
        const containsHeader: boolean = data.sortContainsHeader !== false;
        const sortArgs: { sortOptions: object; range?: string } = {
            sortOptions: {
                sortDescriptors: { field: field, order: order },
                containsHeader: containsHeader
            }
        };
        if (hasRange) {
            sortArgs.range = range;
        }
        this.parent.notify(applySort, sortArgs);
        const rangeInfo: string = hasRange ? ` in range ${range}` : ' in the selected range';
        return `Sorted by column ${field}${rangeInfo} in ${order} order.`;
    }

    private normalizeSortOrder(order?: string): string {
        if (isNullOrUndefined(order) || order === '') { return 'Ascending'; }
        const map: { [key: string]: string } = {
            'ascending': 'Ascending', 'asc': 'Ascending', 'a-z': 'Ascending', 'az': 'Ascending',
            'descending': 'Descending', 'desc': 'Descending', 'z-a': 'Descending', 'za': 'Descending'
        };
        return map[order.toLowerCase().replace(/\s/g, '')];
    }

    private applyInsert(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.modelType)) {
            return 'Please provide modelType (Row or Column) and startIndex.';
        }
        const type: string = this.normalizeModelType(data.modelType);
        if (!type) {
            return 'Invalid modelType. Please specify "Row" or "Column".';
        }
        const startIdx: number = Math.max(0, data.startIndex - 1);
        const count: number = Math.max(1, data.count);
        const endIdx: number = !isNullOrUndefined(data.endIndex)
            ? Math.max(startIdx, data.endIndex - 1)
            : startIdx + count - 1;
        this.parent.notify(insertModel, {
            model: this.parent.getActiveSheet(),
            start: startIdx,
            end: endIdx,
            modelType: type,
            isAction: true,
            insertType: 'above'
        });
        const insertedCount: number = (endIdx - startIdx) + 1;
        return `Inserted ${insertedCount} ${type}(s) at position ${data.startIndex}.`;
    }

    private applyDelete(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.modelType)) {
            return 'Please provide modelType (Row or Column) and startIndex.';
        }
        const type: string = this.normalizeModelType(data.modelType);
        if (!type) {
            return 'Invalid modelType. Please specify "Row" or "Column".';
        }
        const startIdx: number = Math.max(0, data.startIndex - 1);
        const count: number = Math.max(1, data.count);
        const endIdx: number = !isNullOrUndefined(data.endIndex)
            ? Math.max(startIdx, data.endIndex - 1)
            : startIdx + count - 1;
        this.parent.notify(deleteModel, {
            model: this.parent.getActiveSheet(),
            start: startIdx,
            end: endIdx,
            modelType: type,
            isAction: true
        });
        const deletedCount: number = (endIdx - startIdx) + 1;
        return `Deleted ${deletedCount} ${type}(s) starting at position ${data.startIndex}.`;
    }

    private normalizeModelType(type?: string): string {
        if (isNullOrUndefined(type) || type === '') { return ''; }
        const map: { [key: string]: string } = {
            'row': 'Row', 'rows': 'Row',
            'column': 'Column', 'columns': 'Column', 'col': 'Column', 'cols': 'Column'
        };
        return map[type.toLowerCase().trim()] || '';
    }

    private applyAutoFill(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.dataRange) || isNullOrUndefined(data.fillRange)) {
            return 'Please provide both dataRange (source) and fillRange (target) for autofill.';
        }
        const sheetName: string = this.parent.getActiveSheet().name;
        const dataRange: string = this.getTargetRange(data.dataRange);
        const fillRange: string = this.getTargetRange(data.fillRange);
        const direction: AutoFillDirection = this.normalizeAutoFillDirection(data.direction, dataRange, fillRange);
        const fillType: AutoFillType = this.normalizeAutoFillType(data.fillType);
        const eventArgs: AutoFillEventArgs = {
            dataRange: `${sheetName}!${dataRange}`,
            fillRange: `${sheetName}!${fillRange}`,
            direction: direction,
            fillType: fillType,
            cancel: false
        };
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'autofill' });
        if (eventArgs.cancel) { return ''; }
        this.parent.notify(setAutoFill, {
            dataRange: eventArgs.dataRange,
            fillRange: eventArgs.fillRange,
            direction: direction,
            fillType: fillType
        });
        this.parent.notify(completeAction, {
            eventArgs: { dataRange: eventArgs.dataRange, fillRange: eventArgs.fillRange, direction, fillType },
            action: 'autofill'
        });
        return `AutoFilled ${fillRange} from ${dataRange} (${fillType}, direction: ${direction}).`;
    }

    private normalizeAutoFillDirection(direction?: string, dataRange?: string, fillRange?: string): AutoFillDirection {
        if (!isNullOrUndefined(direction) && direction !== '') {
            const map: { [key: string]: AutoFillDirection } = {
                'down': 'Down', 'up': 'Up', 'left': 'Left', 'right': 'Right'
            };
            const normalized: AutoFillDirection = map[direction.toLowerCase().trim()];
            if (normalized) { return normalized; }
        }
        if (dataRange && fillRange) {
            const dataIdx: number[] = getRangeIndexes(dataRange);
            const fillIdx: number[] = getRangeIndexes(fillRange);
            if (fillIdx[0] > dataIdx[2]) { return 'Down'; }
            if (fillIdx[0] < dataIdx[0]) { return 'Up'; }
            if (fillIdx[1] > dataIdx[3]) { return 'Right'; }
            if (fillIdx[1] < dataIdx[1]) { return 'Left'; }
        }
        return 'Down';
    }

    private normalizeAutoFillType(type?: string): AutoFillType {
        if (isNullOrUndefined(type) || type === '') { return 'FillSeries'; }
        const map: { [key: string]: AutoFillType } = {
            'fillseries': 'FillSeries', 'series': 'FillSeries',
            'copycells': 'CopyCells', 'copy': 'CopyCells',
            'fillformattingonly': 'FillFormattingOnly', 'formatting': 'FillFormattingOnly',
            'fillwithoutformatting': 'FillWithoutFormatting', 'noformatting': 'FillWithoutFormatting'
        };
        return map[type.toLowerCase().replace(/\s/g, '')] || 'FillSeries';
    }

    private applyFreezePanes(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.freezeType)) {
            return 'Please specify freezeType: "Rows", "Columns", "Panes", or "Unfreeze".';
        }
        if (!this.parent.allowFreezePane) {
            return 'Freeze pane is not enabled. Set allowFreezePane to true.';
        }
        const freezeType: string = data.freezeType.toLowerCase().trim();
        let row: number = 0;
        let column: number = 0;
        switch (freezeType) {
        case 'rows':
            row = Math.max(1, data.row);
            column = 0;
            break;
        case 'columns':
            row = 0;
            column = Math.max(1, data.column);
            break;
        case 'panes':
            row = Math.max(1, data.row);
            column = Math.max(1, data.column);
            break;
        case 'unfreeze':
            row = 0;
            column = 0;
            break;
        default:
            return `Unknown freezeType "${data.freezeType}". Use "Rows", "Columns", "Panes", or "Unfreeze".`;
        }
        const eventArgs: { row: number; column: number; cancel: boolean; sheetIndex: number } = {
            row: row, column: column, cancel: false, sheetIndex: this.parent.activeSheetIndex
        };
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'freezePanes' });
        if (eventArgs.cancel) { return ''; }
        this.parent.freezePanes(row, column);
        this.parent.notify(completeAction, {
            eventArgs: { row, column, sheetIndex: this.parent.activeSheetIndex },
            action: 'freezePanes'
        });
        if (freezeType === 'unfreeze') {
            return 'Removed all freeze panes from the active sheet.';
        }
        return `Frozen ${row > 0 ? `${row} row(s)` : ''}${row > 0 && column > 0 ? ' and ' : ''}${column > 0 ? `${column} column(s)` : ''} on the active sheet.`;
    }

    private applyHyperlink(data: AssistCommand['args']): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.address) || data.address === '') {
            return 'Please provide an address (URL or cell/sheet reference) for the hyperlink.';
        }
        const range: string = this.getTargetRange(data.range);
        const sheetName: string = this.parent.getActiveSheet().name;
        const cellAddress: string = `${sheetName}!${range}`;
        const displayText: string = !isNullOrUndefined(data.displayText) && data.displayText !== ''
            ? data.displayText : null;
        this.parent.insertHyperlink(data.address, cellAddress, displayText, false);
        return `Inserted hyperlink to "${data.address}" in ${range}${displayText ? ` with display text "${displayText}"` : ''}.`;
    }

    private applySave(data: AssistCommand['args']): string {
        const type: string = (data.saveType as string || 'xlsx').toLowerCase();
        const validTypes: string[] = ['xlsx', 'xls', 'csv', 'pdf'];
        if (validTypes.indexOf(type) === -1) {
            return `Saving in '${type}' format is not supported. Valid save types are 'xlsx', 'xls', 'csv', and 'pdf'.`;
        }
        this.parent.notify(exportDialog, { item: { id: `${this.parent.element.id}_${type[0].toUpperCase() + type.substring(1)}` } });
        return 'Save dialog opened';
    }

    private getTargetRange(address: string): string {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const fallback: string = sheet.selectedRange;
        if (isNullOrUndefined(address) || address === '' || address.toLowerCase() === 'selected') {
            return fallback;
        }
        return address;
    }

    private getTargetAddress(address: string): string {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const fallback: string = (sheet.selectedRange).split(':')[0];
        if (isNullOrUndefined(address) || address === '' || address.toLowerCase() === 'selected') {
            return fallback;
        }
        return address.split(':')[0];
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
