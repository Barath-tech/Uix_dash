import streamlit as st
from lib.api_client import api_client
from lib.ui_helpers import render_stat_card, apply_light_theme, create_activity_chart, render_agent_badge
import config

def render():
    apply_light_theme()
    
    st.markdown("## 📊 Overview")
    st.markdown("Real-time system metrics and agent activity")
    st.divider()
    
    # Get stats
    stats = api_client.get_overview_stats()
    activity = api_client.get_overview_activity()
    orchestrator = api_client.get_orchestrator_status()
    agents = api_client.get_agents()
    logs = api_client.get_logs(limit=5)
    
    # Key metrics row
    st.markdown("### Key Metrics")
    col1, col2, col3, col4 = st.columns(4)
    
    render_stat_card(col1, "Active Agents", str(stats.get("activeAgents", 0)), 
                    f"of {stats.get('totalAgents', 0)}", "🤖", config.SUCCESS_COLOR)
    render_stat_card(col2, "Success Rate", f"{stats.get('successRate', 0):.1f}%", 
                    "+2.5% from yesterday", "✅", config.SUCCESS_COLOR)
    render_stat_card(col3, "Avg Latency", f"{stats.get('avgLatency', 0)}ms", 
                    "-15ms from avg", "⚡", config.PRIMARY_COLOR)
    render_stat_card(col4, "Total Cost", f"${stats.get('totalCost', 0):.2f}", 
                    f"{stats.get('totalTokens', 0):,} tokens", "💰", config.WARNING_COLOR)
    
    st.divider()
    
    # Activity chart
    st.markdown("### Activity Over 24 Hours")
    if activity and activity.get("data"):
        fig = create_activity_chart(activity.get("data", []))
        st.plotly_chart(fig, use_container_width=True)
    
    st.divider()
    
    # Agent status and recent activity
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 🤖 Agent Status")
        agent_list = agents.get("agents", [])
        
        for agent in agent_list[:6]:
            status_color = config.SUCCESS_COLOR if agent["status"] == "active" else config.WARNING_COLOR
            st.markdown(f"""
            <div style='background: white; padding: 12px; border-radius: 8px; border: 1px solid {config.NEUTRAL_BORDER}; margin-bottom: 8px;'>
                <div style='display: flex; justify-content: space-between; align-items: center;'>
                    <div>
                        <div style='font-weight: 600; color: {config.NEUTRAL_TEXT};'>{agent["name"]}</div>
                        <div style='font-size: 12px; color: #94a3b8; margin-top: 2px;'>{agent["totalRequests"]} requests</div>
                    </div>
                    <div style='text-align: right;'>
                        <div style='display: inline-block; padding: 4px 8px; border-radius: 6px; background-color: {status_color}20; color: {status_color}; font-size: 11px; font-weight: 600;'>{agent["status"].upper()}</div>
                        <div style='font-size: 12px; color: #94a3b8; margin-top: 4px;'>{agent["successRate"]:.1f}% success</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("### 📝 Recent Logs")
        log_list = logs.get("logs", [])
        
        for log in log_list[:6]:
            level_colors = {
                "info": "#0369a1",
                "warning": "#b45309",
                "error": "#991b1b",
                "debug": "#374151"
            }
            level_color = level_colors.get(log.get("level", "info"), "#0369a1")
            status_color = config.SUCCESS_COLOR if log["status"] == "success" else config.ERROR_COLOR
            
            st.markdown(f"""
            <div style='background: white; padding: 12px; border-radius: 8px; border: 1px solid {config.NEUTRAL_BORDER}; margin-bottom: 8px;'>
                <div style='display: flex; gap: 8px; align-items: start;'>
                    <div style='padding: 2px 6px; border-radius: 4px; background-color: {level_color}20; color: {level_color}; font-size: 10px; font-weight: 600; white-space: nowrap;'>{log["level"].upper()}</div>
                    <div style='flex: 1;'>
                        <div style='font-size: 12px; color: {config.NEUTRAL_TEXT}; font-weight: 500;'>{log["message"][:50]}</div>
                        <div style='font-size: 11px; color: #94a3b8; margin-top: 2px;'>{log["timestamp"]}</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
