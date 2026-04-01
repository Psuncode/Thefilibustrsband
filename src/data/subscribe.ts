import { siteMeta } from "./site";

export const subscribePage = {
  eyebrow: "Subscribe",
  title: "Get the emails worth opening.",
  description:
    "New music, important show dates, merch when it is real, and the updates that matter enough to send directly.",
  promise: [
    "New releases and big band moments first",
    "Upcoming shows and ticket links when they go live",
    "Merch and major announcements without inbox clutter"
  ],
  note:
    `Simple on purpose: one email field, one list, and no extra friction. If the direct signup is not active yet, email ${siteMeta.contactEmail} and the band will add you manually.`,
  form: {
    emailLabel: "Email address",
    submitLabel: "Subscribe",
    fallbackLabel: "Email the band instead"
  }
} as const;
