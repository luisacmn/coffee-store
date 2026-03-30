import { useEffect } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { logPageView } from '@/shared/lib/observability';

const Index = () => {
  useEffect(() => {
    logPageView('home');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — typography only */}
      <section className="container py-16 md:py-24">
        <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          Coffee,
          <br />
          <span className="text-accent">refined.</span>
        </h1>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground md:text-base">
          Single-origin beans, expertly roasted.
          <br />
          Nothing more, nothing less.
        </p>
      </section>

      <div className="container mb-10">
        <div className="h-px w-full bg-border" />
      </div>

      {/* Products */}
      <main className="container pb-16">
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;
