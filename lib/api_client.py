import requests
import pandas as pd
from typing import Dict, List, Any, Optional
import config

class APIClient:
    def __init__(self, base_url: str = config.API_BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()

    def get_overview_stats(self) -> Dict[str, Any]:
        """Get overall system statistics"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/overview/stats")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_overview_stats()

    def get_overview_activity(self, period: str = "24h") -> Dict[str, Any]:
        """Get activity data for charts"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/v1/overview/activity",
                params={"period": period}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_activity_data()

    def get_agents(self, status: str = "all", search: str = "") -> Dict[str, Any]:
        """Get list of all agents"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/v1/agents",
                params={"status": status, "search": search}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_agents()

    def get_agent_detail(self, agent_id: str) -> Dict[str, Any]:
        """Get detailed agent information"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/agents/{agent_id}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_agent_detail(agent_id)

    def get_logs(self, limit: int = 50, offset: int = 0, level: str = "all",
                 status: str = "all", agent_id: str = "", search: str = "") -> Dict[str, Any]:
        """Get paginated logs"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/v1/logs",
                params={
                    "limit": limit,
                    "offset": offset,
                    "level": level,
                    "status": status,
                    "agentId": agent_id,
                    "search": search
                }
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_logs()

    def get_log_detail(self, log_id: str) -> Dict[str, Any]:
        """Get detailed log entry"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/logs/{log_id}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {}

    def get_traces(self, limit: int = 20, offset: int = 0) -> Dict[str, Any]:
        """Get list of traces"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/v1/traces",
                params={"limit": limit, "offset": offset}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_traces()

    def get_trace_detail(self, trace_id: str) -> Dict[str, Any]:
        """Get detailed trace"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/traces/{trace_id}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {}

    def get_metrics_tokens(self, period: str = "24h") -> Dict[str, Any]:
        """Get token usage metrics"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/v1/metrics/tokens",
                params={"period": period}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_metrics_tokens()

    def get_metrics_costs(self, period: str = "24h") -> Dict[str, Any]:
        """Get cost metrics"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/v1/metrics/costs",
                params={"period": period}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_metrics_costs()

    def get_metrics_latency(self, period: str = "24h") -> Dict[str, Any]:
        """Get latency metrics"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/v1/metrics/latency",
                params={"period": period}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_metrics_latency()

    def get_orchestrator_status(self) -> Dict[str, Any]:
        """Get orchestrator status"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/orchestrator/status")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return self._mock_orchestrator_status()

    def get_health(self) -> Dict[str, Any]:
        """Get system health"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/health")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"status": "unhealthy", "version": "unknown"}

    # Mock data methods for development
    @staticmethod
    def _mock_overview_stats() -> Dict[str, Any]:
        return {
            "totalAgents": 8,
            "activeAgents": 6,
            "totalRequests": 15847,
            "successRate": 98.5,
            "totalTokens": 2458900,
            "totalCost": 45.67,
            "avgLatency": 245,
            "activeTraces": 23
        }

    @staticmethod
    def _mock_activity_data() -> Dict[str, Any]:
        import random
        hours = [f"{i:02d}:00" for i in range(24)]
        return {
            "data": [
                {
                    "time": h,
                    "requests": random.randint(50, 200),
                    "tokens": random.randint(5000, 15000),
                    "cost": round(random.uniform(0.1, 0.5), 3)
                }
                for h in hours
            ]
        }

    @staticmethod
    def _mock_agents() -> Dict[str, Any]:
        agents = [
            {"id": "agent-001", "name": "Research Agent", "type": "researcher", "status": "active",
             "description": "Handles web research", "model": "gpt-4", "lastActive": "2024-01-15T10:30:00Z",
             "totalRequests": 1250, "successRate": 99.2, "avgLatency": 320, "totalTokens": 450000,
             "totalCost": 12.50, "isConnectedToOrchestrator": True, "currentTask": "Analyzing trends"},
            {"id": "agent-002", "name": "Analysis Agent", "type": "analyzer", "status": "active",
             "description": "Data analysis", "model": "gpt-4", "lastActive": "2024-01-15T10:25:00Z",
             "totalRequests": 850, "successRate": 98.9, "avgLatency": 280, "totalTokens": 320000,
             "totalCost": 9.80, "isConnectedToOrchestrator": True, "currentTask": "Processing dataset"},
            {"id": "agent-003", "name": "Writer Agent", "type": "writer", "status": "idle",
             "description": "Content writing", "model": "gpt-3.5-turbo", "lastActive": "2024-01-15T10:00:00Z",
             "totalRequests": 650, "successRate": 97.5, "avgLatency": 200, "totalTokens": 250000,
             "totalCost": 5.20, "isConnectedToOrchestrator": False, "currentTask": None},
        ]
        return {"agents": agents, "total": len(agents), "active": 2}

    @staticmethod
    def _mock_agent_detail(agent_id: str) -> Dict[str, Any]:
        return {
            "id": agent_id,
            "name": "Research Agent",
            "type": "researcher",
            "status": "active",
            "description": "Handles web research and data gathering",
            "model": "gpt-4",
            "lastActive": "2024-01-15T10:30:00Z",
            "createdAt": "2024-01-01T00:00:00Z",
            "metrics": {
                "totalRequests": 1250,
                "successRate": 99.2,
                "avgLatency": 320,
                "totalTokens": 450000,
                "inputTokens": 200000,
                "outputTokens": 250000,
                "totalCost": 12.50,
                "errorCount": 10
            },
            "recentActivity": [{"time": f"{i:02d}:00", "requests": 45, "tokens": 5600}
                              for i in range(24)]
        }

    @staticmethod
    def _mock_logs() -> Dict[str, Any]:
        import random
        logs = [
            {
                "id": f"log-{i:03d}",
                "timestamp": f"2024-01-15T{random.randint(0,23):02d}:{random.randint(0,59):02d}:00Z",
                "level": random.choice(["info", "warning", "error"]),
                "message": f"Task execution completed",
                "agentId": f"agent-{random.randint(1,3):03d}",
                "agentName": random.choice(["Research", "Analysis", "Writer"]),
                "traceId": f"trace-{random.randint(1,100):03d}",
                "inputTokens": random.randint(50, 500),
                "outputTokens": random.randint(100, 1000),
                "totalTokens": random.randint(200, 1500),
                "latency": random.randint(100, 5000),
                "cost": round(random.uniform(0.001, 0.1), 4),
                "status": random.choice(["success", "error"]),
                "metadata": {"taskType": "research", "sources": random.randint(1, 10)}
            }
            for i in range(50)
        ]
        return {"logs": logs, "total": 15847, "hasMore": True}

    @staticmethod
    def _mock_traces() -> Dict[str, Any]:
        import random
        traces = [
            {
                "id": f"trace-{i:03d}",
                "name": f"User Query Session {i}",
                "startTime": f"2024-01-15T{random.randint(0,23):02d}:{random.randint(0,59):02d}:00Z",
                "duration": random.randint(1000, 300000),
                "status": random.choice(["completed", "error"]),
                "totalSpans": random.randint(1, 10),
                "totalTokens": random.randint(500, 5000),
                "totalCost": round(random.uniform(0.01, 0.5), 3),
                "agents": random.sample(["agent-001", "agent-002", "agent-003"], k=random.randint(1, 2))
            }
            for i in range(20)
        ]
        return {"traces": traces, "total": 500, "hasMore": True}

    @staticmethod
    def _mock_metrics_tokens() -> Dict[str, Any]:
        import random
        return {
            "data": [
                {
                    "time": f"2024-01-15T{i:02d}:00:00Z",
                    "inputTokens": random.randint(5000, 50000),
                    "outputTokens": random.randint(10000, 80000),
                    "totalTokens": random.randint(20000, 100000)
                }
                for i in range(24)
            ]
        }

    @staticmethod
    def _mock_metrics_costs() -> Dict[str, Any]:
        import random
        return {
            "data": [
                {
                    "time": f"2024-01-15T{i:02d}:00:00Z",
                    "cost": round(random.uniform(0.5, 5), 2),
                    "requests": random.randint(50, 500)
                }
                for i in range(24)
            ]
        }

    @staticmethod
    def _mock_metrics_latency() -> Dict[str, Any]:
        import random
        return {
            "data": [
                {
                    "time": f"2024-01-15T{i:02d}:00:00Z",
                    "avg": random.randint(200, 400),
                    "p50": random.randint(150, 300),
                    "p95": random.randint(400, 800),
                    "p99": random.randint(800, 1500)
                }
                for i in range(24)
            ]
        }

    @staticmethod
    def _mock_orchestrator_status() -> Dict[str, Any]:
        return {
            "status": "active",
            "uptime": 86400000,
            "connectedAgents": ["agent-001", "agent-002"],
            "pendingTasks": 3,
            "activeTasks": 2,
            "completedTasks": 1547,
            "queueLength": 5
        }

api_client = APIClient()
