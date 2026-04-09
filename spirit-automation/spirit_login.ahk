; =========================================================================
; S.P.I.R.I.T. Login Macro - AutoHotkey v2
; =========================================================================
; Universal alternative to the Quick3270 macro. Works with ANY terminal
; emulator (Quick3270, IBM PCOMM, Reflection, Vista tn3270, etc.) because
; it just sends keystrokes to the active window.
;
; TO USE:
;   1. Install AutoHotkey v2 from https://www.autohotkey.com/
;   2. Save this file as spirit_login.ahk
;   3. Update USERNAME, PASSWORD, and APP_CODE below
;   4. Double-click the .ahk file to load it
;   5. Click into your Quick3270 window so it has focus
;   6. Press  Ctrl+Shift+L  to run the login sequence
;
; CUSTOMIZE THE HOTKEY:
;   Change "^+l" below to whatever you want:
;     ^ = Ctrl   ! = Alt   + = Shift   # = Win
;     e.g. "^!s" = Ctrl+Alt+S
; =========================================================================

#Requires AutoHotkey v2.0
#SingleInstance Force

; ------ CONFIGURATION ---------------------------------------------------
USERNAME := "JDOE"
PASSWORD := "mypassword"
APP_CODE := "C"          ; C = Criminal Justice / Courts
FIELD_DELAY := 400       ; ms to wait between screens (increase if slow)
; ------------------------------------------------------------------------

; Hotkey: Ctrl+Shift+L triggers the login
^+l::
{
    global USERNAME, PASSWORD, APP_CODE, FIELD_DELAY

    ; Safety: make sure the active window looks like a 3270 emulator
    title := WinGetTitle("A")
    if !InStr(title, "3270") and !InStr(title, "Session") {
        result := MsgBox("Active window doesn't look like a 3270 session.`n`nContinue anyway?", "S.P.I.R.I.T. Login", "YesNo Icon!")
        if (result = "No")
            return
    }

    ; --- SCREEN 1: Application code ---
    Send(APP_CODE)
    Send("{Enter}")
    Sleep(FIELD_DELAY)

    ; --- SCREEN 2: Login ---
    ; Type username, then Tab to password field, then password, then Enter
    Send(USERNAME)
    Send("{Tab}")
    Send(PASSWORD)
    Send("{Enter}")

    ; Optional tray notification
    TrayTip("S.P.I.R.I.T.", "Login sequence sent", 1)
}

; Bonus hotkey: Ctrl+Shift+Q  = quit/reload this script
^+q::ExitApp
