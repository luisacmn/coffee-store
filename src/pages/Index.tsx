import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { logPageView } from '@/shared/lib/observability';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    logPageView('home');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — modern split layout */}
      <section className="container grid items-center gap-8 py-12 md:grid-cols-2 md:gap-12 md:py-20">
        <div className="order-2 md:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Specialty Coffee
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Coffee,
            <br />
            refined.
          </h1>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Single-origin beans, expertly roasted. From origin to your cup — nothing more, nothing less.
          </p>
          <Link
            to="/#products"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:gap-3 hover:bg-primary/90"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="order-1 md:order-2">
          <div className="aspect-square overflow-hidden rounded-2xl bg-coffee-cream">
            <img
              src="/images/hero-cup.jpg"
              alt="A cup of specialty coffee"
              className="h-full w-full object-cover"
              width={960}
              height={960}
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <main id="products" className="container pb-16">
        <div className="mb-10 h-px w-full bg-border" />
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;
