function getOffsetMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return Math.round((asUtc - date.getTime()) / 60000);
}

function formatOffset(minutes) {
  const sign = minutes >= 0 ? "+" : "-";
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const mins = String(absolute % 60).padStart(2, "0");
  return `${sign}${hours}:${mins}`;
}

const now = new Date();
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
});
const parts = Object.fromEntries(
  formatter
    .formatToParts(now)
    .filter((part) => part.type !== "literal")
    .map((part) => [part.type, part.value])
);
const offsetMinutes = getOffsetMinutes(now, timeZone);

console.log(JSON.stringify({
  local_iso: `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${formatOffset(offsetMinutes)}`,
  utc_iso: now.toISOString(),
  date: `${parts.year}-${parts.month}-${parts.day}`,
  time: `${parts.hour}:${parts.minute}:${parts.second}`,
  day: parts.weekday,
  timezone: timeZone,
  utc_offset: formatOffset(offsetMinutes),
  unix_seconds: Math.floor(now.getTime() / 1000)
}, null, 2));
