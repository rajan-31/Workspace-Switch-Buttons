const { St, GLib, Clutter, Gio } = imports.gi;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;


class Extension {
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


    enable() {

        // Load settings
        this.settings = ExtensionUtils.getSettings()

        // listen for preference updates
        // switch 1 update
        this.settingsConnection1 = this.settings.connect('changed::hide-activities-button', () => {
            if (this.settings.get_boolean('hide-activities-button')) Main.panel.statusArea["activities"].hide();
            else Main.panel.statusArea["activities"].show();
        });
        // switch 2 update
        this.settingsConnection2 = this.settings.connect('changed::hide-workspace-index', () => {
            if (this.centerButton) {
                if (this.settings.get_boolean('hide-workspace-index')) this.centerButton.hide();
                else this.centerButton.show();
            }
        });

        /**
         * Left button
        **/

        this.leftButtonIcon = new St.Icon({
            icon_name: 'go-previous-symbolic',
            style_class: 'system-status-icon',
        });

        this.leftButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        this.leftButton.set_child(this.leftButtonIcon);
        this.leftButtonConnection = this.leftButton.connect('button-press-event', () => this.switchToWorkspace(-1));

        /**
         * Right button
        **/

        this.rightButtonIcon = new St.Icon({
            icon_name: 'go-next-symbolic',
            style_class: 'system-status-icon'
        });

        this.rightButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        this.rightButton.set_child(this.rightButtonIcon);
        this.rightButtonConnection = this.rightButton.connect('button-press-event', () => this.switchToWorkspace(1));

        /**
         * Center/index label and button
        **/

        this.activeIndexLabel = new St.Label({
            text: "1",
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });

        // change workspace index when workspace is changed
        this.activeWorkspaceUpdate = global.workspace_manager.connect(
            'active-workspace-changed',
            () => {
                this.activeIndexLabel.set_text(this.getActiveWorkspaceIndex());
            }
        );

        this.centerButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });
        this.centerButton.set_child(this.activeIndexLabel);
        this.centerButtonConnection = this.centerButton.connect('button-press-event', () => Main.overview.toggle());

        // Set padding using CSS
        this.activeIndexLabel.style = `
            margin: 0 12px 0 12px;  /* Adjust the padding as needed */
        `;

        /**
         * Place buttons on top panel
        **/

        Main.panel._leftBox.insert_child_at_index(this.leftButton, 0);
        Main.panel._leftBox.insert_child_at_index(this.centerButton, 1);
        Main.panel._leftBox.insert_child_at_index(this.rightButton, 2);


        if (this.settings.get_boolean('hide-workspace-index'))
            this.centerButton.hide()

        if (this.settings.get_boolean('hide-activities-button') && Main.panel.statusArea["activities"] != null) {
            Main.panel.statusArea["activities"].hide();
        }
    }

    disable() {

        if (this.settingsConnection1) this.settings.disconnect(this.settingsConnection1)
        if (this.settingsConnection2) this.settings.disconnect(this.settingsConnection2)

        if (Main.panel.statusArea["activities"] != null) {
            Main.panel.statusArea["activities"].show();
        }

        if (this.leftButton) {
            Main.panel._leftBox.remove_child(this.leftButton);

            if (this.leftButtonConnection) {
                this.leftButton.disconnect(this.leftButtonConnection);
                this.leftButtonConnection = null;
            }
            this.leftButton.destroy();
            this.leftButton = null;
        }

        if (this.centerButton) {
            Main.panel._leftBox.remove_child(this.centerButton);
            if (this.centerButtonConnection) {
                this.centerButton.disconnect(this.centerButtonConnection);
                this.centerButtonConnection = null;
            }
            this.centerButton.destroy();
            this.centerButton = null;
        }
        if (this.activeWorkspaceUpdate) {
            global.workspace_manager.disconnect(this.activeWorkspaceUpdate);
            this.activeWorkspaceUpdate = null;
        }

        if (this.rightButton) {
            Main.panel._leftBox.remove_child(this.rightButton);
            if (this.rightButtonConnection) {
                this.rightButton.disconnect(this.rightButtonConnection);
                this.rightButtonConnection = null;
            }
            this.rightButton.destroy();
            this.rightButton = null;
        }
    }
}

function init() {
    return new Extension();
}
