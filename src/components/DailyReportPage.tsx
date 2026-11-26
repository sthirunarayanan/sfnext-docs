import { useState } from 'react';
import { marked } from 'marked';
import { ReportPasswordGate } from './ReportPasswordGate';

interface DailyReportPageProps {
    onBack: () => void;
}

/**
 * All daily briefings dropped into src/data/daily-reports/<YYYY-MM-DD>.md by Chief (manually or
 * via the daily-report.yml workflow). Picked up at build time with import.meta.glob so adding a
 * file is the whole publish process - no codegen, no index to maintain.
 */
const reportModules = import.meta.glob('../data/daily-reports/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>;

interface DailyReport {
    /** Filename date (YYYY-MM-DD), parsed from the path - not a document date. */
    date: string;
    markdown: string;
}

function parseDate(path: string): string | null {
    const match = path.match(/(\d{4}-\d{2}-\d{2})\.md$/);
    return match ? match[1] : null;
}

const reports: DailyReport[] = Object.entries(reportModules)
    .flatMap(([path, markdown]) => {
        const date = parseDate(path);
        return date ? [{ date, markdown }] : [];
    })
    .sort((a, b) => b.date.localeCompare(a.date));

marked.use({ gfm: true });

/**
 * Standalone page (not part of the main docs scroll) reached via the sidebar "Daily Report"
 * button. Gated behind its own separate password - see ReportPasswordGate - independent of the
 * site-wide PasswordGate that already wraps the whole app.
 */
export function DailyReportPage({ onBack }: DailyReportPageProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(reports[0]?.date ?? null);
    const selected = reports.find((report) => report.date === selectedDate) ?? null;

    return (
        <div className="min-h-screen bg-[#0b0a08] text-[#f5f1e8]">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-6 rounded-md border border-[#2a211a] px-3 py-1.5 text-sm text-[#d6cfc3] hover:bg-[#f0802a] hover:text-[#0b0a08]"
                >
                    &larr; Back to Docs
                </button>

                <h1 className="text-xl font-bold uppercase tracking-wide text-[#f0802a]">
                    Daily Report
                </h1>
                <p className="mt-1 text-sm text-[#a89f90]">
                    Consolidated briefing from the watch agents (baddy, jarvis, roddy, war).
                </p>

                <ReportPasswordGate>
                    {reports.length === 0 ? (
                        <p className="mt-8 rounded-lg border border-[#2a211a] bg-[#14110d] p-4 text-sm text-[#a89f90]">
                            No daily reports published yet. Chief drops a file into
                            src/data/daily-reports/&lt;YYYY-MM-DD&gt;.md to publish one.
                        </p>
                    ) : (
                        <div className="mt-6 flex gap-6">
                            <nav
                                aria-label="Daily reports by date"
                                className="w-44 shrink-0 border-r border-[#2a211a] pr-4"
                            >
                                <ul className="space-y-1">
                                    {reports.map((report) => (
                                        <li key={report.date}>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedDate(report.date)}
                                                aria-current={report.date === selectedDate}
                                                className={`block w-full rounded-md px-3 py-1.5 text-left text-sm ${
                                                    report.date === selectedDate
                                                        ? 'bg-[#f0802a] font-semibold text-[#0b0a08]'
                                                        : 'text-[#d6cfc3] hover:bg-[#f0802a] hover:text-[#0b0a08]'
                                                }`}
                                            >
                                                {report.date}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            {selected && (
                                <article
                                    aria-label={`Daily report for ${selected.date}`}
                                    className="min-w-0 flex-1 text-sm leading-relaxed text-[#d6cfc3] [&_a]:text-[#f0802a] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[#f0802a]/50 [&_blockquote]:pl-3 [&_blockquote]:text-[#a89f90] [&_code]:rounded [&_code]:bg-[#14110d] [&_code]:px-1 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-[#f0802a] [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[#f0802a] [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-[#f0802a] [&_hr]:border-[#2a211a] [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:text-[#f5f1e8] [&_table]:mt-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#2a211a] [&_td]:px-2 [&_td]:py-1 [&_td]:align-top [&_th]:border [&_th]:border-[#2a211a] [&_th]:bg-[#14110d] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5"
                                    // Report markdown is authored by the user's own Chief agent and
                                    // reaches this repo only through a git push or a repository_dispatch
                                    // requiring write access - the same trust level as the repo itself.
                                    dangerouslySetInnerHTML={{
                                        __html: marked.parse(selected.markdown) as string,
                                    }}
                                />
                            )}
                        </div>
                    )}
                </ReportPasswordGate>
            </div>
        </div>
    );
}
