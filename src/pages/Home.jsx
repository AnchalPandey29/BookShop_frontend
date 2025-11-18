import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ShoppingBag,
  Users,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/* -------------------------------------
    COUNTER COMPONENT
-------------------------------------- */
const Counter = ({ end, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observe = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 1500;
          const increment = end / (duration / 16);

          const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
              start = end;
              clearInterval(counter);
            }
            setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.4 }
    );

    observe.observe(ref.current);
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-yellow-500">{count}+</p>
      <p className="text-gray-700 font-medium">{label}</p>
    </div>
  );
};

/* -------------------------------------
    TRENDING BOOK DATA
-------------------------------------- */
const trendingBooks = [
  {
    title: "Atomic Habits",
    img: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg",
  },
  {
    title: "The Psychology of Money",
    img: "https://m.media-amazon.com/images/I/81Lb75rUhLL.jpg",
  },
  {
    title: "Think Like a Monk",
    img: "https://m.media-amazon.com/images/I/81s6DUyQCZL.jpg",
  },
  {
    title: "Rich Dad Poor Dad",
    img: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg",
  },
];

/* -------------------------------------
    BOOK CARD
-------------------------------------- */
const BookCard = ({ book }) => {
  return (
    <div className="min-w-[260px] bg-gray-50 p-6 rounded-2xl shadow-lg text-center transition-all duration-300 hover:scale-105">
      <img
        src={book.img}
        alt={book.title}
        className="w-40 h-56 object-cover rounded-xl mx-auto shadow-md"
      />
      <h3 className="mt-4 font-semibold text-lg">{book.title}</h3>
    </div>
  );
};

/* -------------------------------------
    MAIN HOME COMPONENT
-------------------------------------- */
const Home = () => {
  /* Infinite loop carousel states */
  const [currentIndex, setCurrentIndex] = useState(1);
  const [noAnim, setNoAnim] = useState(false);

  /* Pause state for testimonials */
  const [pause, setPause] = useState(false);

  /* Card width calculation */
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  /* Measure width once */
  useEffect(() => {
    if (containerRef.current) {
      const card = containerRef.current.children[0];
      setCardWidth(card.offsetWidth + 24); // 24px = gap-6
    }
  }, []);

  /* Recalculate on resize */
  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const card = containerRef.current.children[0];
        setCardWidth(card.offsetWidth + 24);
      }
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* Auto-slide */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* Infinite scroll logic */
  const handleTransitionEnd = () => {
    if (currentIndex === trendingBooks.length + 1) {
      setNoAnim(true);
      setCurrentIndex(1);
      setTimeout(() => setNoAnim(false), 20);
    }
    if (currentIndex === 0) {
      setNoAnim(true);
      setCurrentIndex(trendingBooks.length);
      setTimeout(() => setNoAnim(false), 20);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-20 gap-10">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Buy, Sell & Share Books with{" "}
            <span className="text-yellow-500">BookShare</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Discover pre-loved books or sell the ones you’ve finished — join the
            largest community-driven book marketplace.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/find"
              className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-semibold hover:bg-yellow-300 transition"
            >
              Find Books
            </Link>
            <Link
              to="/sell"
              className="border border-yellow-400 text-yellow-500 px-6 py-3 rounded-2xl font-semibold hover:bg-yellow-400 hover:text-black transition"
            >
              Sell Books
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/584/584796.png"
            alt="Books"
            className="w-80 md:w-96 drop-shadow-2xl animate-float"
          />
        </div>
      </section>

      {/* COUNTERS */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <Counter end={5000} label="Books Shared" />
          <Counter end={1200} label="Active Sellers" />
          <Counter end={8000} label="Happy Readers" />
          <Counter end={150} label="Cities Covered" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Why Choose <span className="text-yellow-500">BookShare?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white shadow-sm rounded-2xl p-6 hover:shadow-lg transition">
              <BookOpen className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-gray-800">
                Explore Wide Collections
              </h3>
              <p className="text-gray-600 mt-2">
                Thousands of books across genres — fiction, non-fiction,
                academic & more.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-2xl p-6 hover:shadow-lg transition">
              <ShoppingBag className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-gray-800">
                Buy & Sell Easily
              </h3>
              <p className="text-gray-600 mt-2">
                Post or purchase books instantly with a smooth experience.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-2xl p-6 hover:shadow-lg transition">
              <Users className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-gray-800">
                Connect with Readers
              </h3>
              <p className="text-gray-600 mt-2">
                Engage with like-minded readers & join a vibrant community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING BOOKS — INFINITE LOOP */}
      <section className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Trending Books 📚
        </h2>

        <div className="relative max-w-6xl mx-auto overflow-hidden">
          <div
            ref={containerRef}
            className={`flex gap-6 transition-transform ${noAnim ? "" : "duration-500"}`}
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {/* Fake last */}
            <BookCard book={trendingBooks[trendingBooks.length - 1]} />

            {/* Real */}
            {trendingBooks.map((b, i) => (
              <BookCard key={i} book={b} />
            ))}

            {/* Fake first */}
            <BookCard book={trendingBooks[0]} />
          </div>

          {/* Buttons */}
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          What Readers Say ❤️
        </h2>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setPause(true)}
          onMouseLeave={() => setPause(false)}
        >
          <div
            className="flex gap-6 animate-scroll"
            style={{
              animationPlayState: pause ? "paused" : "running",
            }}
          >
            {[1, 2, 3, 4].map((t) => (
              <div
                key={t}
                className="min-w-[300px] bg-white/40 backdrop-blur-xl border border-white/30 p-6 rounded-3xl shadow-xl hover:scale-105 transition transform cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={`https://i.pravatar.cc/150?img=${t + 10}`}
                    className="w-12 h-12 rounded-full border-2 border-yellow-400"
                  />
                  <div>
                    <p className="font-bold text-gray-800">Reader {t}</p>
                    <p className="text-sm text-gray-600">Book Lover</p>
                  </div>
                </div>

                <p className="text-gray-700 italic text-sm">
                  “BookShare helped me discover rare books at amazing prices —
                  the whole experience feels magical!”
                </p>

                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-yellow-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-400 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to Share Your Books?
        </h2>
        <p className="text-gray-700 mb-6">
          Sign up today and turn your bookshelf into an opportunity.
        </p>
        <Link
          to="/signup"
          className="bg-black text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition inline-flex items-center gap-2"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
};

export default Home;
