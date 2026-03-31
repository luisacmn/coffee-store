import { useEffect, useState } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { logError, logEvent } from '@/shared/lib/observability';

function blockMainThread(durationMs: number) {
  const start = performance.now();
  while (performance.now() - start < durationMs) {
    // Intentional busy loop for observability testing.
  }
}

export default function SupportStressPage() {
  const [showLateBanner, setShowLateBanner] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    logEvent('support_page_opened', { testPage: true });

    const clsTimer = window.setTimeout(() => {
      setShowLateBanner(true);
      logEvent('support_layout_shift_triggered', { delayMs: 1800 });
    }, 1800);

    const errorTimer = window.setTimeout(() => {
      logEvent('support_uncaught_error_scheduled');
      logError(new Error('Intentional support page uncaught error for observability test'), {
        flow: 'support_page_timeout_error',
      });
    }, 3200);

    return () => {
      window.clearTimeout(clsTimer);
      window.clearTimeout(errorTimer);
    };
  }, []);

  const handleSlowInteraction = () => {
    logEvent('support_slow_interaction_clicked');
    blockMainThread(900);
    setMessages((prev) => [...prev, `Slow interaction executed at ${new Date().toLocaleTimeString()}`]);
  };

  const handleFailingRequest = async () => {
    logEvent('support_failing_request_clicked');
    try {
      const response = await fetch('http://localhost:3333/api/support/tickets');
      if (!response.ok) {
        logEvent('support_failing_request_failed', { status: response.status });
        logError(new Error(`Support request failed with status ${response.status}`), {
          flow: 'support_failing_request',
          status: response.status,
        });
      } else {
        logEvent('support_failing_request_unexpected_success', { status: response.status });
      }
    } catch (error) {
      logEvent('support_failing_request_failed', { status: 'network_error' });
      logError(error, { flow: 'support_failing_request', status: 'network_error' });
    }
    setMessages((prev) => [...prev, `Failing request attempted at ${new Date().toLocaleTimeString()}`]);
  };

  const handleBurstClicks = () => {
    logEvent('support_burst_clicks_clicked');
    for (let i = 0; i < 8; i += 1) {
      logEvent('support_button_spam', { sequence: i + 1 });
    }
    setMessages((prev) => [...prev, `Burst click telemetry generated at ${new Date().toLocaleTimeString()}`]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-3xl font-semibold">Customer Support (Observability Stress Test)</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This page intentionally generates problematic signals to validate your metrics, errors, tracing, and user action pipeline.
        </p>

        {showLateBanner && (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Delayed banner intentionally inserted to trigger layout shift (CLS).
          </div>
        )}

        <section className="mt-6 grid gap-3 md:grid-cols-3">
          <button
            data-faro-user-action-name="support-slow-interaction"
            onClick={handleSlowInteraction}
            className="rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Simulate slow interaction (900ms)
          </button>

          <button
            data-faro-user-action-name="support-failing-request"
            onClick={handleFailingRequest}
            className="rounded-md bg-destructive px-4 py-3 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            Simulate failing request
          </button>

          <button
            data-faro-user-action-name="support-burst-clicks"
            onClick={handleBurstClicks}
            className="rounded-md border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-muted"
          >
            Generate event burst
          </button>
        </section>

        <section className="mt-6 rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Expected checklist in Grafana</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>New user actions with the <code>support-*</code> prefix</li>
            <li>Unhandled JavaScript error after ~3 seconds</li>
            <li>HTTP error in request views</li>
            <li>INP degradation from blocking interaction</li>
            <li>CLS increase after delayed banner insertion</li>
          </ul>
        </section>

        <section className="mt-6 rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Events executed in this session</h2>
          {messages.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No manual events executed yet.</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
