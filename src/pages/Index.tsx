import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PlanSelector from "@/components/PlanSelector";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <PlanSelector />
      <Footer />
    </div>
  );
};

export default Index;
