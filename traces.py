import streamlit as st
from lib.api_client import api_client
from lib.ui_helpers import apply_light_theme
import config
from datetime import datetime

def render():
    apply_light_theme()
    
    st.markdown("## 🔗 Traces")
    st.markdown("Session and execution traces from your agents")
    st.divider()
    
    # Filters
    col1, col2 = st.columns([2, 2])
    with col1:
        status_filter = st.selectbox("Filter by Status", ["all", "completed", "error", "active"], key="trace_status")
    with col2:
        limit = st.number_input("Show last", min_value=5, max_value=100, value=20)
    
    # Get traces
    traces_data = api_client.get_traces(limit=limit)
    traces = traces_data.get("traces", [])
    
    st.markdown(f"### Found {len(traces)} Traces (Total: {traces_data.get('total', 0)})")
    
    # Display traces
    for trace in traces:
        status_color = config.SUCCESS_COLOR if trace["status"] == "completed" else config.ERROR_COLOR
        
        with st.expander(f"🔗 {trace['name']} - {trace['status'].upper()} - {trace.get('totalSpans', 0)} spans"):
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.metric("Duration", f"{trace.get('duration', 0) / 1000:.2f}s")
            
            with col2:
                st.metric("Total Tokens", f"{trace.get('totalTokens', 0):,}")
            
            with col3:
                st.metric("Total Cost", f"${trace.get('totalCost', 0):.4f}")
            
            with col4:
                st.metric("Agents", len(trace.get("agents", [])))
            
            st.divider()
            
            st.markdown(f"""
            **Start Time:** {trace.get('startTime', 'N/A')}
            
            **Agents Involved:** {', '.join(trace.get('agents', []))}
            
            **Metadata:**
            """)
            st.json(trace.get('metadata', {}))
