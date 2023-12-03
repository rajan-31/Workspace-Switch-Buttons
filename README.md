This GNOME Shell extension adds buttons to switch to left and right workspace, and hides "Activities" button.

![preview](./content/images/preview.png)

https://extensions.gnome.org/extension/6562/workspace-switch-buttons/

## Usage

Use GNOME Extension manager (or and any similar tool) and search for "Workspace Switch Buttons" OR follow these steps

- Add this folder to `~/.local/share/gnome-shell/extensions/`

- Press `alt` + `f2`, type `restart` and press `enter` to reload the GNOME desktop environment OR logout and log back in

- Run `gnome-extensions enable workspace-switch-buttons@rajan-31` in terminal

---

## Devlopment

__Resources__

https://gjs.guide/extensions/

https://gjs.guide/guides/gobject/basics.html#gobject-construction

https://gjs-docs.gnome.org/

https://gnome-shell-extension-examples.readthedocs.io/en/latest/gsettings1.html

<br>

### Quick Reference

- Create new GNOME Shell Extension

    `gnome-extensions create --interactive`

- For testing, start a nested GNOME Shell session

    `dbus-run-session -- gnome-shell --nested --wayland`

- Compile settings schema

    `glib-compile-schemas ./schemas`

- Copy settings schema to glib-2.0/schemas & compile

    ```bash
    sudo cp org.gnome.shell.extensions.workspace-switch-buttons.gschema.xml /usr/share/glib-2.0/schemas/

    sudo glib-compile-schemas /usr/share/glib-2.0/schemas/
    ```