import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { WhyMax } from "@/components/sections/WhyMax";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Tariffs } from "@/components/sections/Tariffs";
import { WhyUs } from "@/components/sections/WhyUs";
import { FAQ } from "@/components/sections/FAQ";
import { LeadForm } from "@/components/sections/LeadForm";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd variant="home" />
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Process />
        <WhyUs />
        <Tariffs />
        <WhyMax />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
