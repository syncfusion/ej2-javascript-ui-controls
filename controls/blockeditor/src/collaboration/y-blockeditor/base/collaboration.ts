import { BlockManager } from '../../../block-manager/base/block-manager';
import { IVersionHistory, YjsAdapter } from '../../../models/interface';
import { CollaborationSettingsModel } from '../../../models/collaboration/collaboration-settings-model';
import { BlockEditorBinding, CursorPlugin, UndoPlugin, VersionHistory } from '../plugins/index';
import { InternalYRuntime } from './interface';

export class Collaboration {
    /** @hidden */
    public blockManager: BlockManager;

    /** @hidden */
    public settings: CollaborationSettingsModel;

    /** @hidden */
    public syncBinding!: BlockEditorBinding | null;

    /** @hidden */
    public cursorPlugin!: CursorPlugin | null;

    /** @hidden */
    public undoPlugin!: UndoPlugin | null;

    /** @hidden */
    public adapter: YjsAdapter;

    /**
     * Initializes the collaboration module
     *
     * @param {BlockManager} blockManager - The manager instance
     * @param {CollaborationSettingsModel} settings - The Collaboration settings
     * @returns {void}
     * @hidden
     */
    public initialize(blockManager: BlockManager, settings: CollaborationSettingsModel): void {
        this.blockManager = blockManager;
        this.settings = settings;
        this.adapter = settings.adapter;

        // BlockEditorBinding (sync plugin)
        this.syncBinding = new BlockEditorBinding({
            parent: this,
            blockManager: this.blockManager,
            yBlocks: this.adapter.yXmlFragment!
        });

        // CursorPlugin
        if (this.settings.enableAwareness && this.settings.provider) {
            if (this.settings.provider.awareness) {
                this.cursorPlugin = new CursorPlugin(
                    this.adapter.yXmlFragment!,
                    {
                        parent: this,
                        blockManager: this.blockManager,
                        awareness: this.settings.provider.awareness
                    }
                );
            }
        }

        // UndoPlugin
        this.undoPlugin = new UndoPlugin({
            parent: this,
            blockManager: this.blockManager,
            maxStackSize: this.blockManager.undoRedoStack,
            yXmlFragment: this.adapter.yXmlFragment!,
            captureTimeout: 500
        });

    }

    /**
     * To get component name.
     *
     * @returns {string} - It returns the module name.
     * @private
     */
    public getModuleName(): string {
        return 'collaboration';
    }

    public getSyncBinding(): BlockEditorBinding | null {
        return this.syncBinding;
    }

    public getCursorPlugin(): CursorPlugin | null {
        return this.cursorPlugin;
    }

    public getUndoPlugin(): UndoPlugin | null {
        return this.undoPlugin;
    }

    /**
     * Returns the VersionHistory instance if version history is configured.
     *
     * @returns {IVersionHistory | null} - The version history or null.
     * @hidden
     */
    public getVersionHistory(): IVersionHistory | null {
        return this.blockManager.versionHistoryModule;
    }

    public getYRuntime(): InternalYRuntime {
        return this.adapter.yRuntime;
    }

    public destroy(): void {
        // Destroy plugins
        if (this.undoPlugin) {
            this.undoPlugin.destroy();
        }

        if (this.cursorPlugin) {
            this.cursorPlugin.destroy();
        }

        if (this.syncBinding) {
            this.syncBinding.destroy();
        }

        this.syncBinding = null;
        this.cursorPlugin = null;
        this.undoPlugin = null;
    }
}
