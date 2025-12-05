import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
API_WS_URL = os.getenv("API_WS_URL", "ws://localhost:8000")

# App Configuration
APP_NAME = "Multi-Agent Monitor"
APP_DESCRIPTION = "Real-time monitoring and analytics for multi-agent AI systems"
REFRESH_INTERVAL = 3

# Color Theme (Light Mode)
PRIMARY_COLOR = "#0ea5e9"  # Sky Blue
SECONDARY_COLOR = "#06b6d4"  # Cyan
SUCCESS_COLOR = "#10b981"  # Emerald
WARNING_COLOR = "#f59e0b"  # Amber
ERROR_COLOR = "#ef4444"  # Red
NEUTRAL_BG = "#f8fafc"  # Slate 50
NEUTRAL_TEXT = "#1e293b"  # Slate 900
NEUTRAL_BORDER = "#e2e8f0"  # Slate 200
