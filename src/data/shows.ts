import battleWinnerImage from "../assets/images/Battle of the band winner.jpg";
import devotionalUnforumImage from "../assets/Devotional Unforum.png";

export const upcomingShows = [
  {
    title: "BYU Battle of the Bands 2026",
    slug: "byu-battle-of-the-bands-2026",
    status: "announced",
    startsAt: "2026-03-28T19:00:00-06:00",
    venue: "BYU Marriott Center",
    city: "Provo",
    state: "Utah",
    ticketUrl: "https://sclcenter.byu.edu/battle-of-the-bands",
    flyerUrl: battleWinnerImage.src,
    summary: "The Filibusters take the stage at BYU Battle of the Bands 2026.",
    body: [
      "The Filibusters bring a loud, emotionally direct live set to the BYU Marriott Center for Battle of the Bands 2026.",
      "Expect a high-energy room, crowd-sing moments, and a set built to feel immediate in person."
    ],
    lineup: ["The Filibusters"],
    notes: "Doors and event timing should be confirmed with the venue."
  },
  {
    title: "Devotional: Unforum",
    slug: "devotional-unforum-2026-04-14",
    status: "announced",
    startsAt: "2026-04-14T11:05:00-06:00",
    venue: "Marriott Center",
    city: "Provo",
    state: "Utah",
    ticketUrl: "https://calendar.byu.edu/devotionals-forums/devotional-unforum-2026-04-14",
    flyerUrl: devotionalUnforumImage.src,
    summary: "The Filibusters appear at BYU's Devotional: Unforum on Tuesday, April 14.",
    body: [
      "The Filibusters are part of BYU's Devotional: Unforum at the Marriott Center on Tuesday, April 14 from 11:05 AM to 12:00 PM.",
      "Unforum is described by BYU as a student-centered year in review celebrating student successes, performances, service, and achievements."
    ],
    lineup: ["The Filibusters"],
    notes: "Event details are based on the BYU Events Calendar listing and should be confirmed with BYU before attending."
  }
] as const;
