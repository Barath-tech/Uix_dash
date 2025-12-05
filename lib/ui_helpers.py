import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import config
from datetime import datetime

def get_status_color(status: str) -> str:
    """Get color for status badge"""
    colors = {
        "active": config.SUCCESS_COLOR,
        "idle": config.WARNING_COLOR,
        "error": config.ERROR_COLOR,
        "offline": config.NEUTRAL_BORDER,
        "success": config.SUCCESS_COLOR,
        "pending": config.PRIMARY_COLOR,
        "completed": config.SUCCESS_COLOR,
    }
    return colors.get(status, config.NEUTRAL_BORDER)

def render_stat_card(col, label: str, value: str, subtext: str = "", icon: str = "📊", color: str = None):
    """Render a statistics card"""
    with col:
        st.markdown(f"""
        <div style='background: white; padding: 20px; border-radius: 12px; border: 1px solid {config.NEUTRAL_BORDER};'>
            <div style='display: flex; justify-content: space-between; align-items: start;'>
                <div>
                    <div style='font-size: 13px; color: #64748b; font-weight: 500; margin-bottom: 8px;'>{label}</div>
                    <div style='font-size: 28px; font-weight: 700; color: {color or config.NEUTRAL_TEXT};'>{value}</div>
                    {f'<div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">{subtext}</div>' if subtext else ''}
                </div>
                <div style='font-size: 24px;'>{icon}</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

def render_agent_badge(status: str, name: str = ""):
    """Render agent status badge"""
    color = get_status_color(status)
    return f'<span style="display: inline-block; padding: 4px 12px; border-radius: 20px; background-color: {color}20; color: {color}; font-size: 12px; font-weight: 600; border: 1px solid {color}40;">{name or status}</span>'

def render_log_row(log: dict):
    """Render a log entry in table format"""
    level_colors = {
        "info": f"background-color: #d0f0ff; color: #0369a1;",
        "warning": f"background-color: #fef3c7; color: #b45309;",
        "error": f"background-color: #fee2e2; color: #991b1b;",
        "debug": f"background-color: #f3f4f6; color: #374151;"
    }
    level_style = level_colors.get(log.get("level", "info"), "")
    
    return f"""
    <div style='display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid {config.NEUTRAL_BORDER}; align-items: center;'>
        <div style='flex: 0 0 80px;'><span style='padding: 4px 8px; border-radius: 6px; {level_style} font-weight: 500; font-size: 11px;'>{log.get("level", "info").upper()}</span></div>
        <div style='flex: 1; min-width: 0;'><div style='color: {config.NEUTRAL_TEXT}; font-weight: 500; font-size: 13px;'>{log.get("message", "N/A")}</div><div style='color: #94a3b8; font-size: 11px; margin-top: 2px;'>{log.get("timestamp", "")}</div></div>
        <div style='flex: 0 0 100px; text-align: right;'><div style='font-size: 12px; color: {config.NEUTRAL_TEXT};'>{log.get("totalTokens", 0)} tokens</div><div style='font-size: 11px; color: #94a3b8; margin-top: 2px;'>${log.get("cost", 0):.4f}</div></div>
        <div style='flex: 0 0 80px;'><span style='padding: 4px 8px; border-radius: 6px; background-color: {get_status_color(log.get("status", "pending"))}20; color: {get_status_color(log.get("status", "pending"))}; font-weight: 500; font-size: 11px;'>{log.get("status", "pending").upper()}</span></div>
    </div>
    """

def create_activity_chart(data: list):
    """Create activity chart"""
    df_data = []
    for point in data:
        df_data.append({
            "time": point.get("time", ""),
            "Requests": point.get("requests", 0),
            "Tokens": point.get("tokens", 0)
        })
    
    df = __import__("pandas").DataFrame(df_data)
    
    fig = make_subplots(specs=[[{"secondary_y": True}]])
    
    fig.add_trace(
        go.Scatter(x=df["time"], y=df["Requests"], name="Requests",
                   line=dict(color=config.PRIMARY_COLOR, width=2),
                   fill="tozeroy", fillcolor=config.PRIMARY_COLOR,opacity=0.2),
        secondary_y=False
    )
    
    fig.add_trace(
        go.Scatter(x=df["time"], y=df["Tokens"], name="Tokens",
                   line=dict(color=config.SECONDARY_COLOR, width=2)),
        secondary_y=True
    )
    
    fig.update_layout(
        height=300,
        hovermode="x unified",
        plot_bgcolor="white",
        paper_bgcolor="white",
        font=dict(family="system-ui, -apple-system, sans-serif", size=12, color=config.NEUTRAL_TEXT),
        margin=dict(l=0, r=0, t=20, b=0),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    
    fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor=config.NEUTRAL_BORDER)
    fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor=config.NEUTRAL_BORDER)
    
    return fig

def create_token_distribution_chart(data: list):
    """Create token distribution chart"""
    df_data = []
    for point in data:
        df_data.append({
            "time": point.get("time", ""),
            "Input Tokens": point.get("inputTokens", 0),
            "Output Tokens": point.get("outputTokens", 0)
        })
    
    df = __import__("pandas").DataFrame(df_data)
    
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        x=df["time"], y=df["Input Tokens"],
        name="Input Tokens",
        line=dict(color=config.PRIMARY_COLOR, width=2),
        fill="tozeroy", fillcolor=config.PRIMARY_COLOR,opacity=0.2
    ))
    
    fig.add_trace(go.Scatter(
        x=df["time"], y=df["Output Tokens"],
        name="Output Tokens",
        line=dict(color=config.SECONDARY_COLOR, width=2),
        fill="tozeroy", fillcolor=config.SECONDARY_COLOR,opacity=0.2
    ))
    
    fig.update_layout(
        height=300,
        hovermode="x unified",
        plot_bgcolor="white",
        paper_bgcolor="white",
        font=dict(family="system-ui, -apple-system, sans-serif", size=12, color=config.NEUTRAL_TEXT),
        margin=dict(l=0, r=0, t=20, b=0),

    )
    
    fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor=config.NEUTRAL_BORDER)
    fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor=config.NEUTRAL_BORDER)
    
    return fig

def create_cost_chart(data: list):
    """Create cost over time chart"""
    df_data = []
    for point in data:
        df_data.append({
            "time": point.get("time", ""),
            "Cost": point.get("cost", 0),
            "Requests": point.get("requests", 0)
        })
    
    df = __import__("pandas").DataFrame(df_data)
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        x=df["time"], y=df["Cost"],
        name="Cost",
        marker=dict(color=config.WARNING_COLOR),
        opacity=0.8
    ))
    
    fig.update_layout(
        height=300,
        hovermode="x unified",
        plot_bgcolor="white",
        paper_bgcolor="white",
        font=dict(family="system-ui, -apple-system, sans-serif", size=12, color=config.NEUTRAL_TEXT),
        margin=dict(l=0, r=0, t=20, b=0),
        showlegend=False
    )
    
    fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor=config.NEUTRAL_BORDER)
    fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor=config.NEUTRAL_BORDER)
    
    return fig

def create_latency_chart(data: list):
    """Create latency percentile chart"""
    df_data = []
    for point in data:
        df_data.append({
            "time": point.get("time", ""),
            "P50": point.get("p50", 0),
            "P95": point.get("p95", 0),
            "P99": point.get("p99", 0),
            "Avg": point.get("avg", 0)
        })
    
    df = __import__("pandas").DataFrame(df_data)
    
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        x=df["time"], y=df["P50"],
        name="P50",
        line=dict(color=config.SUCCESS_COLOR, width=2)
    ))
    
    fig.add_trace(go.Scatter(
        x=df["time"], y=df["P95"],
        name="P95",
        line=dict(color=config.WARNING_COLOR, width=2),
        fill="tonexty", fillcolor=config.WARNING_COLOR,opacity=0.1
    ))
    
    fig.add_trace(go.Scatter(
        x=df["time"], y=df["P99"],
        name="P99",
        line=dict(color=config.ERROR_COLOR, width=2),
        fill="tonexty", fillcolor=config.ERROR_COLOR,opacity=0.1
    ))
    
    fig.update_layout(
        height=300,
        hovermode="x unified",
        plot_bgcolor="white",
        paper_bgcolor="white",
        font=dict(family="system-ui, -apple-system, sans-serif", size=12, color=config.NEUTRAL_TEXT),
        margin=dict(l=0, r=0, t=20, b=0)
    )
    
    fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor=config.NEUTRAL_BORDER)
    fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor=config.NEUTRAL_BORDER)
    
    return fig

import streamlit as st

def apply_light_theme():
    """Apply light theme CSS to Streamlit in a clean, maintainable format."""
    st.markdown("""
    <style>
    /* -------------------------
       CSS Variables for Colors
       ------------------------- */
    :root {
        --background-main: #ffffff;
        --background-sidebar: #f8fafc;
        --primary-color: #0ea5e9;
        --primary-hover: #0284c7;
        --text-color-main: #1e293b;
        --text-color-muted: #64748b;
        --sidebar-header: #0FA4E9;
        --button-radius: 6px;
        --button-padding: 8px 16px;
    }

    /* -------------------------
       Global Styles
       ------------------------- */
    * {
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        color: var(--text-color-main);
    }

    .stApp, .main {
        background-color: var(--background-main);
    }

    /* -------------------------
       Sidebar
       ------------------------- */
    [data-testid="stSidebar"] {
        background-color: var(--background-sidebar);
        border-right: 1px solid #e2e8f0;
    }

    [data-testid="stSidebarHeader"] {
        background-color: var(--sidebar-header);
        border-right: 1px solid #e2e8f0;
    }

    /* -------------------------
       Toolbar
       ------------------------- */
    [data-testid="stToolbar"] {
        background-color: var(--primary-color);
        border-right: 1px solid #e2e8f0;
    }

    /* -------------------------
       Headings
       ------------------------- */
    h1, h2, h3 {
        color: var(--text-color-main);
    }

    /* -------------------------
       Text
       ------------------------- */
    p, span, div, [data-testid="stMetricValue"] {
        color: var(--text-color-main);
        
        
    }
     [data-testid="stMetricValue"] {
        white-space: normal !important;      /* Allow multiline */
        overflow: visible !important;         /* Show full content */
        text-overflow: clip !important;       /* No ellipsis */
        color: inherit !important;             /* Default color */
        font-weight: normal !important;        /* Normal weight */
        font-size: 16px !important;             /* Normal size */
        background: none !important;            /* Remove background */
        padding-left: 0 !important;             /* Remove padding from icon */
        display: inline !important;              /* Inline or block as needed */
    }

    [data-testid="stMetricLabel"] {
        color: var(--text-color-muted);
    }

    /* -------------------------
       Buttons
       ------------------------- */
    .stButton > button {
        background-color: var(--primary-color);
        color: white;
        border-radius: var(--button-radius);
        border: none;
        font-weight: 600;
        padding: var(--button-padding);
        transition: background-color 0.2s ease;
    }

    .stButton > button:hover {
        background-color: var(--primary-hover);
    }

    /* -------------------------
       Inputs
       ------------------------- */
    .stTextInput, .stSelectbox, .stMultiSelect {
        background-color: white;
    }
    .stSelectbox select, .stMultiSelect select {
        background-color: white;
        color: #0FA4E9;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 4px 8px;
    }

    /* Dropdown when focused (clicked/active) */
    .st-c5,.stSelectbox select:focus, .stMultiSelect select:focus {
        background-color: #0FA4E9;  /* Light blue background when active */
        border-color: #0ea5e9;       /* Blue border when active */
        outline: none;               /* Remove default outline */
    }

    /* Option hover inside dropdown */
    .st-c5,.stSelectbox select option:hover, .stMultiSelect select option:hover {
        background-color: #bae6fd;
    }

    /* Text color of options */
    .st-c5,.stSelectbox select option, .stMultiSelect select option {
        color: #1e293b;
    }

    /* -------------------------
       Tabs
       ------------------------- */
    .stTabs [data-baseweb="tab"] {
        color: var(--text-color-muted);
        font-weight: 600;
    }

    .stTabs [aria-selected="true"] {
        color: var(--primary-color);
        border-bottom: 3px solid var(--primary-color);
    }
     [data-testid="stSidebarNav"] {
        display: none;  /* Hides the sidebar navigation */
    }
    </style>
    """, unsafe_allow_html=True)

