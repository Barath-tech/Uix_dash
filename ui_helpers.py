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
                   fill="tozeroy", fillcolor=f"{config.PRIMARY_COLOR}20"),
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
        fill="tozeroy", fillcolor=f"{config.PRIMARY_COLOR}20"
    ))
    
    fig.add_trace(go.Scatter(
        x=df["time"], y=df["Output Tokens"],
        name="Output Tokens",
        line=dict(color=config.SECONDARY_COLOR, width=2),
        fill="tozeroy", fillcolor=f"{config.SECONDARY_COLOR}20"
    ))
    
    fig.update_layout(
        height=300,
        hovermode="x unified",
        plot_bgcolor="white",
        paper_bgcolor="white",
        font=dict(family="system-ui, -apple-system, sans-serif", size=12, color=config.NEUTRAL_TEXT),
        margin=dict(l=0, r=0, t=20, b=0),
        stackgroup="one"
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
        fill="tonexty", fillcolor=f"{config.WARNING_COLOR}10"
    ))
    
    fig.add_trace(go.Scatter(
        x=df["time"], y=df["P99"],
        name="P99",
        line=dict(color=config.ERROR_COLOR, width=2),
        fill="tonexty", fillcolor=f"{config.ERROR_COLOR}10"
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

def apply_light_theme():
    """Apply light theme CSS to Streamlit"""
    st.markdown("""
    <style>
    * {
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    }
    
    .stApp {
        background-color: #ffffff;
    }
    
    .main {
        background-color: #ffffff;
    }
    
    [data-testid="stSidebar"] {
        background-color: #f8fafc;
        border-right: 1px solid #e2e8f0;
    }
    
    h1, h2, h3 {
        color: #1e293b;
    }
    
    p, span, div {
        color: #1e293b;
    }
    
    [data-testid="stMetricValue"] {
        color: #1e293b;
    }
    
    [data-testid="stMetricLabel"] {
        color: #64748b;
    }
    
    .stButton > button {
        background-color: #0ea5e9;
        color: white;
        border-radius: 6px;
        border: none;
        font-weight: 600;
        padding: 8px 16px;
    }
    
    .stButton > button:hover {
        background-color: #0284c7;
    }
    
    .stSelectbox, .stMultiSelect {
        background-color: white;
    }
    
    .stTextInput {
        background-color: white;
    }
    
    .stTabs [data-baseweb="tab"] {
        color: #64748b;
        font-weight: 600;
    }
    
    .stTabs [aria-selected="true"] {
        color: #0ea5e9;
        border-bottom: 3px solid #0ea5e9;
    }
    </style>
    """, unsafe_allow_html=True)
