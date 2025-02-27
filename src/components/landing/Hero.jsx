import PageIllustration from "./PageIllustration";
import Computer from "../../assets/landing/computer.png";
import { Button } from "../common/button/button";

export default function HeroHome() {
  return (
    <section className="relative overflow-x-hidden dark:bg-black transition-colors duration-300">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-12 text-center md:pb-16">
            <h1
              className="mb-6 border-y text-5xl font-bold text-black dark:text-white md:text-6xl font-sans"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Aprendé programación gratis, fácil e interactivamente.
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700 dark:text-gray-300 font-mono"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Mejorá tus habilidades con ejercicios prácticos y desafiantes de
                distintos lenguajes de programación.
              </p>
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]">
                <div
                  className="relative mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <Button
                    icon={
                      <svg
                        width="11"
                        height="10"
                        viewBox="0 0 11 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.7398 9.75L4.82143 8.84378L8.0102 5.66184H0V4.33816H8.0102L4.82143 1.16131L5.7398 0.25L10.5 5L5.7398 9.75Z"
                          fill="#93C5FD"
                        />
                      </svg>
                    }
                    label="Quiero saber más"
                  />
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
