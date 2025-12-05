import streamlit as st
from lib.api_client import api_client
from lib.ui_helpers import render_stat_card, apply_light_theme
import config

def render():
    apply_light_theme()
    
    st.markdown("## 🤖 Agents")
    st.markdown("Monitor all active agents and their performance metrics")
    st.divider()
    
    # Get agents data
    agents_data = api_client.get_agents()
    agents = agents_data.get("agents", [])
    
    # Filters
    col1, col2, col3 = st.columns([2, 2, 2])
    with col1:
        status_filter = st.selectbox("Filter by Status", ["all", "active", "idle", "error"], key="agent_status_filter")
    with col2:
        search = st.text_input("Search agents...", placeholder="e.g., Research Agent")
    
    # Re-fetch if filters changed
    if status_filter != "all" or search:
        agents_data = api_client.get_agents(status=status_filter, search=search)
        agents = agents_data.get("agents", [])
    
    st.markdown(f"### Found {len(agents)} Agents")
    
    # Tabs for view modes
    tab1, tab2 = st.tabs(["📋 Grid View", "📊 Detailed View"])
    
    with tab1:
        # Grid view
        cols = st.columns(3)
        for idx, agent in enumerate(agents):
            with cols[idx % 3]:
                status_color = config.SUCCESS_COLOR if agent["status"] == "active" else config.WARNING_COLOR
                
                st.markdown(f"""
                <div style='background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); padding: 16px; border-radius: 12px; border: 1px solid {config.NEUTRAL_BORDER}; cursor: pointer;'>
                    <div style='display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;'>
                        <div>
                            <div style='font-weight: 700; color: {config.NEUTRAL_TEXT}; font-size: 14px;'>{agent["name"]}</div>
                            <div style='font-size: 11px; color: #94a3b8;'>{agent["type"]}</div>
                        </div>
                        <div style='display: inline-block; padding: 4px 10px; border-radius: 20px; background-color: {status_color}20; color: {status_color}; font-size: 10px; font-weight: 700;'>{agent["status"].upper()}</div>
                    </div>
                    
                    <div style='background: white; padding: 12px; border-radius: 8px; margin-bottom: 12px;'>
                        <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 8px;'>
                            <div>
                                <div style='font-size: 10px; color: #94a3b8; font-weight: 600;'>REQUESTS</div>
                                <div style='font-size: 16px; font-weight: 700; color: {config.NEUTRAL_TEXT};'>{agent["totalRequests"]}</div>
                            </div>
                            <div>
                                <div style='font-size: 10px; color: #94a3b8; font-weight: 600;'>SUCCESS RATE</div>
                                <div style='font-size: 16px; font-weight: 700; color: {config.SUCCESS_COLOR};'>{agent["successRate"]:.1f}%</div>
                            </div>
                            <div>
                                <div style='font-size: 10px; color: #94a3b8; font-weight: 600;'>LATENCY</div>
                                <div style='font-size: 16px; font-weight: 700; color: {config.PRIMARY_COLOR};'>{agent["avgLatency"]}ms</div>
                            </div>
                            <div>
                                <div style='font-size: 10px; color: #94a3b8; font-weight: 600;'>COST</div>
                                <div style='font-size: 16px; font-weight: 700; color: {config.WARNING_COLOR};'>${agent["totalCost"]:.2f}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style='display: flex; gap: 6px; align-items: center; font-size: 12px; color: #64748b;'>
                        <span>🔗</span>
                        <span>{'Connected to Orchestrator' if agent["isConnectedToOrchestrator"] else 'Not connected'}</span>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                if st.button("View Details", key=f"agent_detail_{agent['id']}", use_container_width=True):
                    st.session_state.selected_agent_id = agent['id']
                    st.session_state.page = "agent_detail"
    
    with tab2:
        # Detailed table view
        st.markdown("### All Agents Performance")
        
        for agent in agents:
            with st.expander(f"🤖 {agent['name']} - {agent['status'].upper()}"):
                col1, col2, col3, col4 = st.columns(4)
                
                with col1:
                    st.metric("Total Requests", agent["totalRequests"])
                
                with col2:
                    st.metric("Success Rate", f"{agent['successRate']:.1f}%")
                
                with col3:
                    st.metric("Avg Latency", f"{agent['avgLatency']}ms")
                
                with col4:
                    st.metric("Total Cost", f"${agent['totalCost']:.2f}")
                
                st.markdown(f"""
                **Description:** {agent['description']}
                
                **Model:** {agent['model']}
                
                **Last Active:** {agent['lastActive']}
                """)
                
                if st.button("View Full Analytics", key=f"analytics_{agent['id']}"):
                    st.session_state.selected_agent_id = agent['id']
