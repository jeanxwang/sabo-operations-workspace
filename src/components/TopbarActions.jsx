import { useState } from "react";
import { Bell, CircleHelp, Inbox } from "lucide-react";
import "./TopbarActions.css";

export default function TopbarActions({ notifications = [] }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const hasNotifications = notifications.length > 0;

  return (
    <div className="topbar-actions">
      <div className="topbar-notification-wrapper">
        <button
          type="button"
          className="topbar-action-button"
          aria-label="Notifikasi"
          aria-expanded={notificationsOpen}
          aria-controls="topbar-notifications"
          onClick={() => setNotificationsOpen((isOpen) => !isOpen)}
        >
          <Bell size={19} />
          {hasNotifications && <span className="notification-dot" aria-hidden="true" />}
        </button>

        {notificationsOpen && (
          <section
            id="topbar-notifications"
            className="topbar-notification-popover"
            aria-label="Notifikasi"
          >
            <div className="topbar-notification-header">
              <strong>Notifikasi</strong>
              <span>{notifications.length}</span>
            </div>

            {hasNotifications ? (
              <ul className="topbar-notification-list">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="topbar-notification-empty">
                <Inbox size={18} />
                <span>Belum ada notifikasi baru.</span>
              </div>
            )}
          </section>
        )}
      </div>

      <a
        className="topbar-action-button"
        href="mailto:platform@schoters.com?subject=Bantuan SABO Operations"
        aria-label="Bantuan Platform Team"
        title="Hubungi Platform Team"
      >
        <CircleHelp size={19} />
      </a>
    </div>
  );
}
