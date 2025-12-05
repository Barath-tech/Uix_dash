import streamlit as st
from lib.api_client import api_client
from lib.ui_helpers import apply_light_theme
import config
from datetime import datetime

# Define color palette
CARD_BG = "#f0f8ff"  # AliceBlue / soft sky blue
CARD_BORDER = "#dbeaf7"
TEXT_PRIMARY = "#1e3a8a"  # dark sky blue
TEXT_SECONDARY = "#64748b"  # neutral grey
SUCCESS_COLOR = "#16a34a"  # green
ERROR_COLOR = "#dc2626"  # red
WARNING_COLOR = "#facc15"  # yellow


def render():
    apply_light_theme()

    st.markdown("<h2 style='color:{};'>🔗 Traces</h2>".format(TEXT_PRIMARY), unsafe_allow_html=True)
    st.markdown("<p style='color:{};'>Session and execution traces from your agents</p>".format(TEXT_SECONDARY),
                unsafe_allow_html=True)
    st.divider()

    # Filters
    col1, col2 = st.columns([2, 2])
    with col1:
        status_filter = st.selectbox(
            "Filter by Status",
            ["all", "completed", "error", "active"],
            key="trace_status"
        )
    with col2:
        limit = st.number_input(
            "Show last",
            min_value=5, max_value=100, value=20
        )

    # Fetch traces
    traces_data = api_client.get_traces(limit=limit)
    traces = traces_data.get("traces", [])

    # Local filtering by status
    if status_filter != "all":
        traces = [t for t in traces if t.get("status") == status_filter]

    st.markdown(
        f"<h4 style='color:{TEXT_PRIMARY};'>Found {len(traces)} Traces (Total: {traces_data.get('total', 0)})</h4>",
        unsafe_allow_html=True)

    # Display traces as card-like expanders
    if traces:
        for trace in traces:
            # Determine status color
            status_color = (
                SUCCESS_COLOR if trace.get("status") == "completed"
                else ERROR_COLOR if trace.get("status") == "error"
                else WARNING_COLOR
            )

            # Card container
            with st.container():
                st.markdown(
                    f"""
                    <div style='background-color:{CARD_BG}; border:1px solid {CARD_BORDER}; border-radius:12px; padding:16px; margin-bottom:12px;'>
                        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;'>
                            <div style='color:{TEXT_PRIMARY}; font-weight:700;'>{trace.get('name', 'N/A')}</div>
                            <div style='color:{status_color}; font-weight:700;'>{trace.get('status', 'N/A').upper()}</div>
                        </div>
                    </div>
                    """, unsafe_allow_html=True
                )

                # Expander for details
                expander_label = f"Details - {trace.get('totalSpans', 0)} spans"
                with st.expander(expander_label):
                    col1, col2, col3, col4 = st.columns(4)

                    with col1:
                        duration_sec = trace.get('duration', 0) / 1000
                        st.metric("Duration", f"{duration_sec:.2f}s")

                    with col2:
                        st.metric("Total Tokens", f"{trace.get('totalTokens', 0):,}")

                    with col3:
                        st.metric("Total Cost", f"${trace.get('totalCost', 0):.4f}")

                    with col4:
                        st.metric("Agents", len(trace.get("agents", [])))

                    st.divider()

                    # Additional details
                    start_time = trace.get('startTime')
                    if start_time:
                        try:
                            start_time = datetime.fromisoformat(start_time).strftime("%Y-%m-%d %H:%M:%S")
                        except ValueError:
                            pass
                    st.markdown(f"**Start Time:** {start_time or 'N/A'}")

                    agents_involved = trace.get('agents', [])
                    st.markdown(f"**Agents Involved:** {', '.join(agents_involved) if agents_involved else 'None'}")

                    # Metadata section
                    metadata = trace.get('metadata', {})
                    st.markdown("**Metadata:**")
                    if metadata:
                        st.json(metadata)
                    else:
                        st.info("No metadata available")
    else:
        st.info("No traces found with the selected filters.")
