/**
 * AI Memory Service
 * Manages conversation history for AI Agent nodes with context window trimming.
 *
 * @internal
 */

import { ChatMessage, MemoryStorageAdapter, AIMemoryConfig, AIMemoryStats } from './ai-memory-types';
import { SessionStorageMemoryAdapter } from './ai-memory-storage-adapter';

/**
 * Service for managing AI Agent conversation memory.
 * Handles loading, saving, and trimming conversation history.
 */
export class AIMemoryService {
    private readonly workflowId: string;
    private readonly nodeId: string;
    private readonly adapter: MemoryStorageAdapter;
    private readonly config: AIMemoryConfig;
    private messageCounter: number = 0;

    /**
     * Creates an instance.
     *
     * @param {string} workflowId - The workflow identifier
     * @param {string} nodeId - The AI node identifier
     * @param {AIMemoryConfig} config - Memory configuration
     * @param {MemoryStorageAdapter} [adapter] - Optional custom storage adapter (defaults to sessionStorage)
     */
    public constructor(
        workflowId: string,
        nodeId: string,
        config: AIMemoryConfig,
        adapter?: MemoryStorageAdapter
    ) {
        this.workflowId = workflowId;
        this.nodeId = nodeId;
        this.config = config;
        this.adapter = adapter || new SessionStorageMemoryAdapter(workflowId, nodeId);
    }

    /**
     * Resolves the session key.
     * If not provided in config, generates one from workflowId and nodeId.
     *
     * @returns {string} The resolved session key
     */
    private resolveSessionKey(): string {
        if (this.config.sessionKey) {
            return String(this.config.sessionKey);
        }
        return `${this.workflowId}:${this.nodeId}`;
    }

    /**
     * Loads the conversation history for the current session.
     *
     * @returns {ChatMessage[]} Array of recent messages within the configured context window
     */
    public loadHistory(): ChatMessage[] {
        if (!this.config.enabled) {
            return [];
        }

        const sessionKey: string = this.resolveSessionKey();
        const allMessages: ChatMessage[] = this.adapter.getMessages(sessionKey);

        // Apply context window limit: interactionLimit * 2 (user + assistant messages)
        return this.trimMemory(allMessages, this.config.memoryHistorySize || 10);
    }

    /**
     * Saves a user message and AI response to the conversation history.
     * Automatically trims old messages to respect the context window.
     *
     * @param {string} userMessage - The user's input message
     * @param {string} assistantMessage - The AI's response message
     * @returns {void}
     */
    public saveExchange(userMessage: string, assistantMessage: string): void {
        if (!this.config.enabled) {
            return;
        }

        const sessionKey: string = this.resolveSessionKey();
        const allMessages: ChatMessage[] = this.adapter.getMessages(sessionKey);
        if (this.hasReachedHistoryLimit(allMessages)) {
            return;
        }

        const now: number = Date.now();
        const newMessages: ChatMessage[] = [
            ...allMessages,
            {
                id: `message-${this.messageCounter++}`,
                role: 'user',
                content: userMessage,
                timestamp: now
            },
            {
                id: `message-${this.messageCounter++}`,
                role: 'assistant',
                content: assistantMessage,
                timestamp: now + 1
            }
        ];

        // Trim to respect context window and save
        const trimmedMessages: ChatMessage[] = this.trimMemory(newMessages, this.config.memoryHistorySize || 10);
        this.adapter.saveMessages(sessionKey, trimmedMessages);
    }

    /**
     * Saves only a user message (without an assistant response).
     * Useful for capturing user input before AI execution.
     * WARNING: If the AI request fails, this message should not be saved.
     *
     * @param {string} userMessage - The user's input message
     * @returns {void}
     */
    public saveUserMessage(userMessage: string): void {
        if (!this.config.enabled) {
            return;
        }

        const sessionKey: string = this.resolveSessionKey();
        const allMessages: ChatMessage[] = this.adapter.getMessages(sessionKey);
        if (this.hasReachedHistoryLimit(allMessages)) {
            return;
        }

        const newMessages: ChatMessage[] = [
            ...allMessages,
            {
                id: `message-${this.messageCounter++}`,
                role: 'user',
                content: userMessage,
                timestamp: Date.now()
            }
        ];

        const trimmedMessages: ChatMessage[] = this.trimMemory(newMessages, this.config.memoryHistorySize || 10);
        this.adapter.saveMessages(sessionKey, trimmedMessages);
    }

    /**
     * Saves only an assistant message (without a user message).
     * Useful when resuming from a failed execution.
     *
     * @param {string} assistantMessage - The AI's response message
     * @returns {void}
     */
    public saveAssistantMessage(assistantMessage: string): void {
        if (!this.config.enabled) {
            return;
        }

        const sessionKey: string = this.resolveSessionKey();
        const allMessages: ChatMessage[] = this.adapter.getMessages(sessionKey);
        if (this.hasReachedHistoryLimit(allMessages)) {
            return;
        }

        const newMessages: ChatMessage[] = [
            ...allMessages,
            {
                id: `message-${this.messageCounter++}`,
                role: 'assistant',
                content: assistantMessage,
                timestamp: Date.now()
            }
        ];

        const trimmedMessages: ChatMessage[] = this.trimMemory(newMessages, this.config.memoryHistorySize || 10);
        this.adapter.saveMessages(sessionKey, trimmedMessages);
    }

    /**
     * Clears all conversation history for the current session.
     *
     * @returns {void}
     */
    public clearSessionMemory(): void {
        const sessionKey: string = this.resolveSessionKey();
        this.adapter.clearMessages(sessionKey);
    }

    /**
     * Clears all conversation history for all sessions of this node.
     * Called when the node is deleted or user clears all memory.
     *
     * @returns {void}
     */
    public clearAllMemory(): void {
        this.adapter.clearAll();
    }

    /**
     * Returns memory statistics for the current session.
     *
     * @returns {AIMemoryStats} Statistics object
     */
    public getStats(): AIMemoryStats {
        const sessionKey: string = this.resolveSessionKey();
        const messages: ChatMessage[] = this.adapter.getMessages(sessionKey);
        const assistantCount: number = messages.filter((m: ChatMessage) => m.role === 'assistant').length;

        return {
            totalMessages: messages.length,
            interactions: assistantCount,
            lastMessageTime: messages.length > 0 ? messages[messages.length - 1].timestamp : undefined
        };
    }

    /**
     * Trims memory to fit within the context window.
     * Keeps the most recent interactions (user + assistant pairs).
     *
     * @param {ChatMessage[]} messages - All messages to trim
     * @param {number} interactionLimit - Maximum number of interactions to keep
     * @returns {ChatMessage[]} Trimmed array of messages
     */
    private trimMemory(messages: ChatMessage[], interactionLimit: number): ChatMessage[] {
        const messageLimit: number = interactionLimit * 2;
        if (messages.length <= messageLimit) {
            return messages;
        }
        return messages.slice(0, messageLimit);
    }

    /**
     * Checks whether the configured number of completed exchanges is already stored.
     *
     * @param {ChatMessage[]} messages - The stored conversation messages
     * @returns {boolean} Whether the completed exchange limit has been reached
     */
    private hasReachedHistoryLimit(messages: ChatMessage[]): boolean {
        const interactionLimit: number = this.config.memoryHistorySize || 10;
        const completedInteractions: number = messages.filter(
            (message: ChatMessage) => message.role === 'assistant'
        ).length;
        return completedInteractions >= interactionLimit;
    }
}
