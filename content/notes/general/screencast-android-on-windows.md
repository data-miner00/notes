---
title: Screencast Android on Windows
description: Two ways to share the screen of an Android device on Windows
topic: General
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - windows
  - android
  - screencast
  - guide
updatedAt: 2024-09-15T05:44:36.967Z
createdAt: 2024-09-15T05:44:36.967Z
---

## Windows Connect

Windows steps:

1. Go to settings
2. Click "Projecting to this PC" on the sidebar
3. Click on "Optional Features"
4. Click on "Add a feature"
5. Search for "Wireless Display" and install it
6. Back to the settings, select "Available Everywhere" on the first dropdown
7. Click on "Launch the Connect app to project to this PC"

Android steps:

1. Find the "Connection & sharing" option in settings
2. Click on any options that is related to screencasting
3. It should be able to detect the Windows PC that is ready for screen sharing
4. Click on the PC name
5. The screen of the Android phone should be projected to the PC.

## scrcpy

Summarized steps:

1. PC: Download the assets from [scrcpy](https://github.com/Genymobile/scrcpy) GitHub.
2. PC: Extract the files to a folder.
3. Android: Enable developer mode
4. Android: Enable USB debugging
5. Android: Connect the phone to PC with USB wire
6. PC: Run `scrcpy-noconsole.vbs` in the folder
7. Android: Click "Allow" on the prompt "Allow RSA Debugging"
8. PC: Run `scrcpy-noconsole.vbs` again
9. PC: The phone screen should be available on the PC and is clickable

## References

- [How To CAST Android Mobile Phone Screen to PC Laptop for Free Connect Phone to PC Laptop!!](https://www.youtube.com/watch?v=3KPiN-3MyTg)
- [How to use SCRCPY 2.0 | Control & Mirroring Android to PC](https://www.youtube.com/watch?v=owijYeRAlEw)
