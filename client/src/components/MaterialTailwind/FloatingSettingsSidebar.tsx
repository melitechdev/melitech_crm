import React, { useState } from "react";
import { Settings, X, Bell, Eye, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingSettingsSidebarProps {
  onThemeChange?: (theme: "light" | "dark") => void;
  onNotificationsToggle?: (enabled: boolean) => void;
}

export function FloatingSettingsSidebar({
  onThemeChange,
  onNotificationsToggle,
}: FloatingSettingsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const handleNotificationsToggle = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    onNotificationsToggle?.(newState);
  };

  return (
    <>
      {/* Floating Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
          "hover:shadow-xl hover:from-blue-600 hover:to-blue-700",
          isOpen && "scale-110"
        )}
        style={{ opacity: 0.85 }}
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Pop-out Right Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-40 transition-transform duration-300 ease-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-center justify-between border-b border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Appearance
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange("light")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all",
                  theme === "light"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                <Sun className="w-4 h-4" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all",
                  theme === "dark"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                <Moon className="w-4 h-4" />
                <span className="text-sm font-medium">Dark</span>
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-3 border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Notifications
            </h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Enable Notifications
                  </p>
                  <p className="text-xs text-slate-500">
                    Get real-time updates
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleNotificationsToggle}
                className="w-5 h-5 rounded cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Visibility Section */}
          <div className="space-y-3 border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Visibility
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">
                    Show Sidebar
                  </span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded cursor-pointer accent-blue-500"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">
                    Show Statistics
                  </span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="space-y-3 border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Account
            </h3>
            <Button
              variant="outline"
              className="w-full justify-center text-slate-700 hover:bg-slate-50"
            >
              Profile Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center text-slate-700 hover:bg-slate-50"
            >
              Help & Support
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center text-red-600 hover:bg-red-50 border-red-200"
            >
              Logout
            </Button>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-6 mt-6">
            <p className="text-xs text-slate-500 text-center">
              Melitech CRM v1.0.0
            </p>
            <p className="text-xs text-slate-400 text-center mt-1">
              © 2025 Melitech Solutions
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

