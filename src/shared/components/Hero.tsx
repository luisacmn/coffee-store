import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_IMAGE = '/images/hero-minimal.svg';

const scrollToProducts = () => {
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
};

export function Hero() {
  return (
    <section className="border-b border-border/15 bg-white">
      <div className="grid min-h-[min(30vh,300px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:min-h-[min(38vh,380px)]">
        <div className="flex items-center px-6 py-8 sm:px-8 md:py-10 lg:pl-12 lg:pr-8 xl:pl-16">
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-neutral-400/80" aria-hidden />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Ember & Roast
              </p>
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-600">
              Specialty coffee · Café brasileiro
            </p>

            <h1 className="mt-3 font-display text-[clamp(2rem,4.2vw,3rem)] font-semibold leading-[1.07] tracking-tight text-neutral-900">
              Coffee,{' '}
              <span className="font-hero-serif font-medium italic text-neutral-800">refined.</span>
            </h1>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-600">
              Single-origin beans, expertly roasted — including Brazilian microlots and classics.
              From origin to your cup — nothing more, nothing less.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Button asChild className="h-11 rounded-md px-6 font-medium shadow-sm">
                <Link
                  to="/#products"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToProducts();
                  }}
                  className="inline-flex items-center gap-2"
                >
                  Shop collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="h-11 px-4 font-medium text-neutral-600 hover:text-neutral-900"
              >
                <button type="button" onClick={scrollToProducts}>
                  Browse beans
                </button>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {['Roasted weekly', 'Ships in 48h', 'Café brasileiro'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] font-medium text-neutral-600"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[180px] items-center justify-end overflow-hidden bg-white px-4 pb-5 pt-6 md:min-h-0 md:items-end md:px-8 md:pb-8 md:pt-10">
          <img
            src={HERO_IMAGE}
            alt=""
            width={480}
            height={360}
            className="h-auto max-h-[min(280px,38vh)] w-auto max-w-[min(100%,400px)] object-contain object-right"
            sizes="(min-width: 768px) 45vw, 90vw"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
