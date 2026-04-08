"""
S.P.I.R.I.T. Mainframe Login Automation
========================================
Connects to Miami-Dade County mainframe (IBMPRD.METRO-DADE.COM)
via TN3270 and autofills the login screen.

Prerequisites:
  1. Install s3270 (the scripted 3270 emulator):
     - Windows: Download wc3270 from http://x3270.bgp.nu/
     - Mac:     brew install x3270
     - Linux:   sudo apt install x3270 (or: sudo yum install x3270-text)
  2. pip install -r requirements.txt
  3. Copy .env.example to .env and fill in your credentials

Usage:
  python login.py
"""

import os
import time
import sys
from dotenv import load_dotenv
from py3270 import Emulator

load_dotenv()

HOST = os.getenv("SPIRIT_HOST", "IBMPRD.METRO-DADE.COM")
PORT = os.getenv("SPIRIT_PORT", "23")
USERNAME = os.getenv("SPIRIT_USERNAME")
PASSWORD = os.getenv("SPIRIT_PASSWORD")
APP_CODE = os.getenv("APP_CODE", "")


def main():
    if not USERNAME or not PASSWORD:
        print("Error: Set SPIRIT_USERNAME and SPIRIT_PASSWORD in your .env file.")
        sys.exit(1)

    # visible=True opens x3270 (graphical), visible=False uses s3270 (headless)
    visible = "--headless" not in sys.argv
    print(f"Connecting to {HOST}:{PORT} (visible: {visible})...")

    em = Emulator(visible=visible)

    try:
        # Connect to mainframe
        em.connect(f"{HOST}:{PORT}")
        em.wait_for_field()
        print("Connected to mainframe.")

        # --- SCREEN 1: Application code menu ---
        # The screen shows "PLEASE ENTER APPLICATION CODE:"
        # We need to type the app code and press Enter.
        # If you just want to stop here and fill manually, comment this out.
        if APP_CODE:
            print(f"Entering application code: {APP_CODE}")
            em.send_string(APP_CODE)
            em.send_enter()
            em.wait_for_field()
            print("Application selected.")

        # --- SCREEN 2: Login screen ---
        # After selecting an application, you'll likely get a login prompt.
        # The field positions below are estimates — update them with the
        # actual row/col positions from your login screen.
        #
        # To find positions: in Quick3270, look at the bottom-left status bar
        # which shows row/col (e.g., "4B" = row 4, col 2). Hover your cursor
        # over the username field and note the row/col.
        #
        # UPDATE THESE COORDINATES to match your actual login screen:
        USERNAME_ROW = 6
        USERNAME_COL = 20
        PASSWORD_ROW = 7
        PASSWORD_COL = 20

        print("Filling in credentials...")
        em.move_to(USERNAME_ROW, USERNAME_COL)
        em.send_string(USERNAME)
        em.move_to(PASSWORD_ROW, PASSWORD_COL)
        em.send_string(PASSWORD)
        em.send_enter()
        em.wait_for_field()

        print("Login submitted!")

        # Print what's on screen after login
        screen_text = em.string_get(1, 1, 80)
        print(f"Screen after login: {screen_text[:80]}")

        # Keep the session open so you can see the result
        if visible:
            print("Session is open. Close the x3270 window to exit.")
            # Keep script alive while the emulator window is open
            while True:
                time.sleep(1)
        else:
            # In headless mode, print the full screen and exit
            for row in range(1, 25):
                line = em.string_get(row, 1, 80)
                print(line)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        em.terminate()


if __name__ == "__main__":
    main()
