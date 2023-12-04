const { St, GLib, Clutter, Gio } = imports.gi;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;

class Manager {
    constructor() {
        this.leftButton = null;
        this.centerButton = null;
        this.rightButton = null;

        this.leftButtonConnection = null;
        this.centerButtonConnection = null;
        this.rightButtonConnection = null;

        this.leftButtonIcon = null;
        this.rightButtonIcon = null;

        this.activeIndexLabel = null;
        this.activeWorkspaceUpdate = null;

        this.settings = null;
        this.settingsConnection1 = null;
        this.settingsConnection2 = null;
    }

    // offset -1 for right, +1 for left
    switchToWorkspace(offset) {
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

    // currrent workspace number as string (1 based indexing)
    getActiveWorkspaceIndex() {
        return String(global.workspace_manager.get_active_workspace_index() + 1)
    }
}

class Extension {
    constructor() {
        this.manager = null;
    }

    enable() {
        this.manager = new Manager();

        // Load settings
        this.manager.settings = ExtensionUtils.getSettings()

        // listen for preference updates
        // switch 1 update
        this.manager.settingsConnection1 = this.manager.settings.connect('changed::hide-activities-button', () => {
            if (this.manager.settings.get_boolean('hide-activities-button')) Main.panel.statusArea["activities"].hide();
            else Main.panel.statusArea["activities"].show();
        });
        // switch 2 update
        this.manager.settingsConnection2 = this.manager.settings.connect('changed::hide-workspace-index', () => {
            if (this.manager.centerButton) {
                if (this.manager.settings.get_boolean('hide-workspace-index')) this.manager.centerButton.hide();
                else this.manager.centerButton.show();
            }
        });

        /**
         * Left button
        **/

        this.manager.leftButtonIcon = new St.Icon({
            icon_name: 'go-previous-symbolic',
            style_class: 'system-status-icon',
        });

        this.manager.leftButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        this.manager.leftButton.set_child(this.manager.leftButtonIcon);
        this.manager.leftButtonConnection = this.manager.leftButton.connect('button-press-event', () => this.manager.switchToWorkspace(-1));

        /**
         * Right button
        **/

        this.manager.rightButtonIcon = new St.Icon({
            icon_name: 'go-next-symbolic',
            style_class: 'system-status-icon'
        });

        this.manager.rightButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        this.manager.rightButton.set_child(this.manager.rightButtonIcon);
        this.manager.rightButtonConnection = this.manager.rightButton.connect('button-press-event', () => this.manager.switchToWorkspace(1));

        /**
         * Center/index label and button
        **/

        this.manager.activeIndexLabel = new St.Label({
            text: "1",
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });

        // change workspace index when workspace is changed
        this.manager.activeWorkspaceUpdate = global.workspace_manager.connect(
            'active-workspace-changed',
            () => {
                this.manager.activeIndexLabel.set_text(this.manager.getActiveWorkspaceIndex());
            }
        );

        this.manager.centerButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });
        this.manager.centerButton.set_child(this.manager.activeIndexLabel);
        this.manager.centerButtonConnection = this.manager.centerButton.connect('button-press-event', () => Main.overview.toggle());

        // Set padding using CSS
        this.manager.activeIndexLabel.style = `
            margin: 0 12px 0 12px;  /* Adjust the padding as needed */
        `;

        /**
         * Place buttons on top panel
        **/

        Main.panel._leftBox.insert_child_at_index(this.manager.leftButton, 0);
        Main.panel._leftBox.insert_child_at_index(this.manager.centerButton, 1);
        Main.panel._leftBox.insert_child_at_index(this.manager.rightButton, 2);


        if (this.manager.settings.get_boolean('hide-workspace-index'))
            this.manager.centerButton.hide()

        if (this.manager.settings.get_boolean('hide-activities-button') && Main.panel.statusArea["activities"] != null) {
            Main.panel.statusArea["activities"].hide();
        }
    }

    disable() {
        // make top panel as it looked without extension
        if (Main.panel.statusArea["activities"] != null) {
            Main.panel.statusArea["activities"].show();
        }
        if (this.manager.leftButton) {
            Main.panel._leftBox.remove_child(this.manager.leftButton);
        }
        if (this.manager.centerButton) {
            Main.panel._leftBox.remove_child(this.manager.centerButton);
        }
        if (this.manager.rightButton) {
            Main.panel._leftBox.remove_child(this.manager.rightButton);
        }

        if (this.manager) {
            this.manager = null;
        }
    }
}

function init() {
    return new Extension();
}
