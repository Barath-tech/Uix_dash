import streamlit as st
from lib.api_client import api_client
from lib.ui_helpers import apply_light_theme
import config

def render():
    apply_light_theme()
    
    st.markdown("## 📝 Logs")
    st.markdown("Real-time logs from all agents")
    st.divider()
    
    # Filters
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        level_filter = st.selectbox("Log Level", ["all", "info", "warning", "error", "debug"], key="log_level")
    
    with col2:
        status_filter = st.selectbox("Status", ["all", "success", "error", "pending"], key="log_status")
    
    with col3:
        limit = st.number_input("Show last", min_value=10, max_value=200, value=50, step=10)
    
    with col4:
        search = st.text_input("Search logs...", placeholder="Search...")
    
    # Get logs
    logs_data = api_client.get_logs(
        limit=limit,
        level=level_filter,
        status=status_filter,
        search=search
    )
    logs = logs_data.get("logs", [])
    
    st.markdown(f"### Showing {len(logs)} Logs (Total: {logs_data.get('total', 0)})")
    
    # Display logs
    st.markdown(f"""
    <div style='background: white; border: 1px solid {config.NEUTRAL_BORDER}; border-radius: 12px; overflow: hidden;'>
    """, unsafe_allow_html=True)
    
    for log in logs:
        level_colors = {
            "info": ("#0369a1", "#d0f0ff"),
            "warning": ("#b45309", "#fef3c7"),
            "error": ("#991b1b", "#fee2e2"),
            "debug": ("#374151", "#f3f4f6")
        }
        
        level_text_color, level_bg_color = level_colors.get(log.get("level", "info"), ("#0369a1", "#d0f0ff"))
        status_color = config.SUCCESS_COLOR if log["status"] == "success" else config.ERROR_COLOR
        
        with st.expander(f"[{log['level'].upper()}] {log['message'][:60]} - {log['timestamp']}"):
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.markdown(f"**Agent:** {log.get('agentName', 'N/A')}")
                st.markdown(f"**Trace ID:** `{log.get('traceId', 'N/A')}`")
                st.markdown(f"**Level:** {log.get('level', 'N/A').upper()}")
            
            with col2:
                st.markdown(f"**Input Tokens:** {log.get('inputTokens', 0)}")
                st.markdown(f"**Output Tokens:** {log.get('outputTokens', 0)}")
                st.markdown(f"**Total Tokens:** {log.get('totalTokens', 0)}")
            
            with col3:
                st.markdown(f"**Latency:** {log.get('latency', 0)}ms")
                st.markdown(f"**Cost:** ${log.get('cost', 0):.6f}")
                st.markdown(f"**Status:** {log.get('status', 'N/A').upper()}")
            
            st.divider()
            
            if log.get('input'):
                st.markdown("**Input:**")
                st.code(log.get('input', 'N/A')[:200] + "...", language="text")
            
            if log.get('output'):
                st.markdown("**Output:**")
                st.code(log.get('output', 'N/A')[:200] + "...", language="text")
            
            if log.get('metadata'):
                st.markdown("**Metadata:**")
                st.json(log.get('metadata', {}))
    
    st.markdown("</div>", unsafe_allow_html=True)
