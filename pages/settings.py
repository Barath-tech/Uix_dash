import streamlit as st
from lib.api_client import api_client
from lib.ui_helpers import apply_light_theme
import config

def render():
    apply_light_theme()
    
    st.markdown("## ⚙️ Settings")
    st.markdown("Configure your monitoring dashboard")
    st.divider()
    
    # API Configuration
    st.markdown("### API Configuration")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Base URL**")
        base_url = st.text_input("API Base URL", value=config.API_BASE_URL, 
                                placeholder="http://localhost:8000")
        st.markdown("*Where your Python backend is running*")
    
    with col2:
        st.markdown("**WebSocket URL**")
        ws_url = st.text_input("WebSocket URL", value=config.API_WS_URL,
                              placeholder="ws://localhost:8000")
        st.markdown("*For real-time log streaming*")
    
    if st.button("Save Configuration", use_container_width=True):
        st.session_state.api_base_url = base_url
        st.session_state.api_ws_url = ws_url
        st.success("Configuration saved! Refresh the page to apply changes.")
    
    st.divider()
    
    # Health Status
    st.markdown("### System Health")
    
    health = api_client.get_health()
    orchestrator = api_client.get_orchestrator_status()
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        health_status = health.get("status", "unknown")
        color = config.SUCCESS_COLOR if health_status == "healthy" else config.ERROR_COLOR
        st.markdown(f"""
        <div style='background: {color}20; padding: 16px; border-radius: 8px; border: 1px solid {color};'>
            <div style='color: {color}; font-weight: 700;'>API Status</div>
            <div style='color: {color}; font-size: 14px; margin-top: 4px;'>{health_status.upper()}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        orch_status = orchestrator.get("status", "unknown")
        color = config.SUCCESS_COLOR if orch_status == "active" else config.ERROR_COLOR
        st.markdown(f"""
        <div style='background: {color}20; padding: 16px; border-radius: 8px; border: 1px solid {color};'>
            <div style='color: {color}; font-weight: 700;'>Orchestrator</div>
            <div style='color: {color}; font-size: 14px; margin-top: 4px;'>{orch_status.upper()}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        connected = len(orchestrator.get("connectedAgents", []))
        st.markdown(f"""
        <div style='background: {config.PRIMARY_COLOR}20; padding: 16px; border-radius: 8px; border: 1px solid {config.PRIMARY_COLOR};'>
            <div style='color: {config.PRIMARY_COLOR}; font-weight: 700;'>Connected Agents</div>
            <div style='color: {config.PRIMARY_COLOR}; font-size: 14px; margin-top: 4px;'>{connected} agents</div>
        </div>
        """, unsafe_allow_html=True)
    
    st.divider()
    
    # API Endpoints Reference
    st.markdown("### API Endpoints Reference")
    
    with st.expander("View All Endpoints", expanded=False):
        endpoints = {
            "Overview": [
                "GET /api/v1/overview/stats",
                "GET /api/v1/overview/activity"
            ],
            "Agents": [
                "GET /api/v1/agents",
                "GET /api/v1/agents/:id",
                "GET /api/v1/agents/:id/logs"
            ],
            "Logs": [
                "GET /api/v1/logs",
                "GET /api/v1/logs/:id"
            ],
            "Traces": [
                "GET /api/v1/traces",
                "GET /api/v1/traces/:id"
            ],
            "Metrics": [
                "GET /api/v1/metrics/tokens",
                "GET /api/v1/metrics/costs",
                "GET /api/v1/metrics/latency"
            ]
        }
        
        for category, eps in endpoints.items():
            st.markdown(f"#### {category}")
            for ep in eps:
                st.code(ep, language="http")
