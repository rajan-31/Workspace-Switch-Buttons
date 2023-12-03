const { St, GLib, Clutter, Gio } = imports.gi;
const Main = imports.ui.main;

function switchToWorkspace(offset) {
    try {
        const currentIndex = global.workspace_manager.get_active_workspace_index();
        const newIndex = currentIndex + offset;

        if (newIndex >= 0 && newIndex < global.workspace_manager.n_workspaces) {
            global.workspace_manager.get_workspace_by_index(newIndex).activate(global.get_current_time());
        }
    } catch (err) {
        Main.notify(err + ": GNOME Extension workspace-switch-buttons experienced an error!");
        console.log("workspace-switch-buttons:" + err);
    }
}

// currrent workspace number as string (1 based indexing)
function getActiveWorkspaceIndex() {
    return String(global.workspace_manager.get_active_workspace_index() + 1)
}


let leftButton, centerButton, rightButton;
let leftButtonConnection, centerButtonConnection, rightButtonConnection;
let leftButtonIcon, rightButtonIcon;
let activeIndexLabel, activeWorkspaceUpdate;

let settings, settingsConnection1, settingsConnection2;;


class Extension {
    constructor() {
    }

    enable() {

        // Load settings
        settings = Gio.Settings.new('org.gnome.shell.extensions.workspace-switch-buttons');

        // listen for preference updates
        // switch 1
        settingsConnection1 = settings.connect('changed::hide-activities-button', () => {
            if (settings.get_boolean('hide-activities-button')) Main.panel.statusArea["activities"].hide();
            else Main.panel.statusArea["activities"].show();
        });
        // switch 2
        settingsConnection2 = settings.connect('changed::hide-workspace-index', () => {
            if (centerButton) {
                if (settings.get_boolean('hide-workspace-index')) centerButton.hide();
                else centerButton.show();
            }
        });

        /**
         * Left button
        **/

        leftButtonIcon = new St.Icon({
            icon_name: 'go-previous-symbolic',
            style_class: 'system-status-icon',
        });

        leftButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        leftButton.set_child(leftButtonIcon);
        leftButtonConnection = leftButton.connect('button-press-event', () => switchToWorkspace(-1));

        /**
         * Right button
        **/

        rightButtonIcon = new St.Icon({
            icon_name: 'go-next-symbolic',
            style_class: 'system-status-icon'
        });

        rightButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        rightButton.set_child(rightButtonIcon);
        rightButtonConnection = rightButton.connect('button-press-event', () => switchToWorkspace(1));

        /**
         * Center/index label and button
        **/

        activeIndexLabel = new St.Label({
            text: "1",
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });

        // change workspace index when workspace is changed
        activeWorkspaceUpdate = global.workspace_manager.connect(
            'active-workspace-changed',
            () => {
                activeIndexLabel.set_text(getActiveWorkspaceIndex());
            }
        );

        centerButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });
        centerButton.set_child(activeIndexLabel);
        centerButtonConnection = centerButton.connect('button-press-event', () => Main.overview.toggle());

        // Set padding using CSS
        activeIndexLabel.style = `
            margin: 0 12px 0 12px;  /* Adjust the padding as needed */
        `;

        /**
         * Place buttons on top panel
        **/

        Main.panel._leftBox.insert_child_at_index(leftButton, 0);
        Main.panel._leftBox.insert_child_at_index(centerButton, 1);
        Main.panel._leftBox.insert_child_at_index(rightButton, 2);


        if (settings.get_boolean('hide-workspace-index'))
            centerButton.hide()

        if (settings.get_boolean('hide-activities-button') && Main.panel.statusArea["activities"] != null) {
            Main.panel.statusArea["activities"].hide();
        }
    }

    disable() {

        if (settingsConnection1) settings.disconnect(settingsConnection1)
        if (settingsConnection2) settings.disconnect(settingsConnection2)

        if (Main.panel.statusArea["activities"] != null) {
            Main.panel.statusArea["activities"].show();
        }

        if (leftButton) {
            Main.panel._leftBox.remove_child(leftButton);

            if (leftButtonConnection) {
                leftButton.disconnect(leftButtonConnection);
                leftButtonConnection = null;
            }
            leftButton.destroy();
            leftButton = null;
        }

        if (centerButton) {
            Main.panel._leftBox.remove_child(centerButton);
            if (centerButtonConnection) {
                centerButton.disconnect(centerButtonConnection);
                centerButtonConnection = null;
            }
            centerButton.destroy();
            centerButton = null;
        }
        if (activeWorkspaceUpdate) {
            global.workspace_manager.disconnect(activeWorkspaceUpdate);
            activeWorkspaceUpdate = null;
        }

        if (rightButton) {
            Main.panel._leftBox.remove_child(rightButton);
            if (rightButtonConnection) {
                rightButton.disconnect(rightButtonConnection);
                rightButtonConnection = null;
            }
            rightButton.destroy();
            rightButton = null;
        }
    }
}

function init() {
    return new Extension();
}
