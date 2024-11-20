import { useState } from "react";
import { Button } from "../common/button/button";

export default function PricingTables() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-12 text-center">
            <h1 className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] md:text-6xl">
              Nuestros planes de suscripción
            </h1>
            <div className="mx-auto max-w-3xl">
              <p className="text-lg text-gray-700">
                Selecciona el plan que se ajuste a tus necesidades: básico para
                iniciar, premium con funcionalidades avanzadas y planes
                especiales para instituciones educativas.
              </p>
            </div>
          </div>

          <div>
            <div className="m-auto pb-10 flex max-w-xs justify-center">
              <div className="relative mx-6 flex w-full rounded-lg bg-gray-200 p-1">
                <span
                  className="pointer-events-none absolute inset-0 m-1"
                  aria-hidden="true"
                >
                  <span
                    className={`absolute inset-0 w-1/2 transform rounded bg-white shadow transition ${
                      annual ? "translate-x-0" : "translate-x-full"
                    }`}
                  ></span>
                </span>
                <button
                  className={`relative flex-1 p-1 text-sm font-medium transition ${
                    annual ? "" : "text-gray-900"
                  }`}
                  onClick={() => setAnnual(true)}
                  aria-pressed={annual}
                >
                  Pago anual
                  <span className="text-emerald-500">-20%</span>
                </button>
                <button
                  className={`relative flex-1 p-1 text-sm font-medium transition ${
                    annual ? "text-gray-500" : ""
                  }`}
                  onClick={() => setAnnual(false)}
                  aria-pressed={annual}
                >
                  Pago mensual
                </button>
              </div>
            </div>

            <div className="mx-auto grid max-w-sm items-start gap-8 md:max-w-2xl md:grid-cols-2 xl:max-w-none xl:grid-cols-3 xl:gap-6">
              <div className="relative flex h-full flex-col rounded-2xl bg-white/70 p-4 shadow-lg shadow-black/[0.03] backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(theme(colors.gray.100),theme(colors.gray.200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
                <div className="mb-4">
                  <div className="mb-1 font-medium underline decoration-gray-300 underline-offset-4">
                    Basico
                  </div>
                  <div className="mb-4 flex items-baseline border-b border-dashed border-gray-200 pb-4">
                    <span className="text-4xl font-bold tabular-nums">
                      Gratis
                    </span>
                  </div>
                </div>
                <ul className="grow space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>Lorem Ipsum</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>Lorem Ipsum</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>Lorem Ipsum</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>Lorem Ipsum</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button full label="Más información" />
                </div>
              </div>

              <div className="relative flex h-full flex-col rounded-2xl bg-gradient-to-tr from-gray-900 to-gray-700 p-4 shadow-lg shadow-black/[0.03] backdrop-blur-sm">
                <div className="mb-4">
                  <div className="mb-1 font-medium text-gray-200 underline decoration-gray-600 underline-offset-4">
                    Premium
                  </div>
                  <div className="mb-4 flex items-baseline border-b border-dashed border-gray-600 pb-4">
                    <span className="text-2xl font-bold text-gray-200">$</span>
                    <span className="text-4xl font-bold tabular-nums text-gray-200">
                      {annual ? 4000 : 5.999}
                    </span>
                    <span className="pl-1 text-sm text-gray-400">/mes</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Lorem Ipsum es simplemente el texto de relleno{" "}
                  </div>
                </div>
                <ul className="grow space-y-2 text-sm text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>lorem ipsum</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>lorem ipsum</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>lorem ipsum</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>lorem ipsum</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button full label="Más información" />
                </div>
              </div>
              <div className="relative flex h-full flex-col rounded-2xl bg-white/70 p-4 shadow-lg shadow-black/[0.03] backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(theme(colors.gray.100),theme(colors.gray.200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
                <div className="mb-4 h-full">
                  <div className="mb-1 font-medium underline decoration-gray-300 underline-offset-4">
                    Instituciones{" "}
                  </div>
                  <div className="mb-4 flex items-baseline border-b border-dashed border-gray-200 pb-4">
                    <span className="text-4xl font-bold tabular-nums">
                      Contactar
                    </span>
                  </div>
                  <div className="grow text-sm text-gray-700">
                    Contáctanos si deseas incorporar Bata en tu institución o en
                    tu método de enseñanza.{" "}
                  </div>
                </div>

                <div className="mt-6">
                  <Button full label="Contactar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
