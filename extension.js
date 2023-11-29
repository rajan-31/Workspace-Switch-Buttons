const St = imports.gi.St;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;

function switchToWorkspace(offset) {
    try {
        const currentIndex = global.workspace_manager.get_active_workspace_index();
        const newIndex = currentIndex + offset;

        if (newIndex >= 0 && newIndex < global.workspace_manager.n_workspaces) {
            global.workspace_manager.get_workspace_by_index(newIndex).activate(global.get_current_time());
        }
    } catch (err) {
        Main.notify(err + ": GNOME Extension workspace-switch-buttons@rajan-31 experienced an error!");
        log("workspace-switch-buttons@rajan-31:" + err);
    }
}

let leftButton, rightButton;
let leftButtonConnection, rightButtonConnection;
let leftButtonIcon, rightButtonIcon;


class Extension {
    constructor() {
    }

    enable() {
        leftButtonIcon = new St.Icon({
            icon_name: 'pan-start-symbolic',
            style_class: 'system-status-icon'
        });

        leftButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        leftButton.set_child(leftButtonIcon);
        leftButtonConnection = leftButton.connect('button-press-event', () => switchToWorkspace(-1));


        rightButtonIcon = new St.Icon({
            icon_name: 'pan-end-symbolic',
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


        Main.panel._leftBox.insert_child_at_index(leftButton, 0);
        Main.panel._leftBox.insert_child_at_index(rightButton, 1);
        if (Main.panel.statusArea["activities"] != null) {
            Main.panel.statusArea["activities"].hide();
        }
    }

    disable() {
        Main.panel._leftBox.remove_child(rightButton);
        Main.panel._leftBox.remove_child(leftButton);

        if (Main.panel.statusArea["activities"] != null) {
            Main.panel.statusArea["activities"].show();
        }

        if (leftButton) {
            if (leftButtonConnection) {
                leftButton.disconnect(leftButtonConnection);
                leftButtonConnection = null;
            }
            leftButton.destroy();
            leftButton = null;
        }
        if (leftButtonIcon) {
            leftButtonIcon.destroy();
            leftButtonIcon = null;
        }
        if (rightButton) {
            if (rightButtonConnection) {
                rightButton.disconnect(rightButtonConnection);
                rightButtonConnection = null;
            }
            rightButton.destroy();
            rightButton = null;
        }
        if (rightButtonIcon) {
            rightButtonIcon.destroy();
            rightButtonIcon = null;
        }
    }
}

function init() {
    return new Extension();
}
