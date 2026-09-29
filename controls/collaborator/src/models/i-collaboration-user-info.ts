/**
 * Provides the information about the user who joined or left the
 * collaboration session.
 */
export interface UserInfo {
    /**
     * The unique identifier of the user.
     */
    userId: string;

    /**
     * The display name of the user.
     */
    userName: string;

    /**
     * The unique connection identifier of the user's active connection.
     */
    connectionId: string;
}
