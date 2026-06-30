export function formatTimeAgo(
  date: string | Date | null
): string {
  if (!date) return "Unknown";

  const now = new Date();
  const targetDate = new Date(date);

  const diffMs =
    now.getTime() - targetDate.getTime();

  const minutes = Math.floor(
    diffMs / (1000 * 60)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${
      minutes !== 1 ? "s" : ""
    } ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${
      hours !== 1 ? "s" : ""
    } ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} day${
      days !== 1 ? "s" : ""
    } ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} month${
      months !== 1 ? "s" : ""
    } ago`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} year${
      years !== 1 ? "s" : ""
    } ago`;
  }

  return `${years} year${
    years !== 1 ? "s" : ""
  } ${remainingMonths} month${
    remainingMonths !== 1 ? "s" : ""
  } ago`;
}