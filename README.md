![View on GitHub repo](./content/images/preview.png)

[Full Screen Preview](./content/images/full_screen_preview.png)

This GNOME Shell extension offers following features:

- Buttons to switch to left and right workspace
- Shows index of active workspace (click it for overview)
    - You can hide it (preferences/settings)
- Hides "Activities" button
    - You can turn this off (preferences/settings)

[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" alt="Get it on GNOME Extensions" height="100" align="middle">](https://extensions.gnome.org/extension/6562/workspace-switch-buttons/)

_Supported GNOME Shell versions: 42, 43, 44_

<br>

## Installation

Use [GNOME Extension Manager](https://mattjakeman.com/apps/extension-manager) (or browser extension or any other tool) and search for "Workspace Switch Buttons" 

OR follow these steps

- Download this repo, name the folder "workspace-switch-buttons@rajan-31" and move it to `~/.local/share/gnome-shell/extensions/`

- Restart the GNOME Shell

    - For Wayland

        Logout and log back in
    
    - For X11
    
        Press `alt` + `f2`, type `restart` and press `enter`

- Run the command `gnome-extensions enable workspace-switch-buttons@rajan-31`

<br>

## Feedback/Contribute

Feel free to create an issue if something is not working correctly. Any PRs are welcome.

## Devlopment

__Resources__

https://gjs.guide/extensions/

https://gjs.guide/guides/gobject/basics.html#gobject-construction

https://gjs-docs.gnome.org/

https://gnome-shell-extension-examples.readthedocs.io/en/latest/gsettings1.html

<br>

__Quick Reference__

- Create new GNOME Shell Extension

    `gnome-extensions create --interactive`

- For testing, start a nested GNOME Shell session

    `dbus-run-session -- gnome-shell --nested --wayland`

- Compile settings schema

    `glib-compile-schemas ./schemas`

- [no use in latest version] Copy settings schema to glib-2.0/schemas & compile

    ```bash
    sudo cp org.gnome.shell.extensions.workspace-switch-buttons.gschema.xml /usr/share/glib-2.0/schemas/

    sudo glib-compile-schemas /usr/share/glib-2.0/schemas/
    ```

- Zip it
    `zip ../workspace-switch-buttons@rajan-31.zip *`

- Symbolic Icons
    `/usr/share/icons/Yaru/scalable`

<!-- 
    ### What to update after update

    Code
    - metadata.json => version, description
    - images => preview, full screen preview
    - schema => recompile
    - Readme.md => Description

    Repo
    - Releases => zip, changes

    GNOME Extension Website
    - Description
    - Screenshot
    - upload zip

    ### More features/improvements

    [ ] Wrap around on first and last workspace
    [ ] different placement options
    
    [*] use style_class
    [*] all three button as single item
 -->
