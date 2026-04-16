import test from "node:test";
import assert from "node:assert/strict";
import { partitionShowsByDate, isPastShow } from "../src/lib/shows/schedule.js";

const shows = [
  {
    slug: "battle",
    startsAt: "2026-03-28T19:00:00-06:00"
  },
  {
    slug: "unforum",
    startsAt: "2026-04-14T11:05:00-06:00",
    endsAt: "2026-04-14T12:00:00-06:00"
  },
  {
    slug: "festival",
    startsAt: "2026-06-20T21:30:00-06:00"
  }
];

test("treats a show as past once its end time has passed", () => {
  assert.equal(
    isPastShow(shows[1], new Date("2026-04-14T12:01:00-06:00")),
    true
  );
});

test("splits shows into upcoming and past buckets around a reference date", () => {
  const result = partitionShowsByDate(shows, new Date("2026-04-15T09:00:00-06:00"));

  assert.deepEqual(
    result.upcoming.map((show) => show.slug),
    ["festival"]
  );
  assert.deepEqual(
    result.past.map((show) => show.slug),
    ["unforum", "battle"]
  );
});
