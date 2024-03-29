import * as React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { gsap } from "gsap";
import RainbowBackgroundFade from "./RainbowBackgroundFade";
import HideOnScroll from "./HideOnScroll";

const Hamburger = styled.button`
  padding: 30px;
  font-size: 20px;
  @media screen and (max-width: 320px) {
    padding: 20px;
  }
  .hamburger-icon {
    fill: #fff;
    margin-right: 10px;
    @media screen and (max-width: 400px) {
      display: none;
    }
  }
`;

const Navigation = styled.nav`
  position: fixed;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 98;
  overflow: scroll;
`;

const NavigationInner = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 120px 20px 80px 20px;

  .letter-from {
    margin: 30px auto 10px auto;
  }
  .navigation-link {
    font-size: 2rem;
    text-transform: uppercase;
    font-family: "Windsor", sans-serif;
    font-weight: 700;
  }
`;

export default function Menu({ data }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  const router = useRouter();
  const { locale } = router;

  React.useEffect(() => {
    router.events.on("routeChangeStart", () => {
      handleMenuClose();
    });
  }, []);

  React.useEffect(() => {
    gsap.to(menuRef.current, {
      yPercent: 100,
      duration: 0.7,
      ease: "power2.out",
    });
  }, [menuOpen]);

  const handleMenuOpen = () => {
    if (!menuOpen) {
      setMenuOpen(true);
    }

    if (menuOpen) {
      handleMenuClose();
    }
  };

  const exitAnimation = () => {
    return gsap.to(menuRef.current, {
      yPercent: -100,
      duration: 0.7,
      ease: "power2.in",
    });
  };

  const handleMenuClose = async () => {
    await exitAnimation();
    await setMenuOpen(false);
  };

  return (
    <>
      <HideOnScroll right={0}>
        <Hamburger onClick={handleMenuOpen}>
          <svg
            className="hamburger-icon"
            viewBox="0 0 100 80"
            width="25"
            height="25"
          >
            {!menuOpen && <rect width="100" height="10"></rect>}
            <rect y="30" width="100" height="10"></rect>
            {!menuOpen && <rect y="60" width="100" height="10"></rect>}
          </svg>
          {menuOpen ? (
            <>
              {locale === "es"
                ? "Cerrar"
                : locale === "fr"
                ? "Fermer"
                : "Close"}
            </>
          ) : (
            <>{locale === "es" ? "Menú" : "Menu"}</>
          )}
        </Hamburger>
      </HideOnScroll>
      {menuOpen && (
        <Navigation ref={menuRef}>
          <RainbowBackgroundFade>
            <NavigationInner>
              <div
                className="navigation-link"
                onClick={() => router.push(`/about`)}
                role="button"
              >
                {locale === "es"
                  ? "Sobre"
                  : locale === "fr"
                  ? "À Propos"
                  : "About"}
              </div>
              <h1 className="letter-from">{data?.aLetterFrom}</h1>
              {data?.menuItems.map((m, i) => {
                return (
                  <div
                    key={m?.slug}
                    className="navigation-link"
                    onClick={() => router.push(`/${m?.slug}`)}
                    role="button"
                  >
                    {m?.title}
                  </div>
                );
              })}
            </NavigationInner>
          </RainbowBackgroundFade>
        </Navigation>
      )}
    </>
  );
}
