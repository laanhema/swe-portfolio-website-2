const blogDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (dateString: string): string =>
  blogDateFormatter.format(new Date(dateString));
