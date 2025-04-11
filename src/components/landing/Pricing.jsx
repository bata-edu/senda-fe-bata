import MaxIllustration from "../../assets/landing/max.svg";

export default function   PricingTables() {
  return (
    <section className="" id="pricing" >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-6 text-center">
            <h1 className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] md:text-6xl">
              Nuestros planes de suscripción
            </h1>
            <div className="mx-auto max-w-3xl">
              <p className="text-lg text-gray-700 font-sans">
              Con Bata MAX, desbloquea tu máximo potencial con funciones avanzadas, inteligencia artificial y una experiencia de aprendizaje mejorada.
              </p>
            </div>
          </div>
          <div className="mx-auto w-full h-full relative">
            <div className="absolute -mt-[48px] -ml-[40.5px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-[breath_4s_ease-in-out_infinite_both]">
              <svg
                width="82"
                height="64"
                viewBox="0 0 82 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_dd_321_7607)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.5979 31L37.1196 22.2798V7L8 23.3608L21.5979 31Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.5979 31L37.1196 39.7202V55L8 38.6392L21.5979 31Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M60.4021 31L44.8804 22.2798V7L74 23.3608L60.4021 31Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M60.4021 31L44.8804 39.7202V55L74 38.6392L60.4021 31Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_dd_321_7607"
                    x="0"
                    y="0"
                    width="82"
                    height="64"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="4" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.886275 0 0 0 0 0.909804 0 0 0 0 0.941176 0 0 0 0.24 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_321_7607"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="4" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.886275 0 0 0 0 0.909804 0 0 0 0 0.941176 0 0 0 0.24 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_321_7607"
                      result="effect2_dropShadow_321_7607"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect2_dropShadow_321_7607"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <img
              className="mx-auto"
              src={MaxIllustration}
              width={450}
              height={384}
              alt="Planet decoration"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
