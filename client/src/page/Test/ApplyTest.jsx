import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplyTest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    nationality: "",
    address: "",
    education: "",
    emergencyName: "",
    emergencyPhone: "",
    document: null,
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Application Submitted Successfully!");

    navigate("/student/dashboard");
  };

  return (
    <section className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">
          Apply for Language Test
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Complete the form below to register for the examination.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Information */}

          <div>
            <h2 className="text-2xl font-semibold mb-4">Student Information</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <select
                name="gender"
                onChange={handleChange}
                className="border rounded-lg p-3"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input
                type="date"
                name="dob"
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                onChange={handleChange}
                className="border rounded-lg p-3"
              />
            </div>

            <textarea
              name="address"
              rows="3"
              placeholder="Address"
              onChange={handleChange}
              className="border rounded-lg p-3 w-full mt-5"
            />
          </div>

          {/* Education */}

          <div>
            <h2 className="text-2xl font-semibold mb-4">Education</h2>

            <input
              type="text"
              name="education"
              placeholder="Highest Qualification"
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          {/* Emergency */}

          <div>
            <h2 className="text-2xl font-semibold mb-4">Emergency Contact</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="emergencyName"
                placeholder="Contact Person"
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                type="tel"
                name="emergencyPhone"
                placeholder="Emergency Phone"
                onChange={handleChange}
                className="border rounded-lg p-3"
              />
            </div>
          </div>

          {/* Upload */}

          <div>
            <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>

            <input
              type="file"
              name="document"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          {/* Terms */}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />

            <label>I agree to the examination rules and regulations.</label>
          </div>

          {/* Buttons */}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full border border-blue-700 text-blue-700 py-3 rounded-lg hover:bg-blue-700 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ApplyTest;
