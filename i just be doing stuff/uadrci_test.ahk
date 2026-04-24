; UADRCI Test Script - tests if AutoHotkey is working
; Double-click this file, then press Ctrl+U anywhere
;
; If you see a popup that says "It works!" then AHK is good.
; If nothing happens, AHK might not be installed or might be v1 instead of v2.

#Requires AutoHotkey v2.0
#SingleInstance Force

MsgBox("UADRCI Test Script loaded!" . Chr(10) . Chr(10) . "Now press Ctrl+U anywhere to test." . Chr(10) . "You should see a popup saying 'It works!'" . Chr(10) . Chr(10) . "Press OK to dismiss this and start testing.", "UADRCI Test")

^u::
{
    SoundBeep(1000, 200)
    MsgBox("It works! AutoHotkey v2 is running and keybinds are working." . Chr(10) . Chr(10) . "Your AHK version: " . A_AhkVersion . Chr(10) . "Running as admin: " . (A_IsAdmin ? "YES" : "NO"), "UADRCI Test")
}

^+q::ExitApp
