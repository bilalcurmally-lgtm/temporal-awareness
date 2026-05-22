$now = Get-Date
$utc = $now.ToUniversalTime()
$offset = [System.TimeZoneInfo]::Local.GetUtcOffset($now)
$offsetSign = if ($offset.TotalMinutes -ge 0) { "+" } else { "-" }
$offsetText = "{0}{1:00}:{2:00}" -f $offsetSign, [Math]::Abs($offset.Hours), [Math]::Abs($offset.Minutes)

$payload = [ordered]@{
  local_iso = $now.ToString("yyyy-MM-ddTHH:mm:ssK")
  utc_iso = $utc.ToString("yyyy-MM-ddTHH:mm:ssZ")
  date = $now.ToString("yyyy-MM-dd")
  time = $now.ToString("HH:mm:ss")
  day = $now.DayOfWeek.ToString()
  timezone = [System.TimeZoneInfo]::Local.Id
  utc_offset = $offsetText
  unix_seconds = [DateTimeOffset]$now | ForEach-Object { $_.ToUnixTimeSeconds() }
}

$payload | ConvertTo-Json -Depth 3
