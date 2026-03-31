import { Link } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero background image */}
      <section className="relative isolate min-h-[min(44vh,380px)] w-full overflow-hidden border-b border-border/40 bg-background md:min-h-[min(50vh,480px)] ">
        <img
          src="/images/hero-background-cup.png"
          alt="Cup of black coffee on a minimal background"
          width={970}
          height={679}
          className="absolute inset-0 h-full w-full object-cover object-[90%_72%] md:object-[92%_72%]  md:translate-x-[14%]"
          loading="eager"
          decoding="async"
        />
        <div className="container relative z-10 flex min-h-[min(44vh,380px)] items-center py-10 md:min-h-[min(50vh,480px)] md:py-14">
          <div className="max-w-xl">
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
