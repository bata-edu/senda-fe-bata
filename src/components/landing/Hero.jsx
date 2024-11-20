import PageIllustration from "./PageIllustration";
import Computer from "../../assets/landing/computer.png";
import { Button } from "../common/button/button";

export default function HeroHome() {
  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-12 text-center md:pb-16">
            <h1
              className="mb-6 border-y text-5xl font-bold text-black md:text-6xl font-sans"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Aprende programación gratis, práctica e interactiva.
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700 font-mono"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Desarrolla tus habilidades a través de proyectos y simulaciones
                que te permiten programar desde el primer día y avanzar a tu
                propio ritmo.
              </p>
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]">
                <div
                  className="relative mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <Button label="Quiero saber más" />
                  <button>
                    <span className="relative inline-flex items-center font-mono"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="mx-auto max-w-3xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="relative aspect-video   px-5 py-3  before:pointer-events-none before:absolute ">
              <img src={Computer} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
