import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="mb-12">
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 hero-gradient">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800"
          alt="Mountain sunrise landscape"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white p-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Discover Amazing Products</h2>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Curated collection of premium items for modern living
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-100">
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
