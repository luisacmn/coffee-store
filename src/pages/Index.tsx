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
      <section className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <img
          src="/images/hero-coffee.jpg"
          alt="Specialty coffee beans"
          className="h-full w-full object-cover"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Specialty Coffee
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Carefully sourced, expertly roasted. From origin to your cup.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <main className="container py-10">
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;
