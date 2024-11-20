import { React, useState, useEffect } from "react";

import MobileMenu from "./MobileMenu";
import { Link } from "react-router-dom";
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
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(theme(colors.gray.100),theme(colors.gray.200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          <nav className="hidden md:flex md:grow">
            <ul className="flex grow flex-wrap items-center justify-center gap-4 text-sm lg:gap-8">
              <li className="px-3 py-1">
                <Link
                  to="/pricing"
                  className="flex items-center text-gray-700 transition hover:text-gray-900"
                >
                  Beneficios
                </Link>
              </li>
              <li className="px-3 py-1">
                <Link
                  to="/customers"
                  className="flex items-center text-gray-700 transition hover:text-gray-900"
                >
                  Planes
                </Link>
              </li>
              <li className="px-3 py-1">
                <Link
                  to="/blog"
                  className="flex items-center text-gray-700 transition hover:text-gray-900"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <Button label="Mas info" />
            </li>
          </ul>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
