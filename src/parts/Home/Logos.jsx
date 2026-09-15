import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useReducer, useRef } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export default function Logos() {
  const logoRef = useRef(null);
  const textRef = useRef(null);
  let text = "Abraham Naiborhu";
  useGSAP(() => {
    let tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: logoRef.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      })
      .fromTo(
        textRef.current.querySelectorAll("span"),
        {
          x: -12,
          y: -20,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.2,
          stagger: 0.2,
          repeat: -1,
        },
      );
  }, []);
  return (
    <section className="py-3 md:py-8 lg:py-14 xl:py-20 bg-yellow_custom" ref={logoRef}>
      <p
        className="text-base md:text-3xl lg:text-5xl xl:text-8xl font-italic text-center font-sen text-white"
        ref={textRef}
      >
        {text.split("").map((char, index) => {
          if (char === "\n") {
            return <br key={index} />;
          }
          return (
            <span key={index} className="opacity-0">
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </p>
    </section>
  );
}
