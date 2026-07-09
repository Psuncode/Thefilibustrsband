// When a show has no explicit end time, assume it runs ~3 hours from the start so
// it stays "upcoming" while it's happening instead of flipping to past at doors.
const DEFAULT_SHOW_DURATION_MS = 3 * 60 * 60 * 1000;

const getShowBoundary = (show) => {
  if (show.endsAt) return new Date(show.endsAt);
  return new Date(new Date(show.startsAt).getTime() + DEFAULT_SHOW_DURATION_MS);
};

export const isPastShow = (show, referenceDate = new Date()) => {
  return getShowBoundary(show) < referenceDate;
};

export const partitionShowsByDate = (shows, referenceDate = new Date()) => {
  const upcoming = [];
  const past = [];

  for (const show of shows) {
    if (isPastShow(show, referenceDate)) {
      past.push(show);
      continue;
    }

    upcoming.push(show);
  }

  upcoming.sort((left, right) => new Date(left.startsAt) - new Date(right.startsAt));
  past.sort((left, right) => new Date(right.startsAt) - new Date(left.startsAt));

  return { upcoming, past };
};
