<#
.SYNOPSIS
  Feeds the Chief agent's daily briefing into the sfnext-docs "Daily Report" tab.

.DESCRIPTION
  Three modes - exactly one is required:

    -Publish       Local mode (the Chief agent / local scheduling). Copies the day's briefing
                   from $ReportsDir (<Date>.md) into src/data/daily-reports/, commits it and
                   pushes main. The push triggers deploy.yml, which publishes the site.

    -FromDispatch  Runner mode (.github/workflows/daily-report.yml). Writes the
                   repository_dispatch payload ($env:REPORT_DATE, $env:REPORT_MARKDOWN) into
                   src/data/daily-reports/, commits and pushes.

    -Verify        Runner mode (.github/workflows/daily-report-pipeline.yml). Asserts that
                   src/data/daily-reports/<Date>.md exists and is non-empty, i.e. the feed
                   chain (Chief -> push) worked that day. A non-zero exit gives the pipeline
                   a red X, which is the signal that the morning report did not land.

  Every mode is idempotent: re-publishing an unchanged report is a clean no-op.

.EXAMPLE
  pwsh -NoProfile -File scripts/feed-daily-report.ps1 -Publish
  pwsh -NoProfile -File scripts/feed-daily-report.ps1 -Verify -Date 2026-11-26
#>
param(
    [switch]$Publish,
    [switch]$FromDispatch,
    [switch]$Verify,
    # Report date (YYYY-MM-DD). Defaults to today when empty - important for pipeline runs,
    # where an unset workflow_dispatch input arrives as an empty string.
    [string]$Date,
    # Repo root defaults to the parent of this script's scripts/ directory.
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
    # Where the Chief agent saves its consolidated briefings. Only -Publish uses this, and only
    # on the local Windows machine. Resolved lazily in the -Publish branch because default
    # parameter values are evaluated eagerly on every invocation - and $env:USERPROFILE does
    # not exist on Linux runners, which would crash even -Verify runs before any logic ran.
    [string]$ReportsDir = ''
)

$ErrorActionPreference = 'Stop'

if (-not $Date) { $Date = (Get-Date -Format 'yyyy-MM-dd') }
if ($Date -notmatch '^\d{4}-\d{2}-\d{2}$') {
    Write-Error "Date must be YYYY-MM-DD, got: '$Date'"
    exit 2
}

$modeCount = @($Publish, $FromDispatch, $Verify) | Where-Object { $_ } | Measure-Object | ForEach-Object { $_.Count }
if ($modeCount -ne 1) {
    Write-Error 'Specify exactly one of -Publish, -FromDispatch, -Verify.'
    exit 2
}

$reportsFolder = Join-Path $RepoRoot 'src/data/daily-reports'
$targetFile = Join-Path $reportsFolder "$Date.md"

function Invoke-Git {
    param([string[]]$GitArgs)
    & git -C $RepoRoot @GitArgs
    if ($LASTEXITCODE -ne 0) {
        throw "git $($GitArgs -join ' ') failed with exit code $LASTEXITCODE"
    }
}

function Publish-Report {
    param([string]$Markdown)

    New-Item -ItemType Directory -Force $reportsFolder | Out-Null

    if (Test-Path $targetFile) {
        $existing = [System.IO.File]::ReadAllText($targetFile)
        if ($existing -eq $Markdown) {
            Write-Output "ALREADY-PUBLISHED: $Date report is unchanged; nothing to do."
            return
        }
    }

    # Exact bytes, UTF-8 without BOM - works on both Windows PowerShell and pwsh.
    [System.IO.File]::WriteAllText($targetFile, $Markdown, [System.Text.UTF8Encoding]::new($false))

    Invoke-Git @('add', 'src/data/daily-reports')
    $dirty = & git -C $RepoRoot status --porcelain 'src/data/daily-reports'
    if ($dirty) {
        Invoke-Git @('commit', '-m', "chore(daily-report): publish $Date briefing")
        Invoke-Git @('push', 'origin', 'main')
        Write-Output "PUBLISHED: $targetFile committed and pushed (deploy.yml deploys the site)."
    }
    else {
        Write-Output 'NO-CHANGES: staged content matched HEAD; nothing to commit.'
    }
}

if ($Publish) {
    if (-not $ReportsDir) {
        $homeDir = if ($env:USERPROFILE) { $env:USERPROFILE } elseif ($env:HOME) { $env:HOME } else { '' }
        if (-not $homeDir) {
            Write-Error 'PUBLISH-FAILED: cannot locate the Chief reports directory (USERPROFILE/HOME both unset).'
            exit 1
        }
        $ReportsDir = Join-Path $homeDir '.config/opencode/reports/chief'
    }
    $sourceFile = Join-Path $ReportsDir "$Date.md"
    if (-not (Test-Path $sourceFile)) {
        Write-Error "PUBLISH-FAILED: no Chief report for $Date at $sourceFile. Run the Chief daily briefing first."
        exit 1
    }
    $markdown = [System.IO.File]::ReadAllText($sourceFile)
    Publish-Report -Markdown $markdown
}
elseif ($FromDispatch) {
    $payloadDate = $env:REPORT_DATE
    $payloadMarkdown = $env:REPORT_MARKDOWN
    if (-not $payloadDate -or -not $payloadMarkdown) {
        Write-Error 'FromDispatch requires REPORT_DATE (YYYY-MM-DD) and REPORT_MARKDOWN in the environment.'
        exit 2
    }
    if ($payloadDate -notmatch '^\d{4}-\d{2}-\d{2}$') {
        Write-Error "REPORT_DATE must be YYYY-MM-DD, got: '$payloadDate'"
        exit 2
    }
    Publish-Report -Markdown $payloadMarkdown
}
elseif ($Verify) {
    if (-not (Test-Path $targetFile)) {
        Write-Output "VERIFY-FAILED: no daily report for $Date at $targetFile."
        Write-Output 'The Chief publish step did not land today - check the local Chief run / scheduled task.'
        exit 1
    }
    $size = (Get-Item $targetFile).Length
    if ($size -lt 1) {
        Write-Output "VERIFY-FAILED: $targetFile exists but is empty."
        exit 1
    }
    Write-Output "VERIFY-OK: $targetFile ($size bytes) - the feed chain worked today."
}
