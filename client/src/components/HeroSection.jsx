// import React from "react";
// import Image from "../assets/HeroSction.jpeg";

// function HeroSection() {
//   return (
//     <div>
//       <section
//         className="relative h-screen bg-cover bg-center "
//         style={{ backgroundImage: `url(${Image})` }}
//       >
//         <div className="absloute  insert-0 bg-black/50"></div>
//         <div className=" relative z-10 flex  flex-col h-full items-center justify-center ">
//           {/* text */}
//           <div className=" text-center   text-white  mx-w-3xl ">
//             <h1 className="text-4xl md:text-5xl font-bold text-gray leading-tight">
//               Learn New Skills
//             </h1>

//             <span className="text-blue-600 text-4xl font-bold">
//               Any Time , AnyWhere
//             </span>
//             <p className="mt-6 text-lg text-white transform ">
//               Join thousands of students learning programming, design, business,
//               and more from expert instructors.
//             </p>
//           </div>
//           <div>
//             <button className=" bg-blue-600 text-white m-5 p-3 rounded-2xl hover:bg-blue-800 transition  ">
//               Get started
//             </button>

//             <button className="border border-blue-600 px-4 py-3  rounded  hover:bg-blue-500 hover:text-white">
//               explore Now
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default HeroSection;

import React from "react";
import { Link } from "react-router-dom";
import Image from "../assets/HeroSction.jpeg";
import { ArrowRight, PlayCircle } from "lucide-react";

function HeroSection() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-900/70 to-slate-900/40"></div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/20 px-5 py-2 text-sm font-medium text-blue-300">
              🚀 Learn from Industry Experts
            </span>

            {/* Heading */}
            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
              Learn New Skills
              <br />
              <span className="text-blue-500">Anytime, Anywhere</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl">
              Join thousands of students learning programming, UI/UX, business,
              AI, cybersecurity, and more through expert-led online courses.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-5">
              <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:scale-105">
                Get Started
                <ArrowRight size={20} />
              </button>

              <Link
                to="/languages"
                className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-900"
              >
                <PlayCircle size={22} />
                Explore Courses
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 flex flex-wrap gap-10">
              <div>
                <h2 className="text-3xl font-bold text-white">10K+</h2>
                <p className="text-gray-400">Students</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white">500+</h2>
                <p className="text-gray-400">Courses</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white">100+</h2>
                <p className="text-gray-400">Expert Mentors</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white">4.9★</h2>
                <p className="text-gray-400">Student Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
