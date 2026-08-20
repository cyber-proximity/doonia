<style>
/* ═══════════════════════════════════════════════
   Doonnia Admin Panel — Custom Dark Sidebar Theme
   ═══════════════════════════════════════════════ */

/* ── Sidebar background ─────────────────────── */
.fi-sidebar {
    background-color: #14172b !important;
    border-right: none !important;
}

.fi-sidebar-header {
    background-color: #14172b !important;
    border-bottom: 1px solid rgba(255,255,255,0.06) !important;
    padding: 20px 16px !important;
}

.fi-sidebar-footer {
    background-color: #14172b !important;
    border-top: 1px solid rgba(255,255,255,0.06) !important;
}

.fi-sidebar-nav {
    background-color: #14172b !important;
    padding: 8px 12px !important;
}

/* ── Brand name ─────────────────────────────── */
.fi-brand-name,
.fi-sidebar-header .fi-brand-name,
.fi-logo .fi-brand-name {
    color: #ffffff !important;
    font-weight: 800 !important;
    font-size: 1.25rem !important;
    letter-spacing: -0.3px !important;
}

/* ── Navigation group labels ────────────────── */
.fi-nav-group-label,
[class*="fi-nav-group"] > :first-child {
    color: rgba(255,255,255,0.32) !important;
    font-size: 0.65rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    padding-left: 8px !important;
    margin-top: 8px !important;
    margin-bottom: 4px !important;
}

/* ── Nav item text & icon ───────────────────── */
.fi-nav-item-button,
.fi-nav-item > a,
.fi-nav-item > button {
    color: rgba(255,255,255,0.58) !important;
    border-radius: 8px !important;
    padding: 7px 12px !important;
    transition: background 0.15s, color 0.15s !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
}

.fi-nav-item-button svg,
.fi-nav-item > a svg,
.fi-nav-item > button svg {
    color: inherit !important;
    opacity: 0.8 !important;
}

/* ── Hover state ────────────────────────────── */
.fi-nav-item-button:hover,
.fi-nav-item > a:hover,
.fi-nav-item > button:hover {
    background-color: rgba(255,255,255,0.06) !important;
    color: rgba(255,255,255,0.9) !important;
}

/* ── Active nav item ────────────────────────── */
.fi-nav-item-button[aria-current],
.fi-nav-item-button[aria-current="page"],
.fi-active .fi-nav-item-button,
.fi-nav-item > a[aria-current],
.fi-nav-item > a[aria-current="page"] {
    background-color: rgba(0,181,200,0.16) !important;
    color: #00B5C8 !important;
    font-weight: 600 !important;
}

.fi-nav-item-button[aria-current] svg,
.fi-nav-item-button[aria-current="page"] svg,
.fi-active .fi-nav-item-button svg {
    color: #00B5C8 !important;
    opacity: 1 !important;
}

/* ── Sidebar scrollbar ──────────────────────── */
.fi-sidebar-nav::-webkit-scrollbar { width: 3px; }
.fi-sidebar-nav::-webkit-scrollbar-track { background: transparent; }
.fi-sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

/* ── Account widget in footer ───────────────── */
.fi-sidebar-footer .fi-account-name,
.fi-sidebar-footer .fi-wi-account-widget-name {
    color: rgba(255,255,255,0.85) !important;
}
.fi-sidebar-footer .fi-account-email,
.fi-sidebar-footer .fi-wi-account-widget-email {
    color: rgba(255,255,255,0.42) !important;
    font-size: 0.72rem !important;
}

/* ── Main content area polish ───────────────── */
.fi-main-ctn {
    background-color: #f4f6fb !important;
}

.fi-header-heading {
    font-weight: 700 !important;
    font-size: 1.35rem !important;
    color: #111827 !important;
}

/* ── Topbar ─────────────────────────────────── */
.fi-topbar {
    background-color: #ffffff !important;
    border-bottom: 1px solid #e5e7eb !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
}

/* ── Stats overview cards ───────────────────── */
.fi-wi-stats-overview-stat {
    border-radius: 14px !important;
    border: 1px solid #e5e7eb !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05) !important;
}

/* ── Table styles ───────────────────────────── */
.fi-ta-ctn {
    border-radius: 14px !important;
    border: 1px solid #e5e7eb !important;
    overflow: hidden !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04) !important;
}

.fi-ta-header-ctn {
    background-color: #ffffff !important;
    border-bottom: 1px solid #f3f4f6 !important;
    padding: 16px 20px !important;
}

/* ── Panels / cards ─────────────────────────── */
.fi-section {
    border-radius: 14px !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05) !important;
}

/* ── Badges / status pills ──────────────────── */
.fi-badge {
    border-radius: 20px !important;
    font-weight: 600 !important;
    font-size: 0.7rem !important;
    padding: 3px 10px !important;
    letter-spacing: 0.02em !important;
}

/* ── Buttons ────────────────────────────────── */
.fi-btn-primary {
    border-radius: 10px !important;
    font-weight: 600 !important;
}

/* ── Widgets container ──────────────────────── */
.fi-wi {
    background-color: #ffffff !important;
    border-radius: 14px !important;
    border: 1px solid #e5e7eb !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05) !important;
}
</style>
