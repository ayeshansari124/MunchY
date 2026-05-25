"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";

const slides = [
  { title: "Pizza", subtitle: "Everything is better with a", image: "/pizza.webp" },
  { title: "Cake", subtitle: "Life is sweeter with a", image: "/cake.avif" },
  { title: "Burger", subtitle: "Happiness comes with a", image: "/burger.webp" },
  { title: "Salad", subtitle: "Feel fresh, feel good with a", image: "/salad.webp" },
  { title: "Fries", subtitle: "Enjoy crunchy and crispy", image: "/fries.avif" },
  { title: "Ice Cream", subtitle: "Cold happiness in every bite of", image: "/icecream2.webp" },
  { title: "Pasta", subtitle: "Comfort food at its best? A", image: "/pasta.png" },
];

export default function Hero() {
  const { user } = useUser();
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % slides.length);
        setAnimate(true);
      }, 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[index];

  return (
    <section className="overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* 
          Mobile  -> column
          Desktop -> row
        */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* ================= TEXT ================= */}
          <div
            className={`
              w-full md:w-1/2
              transition-all duration-700 ease-out
              ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}
            `}
          >
            <div className="mb-4">
              {user ? (
                <>
                  <p className="text-sm font-bold text-gray-700">
                    Hi{" "}
                    <span className="text-red-600 text-3xl italic">
                      {user.name}
                    </span>{" "}
                    👋
                  </p>
                  <p className="text-lg font-bold text-gray-500 mt-1">
                    Feeling hungry? We’ve got you covered 🍕
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Feeling hungry? We’ve got you covered 🍕
                </p>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {slide.subtitle}
              <span className="text-red-600 italic"> {slide.title}</span>
            </h1>

            <p className="mt-4 text-gray-600 font-bold max-w-md">
              Freshly prepared, delicious, and made just for you.
            </p>

            <div className="mt-6 flex gap-6">
              <button className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700">
                Order Now
              </button>
              <button className="text-gray-700 hover:text-red-600">
                Learn more →
              </button>
            </div>
          </div>

          {/* ================= IMAGE ================= */}
          <div
            className={`
              w-full md:w-1/2
              relative aspect-square max-w-md
              transition-all duration-700 ease-out
              ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}
            `}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-contain"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}
