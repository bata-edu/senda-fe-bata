import { Link } from "react-router-dom";
import Logo from "../Logo";

export default function Footer({ border = false }) {
  return (
    <footer className="overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`grid gap-10 py-8 sm:grid-cols-12 md:py-12 ${
            border
              ? "border-t [border-image:linear-gradient(to_right,transparent,theme(colors.slate.200),transparent)1]"
              : ""
          }`}
        >
          <div className="space-y-2 sm:col-span-12 lg:col-span-4">
            <div>
              <Logo />
            </div>
            <div className="text-sm text-gray-600 font-mono">
              &copy; Bata - Todos los derechos <br /> de autor reservados.
            </div>
          </div>

          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Beneficios</h3>
          </div>

          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Planes</h3>
          </div>

          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Faq</h3>
          </div>

          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Social</h3>
            <ul className="flex gap-1">
              <li>
                <Link
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                  href="#0"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z"></path>
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                  href="#0"
                  aria-label="Medium"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23 8H9a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Zm-1.708 3.791-.858.823a.251.251 0 0 0-.1.241V18.9a.251.251 0 0 0 .1.241l.838.823v.181h-4.215v-.181l.868-.843c.085-.085.085-.11.085-.241v-4.887l-2.41 6.131h-.329l-2.81-6.13V18.1a.567.567 0 0 0 .156.472l1.129 1.37v.181h-3.2v-.181l1.129-1.37a.547.547 0 0 0 .146-.472v-4.749a.416.416 0 0 0-.138-.351l-1-1.209v-.181H13.8l2.4 5.283 2.122-5.283h2.971l-.001.181Z"></path>
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                  href="#0"
                  aria-label="Github"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"></path>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative -mt-8 h-48 w-full -z-10" aria-hidden="true">
        <div className="pointer-events-none absolute left-1/2 -z-10 -translate-x-1/2 text-center  ">
          <svg
            width="680"
            height="192"
            viewBox="0 0 680 192"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_i_321_7360)">
              <path
                d="M0.835562 233V0.535985H88.1836C131.336 0.535985 179.36 21.068 179.36 66.308C179.36 87.884 168.572 103.892 152.564 115.028C173.792 127.556 184.58 146.696 184.58 165.488C184.58 198.896 153.26 233 88.1836 233H0.835562ZM80.8756 43.688H61.7356V99.368H80.8756C105.932 99.368 118.808 85.1 118.808 71.528C118.808 57.608 106.28 43.688 80.8756 43.688ZM80.8756 189.848C110.456 189.848 124.724 174.884 124.028 160.268C123.332 146.348 108.716 132.776 80.8756 132.776H61.7356V189.848H80.8756ZM196.602 177.668C196.602 140.432 229.662 121.64 262.374 121.64C278.034 121.64 293.694 126.164 305.526 134.864V131.732C305.526 110.156 287.43 101.456 267.594 101.456C249.846 101.456 230.358 108.416 220.266 118.856L197.646 71.528C217.482 61.436 243.582 55.52 268.986 55.52C318.402 55.52 366.426 78.14 366.426 137.3V233H322.23L311.442 216.992C299.262 229.868 280.818 236.48 262.374 236.48C229.662 236.48 196.602 216.992 196.602 177.668ZM280.818 189.152C292.65 189.152 301.698 181.496 301.698 173.84C301.698 166.88 292.302 159.572 280.818 159.572C266.55 159.572 257.85 166.88 257.85 174.536C257.85 181.844 266.898 189.152 280.818 189.152ZM497.185 233C492.313 234.392 482.221 236.48 471.085 236.48C433.153 236.48 398.701 213.164 398.701 160.964V105.98H381.997V59H404.965C430.021 56.216 423.409 34.64 437.329 15.152H459.601V59H491.965V105.98H459.601V162.356C459.601 176.624 470.041 180.8 480.829 180.8C483.961 180.8 487.093 180.452 490.225 179.756L497.185 233ZM509.278 177.668C509.278 140.432 542.338 121.64 575.05 121.64C590.71 121.64 606.37 126.164 618.202 134.864V131.732C618.202 110.156 600.106 101.456 580.27 101.456C562.522 101.456 543.034 108.416 532.942 118.856L510.322 71.528C530.158 61.436 556.258 55.52 581.662 55.52C631.078 55.52 679.102 78.14 679.102 137.3V233H634.906L624.118 216.992C611.938 229.868 593.494 236.48 575.05 236.48C542.338 236.48 509.278 216.992 509.278 177.668ZM593.494 189.152C605.326 189.152 614.374 181.496 614.374 173.84C614.374 166.88 604.978 159.572 593.494 159.572C579.226 159.572 570.526 166.88 570.526 174.536C570.526 181.844 579.574 189.152 593.494 189.152Z"
                fill="url(#paint0_linear_321_7360)"
              />
            </g>
            <defs>
              <filter
                id="filter0_i_321_7360"
                x="0.835449"
                y="0.536011"
                width="678.267"
                height="235.944"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="1" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.0117647 0 0 0 0 0.027451 0 0 0 0 0.0705882 0 0 0 0.08 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_321_7360"
                />
              </filter>
              <linearGradient
                id="paint0_linear_321_7360"
                x1="369.224"
                y1="54"
                x2="370.243"
                y2="218.994"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#E5E7EB" />
                <stop
                  offset="0.965"
                  stop-color="#F3F4F6"
                  stop-opacity="0.309804"
                />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3"
          aria-hidden="true"
        >
          <div className="h-56 w-56 rounded-full border-[20px] border-blue-700 blur-[80px]"></div>
        </div>
      </div>
    </footer>
  );
}
