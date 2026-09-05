import { useEffect, useState } from "react";

function Settings() {
  const defaultSettings = {
    analystName: "Analyst",
    email: "analyst@fingraph.com",
    notifications: true,
    criticalAlerts: true,
    investigationUpdates: true,
    autoRefresh: true,
    refreshInterval: "30",
    riskThreshold: "High",
    theme: "Dark",
  };

  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings =
        localStorage.getItem("finGraphSettings");

      return savedSettings
        ? JSON.parse(savedSettings)
        : defaultSettings;
    } catch (error) {
      console.error(
        "Error loading settings:",
        error
      );

      return defaultSettings;
    }
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.body.classList.toggle(
      "light-theme",
      settings.theme === "Light"
    );
  }, [settings.theme]);

  const handleChange = (field, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "finGraphSettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleReset = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      "finGraphSettings",
      JSON.stringify(defaultSettings)
    );

    setSaved(false);
  };

  return (
    <div className="page-container">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="page-header">

        <div>
          <h2>Settings</h2>

          <p>
            Manage your FinGraph preferences,
            notifications, and system configuration.
          </p>
        </div>

      </div>

      {/* =====================================
          PROFILE
      ====================================== */}

      <div className="settings-grid">

        <div className="investigation-panel settings-card">

          <div className="panel-header">
            <div>
              <h3>👤 Analyst Profile</h3>

              <small>
                Manage your analyst information.
              </small>
            </div>
          </div>

          <div className="settings-form">

            <div className="form-group">

              <label>
                Analyst Name
              </label>

              <input
                type="text"
                value={settings.analystName}
                onChange={(e) =>
                  handleChange(
                    "analystName",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  handleChange(
                    "email",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* =====================================
            NOTIFICATIONS
        ====================================== */}

        <div className="investigation-panel settings-card">

          <div className="panel-header">
            <div>
              <h3>🔔 Notifications</h3>

              <small>
                Configure fraud alert notifications.
              </small>
            </div>
          </div>

          <div className="settings-options">

            <label className="setting-option">

              <div>
                <strong>
                  Enable Notifications
                </strong>

                <small>
                  Receive fraud monitoring alerts.
                </small>
              </div>

              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  handleChange(
                    "notifications",
                    e.target.checked
                  )
                }
              />

            </label>

            <label className="setting-option">

              <div>
                <strong>
                  Critical Alerts
                </strong>

                <small>
                  Notify when critical fraud is detected.
                </small>
              </div>

              <input
                type="checkbox"
                checked={settings.criticalAlerts}
                onChange={(e) =>
                  handleChange(
                    "criticalAlerts",
                    e.target.checked
                  )
                }
              />

            </label>

            <label className="setting-option">

              <div>
                <strong>
                  Investigation Updates
                </strong>

                <small>
                  Receive investigation status updates.
                </small>
              </div>

              <input
                type="checkbox"
                checked={settings.investigationUpdates}
                onChange={(e) =>
                  handleChange(
                    "investigationUpdates",
                    e.target.checked
                  )
                }
              />

            </label>

          </div>

        </div>

        {/* =====================================
            FRAUD MONITORING
        ====================================== */}

        <div className="investigation-panel settings-card">

          <div className="panel-header">

            <div>
              <h3>🛡️ Fraud Monitoring</h3>

              <small>
                Configure monitoring sensitivity.
              </small>
            </div>

          </div>

          <div className="settings-form">

            <div className="form-group">

              <label>
                Risk Threshold
              </label>

              <select
                value={settings.riskThreshold}
                onChange={(e) =>
                  handleChange(
                    "riskThreshold",
                    e.target.value
                  )
                }
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Critical">
                  Critical
                </option>

              </select>

              <small className="field-help">
                Minimum risk level that requires attention.
              </small>

            </div>

            <div className="form-group">

              <label>
                Auto Refresh
              </label>

              <select
                value={settings.refreshInterval}
                onChange={(e) =>
                  handleChange(
                    "refreshInterval",
                    e.target.value
                  )
                }
              >

                <option value="15">
                  Every 15 seconds
                </option>

                <option value="30">
                  Every 30 seconds
                </option>

                <option value="60">
                  Every 1 minute
                </option>

                <option value="300">
                  Every 5 minutes
                </option>

              </select>

            </div>

            <label className="setting-option">

              <div>
                <strong>
                  Enable Auto Refresh
                </strong>

                <small>
                  Automatically refresh monitoring data.
                </small>
              </div>

              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) =>
                  handleChange(
                    "autoRefresh",
                    e.target.checked
                  )
                }
              />

            </label>

          </div>

        </div>

        {/* =====================================
            APPEARANCE
        ====================================== */}

        <div className="investigation-panel settings-card">

          <div className="panel-header">

            <div>
              <h3>🎨 Appearance</h3>

              <small>
                Customize your dashboard appearance.
              </small>
            </div>

          </div>

          <div className="settings-form">

            <div className="form-group">

              <label>
                Theme
              </label>

              <select
                value={settings.theme}
                onChange={(e) =>
                  handleChange(
                    "theme",
                    e.target.value
                  )
                }
              >

                <option value="Dark">
                  Dark
                </option>

                <option value="Light">
                  Light
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          ACTION BUTTONS
      ====================================== */}

      <div className="settings-actions">

        <button
          className="secondary-btn"
          onClick={handleReset}
        >
          Reset Settings
        </button>

        <button
          className="primary-btn"
          onClick={handleSave}
        >
          Save Settings
        </button>

      </div>

      {saved && (
        <div className="settings-success">
          ✅ Settings saved successfully.
        </div>
      )}

    </div>
  );
}

export default Settings;