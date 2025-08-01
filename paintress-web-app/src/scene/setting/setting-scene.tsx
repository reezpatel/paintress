import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Settings,
  Palette,
  Shield,
  Cloud,
  Edit,
  Code,
  Bell,
  Download,
  Upload,
  Key,
  Database,
  Zap,
  Moon,
  Sun,
  Monitor,
  Save,
  RefreshCw,
  Trash2,
  FileText,
  Type,
  Clipboard,
  Eye,
  Lock,
  Wifi,
  HardDrive,
} from "lucide-react";

export const SettingScene = () => {
  const [settings, setSettings] = useState({
    // General Settings
    autoSave: true,
    saveInterval: 30,
    defaultNoteFormat: "markdown",
    startupBehavior: "restore",
    language: "en",

    // Editor Settings
    fontFamily: "inter",
    fontSize: 14,
    lineHeight: 1.6,
    wordWrap: true,
    showLineNumbers: false,
    tabSize: 2,
    autoComplete: true,
    spellCheck: true,

    // Appearance
    theme: "system",
    colorScheme: "blue",
    density: "comfortable",
    showStatusBar: true,
    showSidebar: true,
    sidebarWidth: 280,

    // Sync & Backup
    autoSync: true,
    syncInterval: 5,
    backupFrequency: "daily",
    maxBackups: 10,
    syncConflictResolution: "manual",

    // Security
    enableEncryption: false,
    lockAfterInactivity: 15,
    requirePasswordOnStart: false,
    twoFactorAuth: false,

    // Advanced
    enableDevMode: false,
    debugLogging: false,
    experimentalFeatures: false,
    apiRateLimit: 100,
    cacheSize: 500,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      // Reset logic would go here
      console.log("Settings reset");
    }
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paintress-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Customize your Paintress experience
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Sync & Backup
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Auto-Save Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when your notes are automatically saved
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Auto-Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes as you type
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) =>
                      updateSetting("autoSave", checked)
                    }
                  />
                </div>

                {settings.autoSave && (
                  <div className="space-y-2">
                    <Label>Save Interval (seconds)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.saveInterval]}
                        onValueChange={(value) =>
                          updateSetting("saveInterval", value[0])
                        }
                        max={120}
                        min={5}
                        step={5}
                        className="flex-1"
                      />
                      <Badge variant="secondary">
                        {settings.saveInterval}s
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Default Settings
                </CardTitle>
                <CardDescription>
                  Set default behaviors for new notes and app startup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Note Format</Label>
                    <Select
                      value={settings.defaultNoteFormat}
                      onValueChange={(value) =>
                        updateSetting("defaultNoteFormat", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="richtext">Rich Text</SelectItem>
                        <SelectItem value="plaintext">Plain Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Startup Behavior</Label>
                    <Select
                      value={settings.startupBehavior}
                      onValueChange={(value) =>
                        updateSetting("startupBehavior", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restore">
                          Restore Last Session
                        </SelectItem>
                        <SelectItem value="blank">
                          Start with Blank Note
                        </SelectItem>
                        <SelectItem value="dashboard">
                          Show Dashboard
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interface Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => updateSetting("language", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Control when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show system notifications for important events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for notifications
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sync Status Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when sync completes or fails
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Editor Settings */}
        <TabsContent value="editor">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Typography
                </CardTitle>
                <CardDescription>
                  Customize the appearance of text in your notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select
                      value={settings.fontFamily}
                      onValueChange={(value) =>
                        updateSetting("fontFamily", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="fira-code">Fira Code</SelectItem>
                        <SelectItem value="source-serif">
                          Source Serif Pro
                        </SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={(value) =>
                          updateSetting("fontSize", value[0])
                        }
                        max={24}
                        min={10}
                        step={1}
                        className="flex-1"
                      />
                      <Badge variant="secondary">{settings.fontSize}px</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Line Height</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.lineHeight]}
                      onValueChange={(value) =>
                        updateSetting("lineHeight", value[0])
                      }
                      max={3}
                      min={1}
                      step={0.1}
                      className="flex-1"
                    />
                    <Badge variant="secondary">{settings.lineHeight}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Editor Behavior
                </CardTitle>
                <CardDescription>
                  Configure how the editor behaves while writing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Word Wrap</Label>
                    <p className="text-sm text-muted-foreground">
                      Wrap long lines to fit the editor width
                    </p>
                  </div>
                  <Switch
                    checked={settings.wordWrap}
                    onCheckedChange={(checked) =>
                      updateSetting("wordWrap", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Line Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Display line numbers in the editor gutter
                    </p>
                  </div>
                  <Switch
                    checked={settings.showLineNumbers}
                    onCheckedChange={(checked) =>
                      updateSetting("showLineNumbers", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Complete</Label>
                    <p className="text-sm text-muted-foreground">
                      Show suggestions while typing
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoComplete}
                    onCheckedChange={(checked) =>
                      updateSetting("autoComplete", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Spell Check</Label>
                    <p className="text-sm text-muted-foreground">
                      Highlight misspelled words
                    </p>
                  </div>
                  <Switch
                    checked={settings.spellCheck}
                    onCheckedChange={(checked) =>
                      updateSetting("spellCheck", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tab Size</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.tabSize]}
                      onValueChange={(value) =>
                        updateSetting("tabSize", value[0])
                      }
                      max={8}
                      min={2}
                      step={2}
                      className="flex-1"
                    />
                    <Badge variant="secondary">{settings.tabSize} spaces</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="w-5 h-5" />
                  Content Handling
                </CardTitle>
                <CardDescription>
                  Configure how content is processed and formatted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Smart Quotes</Label>
                    <p className="text-sm text-muted-foreground">
                      Convert straight quotes to curly quotes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Link URLs</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically convert URLs to clickable links
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Markdown Auto-Formatting</Label>
                    <p className="text-sm text-muted-foreground">
                      Apply formatting as you type markdown syntax
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme & Colors
                </CardTitle>
                <CardDescription>
                  Customize the visual appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => updateSetting("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <Select
                    value={settings.colorScheme}
                    onValueChange={(value) =>
                      updateSetting("colorScheme", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Interface Density</Label>
                  <Select
                    value={settings.density}
                    onValueChange={(value) => updateSetting("density", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Interface Elements
                </CardTitle>
                <CardDescription>
                  Show or hide various interface components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Status Bar</Label>
                    <p className="text-sm text-muted-foreground">
                      Display word count, line info, and other status
                    </p>
                  </div>
                  <Switch
                    checked={settings.showStatusBar}
                    onCheckedChange={(checked) =>
                      updateSetting("showStatusBar", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Sidebar</Label>
                    <p className="text-sm text-muted-foreground">
                      Display the file explorer sidebar
                    </p>
                  </div>
                  <Switch
                    checked={settings.showSidebar}
                    onCheckedChange={(checked) =>
                      updateSetting("showSidebar", checked)
                    }
                  />
                </div>

                {settings.showSidebar && (
                  <div className="space-y-2">
                    <Label>Sidebar Width</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.sidebarWidth]}
                        onValueChange={(value) =>
                          updateSetting("sidebarWidth", value[0])
                        }
                        max={400}
                        min={200}
                        step={20}
                        className="flex-1"
                      />
                      <Badge variant="secondary">
                        {settings.sidebarWidth}px
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sync & Backup Settings */}
        <TabsContent value="sync">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Synchronization
                </CardTitle>
                <CardDescription>
                  Keep your notes synced across all your devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync changes to the cloud
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSync}
                    onCheckedChange={(checked) =>
                      updateSetting("autoSync", checked)
                    }
                  />
                </div>

                {settings.autoSync && (
                  <>
                    <div className="space-y-2">
                      <Label>Sync Interval (minutes)</Label>
                      <div className="flex items-center space-x-4">
                        <Slider
                          value={[settings.syncInterval]}
                          onValueChange={(value) =>
                            updateSetting("syncInterval", value[0])
                          }
                          max={60}
                          min={1}
                          step={1}
                          className="flex-1"
                        />
                        <Badge variant="secondary">
                          {settings.syncInterval}m
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Conflict Resolution</Label>
                      <Select
                        value={settings.syncConflictResolution}
                        onValueChange={(value) =>
                          updateSetting("syncConflictResolution", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">
                            Manual Resolution
                          </SelectItem>
                          <SelectItem value="local">
                            Prefer Local Changes
                          </SelectItem>
                          <SelectItem value="remote">
                            Prefer Remote Changes
                          </SelectItem>
                          <SelectItem value="merge">
                            Auto-Merge When Possible
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sync Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Last synced: 2 minutes ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  Backup Settings
                </CardTitle>
                <CardDescription>
                  Configure automatic backups to protect your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) =>
                      updateSetting("backupFrequency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Backup Files</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.maxBackups]}
                      onValueChange={(value) =>
                        updateSetting("maxBackups", value[0])
                      }
                      max={50}
                      min={5}
                      step={5}
                      className="flex-1"
                    />
                    <Badge variant="secondary">
                      {settings.maxBackups} files
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Manual Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Create a backup of all your notes now
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Create Backup
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Restore from Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Restore notes from a previous backup
                    </p>
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Restore
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Storage Management
                </CardTitle>
                <CardDescription>
                  Monitor and manage your storage usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Storage Used</Label>
                    <span className="text-sm text-muted-foreground">
                      2.4 GB / 10 GB
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "24%" }}
                    ></div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Clear Cache</Label>
                    <p className="text-sm text-muted-foreground">
                      Free up space by clearing temporary files
                    </p>
                  </div>
                  <Button variant="outline">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Data Protection
                </CardTitle>
                <CardDescription>
                  Secure your notes with encryption and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      Encrypt your notes with AES-256 encryption
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableEncryption}
                    onCheckedChange={(checked) =>
                      updateSetting("enableEncryption", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Password on Start</Label>
                    <p className="text-sm text-muted-foreground">
                      Protect app access with a password
                    </p>
                  </div>
                  <Switch
                    checked={settings.requirePasswordOnStart}
                    onCheckedChange={(checked) =>
                      updateSetting("requirePasswordOnStart", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Auto-Lock After Inactivity</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.lockAfterInactivity]}
                      onValueChange={(value) =>
                        updateSetting("lockAfterInactivity", value[0])
                      }
                      max={60}
                      min={5}
                      step={5}
                      className="flex-1"
                    />
                    <Badge variant="secondary">
                      {settings.lockAfterInactivity}m
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  Enhanced security with two-factor authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      updateSetting("twoFactorAuth", checked)
                    }
                  />
                </div>

                {!settings.twoFactorAuth && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-3">
                      Enable 2FA to secure your account with an authenticator
                      app
                    </p>
                    <Button size="sm">Setup Two-Factor Auth</Button>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Change Password</Label>
                    <p className="text-sm text-muted-foreground">
                      Update your account password
                    </p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Active Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      Manage devices with access to your account
                    </p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control how your data is used and shared
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics & Crash Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the app by sharing usage data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and tips
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Retention</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically delete old backups and logs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Developer Options
                </CardTitle>
                <CardDescription>
                  Advanced settings for power users and developers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Developer Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable additional debugging tools and options
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableDevMode}
                    onCheckedChange={(checked) =>
                      updateSetting("enableDevMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Debug Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log detailed information for troubleshooting
                    </p>
                  </div>
                  <Switch
                    checked={settings.debugLogging}
                    onCheckedChange={(checked) =>
                      updateSetting("debugLogging", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Experimental Features</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable beta features (may be unstable)
                    </p>
                  </div>
                  <Switch
                    checked={settings.experimentalFeatures}
                    onCheckedChange={(checked) =>
                      updateSetting("experimentalFeatures", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Tuning
                </CardTitle>
                <CardDescription>
                  Optimize performance for your specific use case
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Rate Limit (requests/minute)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.apiRateLimit]}
                      onValueChange={(value) =>
                        updateSetting("apiRateLimit", value[0])
                      }
                      max={1000}
                      min={10}
                      step={10}
                      className="flex-1"
                    />
                    <Badge variant="secondary">
                      {settings.apiRateLimit}/min
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cache Size (MB)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.cacheSize]}
                      onValueChange={(value) =>
                        updateSetting("cacheSize", value[0])
                      }
                      max={2000}
                      min={100}
                      step={100}
                      className="flex-1"
                    />
                    <Badge variant="secondary">{settings.cacheSize}MB</Badge>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Clear All Caches</Label>
                    <p className="text-sm text-muted-foreground">
                      Reset all cached data and restart fresh
                    </p>
                  </div>
                  <Button variant="outline">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Import, export, and manage your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>Export All Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Download all your notes and settings
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Import Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Import notes from other applications
                    </p>
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-destructive">
                  <div>
                    <Label className="text-destructive">Delete All Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete all notes and settings
                    </p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between p-0">
        <p className="text-sm text-muted-foreground">
          Settings are automatically saved as you make changes
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardFooter>
    </div>
  );
};
