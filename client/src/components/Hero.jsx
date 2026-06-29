import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 overflow-hidden bg-ink-50">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-gold-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[36rem] h-[36rem] bg-ink-200/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-soft border border-ink-100 text-xs font-medium text-ink-600 mb-8 animate-fade-in">
          <Sparkles size={14} className="text-gold-500" />
          Curated. Premium. Delivered to your door.
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-ink-900 leading-[1.08] tracking-tight max-w-4xl mx-auto animate-slide-up">
          Elevate Your Everyday with{' '}
          <span className="text-gold-600 italic">Shakeel's Collect</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-ink-500 max-w-xl mx-auto leading-relaxed animate-slide-up">
          A handpicked selection of premium essentials — modern design meets
          everyday function. Cash on delivery, always.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <a
            href="#shop"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ink-900 text-white text-sm font-semibold hover:bg-gold-600 transition-all duration-300 shadow-card"
          >
            Explore Collection
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#about"
            className="px-7 py-3.5 rounded-full bg-white text-ink-700 text-sm font-semibold border border-ink-200 hover:border-ink-400 transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
