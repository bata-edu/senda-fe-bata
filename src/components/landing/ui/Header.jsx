import { React, useState, useEffect } from "react";

import MobileMenu from "./MobileMenu";
import Logo from "../Logo";
import { Button } from "../../common/button/button";

export default function Header() {
  const [top, setTop] = useState(true);

  const scrollHandler = () => {
    window.scrollY > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-16 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(theme(colors.gray.100),theme(colors.gray.200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          <nav className="hidden md:flex md:grow">
            <ul className="flex grow items-center justify-center gap-4 text-sm lg:gap-8 mb-0 ">
              <li className="px-3 py-1">
                <a
                  href="#features"
                  className="flex items-center text-gray-700 transition hover:text-gray-900 no-underline"
                >
                  Beneficios
                </a>
              </li>
              <li className="px-3 py-1">
                <a
                  href="#pricing"
                  className="flex items-center text-gray-700 transition hover:text-gray-900 no-underline"
                >
                  MAX
                </a>
              </li>
              <li className="px-3 py-1">
                <a
                  href="#faq"
                  className="flex items-center text-gray-700 transition hover:text-gray-900 no-underline"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <ul className="hidden md:flex flex-1 flex-col items-end justify-center gap-3 mb-0">
            <li>
              <Button thin label="Comienza ahora" />
            </li>
          </ul>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
