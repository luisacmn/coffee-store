import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import type { StructuredLogRecord } from '@/shared/lib/observability';
import { clearStoredRecords, getStoredRecords, subscribeRecords } from '@/shared/lib/observability/store';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function metricValue(records: StructuredLogRecord[], name: string): number | null {
  const matches = records.filter((record) => record.type === 'web_vital' && record.context?.name === name);
  if (matches.length === 0) return null;
  const sum = matches.reduce((acc, record) => acc + Number(record.context?.value ?? 0), 0);
  return sum / matches.length;
}

export default function DashboardPage() {
  const [records, setRecords] = useState<StructuredLogRecord[]>(() => getStoredRecords());
  const [insightTab, setInsightTab] = useState<'funnel' | 'api' | 'ux'>('funnel');
  const [timeWindow, setTimeWindow] = useState<'15m' | '1h' | 'all'>('all');

  useEffect(() => {
    return subscribeRecords(() => setRecords(getStoredRecords()));
  }, []);

  const filteredRecords = useMemo(() => {
    if (timeWindow === 'all') return records;

    const now = Date.now();
    const windowMs = timeWindow === '15m' ? 15 * 60 * 1000 : 60 * 60 * 1000;
    return records.filter((record) => {
      const timestamp = new Date(record.ts).getTime();
      return Number.isFinite(timestamp) && now - timestamp <= windowMs;
    });
  }, [records, timeWindow]);

  const data = useMemo(() => {
    const eventRecords = filteredRecords.filter((record) => record.type === 'event');
    const countEvent = (eventName: string) =>
      eventRecords.filter((record) => record.context?.event === eventName).length;

    const addToCart = countEvent('add_to_cart_clicked');
    const proceedCheckout = countEvent('checkout_entry_clicked');
    const placeOrder = countEvent('checkout_submit_clicked');
    const checkoutSuccess = countEvent('checkout_submit_succeeded');

    const apiSuccess = eventRecords.filter(
      (record) => record.context?.event === 'api_products_ok' || record.context?.event === 'api_product_ok',
    );
    const apiFailed = eventRecords.filter(
      (record) =>
        record.context?.event === 'api_products_failed' ||
        record.context?.event === 'api_product_failed' ||
        record.context?.event === 'support_failing_request_failed',
    );
    const apiLatencyAvg = apiSuccess.length
      ? apiSuccess.reduce((acc, record) => acc + Number(record.context?.durationMs ?? 0), 0) / apiSuccess.length
      : null;

    const exceptionCount = filteredRecords.filter((record) => record.type === 'exception').length;
    const sessionIds = new Set(
      filteredRecords
        .map((record) => String(record.context?.session_id ?? ''))
        .filter((sessionId) => sessionId.length > 0),
    );

    return {
      addToCart,
      proceedCheckout,
      placeOrder,
      checkoutSuccess,
      apiSuccessCount: apiSuccess.length,
      apiFailedCount: apiFailed.length,
      apiLatencyAvg,
      exceptionCount,
      sessions: sessionIds.size,
      lcp: metricValue(filteredRecords, 'LCP'),
      inp: metricValue(filteredRecords, 'INP'),
      cls: metricValue(filteredRecords, 'CLS'),
    };
  }, [filteredRecords]);

  const dropoffAfterCart =
    data.addToCart > 0 ? Math.max(0, Math.round(((data.addToCart - data.proceedCheckout) / data.addToCart) * 100)) : 0;

  const funnelChartData = [
    { name: 'Add to cart', value: data.addToCart },
    { name: 'Checkout', value: data.proceedCheckout },
    { name: 'Place order', value: data.placeOrder },
    { name: 'Success', value: data.checkoutSuccess },
  ];

  const apiChartData = [
    { name: 'Success', value: data.apiSuccessCount, color: '#22c55e' },
    { name: 'Errors', value: data.apiFailedCount, color: '#ef4444' },
  ];

  const insightText = {
    funnel:
      dropoffAfterCart > 40
        ? `High checkout friction detected (${dropoffAfterCart}% drop after add-to-cart).`
        : `Healthy cart-to-checkout transition (${dropoffAfterCart}% drop after add-to-cart).`,
    api:
      data.apiFailedCount > 0
        ? `API errors detected (${data.apiFailedCount}). Investigate failing endpoints and retries.`
        : 'No API failures detected in the captured dataset.',
    ux:
      data.lcp && data.lcp > 2500
        ? `LCP average is above target (${Math.round(data.lcp)} ms). Optimize largest content rendering.`
        : 'Core UX vitals are within acceptable ranges for the sampled events.',
  } as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Frontend Observability Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Real-time local telemetry from this session and recent app interactions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeWindow}
              onChange={(event) => setTimeWindow(event.target.value as '15m' | '1h' | 'all')}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="15m">Last 15m</option>
              <option value="1h">Last 1h</option>
              <option value="all">All</option>
            </select>
            <button
              onClick={clearStoredRecords}
              className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Reset metrics
            </button>
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Sessions</p>
            <p className="mt-2 text-2xl font-semibold">{data.sessions}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">JS Exceptions</p>
            <p className="mt-2 text-2xl font-semibold">{data.exceptionCount}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">API Errors</p>
            <p className="mt-2 text-2xl font-semibold">{data.apiFailedCount}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">API Avg Latency</p>
            <p className="mt-2 text-2xl font-semibold">{data.apiLatencyAvg ? `${Math.round(data.apiLatencyAvg)} ms` : '-'}</p>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Checkout Funnel</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <div className="rounded-md bg-muted/50 p-3 text-sm">Add to cart: <span className="font-semibold">{data.addToCart}</span></div>
            <div className="rounded-md bg-muted/50 p-3 text-sm">Proceed checkout: <span className="font-semibold">{data.proceedCheckout}</span></div>
            <div className="rounded-md bg-muted/50 p-3 text-sm">Place order click: <span className="font-semibold">{data.placeOrder}</span></div>
            <div className="rounded-md bg-muted/50 p-3 text-sm">Checkout success: <span className="font-semibold">{data.checkoutSuccess}</span></div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Drop-off after add-to-cart: <span className="font-medium text-foreground">{dropoffAfterCart}%</span></p>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Funnel Visual</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6d28d9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">API Health Visual</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={apiChartData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {apiChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">LCP (avg)</p>
            <p className="mt-2 text-2xl font-semibold">{data.lcp ? `${Math.round(data.lcp)} ms` : '-'}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">INP (avg)</p>
            <p className="mt-2 text-2xl font-semibold">{data.inp ? `${Math.round(data.inp)} ms` : '-'}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">CLS (avg)</p>
            <p className="mt-2 text-2xl font-semibold">{data.cls ? data.cls.toFixed(3) : '-'}</p>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Insights</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={`rounded-md px-3 py-1.5 text-sm ${insightTab === 'funnel' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setInsightTab('funnel')}
            >
              Funnel
            </button>
            <button
              className={`rounded-md px-3 py-1.5 text-sm ${insightTab === 'api' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setInsightTab('api')}
            >
              API
            </button>
            <button
              className={`rounded-md px-3 py-1.5 text-sm ${insightTab === 'ux' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setInsightTab('ux')}
            >
              UX Vitals
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{insightText[insightTab]}</p>
        </section>
      </main>
    </div>
  );
}
