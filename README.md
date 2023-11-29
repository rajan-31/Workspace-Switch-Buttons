This GNOME Shell extension adds buttons to switch to left and right workspace, and hides "Activities" button.

![preview](./content/images/preview.png)

## Usage

Use GNOME Extension manager (or and any similar tool) and search for "Workspace Switch Buttons" OR follow these steps

- Add this folder to `~/.local/share/gnome-shell/extensions/`

- Press `alt` + `f2`, type `restart` and press `enter` to reload the GNOME desktop environment OR logout and log back in

- Run `gnome-extensions enable workspace-switch-buttons@rajan-31` in terminal

---

## Devlopment

Follow https://gjs.guide/extensions/

### Quick Reference

- Create new GNOME Shell Extension

    `gnome-extensions create --interactive`

- For testing start a nested GNOME Shell session

    `dbus-run-session -- gnome-shell --nested --wayland`