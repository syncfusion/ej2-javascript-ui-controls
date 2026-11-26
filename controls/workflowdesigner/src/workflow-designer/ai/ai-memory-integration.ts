/**
 * AI Memory Integration with Execution Flow
 * Handles memory loading/saving during AI node execution.
 *
 * @internal
 */

import { AIMemoryConfig, ChatMessage } from './ai-memory-types';
import { AIMemoryService } from './ai-memory-service';
import { SessionStorageMemoryAdapter } from './ai-memory-storage-adapter';
import { MemoryStorageAdapter } from './ai-memory-types';

/**
 * Returns the sessionStorage store for a step (key `ej2-ai-memory:{workflowId}:{nodeId}:{sessionKey}`).
 *
 * @param {string} workflowId - The workflow / instance scope.
 * @param {string} nodeId - The AI step id.
 * @returns {MemoryStorageAdapter} The adapter.
 */
function createAdapter(workflowId: string, nodeId: string): MemoryStorageAdapter {
    return new SessionStorageMemoryAdapter(workflowId, nodeId);
}

export class AIMemoryIntegration {
    /**
     * Checks whether any session has saved memory for this AI node.
     *
     * @param {string} workflowId - The workflow identifier
     * @param {string} nodeId - The AI node identifier
     * @returns {boolean} Whether saved memory exists
     */
    public static hasStoredMemory(workflowId: string, nodeId: string): boolean {
        return new SessionStorageMemoryAdapter(workflowId, nodeId).hasStoredMessages();
    }

    /**
     * Prepares AI props with memory history before execution.
     *
     * @param {string} workflowId - The workflow identifier
     * @param {string} nodeId - The AI node identifier
     * @param {Record<string, unknown>} props - The AI step properties
     * @returns {Record<string, unknown>} Modified props with memory messages included
     */
    public static preparePropsWithMemory(
        workflowId: string,
        nodeId: string,
        props: Record<string, unknown>
    ): Record<string, unknown> {
        const memoryConfig: AIMemoryConfig = {
            enabled: props.memoryEnabled === true || props.memoryEnabled === 'true',
            memoryHistorySize: Number(props.memoryHistorySize) || 10,
            sessionKey: typeof props.sessionKey === 'string' ? props.sessionKey : undefined
        };

        if (!memoryConfig.enabled) {
            return props;
        }

        const service: AIMemoryService = new AIMemoryService(workflowId, nodeId, memoryConfig, createAdapter(workflowId, nodeId));
        const historyMessages: ChatMessage[] = service.loadHistory();

        // Add history messages to the props for the executor
        const modifiedProps: Record<string, unknown> = { ...props };
        if (historyMessages.length > 0) {
            modifiedProps.memoryMessages = historyMessages;
        }

        // Store the service instance on the props for later use
        (modifiedProps as any).__memoryService = service;

        return modifiedProps;
    }

    /**
     * Saves the user prompt and AI response to memory after successful execution.
     *
     * @param {string} workflowId - The workflow identifier
     * @param {string} nodeId - The AI node identifier
     * @param {Record<string, unknown>} props - The AI step properties
     * @param {string} userPrompt - The user's input prompt
     * @param {string} aiResponse - The AI's response
     * @returns {void}
     */
    public static saveExchangeToMemory(
        workflowId: string,
        nodeId: string,
        props: Record<string, unknown>,
        userPrompt: string,
        aiResponse: string
    ): void {
        const memoryConfig: AIMemoryConfig = {
            enabled: props.memoryEnabled === true || props.memoryEnabled === 'true',
            memoryHistorySize: Number(props.memoryHistorySize) || 10,
            sessionKey: typeof props.sessionKey === 'string' ? props.sessionKey : undefined
        };

        if (!memoryConfig.enabled) {
            return;
        }

        // Try to use the service instance that was stored during preparation
        let service: AIMemoryService | undefined = (props as any).__memoryService;
        if (!service) {
            service = new AIMemoryService(workflowId, nodeId, memoryConfig, createAdapter(workflowId, nodeId));
        }

        service.saveExchange(userPrompt, aiResponse);
    }

    /**
     * Clears memory for a specific session.
     *
     * @param {string} workflowId - The workflow identifier
     * @param {string} nodeId - The AI node identifier
     * @param {string} [sessionKey] - The session identifier (uses default if not provided)
     * @returns {void}
     */
    public static clearSessionMemory(
        workflowId: string,
        nodeId: string,
        sessionKey?: string
    ): void {
        const config: AIMemoryConfig = {
            enabled: true,
            memoryHistorySize: 10,
            sessionKey: sessionKey
        };
        new AIMemoryService(workflowId, nodeId, config, new SessionStorageMemoryAdapter(workflowId, nodeId)).clearSessionMemory();
    }

    /**
     * Clears all memory for a given node (across all sessions).
     *
     * @param {string} workflowId - The workflow identifier
     * @param {string} nodeId - The AI node identifier
     * @returns {void}
     */
    public static clearAllMemory(workflowId: string, nodeId: string): void {
        const config: AIMemoryConfig = {
            enabled: true,
            memoryHistorySize: 10
        };
        new AIMemoryService(workflowId, nodeId, config, new SessionStorageMemoryAdapter(workflowId, nodeId)).clearAllMemory();
    }

    /**
     * Converts memory messages to the format needed for API requests.
     * Adds memory messages to the message array for chat-based APIs.
     *
     * @param {string} systemPrompt - The system prompt
     * @param {ChatMessage[]} [memoryMessages] - Previous conversation messages
     * @param {string} userPrompt - The current user prompt
     * @returns {Array<Object>} Array of messages in chat format
     */
    public static buildMessagesWithMemory(
        systemPrompt: string,
        memoryMessages: ChatMessage[] | undefined,
        userPrompt: string
    ): Array<{ role: string; content: string }> {
        const messages: Array<{ role: string; content: string }> = [];

        // Add system prompt first (highest priority)
        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }

        // Add memory messages (conversation history)
        if (Array.isArray(memoryMessages)) {
            memoryMessages.forEach((msg: ChatMessage) => {
                messages.push({ role: msg.role, content: msg.content });
            });
        }

        // Add current user prompt
        messages.push({ role: 'user', content: userPrompt || systemPrompt });

        return messages;
    }

    /**
     * Builds a text-based prompt with memory for providers that don't support role-based messages.
     * Used as fallback for plain-text APIs.
     *
     * @param {string} systemPrompt - The system prompt
     * @param {ChatMessage[]} [memoryMessages] - Previous conversation messages
     * @param {string} userPrompt - The current user prompt
     * @returns {string} Formatted text prompt with memory
     */
    public static buildTextPromptWithMemory(
        systemPrompt: string,
        memoryMessages: ChatMessage[] | undefined,
        userPrompt: string
    ): string {
        let prompt: string = '';

        if (systemPrompt) {
            prompt += `System instructions:\n${systemPrompt}\n\n`;
        }

        if (Array.isArray(memoryMessages) && memoryMessages.length > 0) {
            prompt += 'Previous conversation:\n';
            memoryMessages.forEach((msg: ChatMessage) => {
                const role: string = msg.role.charAt(0).toUpperCase() + msg.role.slice(1);
                prompt += `${role}: ${msg.content}\n`;
            });
            prompt += '\n';
        }

        prompt += `Current user request:\n${userPrompt || systemPrompt}`;

        return prompt;
    }
}
