import streamlit as st
from lib.api_client import api_client
from lib.ui_helpers import apply_light_theme
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
    col1, col2 = st.columns([2, 3])
    with col1:
        status_filter = st.selectbox(
            "Filter by Status",
            ["all", "active", "idle", "error"],
            key="agent_status_filter"
        )
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
        # Grid view using Streamlit components
        if agents:
            cols = st.columns(3)
            for idx, agent in enumerate(agents):
                with cols[idx % 3]:
                    # Card-like container using st.container()
                    with st.container():
                        # Agent Header
                        status_color = (
                            config.SUCCESS_COLOR
                            if agent["status"] == "active"
                            else config.WARNING_COLOR
                        )
                        st.markdown(f"**{agent['name']}**")
                        st.markdown(f"*{agent['type']}*")
                        st.markdown(f"<span style='color:{status_color}'>{agent['status'].upper()}</span>",
                                    unsafe_allow_html=True)

                        # Metrics
                        st.metric("Requests", agent["totalRequests"])
                        st.metric("Success Rate", f"{agent['successRate']:.1f}%", delta=None)
                        st.metric("Avg Latency", f"{agent['avgLatency']}ms")
                        st.metric("Total Cost", f"${agent['totalCost']:.2f}")

                        # Connection status
                        connection_status = "Connected to Orchestrator" if agent[
                            "isConnectedToOrchestrator"] else "Not connected"
                        st.caption(connection_status)

                        # View Details button
                        if st.button("View Details", key=f"agent_detail_{agent['id']}"):
                            st.session_state.selected_agent_id = agent['id']
                            st.session_state.page = "agent_detail"
        else:
            st.info("No agents found matching the filters.")

    with tab2:
        # Detailed table view
        st.markdown("### All Agents Performance")

        if agents:
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
                        st.session_state.page = "agent_analytics"
        else:
            st.info("No agents to display in detailed view.")
