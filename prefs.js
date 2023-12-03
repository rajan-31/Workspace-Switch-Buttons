const { Adw, Gtk, Gio } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init(metadata) {
    console.debug(`initializing ${metadata.name} Preferences`);
}

function buildPrefsWidget() {
    return new Gtk.Label({
        label: Me.metadata.name,
    });
}

function fillPreferencesWindow(window) {
    /**
     * Main preference/settings page
    **/
    const prefsPage = new Adw.PreferencesPage({
        name: 'general',
        title: 'General',
        icon_name: 'dialog-information-symbolic',
    });
    window.add(prefsPage);

    // Load settings
    const settings = Gio.Settings.new('org.gnome.shell.extensions.workspace-switch-buttons');

    /**
     * Preferences group
    **/

    const prefsGroup = new Adw.PreferencesGroup({
        title: 'Preferences',
        description: `Configure ${Me.metadata.name} according to your needs`,
    });
    prefsPage.add(prefsGroup);

    /**
     * ------------------------------------------------
    **/

    const row1Label = new Adw.ActionRow({
        title: 'Hide "Activities" button',
        subtitle: 'Whether to hide the "Activities" button on top panel',
    });
    prefsGroup.add(row1Label);

    const row1Switch = new Gtk.Switch({
        valign: Gtk.Align.CENTER,
        active: settings.get_boolean('hide-activities-button')
    });
    row1Label.add_suffix(row1Switch);
    row1Label.set_activatable_widget(row1Switch);

    // Connect signal to update settings on switch change
    settings.bind(
        'hide-activities-button',
        row1Switch,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    /**
     * ------------------------------------------------
    **/

    const row2Label = new Adw.ActionRow({
        title: 'Hide workspace index',
        subtitle: 'Whether to hide the worspace index on top panel',
    });
    prefsGroup.add(row2Label);

    const row2Switch = new Gtk.Switch({
        valign: Gtk.Align.CENTER,
        active: settings.get_boolean('hide-workspace-index')
    });
    row2Label.add_suffix(row2Switch);
    row2Label.set_activatable_widget(row2Switch);

    // Connect signal to update settings on switch change
    settings.bind(
        'hide-workspace-index',
        row2Switch,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );
}