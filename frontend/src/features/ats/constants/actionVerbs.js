// Powerhouse action verbs favored by ATS scanners and technical recruiters
export const ACTION_VERBS = {
  technical: [
    "architected", "engineered", "developed", "designed", "implemented",
    "programmed", "coded", "configured", "debugged", "deployed", "refactored",
    "containerized", "migrated", "automated", "integrated", "tested", "built"
  ],
  leadership: [
    "spearheaded", "orchestrated", "led", "mentored", "supervised",
    "championed", "directed", "managed", "coordinated", "delegated",
    "facilitated", "guided", "initiated", "empowered"
  ],
  optimization: [
    "optimized", "accelerated", "streamlined", "enhanced", "boosted",
    "reduced", "eliminated", "maximized", "minimized", "scaled",
    "standardized", "transformed", "modernized", "revamped"
  ],
  achievement: [
    "accomplished", "achieved", "delivered", "outperformed", "generated",
    "solved", "pioneered", "awarded", "published", "surpassed", "secured"
  ]
};

// Flattened set for O(1) lookup
export const ALL_ACTION_VERBS = new Set(
  Object.values(ACTION_VERBS).flatMap((list) => list.map((v) => v.toLowerCase()))
);
