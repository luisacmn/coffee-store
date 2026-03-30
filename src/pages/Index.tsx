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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="/images/hero-minimal.jpg"
          alt="Coffee beans on cream background"
          className="h-[340px] w-full object-cover md:h-[420px]"
          width={1920}
          height={600}
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-r from-background/90 via-background/50 to-transparent">
          <div className="container pb-12 md:pb-16">
            <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
              Coffee,
              <br />
              <span className="text-accent">refined.</span>
            </h1>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Single-origin beans, expertly roasted.
              <br />
              Nothing more, nothing less.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <main className="container py-12">
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;
