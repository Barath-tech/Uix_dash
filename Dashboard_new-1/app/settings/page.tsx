"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { API_CONFIG } from "@/lib/api"
import { Check, Copy } from "lucide-react"

export default function SettingsPage() {
  const [copied, setCopied] = useState(false)
  const [settings, setSettings] = useState({
    apiUrl: API_CONFIG.BASE_URL,
    wsUrl: API_CONFIG.WS_URL,
    enableRealtime: true,
    enableNotifications: true,
    logRetention: "7",
    costAlertThreshold: "50",
    latencyAlertThreshold: "3000",
  })

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" subtitle="Configure your dashboard" />

      <div className="p-6 space-y-6">
        <Tabs defaultValue="connection" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">API Configuration</CardTitle>
                <CardDescription>Configure the connection to your Python multi-agent backend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">API Base URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apiUrl"
                      value={settings.apiUrl}
                      onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
                      placeholder="http://localhost:8000"
                      className="font-mono bg-secondary"
                    />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(settings.apiUrl)}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">The base URL for your multi-agent API server</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wsUrl">WebSocket URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="wsUrl"
                      value={settings.wsUrl}
                      onChange={(e) => setSettings({ ...settings, wsUrl: e.target.value })}
                      placeholder="ws://localhost:8000"
                      className="font-mono bg-secondary"
                    />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(settings.wsUrl)}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">WebSocket URL for real-time log streaming</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label>Enable Real-time Updates</Label>
                    <p className="text-xs text-muted-foreground">Connect to WebSocket for live log streaming</p>
                  </div>
                  <Switch
                    checked={settings.enableRealtime}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableRealtime: checked })}
                  />
                </div>

                <div className="pt-4">
                  <Button>Save Connection Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">API Endpoints Reference</CardTitle>
                <CardDescription>Available endpoints in your centralized API layer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  {Object.entries(API_CONFIG.ENDPOINTS).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 rounded bg-muted/50">
                      <span className="text-muted-foreground">{key}</span>
                      <Badge variant="secondary" className="font-mono">
                        {typeof value === "function" ? `${value("{id}")}` : value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Alert Thresholds</CardTitle>
                <CardDescription>Configure when to receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="costThreshold">Daily Cost Alert ($)</Label>
                  <Input
                    id="costThreshold"
                    type="number"
                    value={settings.costAlertThreshold}
                    onChange={(e) => setSettings({ ...settings, costAlertThreshold: e.target.value })}
                    className="bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">Alert when daily cost exceeds this amount</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latencyThreshold">Latency Alert (ms)</Label>
                  <Input
                    id="latencyThreshold"
                    type="number"
                    value={settings.latencyAlertThreshold}
                    onChange={(e) => setSettings({ ...settings, latencyAlertThreshold: e.target.value })}
                    className="bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">Alert when average latency exceeds this threshold</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label>Enable Notifications</Label>
                    <p className="text-xs text-muted-foreground">Show in-app notifications for alerts</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                  />
                </div>

                <div className="pt-4">
                  <Button>Save Alert Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data Preferences</CardTitle>
                <CardDescription>Configure data retention and display settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logRetention">Log Retention (days)</Label>
                  <Input
                    id="logRetention"
                    type="number"
                    value={settings.logRetention}
                    onChange={(e) => setSettings({ ...settings, logRetention: e.target.value })}
                    className="bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">How long to keep logs in the dashboard</p>
                </div>

                <div className="pt-4">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
