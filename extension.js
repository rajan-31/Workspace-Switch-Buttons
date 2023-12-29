const { St, GLib, Clutter, Gio } = imports.gi;

const Main = imports.ui.main;

const ExtensionUtils = imports.misc.extensionUtils;

class Switcher {
    constructor(settings) {
        this._settings = settings;
        this._buttons = {};
    }

    addToPanel() {
        this._createButtonsContainer();
        Main.panel._leftBox.insert_child_at_index(this._buttonsContainer, 0);

        this._connectSettings();

        if (this._settings.get_boolean('hide-workspace-index')) {
            this._buttons.center.hide();
        }

        if (this._settings.get_boolean('hide-activities-button')) {
            Main.panel.statusArea.activities?.hide();
        }
    }

    destroy() {
        if (this._activeWorkspaceUpdateSignal) {
            global.workspace_manager.disconnect(this._activeWorkspaceUpdateSignal);
        }

        this._buttonsContainer?.destroy();

        if (!Main.sessionMode.isLocked) {
            Main.panel.statusArea.activities?.show();
        }
    }

    _connectSettings() {
        this._settings.connect('changed::hide-activities-button', () => {
            let activities = Main.panel.statusArea.activities;
            if (this._settings.get_boolean('hide-activities-button')) {
                activities.hide();
            } else {
                activities.show();
            }
        });

        this._settings.connect('changed::hide-workspace-index', () => {
            if (this._settings.get_boolean('hide-workspace-index')) {
                this._buttons.center?.hide();
            } else {
                this._buttons.center?.show();
            }
        });
    }

    _createButtonsContainer() {
        this._buttons.left = this._getButton('media-playback-start-rtl-symbolic').button;
        this._buttons.left.connect('button-press-event', () => this._switchToWorkspace(-1));

        this._buttons.right = this._getButton('media-playback-start-symbolic').button;
        this._buttons.right.connect('button-press-event', () => this._switchToWorkspace(1));

        let centerButton = this._getButton(null, this._getActiveWorkspaceIndex());
        this._buttons.center = centerButton.button;
        this._buttons.center.connect('button-press-event', () => Main.overview.toggle());

        this._activeWorkspaceUpdateSignal = global.workspace_manager.connect(
            'active-workspace-changed',
            () => {
                centerButton.label.set_text(this._getActiveWorkspaceIndex());
            }
        );

        this._buttonsContainer = new St.BoxLayout({
        });
        this._buttonsContainer.add_child(this._buttons.left);
        this._buttonsContainer.add_child(this._buttons.center);
        this._buttonsContainer.add_child(this._buttons.right);
    }

    _getButton(iconName, labelText) {
        let button = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        let icon = null;
        if (iconName) {
            icon = new St.Icon({
                icon_name: iconName,
                style_class: 'system-status-icon',
            });
            button.set_child(icon);
        }

        let label = null;
        if (labelText) {
            label = new St.Label({
                text: labelText,
                x_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
                style: 'margin: 0 12px 0 12px;',
            });
            button.set_child(label);
        }

        return { button, icon, label };
    }

    // offset -1 for right, +1 for left
    _switchToWorkspace(offset) {
        try {
            const currentIndex = global.workspace_manager.get_active_workspace_index();
            const newIndex = currentIndex + offset;

            // newIndex validity check
            if (newIndex >= 0 && newIndex < global.workspace_manager.n_workspaces) {
                global.workspace_manager.get_workspace_by_index(newIndex).activate(global.get_current_time());
            }
        } catch (err) {
            Main.notify(err + ": GNOME Extension workspace-switch-buttons experienced an error!");
            console.log("workspace-switch-buttons:" + err);
        }
    }

    // current workspace number as string (1 based indexing)
    _getActiveWorkspaceIndex() {
        return String(global.workspace_manager.get_active_workspace_index() + 1);
    }
}

class Extension {
    enable() {
        this.switcher = new Switcher(ExtensionUtils.getSettings());
        this.switcher.addToPanel();
    }

    disable() {
        this.switcher?.destroy();
        this.switcher = null;
    }
}

function init() {
    return new Extension();
}
