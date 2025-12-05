import streamlit as st
from lib.api_client import api_client
from lib.ui_helpers import apply_light_theme, create_token_distribution_chart, create_cost_chart, create_latency_chart
import config

def render():
    apply_light_theme()
    
    st.markdown("## 📊 Metrics")
    st.markdown("Detailed analytics and performance metrics")
    st.divider()
    
    # Time period selector
    col1, col2 = st.columns([3, 1])
    with col2:
        period = st.selectbox("Period", ["1h", "6h", "24h", "7d", "30d"], key="metrics_period")
    
    st.divider()
    
    # Get metrics data
    tokens_data = api_client.get_metrics_tokens(period)
    costs_data = api_client.get_metrics_costs(period)
    latency_data = api_client.get_metrics_latency(period)
    agents_data = api_client.get_agents()
    
    tab1, tab2, tab3, tab4 = st.tabs(["📊 Token Usage", "💰 Costs", "⚡ Latency", "🤖 Agent Stats"])
    
    with tab1:
        st.markdown("### Token Usage Over Time")
        
        if tokens_data and tokens_data.get("data"):
            totals = tokens_data.get("totals", {})
            
            col1, col2, col3 = st.columns(3)
            col1.metric("Input Tokens", f"{totals.get('inputTokens', 0):,}")
            col2.metric("Output Tokens", f"{totals.get('outputTokens', 0):,}")
            col3.metric("Total Tokens", f"{totals.get('totalTokens', 0):,}")
            
            st.divider()
            
            fig = create_token_distribution_chart(tokens_data.get("data", []))
            st.plotly_chart(fig, use_container_width=True)
    
    with tab2:
        st.markdown("### Costs Over Time")
        
        if costs_data and costs_data.get("data"):
            totals = costs_data.get("totals", {})
            
            col1, col2 = st.columns(2)
            col1.metric("Total Cost", f"${totals.get('cost', 0):.2f}")
            col2.metric("Total Requests", f"{totals.get('requests', 0):,}")
            
            st.divider()
            
            fig = create_cost_chart(costs_data.get("data", []))
            st.plotly_chart(fig, use_container_width=True)
    
    with tab3:
        st.markdown("### Latency Percentiles")
        
        if latency_data and latency_data.get("data"):
            summary = latency_data.get("summary", {})
            
            col1, col2, col3, col4 = st.columns(4)
            col1.metric("Avg Latency", f"{summary.get('avg', 0)}ms")
            col2.metric("P95", f"{summary.get('p95', 0)}ms")
            col3.metric("P99", f"{summary.get('p99', 0)}ms")
            col4.metric("Max", f"{summary.get('max', 0)}ms")
            
            st.divider()
            
            fig = create_latency_chart(latency_data.get("data", []))
            st.plotly_chart(fig, use_container_width=True)
    
    with tab4:
        st.markdown("### Per-Agent Performance")
        
        agents = agents_data.get("agents", [])
        
        for agent in agents:
            col1, col2, col3, col4 = st.columns(4)
            
            col1.metric(f"{agent['name']} - Requests", agent["totalRequests"])
            col2.metric(f"Success Rate", f"{agent['successRate']:.1f}%")
            col3.metric(f"Latency", f"{agent['avgLatency']}ms")
            col4.metric(f"Cost", f"${agent['totalCost']:.2f}")
            
            st.divider()
