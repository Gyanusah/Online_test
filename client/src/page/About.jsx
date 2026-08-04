import React from "react";
import { BookOpen, Users, Award, Globe } from "lucide-react";

const About = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-blue-900">About Us</h1>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            We are committed to helping students achieve their academic,
            professional, and personal goals through high-quality language
            education and skill development.
          </p>
        </div>

        {/* About Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop"
              alt="Students learning"
              className="rounded-2xl shadow-xl w-full h-[450px] object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-5">
              Welcome to Our Language Academy
            </h2>

            <p className="text-gray-600 leading-8 mb-5">
              Our institute provides professional language training for
              students, job seekers, and professionals. Whether you want to
              study abroad, improve your communication skills, or learn a new
              language, our experienced instructors are here to guide you every
              step of the way.
            </p>

            <p className="text-gray-600 leading-8">
              We offer practical learning methods, small class sizes, and
              interactive sessions to ensure every student gains confidence and
              fluency in their chosen language.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition">
            <BookOpen className="mx-auto text-blue-700" size={45} />
            <h3 className="text-xl font-semibold mt-4">Quality Courses</h3>
            <p className="text-gray-600 mt-2">
              Learn Japanese, English, Korean, Chinese, IELTS, and more.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition">
            <Users className="mx-auto text-blue-700" size={45} />
            <h3 className="text-xl font-semibold mt-4">Expert Teachers</h3>
            <p className="text-gray-600 mt-2">
              Experienced instructors dedicated to your learning success.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition">
            <Award className="mx-auto text-blue-700" size={45} />
            <h3 className="text-xl font-semibold mt-4">Certified Programs</h3>
            <p className="text-gray-600 mt-2">
              Receive recognized certificates after course completion.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition">
            <Globe className="mx-auto text-blue-700" size={45} />
            <h3 className="text-xl font-semibold mt-4">Global Opportunities</h3>
            <p className="text-gray-600 mt-2">
              Prepare for study abroad, international careers, and cultural
              exchange.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="mt-20 bg-blue-900 text-white rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="max-w-4xl mx-auto text-lg leading-8">
            Our mission is to empower students with language skills, confidence,
            and global communication abilities. We strive to create an engaging
            learning environment where every student can achieve their dreams
            through education.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
