import React from "react";
import { BookHeart, Users, Globe, Leaf, CheckCircle, HelpCircle } from "lucide-react";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* MAIN TITLE */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          About <span className="text-yellow-500">BookShare</span>
        </h1>

        {/* INTRO */}
        <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto mb-12">
          BookShare is a community-driven platform where readers can easily 
          <strong> buy, sell, donate, or exchange books.</strong>  
          Our goal is to make reading affordable, accessible, and sustainable
          for everyone.
        </p>

        {/* THREE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white shadow-sm rounded-2xl p-6 hover:shadow-md transition text-center">
            <BookHeart className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Love for Books</h3>
            <p className="text-gray-600">
              Preserving the joy of reading by giving every book a second life.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-6 hover:shadow-md transition text-center">
            <Users className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Built for Readers</h3>
            <p className="text-gray-600">
              Helping students, collectors & casual readers connect through books.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-6 hover:shadow-md transition text-center">
            <Globe className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Global Reach</h3>
            <p className="text-gray-600">
              Creating a worldwide network of book lovers & sharers.
            </p>
          </div>
        </div>

        {/* MISSION + VISION */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white shadow-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To make reading accessible to everyone while reducing book waste through 
              sharing, reselling, and community-driven circulation.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To build the world’s largest sustainable platform where books continuously
              find new readers without ending up unused or discarded.
            </p>
          </div>
        </div>

        {/* HOW BOOKSHARE WORKS */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            How <span className="text-yellow-500">BookShare</span> Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white shadow rounded-2xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg text-gray-800">List Your Book</h3>
              <p className="text-gray-600 mt-2">
                Upload book details & set your preferred price.
              </p>
            </div>

            <div className="bg-white shadow rounded-2xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg text-gray-800">Connect With Readers</h3>
              <p className="text-gray-600 mt-2">
                Buyers contact you directly through the platform.
              </p>
            </div>

            <div className="bg-white shadow rounded-2xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg text-gray-800">Sell or Exchange</h3>
              <p className="text-gray-600 mt-2">
                Finalize the exchange & give the book a new home.
              </p>
            </div>
          </div>
        </div>

        {/* SUSTAINABILITY SECTION */}
        <div className="mt-24 bg-white p-10 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-10">
          <Leaf className="w-20 h-20 text-green-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Promoting Sustainability 🌱
            </h2>
            <p className="text-gray-600 text-lg">
              Every book shared helps reduce paper waste and encourages a circular
              reading economy. Together, we support a more eco-friendly future.
            </p>
          </div>
        </div>

        {/* TEAM (optional minimal) */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Meet the Team 👨‍💻📚
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition"
              >
                <img
                  src={`https://i.pravatar.cc/150?img=${i + 15}`}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-400"
                />
                <h3 className="font-semibold text-lg text-gray-800">Team Member {i}</h3>
                <p className="text-gray-600 text-sm">Developer / Designer / Manager</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Frequently Asked Questions ❓
          </h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h4 className="font-bold flex items-center gap-2 text-gray-800">
                <HelpCircle className="w-5 h-5 text-yellow-500" /> Is BookShare free to use?
              </h4>
              <p className="text-gray-600 mt-2">
                Yes! Browsing and listing books are completely free.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h4 className="font-bold flex items-center gap-2 text-gray-800">
                <HelpCircle className="w-5 h-5 text-yellow-500" /> How do I sell a book?
              </h4>
              <p className="text-gray-600 mt-2">
                Go to the “Sell” page, upload details, set your price, and wait
                for interested readers to contact you.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h4 className="font-bold flex items-center gap-2 text-gray-800">
                <HelpCircle className="w-5 h-5 text-yellow-500" /> Can I donate books?
              </h4>
              <p className="text-gray-600 mt-2">
                Absolutely! BookShare supports book donations to readers and
                local communities.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Join the BookShare Community
          </h2>
          <p className="text-gray-600 mb-6">
            Be part of a movement that values reading, sustainability & sharing.
          </p>
          <a
            href="/signup"
            className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-semibold hover:bg-yellow-300 transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
