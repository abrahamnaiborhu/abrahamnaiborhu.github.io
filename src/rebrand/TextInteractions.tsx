import { gsap, useGSAP, reveal } from "./motion";
import { useReducedMotion } from "./useReducedMotion";
import { charsOf, splitChars, splitWords, wordsOf } from "./textMotion";

/**
 * Page-wide text motion: headings arrive word by word from the left, and
 * interactive labels answer pointer and keyboard focus per character.
 *
 * It runs from one place because the content is static; every element keeps its
 * text at rest, so nothing here hides copy, changes an accessible name, or
 * survives a reduced-motion switch (the hook reverts and restores the markup).
 */
const HEADINGS = "#hero-title, .section h2, .capabilities h2";
const JUMP = ".text-link, .button, .hero-meta a, .hero-foot a, .desktop-navigation a, .navigation-drawer nav a, .site-footer a";
const FLIP = ".writing-row h3, .capability-grid h3, .certification-grid h3, .project h3, .career-timeline h3";
const LABELS = ".section .eyebrow, .capabilities .eyebrow, .project .eyebrow";

export function TextInteractions() {
  const reducedMotion = useReducedMotion();

  useGSAP(
    (_context, contextSafe) => {
      if (reducedMotion || typeof document === "undefined") return;
      const restores: (() => void)[] = [];

      // Headings settle in from the left, one word at a time. Words never drop
      // below 0.86 opacity, so the sentence stays readable the whole way.
      for (const heading of document.querySelectorAll<HTMLElement>(HEADINGS)) {
        restores.push(splitWords(heading));
        const words = wordsOf(heading);
        if (!words.length) continue;
        gsap.from(words, {
          x: -18,
          y: 10,
          opacity: 0.86,
          duration: reveal.duration,
          ease: reveal.ease,
          stagger: 0.035,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: heading, start: "top 88%", once: true },
        });
      }

      // Mono labels come up character by character, like a line being typed.
      // They start at 0.35 opacity, never hidden, and the stagger is short.
      for (const label of document.querySelectorAll<HTMLElement>(LABELS)) {
        restores.push(splitChars(label));
        const chars = charsOf(label);
        if (!chars.length) continue;
        gsap.from(chars, {
          opacity: 0.35,
          y: 6,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.012,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: label, start: "top 92%", once: true },
        });
      }

      // Hover and focus effects. Characters are split once; each pass animates
      // them and clears itself, so the resting DOM keeps no inline styles.
      const bind = (element: HTMLElement, play: (chars: HTMLElement[]) => void) => {
        // Flex containers size themselves from their items, so split characters
        // there collapse to one per line. Those elements move as a whole instead.
        const flex = getComputedStyle(element).display.includes("flex");
        if (!flex) restores.push(splitChars(element));
        const chars = flex ? [element] : charsOf(element);
        if (!chars.length) return;
        const run = contextSafe!(() => play(chars));
        element.addEventListener("pointerenter", run);
        element.addEventListener("focus", run);
        restores.push(() => {
          element.removeEventListener("pointerenter", run);
          element.removeEventListener("focus", run);
        });
      };

      for (const element of document.querySelectorAll<HTMLElement>(JUMP)) {
        bind(element, chars =>
          gsap.to(chars, {
            y: -5,
            duration: 0.22,
            ease: "power2.out",
            stagger: { each: 0.018, from: "start" },
            overwrite: true,
            yoyo: true,
            repeat: 1,
            clearProps: "transform",
          }),
        );
      }

      for (const element of document.querySelectorAll<HTMLElement>(FLIP)) {
        bind(element, chars =>
          gsap.fromTo(
            chars,
            { rotateX: 0 },
            {
              rotateX: 360,
              duration: 0.55,
              ease: "power3.inOut",
              stagger: { each: 0.022, from: "start" },
              overwrite: true,
              clearProps: "transform",
            },
          ),
        );
      }

      return () => {
        for (const restore of restores) restore();
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return null;
}
