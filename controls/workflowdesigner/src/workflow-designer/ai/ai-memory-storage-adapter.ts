/**
 * sessionStorage-based implementation of the Memory Storage Adapter.
 * Conversation history lasts for the browser tab session and is cleared when it ends.
 *
 * @internal
 */

import { ChatMessage, MemoryStorageAdapter } from './ai-memory-types';

/**
 * sessionStorage-based memory storage adapter.
 * Uses namespaced keys to organize memory by workflow, node, and session.
 *
 * Namespace format: `ej2-ai-memory:{workflowId}:{nodeId}:{sessionKey}`
 */
export class SessionStorageMemoryAdapter implements MemoryStorageAdapter {
    private static readonly PREFIX: string = 'ej2-ai-memory';
    private readonly workflowId: string;
    private readonly nodeId: string;

    /**
     * Generates a namespaced storage key for a session.
     *
     * @param {string} workflowId - The workflow identifier
     * @param {string} nodeId - The AI node identifier
     * @param {string} sessionKey - The session identifier
     * @returns {string} The full namespaced key
     */
    private static generateKey(workflowId: string, nodeId: string, sessionKey: string): string {
        return `${SessionStorageMemoryAdapter.PREFIX}:${workflowId}:${nodeId}:${sessionKey}`;
    }

    /**
     * Creates an instance.
     *
     * @param {string} workflowId - The workflow identifier
     * @param {string} nodeId - The AI node identifier
     */
    public constructor(
        workflowId: string,
        nodeId: string
    ) {
        this.workflowId = workflowId;
        this.nodeId = nodeId;
    }

    /**
     * Retrieves all messages for a given session.
     *
     * @param {string} sessionKey - The session identifier
     * @returns {ChatMessage[]} Array of chat messages
     */
    public getMessages(sessionKey: string): ChatMessage[] {
        try {
            const key: string = SessionStorageMemoryAdapter.generateKey(this.workflowId, this.nodeId, sessionKey);
            const stored: string | null = typeof window !== 'undefined' && window.sessionStorage
                ? window.sessionStorage.getItem(key)
                : null;
            if (!stored) {
                return [];
            }
            const parsed: any = JSON.parse(stored);
            // Validate that it's an array of chat messages
            if (Array.isArray(parsed)) {
                return parsed.filter((msg: unknown) =>
                    msg && typeof msg === 'object' && (msg as any).id && (msg as any).role && (msg as any).content !== undefined
                );
            }
            return [];
        } catch {
            // Storage can be full or disabled (for example in a private window); history is best effort.
            return [];
        }
    }

    /**
     * Checks whether any session for this workflow and node has stored history.
     *
     * @returns {boolean} Whether saved messages exist for this workflow and node
     */
    public hasStoredMessages(): boolean {
        try {
            if (typeof window === 'undefined' || !window.sessionStorage) {
                return false;
            }
            const prefix: string = `${SessionStorageMemoryAdapter.PREFIX}:${this.workflowId}:${this.nodeId}:`;
            for (let i: number = 0; i < window.sessionStorage.length; i++) {
                const key: string | null = window.sessionStorage.key(i);
                if (key && key.startsWith(prefix) && window.sessionStorage.getItem(key)) {
                    return true;
                }
            }
            return false;
        } catch {
            // Storage can be full or disabled (for example in a private window); history is best effort.
            return false;
        }
    }

    /**
     * Saves messages for a given session.
     *
     * @param {string} sessionKey - The session identifier
     * @param {ChatMessage[]} messages - Array of chat messages to store
     * @returns {void}
     */
    public saveMessages(sessionKey: string, messages: ChatMessage[]): void {
        try {
            if (typeof window === 'undefined' || !window.sessionStorage) {
                return;
            }
            const key: string = SessionStorageMemoryAdapter.generateKey(this.workflowId, this.nodeId, sessionKey);
            const serialized: string = JSON.stringify(messages);
            window.sessionStorage.setItem(key, serialized);
        } catch {
            // Storage can be full or disabled (for example in a private window); history is best effort.
        }
    }

    /**
     * Clears all messages for a given session.
     *
     * @param {string} sessionKey - The session identifier
     * @returns {void}
     */
    public clearMessages(sessionKey: string): void {
        try {
            if (typeof window === 'undefined' || !window.sessionStorage) {
                return;
            }
            const key: string = SessionStorageMemoryAdapter.generateKey(this.workflowId, this.nodeId, sessionKey);
            window.sessionStorage.removeItem(key);
        } catch {
            // Storage can be full or disabled (for example in a private window); history is best effort.
        }
    }

    /**
     * Clears all memory data for this workflow and node across all sessions.
     * Useful for node deletion or explicit user action.
     *
     * @returns {void}
     */
    public clearAll(): void {
        try {
            if (typeof window === 'undefined' || !window.sessionStorage) {
                return;
            }
            const prefix: string = `${SessionStorageMemoryAdapter.PREFIX}:${this.workflowId}:${this.nodeId}:`;
            const keysToDelete: string[] = [];
            for (let i: number = 0; i < window.sessionStorage.length; i++) {
                const key: string | null = window.sessionStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    keysToDelete.push(key);
                }
            }
            keysToDelete.forEach((key: string) => window.sessionStorage.removeItem(key));
        } catch {
            // Storage can be full or disabled (for example in a private window); history is best effort.
        }
    }
}
