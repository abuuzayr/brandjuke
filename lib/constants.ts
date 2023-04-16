export const FADE_IN_ANIMATION_SETTINGS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};

export const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export enum INDUSTRIES {
  "Agriculture, forestry, fishing, and hunting",
  "Mining, quarrying, and oil and gas extraction",
  "Utilities",
  "Construction",
  "Manufacturing",
  "Wholesale trade",
  "Retail trade",
  "Transportation and warehousing",
  "Information and cultural industries",
  "Finance and insurance",
  "Real estate and rental and leasing",
  "Professional, scientific and technical services",
  "Management of companies and enterprises",
  "Administrative and support, waste management, and remediation services",
  "Educational services",
  "Health care and social assistance",
  "Arts, entertainment, and recreation",
  "Accommodation and food services",
  "Other services(except public administration)",
  "Public administration",
}