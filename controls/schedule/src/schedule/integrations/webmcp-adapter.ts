/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { getWebMcpTools, registerWebMcpTools } from '../base/constant';
import { WebMcpTool, WebMcpToolResponse, WebMcpToolExecuteEventArgs, ViewsData, EventFieldsMapping } from '../base/interface';
import { Schedule } from '../base/schedule';
import { View } from '../base/type';
import { Dialog } from '@syncfusion/ej2-popups';

type WebMcpLookupArgs = {
    toolNames?: string[];
    tools?: string[] | WebMcpTool[];
};

type WebMcpRegistrationArgs = {
    prefix?: string;
    tools?: string[] | WebMcpTool[];
    exposedTo?: string[];
};

type WebMcpCommandArgs = {
    eventObj?: Record<string, unknown>;
    view?: View;
    selectedDate?: string | Date;
};

/**
 * Tool names that mutate Scheduler data and therefore require
 * user confirmation when `showConfirmationDialog` is enabled.
 */
const MUTATING_WEB_MCP_COMMANDS: string[] = ['createEvent', 'updateEvent', 'deleteEvent'];

const webMcpTools: WebMcpTool[] = [
    {
        name: 'createEvent',
        annotations: { readOnlyHint: false },
        description:
            'Creates a new Scheduler event.',
        inputSchema: {
            type: 'object',
            properties: {
                eventObj: {
                    type: 'object',
                    description: 'Scheduler event object.',
                    properties: {
                        Subject: {
                            type: 'string',
                            description: 'Title of the event'
                        },
                        StartTime: {
                            type: 'string',
                            description: 'Event start date and time in ISO 8601 format. ' +
                                'Example: 2026-04-08T09:00:00'
                        },
                        EndTime: {
                            type: 'string',
                            description: 'Event end date and time in ISO 8601 format. ' +
                                'Example: 2026-04-08T10:00:00'
                        },
                        IsAllDay: {
                            type: 'boolean',
                            description: 'Whether the event spans the entire day'
                        },
                        Location: {
                            type: 'string',
                            description: 'Location of the event'
                        },
                        Description: {
                            type: 'string',
                            description: 'Detailed description of the event'
                        }
                    },
                    required: [ 'Subject', 'StartTime', 'EndTime' ]
                }
            },
            required: [ 'eventObj' ]
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: [ 'success', 'data', 'message' ]
        }
    },
    {
        name: 'updateEvent',
        annotations: { readOnlyHint: false },
        description:
            'Updates an existing Scheduler event. The event is identified using ' +
            'Subject and can be further narrowed down using StartTime and EndTime. ',
        inputSchema: {
            type: 'object',
            properties: {
                eventObj: {
                    type: 'object',
                    description:
                        'Scheduler event identification details and updated values.',
                    properties: {
                        Subject: {
                            type: 'string',
                            description: 'Existing title of the event used to identify it'
                        },
                        StartTime: {
                            type: 'string',
                            description: 'Existing event start date and time in ISO 8601 format. ' +
                                'Example: 2026-04-08T09:00:00'
                        },
                        EndTime: {
                            type: 'string',
                            description: 'Existing event end date and time in ISO 8601 format. ' +
                                'Example: 2026-04-08T10:00:00'
                        },
                        NewSubject: {
                            type: 'string',
                            description: 'Updated title of the event'
                        },
                        NewStartTime: {
                            type: 'string',
                            description: 'Updated event start date and time in ISO 8601 format. ' +
                                'Example: 2026-04-08T11:00:00'
                        },
                        NewEndTime: {
                            type: 'string',
                            description: 'Updated event end date and time in ISO 8601 format. ' +
                                'Example: 2026-04-08T12:00:00'
                        },
                        IsAllDay: {
                            type: 'boolean',
                            description: 'Updated value indicating whether the event spans the entire day'
                        },
                        Location: {
                            type: 'string',
                            description: 'Updated location of the event'
                        },
                        Description: {
                            type: 'string',
                            description: 'Updated description of the event'
                        }
                    },
                    required: [ 'Subject' ]
                }
            },
            required: [ 'eventObj' ]
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: [ 'success', 'data', 'message' ]
        }
    },
    {
        name: 'deleteEvent',
        annotations: { readOnlyHint: false },
        description:
            'Deletes an existing Scheduler event. The event can be identified ' +
            'using Subject alone, or along with StartTime or EndTime.',
        inputSchema: {
            type: 'object',
            properties: {
                eventObj: {
                    type: 'object',
                    description: 'Scheduler event identification details used to locate ' +
                        'the event to be deleted.',
                    properties: {
                        Subject: {
                            type: 'string',
                            description: 'Title of the event to delete'
                        },
                        StartTime: {
                            type: 'string',
                            description: 'Event start date and time in ISO 8601 format. ' +
                                'Example: 2026-04-08T09:00:00'
                        },
                        EndTime: {
                            type: 'string',
                            description: 'Event end date and time in ISO 8601 format. ' +
                                'Example: 2026-04-08T10:00:00'
                        }
                    },
                    required: [ 'Subject' ]
                }
            },
            required: [ 'eventObj' ]
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: [ 'success', 'data', 'message' ]
        }
    },
    {
        name: 'changeView',
        annotations: { readOnlyHint: false },
        description: 'Changes the current Scheduler view.',
        inputSchema: {
            type: 'object',
            properties: {
                view: {
                    type: 'string',
                    enum: [
                        'Day',
                        'Week',
                        'WorkWeek',
                        'Month',
                        'Agenda',
                        'MonthAgenda',
                        'TimelineDay',
                        'TimelineWeek',
                        'TimelineWorkWeek',
                        'TimelineMonth',
                        'Year',
                        'TimelineYear'
                    ],
                    description: 'Scheduler view to switch to'
                }
            },
            required: [ 'view' ]
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: [ 'success', 'data', 'message' ]
        }
    },
    {
        name: 'navigateDate',
        annotations: { readOnlyHint: false },
        description: 'Navigates the Scheduler to a specific date.',
        inputSchema: {
            type: 'object',
            properties: {
                selectedDate: {
                    type: 'string',
                    description: 'Date to navigate to in ISO 8601 format. ' +
                        'Examples: 2026-04-08 or 2026-04-08T09:00:00'
                }
            },
            required: [ 'selectedDate' ]
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: [ 'success', 'data', 'message' ]
        }
    }
];

/**
 * WebMcpScheduler integrates Schedule with the WebMCP protocol.
 */
export class WebMcpScheduler {
    private parent: Schedule;
    private webMcpAbortController: AbortController | null = null;

    /**
     * Initializes the adapter and wires event listeners.
     *
     * @param {Schedule} parent The parent Schedule instance.
     */
    constructor(parent: Schedule) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * Attaches WebMCP event listeners.
     *
     * @returns {void} Returns nothing.
     */
    private addEventListener(): void {
        this.parent.on(getWebMcpTools, this.getTools, this);
        this.parent.on(registerWebMcpTools, this.registerTools, this);
    }

    /**
     * Removes WebMCP event listeners.
     *
     * @returns {void} Returns nothing.
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(getWebMcpTools, this.getTools);
            this.parent.off(registerWebMcpTools, this.registerTools);
        }
    }

    /**
     * Retrieves available WebMCP tools, optionally filtered by tool names.
     *
     * @param {WebMcpLookupArgs} args The lookup arguments.
     * @returns {WebMcpTool[]} Returns the available tools.
     */
    private getTools(args: WebMcpLookupArgs): WebMcpTool[] {
        const toolNames: string[] = args.toolNames || [];
        if (toolNames.length !== 0) {
            args.tools = webMcpTools.filter((webMcpTool: WebMcpTool) => toolNames.indexOf(webMcpTool.name) !== -1)
                .map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        } else {
            args.tools = webMcpTools.map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        }
        return args.tools as WebMcpTool[];
    }

    /**
     * Registers tools with document.modelContext for AI access.
     *
     * @param {WebMcpRegistrationArgs} args The registration arguments.
     * @returns {void} Returns nothing.
     */
    private registerTools(args: WebMcpRegistrationArgs): void {
        const modelContext: {
            registerTool: (tool: WebMcpTool, options: { signal: AbortSignal; exposedTo?: string[] }) => void;
        } = (document as {
            modelContext?: {
                registerTool: (tool: WebMcpTool, options: { signal: AbortSignal; exposedTo?: string[] }) => void;
            };
        }).modelContext;
        if (!modelContext || typeof modelContext.registerTool !== 'function') {
            return;
        }

        this.webMcpAbortController = new AbortController();
        const toolPrefix: string = args.prefix == null ? this.parent.element.id : args.prefix;
        const tools: WebMcpTool[] = args.tools && args.tools.length && typeof args.tools[0] === 'object'
            ? args.tools as WebMcpTool[]
            : this.getTools({ toolNames: args.tools as string[] });

        tools.forEach((tool: WebMcpTool): void => {
            tool.name = `${toolPrefix}_${tool.name}`;
            tool.execute = tool.execute || (async (toolArgs: object) => this.executeHandler(tool.name, toolArgs as WebMcpCommandArgs));
            const registerOptions: { signal: AbortSignal; exposedTo?: string[] } = {
                signal: (<AbortController>this.webMcpAbortController).signal
            };
            if (Array.isArray(args.exposedTo) && args.exposedTo.length > 0) {
                registerOptions.exposedTo = args.exposedTo;
            }
            modelContext.registerTool(tool, registerOptions);
        });
    }

    /**
     * Executes a WebMCP tool handler based on command name.
     *
     * @param {string} command The command name.
     * @param {WebMcpCommandArgs} args The command arguments.
     * @returns {Promise<WebMcpToolResponse>} Returns the command response.
     */
    private async executeHandler(command: string, args: WebMcpCommandArgs): Promise<WebMcpToolResponse> {
        const baseCommand: string = command.includes('_') ? command.substring(command.indexOf('_') + 1) : command;
        const eventArgs: WebMcpToolExecuteEventArgs = { toolName: command, toolArgs: args as object };
        this.parent.trigger('beforeWebMcpToolExecute', eventArgs);

        if (eventArgs.cancel) {
            return this.message({
                action: command,
                cancelled: true,
                message: eventArgs.cancellationResponse || `[USER_CANCELLED] Tool "${command}" was cancelled. This is final. Do NOT retry.`
            });
        }

        if (eventArgs.showConfirmationDialog && this.isMutatingCommand(baseCommand)) {
            const confirmed: boolean = await this.requestConfirmation(
                this.buildConfirmationMessage(baseCommand, args)
            );

            if (!confirmed) {
                return this.message({
                    action: command,
                    cancelled: true,
                    message: 'Tool execution cancelled by user'
                });
            }
        }

        switch (baseCommand) {
        case 'createEvent':
            return this.handleCreateEvent(args);
        case 'updateEvent':
            return this.handleUpdateEvent(args);
        case 'deleteEvent':
            return this.handleDeleteEvent(args);
        case 'changeView':
            return this.handleChangeView(args);
        case 'navigateDate':
            return this.handleNavigateDate(args);
        default:
            return this.error(`Tool "${baseCommand}" not found.`);
        }
    }

    /**
     * Removes event listeners and aborts registered tools.
     *
     * @returns {void} Returns nothing.
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }
        this.parent = null;
    }

    /**
     * Returns the module name for EJ2 module loading.
     *
     * @returns {string} Returns the module name.
     */
    protected getModuleName(): string {
        return 'webMcpScheduler';
    }

    /**
     * Formats a successful response in WebMCP standard format.
     *
     * @param {unknown} data The response payload.
     * @returns {WebMcpToolResponse} Returns the formatted response.
     */
    private message(data: unknown): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    /**
     * Formats an error response in WebMCP standard format.
     *
     * @param {string} text The error message.
     * @returns {WebMcpToolResponse} Returns the formatted response.
     */
    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
    }

    /**
     * Returns whether the given (already-stripped) command mutates
     * Scheduler data, so a confirmation Dialog should be shown.
     *
     * @param {string} command The base command name (without prefix).
     * @returns {boolean} Returns `true` for create/update/delete.
     */
    private isMutatingCommand(command: string): boolean {
        return MUTATING_WEB_MCP_COMMANDS.indexOf(command) !== -1;
    }

    /**
     * Formats an ISO date/time value for the confirmation dialog using
     * the Schedule's configured date/time format and locale; falls
     * back to a readable default when inputs are missing.
     *
     * @param {string | Date | undefined} value Incoming date value.
     * @returns {string} Returns a human-readable date/time string.
     */
    private formatConfirmationDate(value: string | Date | undefined): string {
        if (value === undefined || value === null || value === '') {
            return '';
        }
        const date: Date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) {
            return String(value);
        }

        const locale: string = (this.parent as any).locale || undefined;

        try {
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return date.toLocaleString(locale) || date.toString();
        }
    }

    /**
     * Builds a human-readable confirmation message for write operations.
     *
     * @param {string} command The command name.
     * @param {WebMcpCommandArgs} args The command arguments.
     * @returns {string} Returns the confirmation message.
     */
    private buildConfirmationMessage(
        command: string,
        args: WebMcpCommandArgs
    ): string {
        const eventObj: Record<string, any> = args.eventObj as Record<string, any>;
        const start: string = this.formatConfirmationDate(eventObj.StartTime);
        const end: string = this.formatConfirmationDate(eventObj.EndTime);
        const newStart: string = this.formatConfirmationDate(eventObj.NewStartTime);
        const newEnd: string = this.formatConfirmationDate(eventObj.NewEndTime);

        switch (command) {
        case 'createEvent':
            return `Create event "${eventObj.Subject}" from ${start} to ${end}?`;

        case 'deleteEvent': {
            let message: string = `Delete event "${eventObj.Subject}"`;

            if (start) {
                message += ` starting at ${start}`;
            }

            if (end) {
                message += ` ending at ${end}`;
            }

            return `${message}?`;
        }

        case 'updateEvent': {
            const changes: string[] = [];

            if (eventObj.NewSubject) {
                changes.push(`Title → "${eventObj.NewSubject}"`);
            }

            if (newStart) {
                changes.push(`Start Time → ${newStart}`);
            }

            if (newEnd) {
                changes.push(`End Time → ${newEnd}`);
            }

            if (eventObj.Location) {
                changes.push(`Location → ${eventObj.Location}`);
            }

            if (eventObj.Description) {
                changes.push('Description updated');
            }

            if (eventObj.IsAllDay !== undefined) {
                changes.push(`All Day → ${eventObj.IsAllDay}`);
            }

            let message: string = `Update event "${eventObj.Subject}"`;

            if (start) {
                message += ` starting at ${start}`;
            }

            if (end) {
                message += ` ending at ${end}`;
            }

            if (changes.length > 0) {
                message += `<br><br>Changes:<br>${changes.join('<br>')}`;
            }

            return message;
        }

        default:
            return `Confirm ${command}?`;
        }
    }

    /**
     * Requests user confirmation before executing write operations.
     *
     * Pops a modal Dialog with a human-readable summary of the action
     * and OK/Cancel buttons; resolves `true` only when the user clicks OK.
     *
     * @param {string} message The confirmation message.
     * @returns {Promise<boolean>} Returns a promise that resolves to the confirmation state.
     */
    private requestConfirmation(message: string): Promise<boolean> {
        const dialogElement: HTMLElement = createElement('div');
        document.body.appendChild(dialogElement);
        let confirmed: boolean = false;

        return new Promise<boolean>((resolve: (value: boolean) => void) => {
            const dialog: Dialog = new Dialog({
                header: 'Confirm action',
                content: message,
                isModal: true,
                showCloseIcon: true,
                closeOnEscape: true,
                animationSettings: { effect: 'Zoom' },
                enableRtl: this.parent.enableRtl,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                width: '500px',
                cssClass: (`e-webmcp-confirm-dialog ${this.parent.cssClass || ''}`).trim(),
                buttons: [
                    {
                        click: (): void => {
                            confirmed = true;
                            dialog.hide();
                        },
                        buttonModel: {
                            content: 'OK',
                            isPrimary: true,
                            cssClass: ('e-primary e-event-save ' + (this.parent.cssClass || '')).trim()
                        }
                    },
                    {
                        click: (): void => {
                            confirmed = false;
                            dialog.hide();
                        },
                        buttonModel: {
                            content: 'Cancel',
                            cssClass: ('e-event-cancel ' + (this.parent.cssClass || '')).trim()
                        }
                    }
                ],
                close: (): void => {
                    if (dialog.element && dialog.element.parentElement) {
                        dialog.element.parentElement.removeChild(dialog.element);
                    }
                    resolve(confirmed);
                }
            });
            dialog.appendTo(dialogElement);
        });
    }

    /**
     * Returns Schedule's mapped event-field names from `eventFields`
     * so custom mappings are honored consistently.
     *
     * @returns {EventFieldsMapping} Returns the mapped event-field names.
     */
    private get fields(): EventFieldsMapping {
        return this.parent.eventFields;
    }

    /**
     * Handles the create event tool.
     *
     * @param {WebMcpCommandArgs} args The command arguments.
     * @returns {WebMcpToolResponse} Returns the command response.
     */
    private handleCreateEvent(args: WebMcpCommandArgs): WebMcpToolResponse {
        try {
            if (!this.parent.eventSettings.allowAdding || this.parent.activeViewOptions.readonly) {
                return this.error('Adding events is disabled in this Schedule.');
            }
            const eventObj: Record<string, any> = args.eventObj as Record<string, any>;
            const fields: EventFieldsMapping = this.fields;
            const scheduleEvent: Record<string, any> = {
                [fields.subject]: eventObj.Subject,
                [fields.startTime]: new Date(eventObj.StartTime),
                [fields.endTime]: new Date(eventObj.EndTime),
                [fields.isAllDay]: eventObj.IsAllDay,
                [fields.location]: eventObj.Location,
                [fields.description]: eventObj.Description,
                [fields.id]: eventObj[fields.id]
            };
            if (isNullOrUndefined(scheduleEvent[fields.id])) {
                scheduleEvent[fields.id] = this.parent.eventBase.getEventMaxID();
            }

            this.parent.addEvent(scheduleEvent);

            return this.message({
                action: 'createEvent',
                success: true,
                data: {},
                message: 'Event created successfully'
            });
        } catch (error) {
            const errorMessage: string =
                error instanceof Error ? error.message : String(error);

            return this.error(
                `Failed to create event: ${errorMessage}`
            );
        }
    }

    /**
     * Handles the update event tool.
     *
     * @param {WebMcpCommandArgs} args The command arguments.
     * @returns {WebMcpToolResponse} Returns the command response.
     */
    private handleUpdateEvent(args: WebMcpCommandArgs): WebMcpToolResponse {
        try {
            if (!this.parent.eventSettings.allowEditing || this.parent.activeViewOptions.readonly) {
                return this.error('Editing events is disabled in this Schedule.');
            }
            const eventInfo: Record<string, any> = args.eventObj as Record<string, any>;
            const matchedEvent: Record<string, any> | undefined = this.getMatchedEvent(eventInfo);
            const fields: EventFieldsMapping = this.fields;

            if (!matchedEvent) {
                return this.error('No matching event found.');
            }

            if (eventInfo.NewSubject) {
                matchedEvent[fields.subject] = eventInfo.NewSubject;
            }

            if (eventInfo.NewStartTime) {
                matchedEvent[fields.startTime] = new Date(eventInfo.NewStartTime);
            }

            if (eventInfo.NewEndTime) {
                matchedEvent[fields.endTime] = new Date(eventInfo.NewEndTime);
            }

            if (eventInfo.IsAllDay !== undefined) {
                matchedEvent[fields.isAllDay] = eventInfo.IsAllDay;
            }

            if (eventInfo.Location !== undefined) {
                matchedEvent[fields.location] = eventInfo.Location;
            }

            if (eventInfo.Description !== undefined) {
                matchedEvent[fields.description] = eventInfo.Description;
            }

            this.parent.saveEvent(matchedEvent);

            return this.message({
                action: 'updateEvent',
                success: true,
                data: {},
                message: 'Event updated successfully'
            });
        } catch (error) {
            const errorMessage: string =
                error instanceof Error ? error.message : String(error);

            return this.error(
                `Failed to update event: ${errorMessage}`
            );
        }
    }

    /**
     * Handles the delete event tool.
     *
     * @param {WebMcpCommandArgs} args The command arguments.
     * @returns {WebMcpToolResponse} Returns the command response.
     */
    private handleDeleteEvent(args: WebMcpCommandArgs): WebMcpToolResponse {
        try {
            if (!this.parent.eventSettings.allowDeleting || this.parent.activeViewOptions.readonly) {
                return this.error('Deleting events is disabled in this Schedule.');
            }
            const eventInfo: Record<string, any> = args.eventObj as Record<string, any>;
            const matchedEvent: Record<string, any> | undefined = this.getMatchedEvent(eventInfo);

            if (!matchedEvent) {
                return this.error('No matching event found.');
            }

            this.parent.deleteEvent(matchedEvent);

            return this.message({
                action: 'deleteEvent',
                success: true,
                data: {},
                message: 'Event deleted successfully'
            });
        } catch (error) {
            const errorMessage: string =
                error instanceof Error ? error.message : String(error);

            return this.error(
                `Failed to delete event: ${errorMessage}`
            );
        }
    }

    /**
     * Handles the change view tool.
     *
     * @param {WebMcpCommandArgs} args The command arguments.
     * @returns {WebMcpToolResponse} Returns the command response.
     */
    private handleChangeView(args: WebMcpCommandArgs): WebMcpToolResponse {
        try {
            const availableViews: string[] = this.parent.viewCollections.map(
                (view: ViewsData) => view.option
            );

            if (availableViews.indexOf(args.view as string) === -1) {
                return this.error(
                    `View "${args.view}" is not available. Available views: ${availableViews.join(', ')}`
                );
            }

            this.parent.currentView = args.view;
            this.parent.dataBind();

            return this.message({
                action: 'changeView',
                success: true,
                data: {},
                message: 'View changed successfully'
            });
        } catch (error) {
            const errorMessage: string =
                error instanceof Error ? error.message : String(error);

            return this.error(
                `Failed to change view: ${errorMessage}`
            );
        }
    }

    /**
     * Handles the date navigation tool.
     *
     * @param {WebMcpCommandArgs} args The command arguments.
     * @returns {WebMcpToolResponse} Returns the command response.
     */
    private handleNavigateDate(args: WebMcpCommandArgs): WebMcpToolResponse {
        try {
            const date: Date = typeof args.selectedDate === 'string' ? new Date(args.selectedDate) : (args.selectedDate || new Date());
            this.parent.selectedDate = date;
            this.parent.dataBind();
            return this.message({
                action: 'navigateDate',
                success: true,
                data: {},
                message: 'Date navigation successful'
            });
        } catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return this.error(`Failed to navigate date: ${errorMessage}`);
        }
    }

    /**
     * Returns the first matching Scheduler event.
     *
     * @param {Record<string, any>} eventInfo Event identification details.
     * @returns {Record<string, any> | undefined} Matching Scheduler event.
     */
    private getMatchedEvent(eventInfo: Record<string, any>): Record<string, any> | undefined {
        const events: Record<string, any>[] = this.parent.getEvents() as Record<string, any>[];
        const fields: EventFieldsMapping = this.fields;

        return events.find((event: Record<string, any>) => {
            const subjectMatch: boolean = event[fields.subject] === eventInfo.Subject;
            const startMatch: boolean =
                !eventInfo.StartTime ||
                new Date(event[fields.startTime]).getTime() ===
                new Date(eventInfo.StartTime).getTime();
            const endMatch: boolean =
                !eventInfo.EndTime ||
                new Date(event[fields.endTime]).getTime() ===
                new Date(eventInfo.EndTime).getTime();

            return subjectMatch && startMatch && endMatch;
        });
    }
}
