import streamlit as st
from pages import overview, agents, logs, metrics, traces, settings
from lib.ui_helpers import apply_light_theme
import config

# Page config
st.set_page_config(
    page_title=config.APP_NAME,
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Apply light theme
apply_light_theme()

# Initialize session state
if 'page' not in st.session_state:
    st.session_state.page = 'overview'

# Sidebar navigation
with st.sidebar:
    st.markdown(f"## {config.APP_NAME}")
    st.markdown(config.APP_DESCRIPTION)
    st.divider()
    
    pages = {
        "📊 Overview": "overview",
        "🤖 Agents": "agents",
        "📝 Logs": "logs",
        "📊 Metrics": "metrics",
        "🔗 Traces": "traces",
        "⚙️ Settings": "settings"
    }
    
    selected = st.radio("Navigation", list(pages.keys()), key="nav")
    st.session_state.page = pages[selected]
    
    st.divider()
    
    # System status
    st.markdown("### System Status")
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Status", "🟢 Active")
    with col2:
        st.metric("API", "Connected")

# Main content
if st.session_state.page == 'overview':
    overview.render()
elif st.session_state.page == 'agents':
    agents.render()
elif st.session_state.page == 'logs':
    logs.render()
elif st.session_state.page == 'metrics':
    metrics.render()
elif st.session_state.page == 'traces':
    traces.render()
elif st.session_state.page == 'settings':
    settings.render()

# Footer
st.divider()
st.markdown("""
<div style='text-align: center; color: #94a3b8; font-size: 12px;'>
    <p>Multi-Agent Monitor • Powered by Streamlit</p>
</div>
""", unsafe_allow_html=True)
