import { GraduationCap, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-300">
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3">
              <div className=" p-3 rounded-xl">
                {/* <GraduationCap className="text-white" size={28} /> */}
                <Link to="/" className="text-blue-600">
                  <img className="h-15 w-15 " src={logo} alt="logo" />
                </Link>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Integral Hub Academy
                </h2>
                <p className="text-sm text-gray-400">Learn Japanese Online</p>
              </div>
            </div>

            <p className="mt-6 leading-7 text-gray-400">
              Master Japanese, IELTS/PTE kOREN with expert teachers, interactive
              lessons, vocabulary practice, JLPT preparation, quizzes and live
              classes.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              {[
                FaFacebookF,
                FaInstagram,
                FaLinkedinIn,
                FaYoutube,
                FaXTwitter,
              ].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500 transition duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-6">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {["Home", "About", "Courses", "Teachers", "Blog", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="flex items-center gap-2 hover:text-red-400 transition"
                    >
                      <ArrowRight size={16} />
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-6">
              Popular Courses
            </h3>

            <ul className="space-y-4">
              {[
                "JLPT N5",
                "JLPT N4",
                "JLPT N3",
                "JLPT N2",
                "Japanese Grammar",
                "Kanji Master",
              ].map((course) => (
                <li key={course}>
                  <a
                    href="#"
                    className="flex items-center gap-2 hover:text-red-400 transition"
                  >
                    <ArrowRight size={16} />
                    {course}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-6">
              Contact Us
            </h3>

            <div className="space-y-6">
              <div className="flex gap-3">
                <MapPin className="text-red-500 mt-1" />
                <div>
                  <p className="font-semibold text-white">Address</p>
                  <p className="text-gray-400">Kathmandu, Nepal</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="text-red-500 mt-1" />
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p className="text-gray-400">+9779826753125</p>
                  <p className="text-gray-400">+9779866156534</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="text-red-500 mt-1" />
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p className="text-gray-400">Shahgyanu0@gmail.com</p>
                  <p className="text-gray-400">integral@languageacademy.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Subscribe to our Newsletter
            </h2>
            <p className="text-gray-400 mt-2">
              Get the latest courses, updates and learning tips.
            </p>
          </div>

          <form className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg bg-slate-900 border border-slate-700 outline-none text-white"
            />

            <button className="bg-red-500 hover:bg-red-600 px-6 rounded-r-lg text-white font-semibold transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Gyanendra sah. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-red-400 transition">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-red-400 transition">
              Terms of Service
            </a>

            <a href="#" className="hover:text-red-400 transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
