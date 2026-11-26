/**
 * AI Memory Types and Interfaces
 * Defines the structure for conversational memory in AI Agent nodes.
 *
 * @internal
 */

/**
 * Represents a single message in the conversation history.
 */
export interface ChatMessage {
    /** Unique identifier for the message */
    id: string;
    /** Role of the message sender: user, assistant, or system */
    role: 'user' | 'assistant' | 'system';
    /** The content of the message */
    content: string;
    /** Unix timestamp when the message was created */
    timestamp: number;
}

/**
 * Storage adapter abstraction for managing conversation history.
 * Allows switching between localStorage, server-side storage, Redis, etc.
 */
export interface MemoryStorageAdapter {
    /**
     * Retrieves all messages for a given session.
     *
     * @param sessionKey - The session identifier
     * @returns Array of chat messages for the session
     */
    getMessages(sessionKey: string): ChatMessage[];

    /**
     * Saves messages for a given session.
     * Replaces any existing messages for that session.
     *
     * @param sessionKey - The session identifier
     * @param messages - Array of chat messages to store
     */
    saveMessages(sessionKey: string, messages: ChatMessage[]): void;

    /**
     * Clears all messages for a given session.
     *
     * @param sessionKey - The session identifier
     */
    clearMessages(sessionKey: string): void;

    /**
     * Clears all memory data (across all sessions).
     * Used for development/testing or when user explicitly clears all memory.
     */
    clearAll(): void;
}

/**
 * Memory configuration for an AI Agent node
 */
export interface AIMemoryConfig {
    /** Whether memory is enabled for this AI Agent */
    enabled: boolean;
    /** Number of recent interactions to include in the request (1-50, default 10) */
    memoryHistorySize: number;
    /** Session key to group related conversations (optional, auto-generated if not provided) */
    sessionKey?: string;
}

/**
 * Memory statistics (for debugging/UI display)
 */
export interface AIMemoryStats {
    /** Total number of messages stored for this session */
    totalMessages: number;
    /** Number of interactions (user-assistant pairs) */
    interactions: number;
    /** Timestamp of the most recent message */
    lastMessageTime?: number;
}
