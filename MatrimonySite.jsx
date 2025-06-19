import React, { useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";

const MatrimonySite = () => {
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
    phone: "",
    subscriptionDuration: "", // in months
  });
  const [showProfiles, setShowProfiles] = useState(false);

  useEffect(() => {
    const filterValidProfiles = () => {
      const today = new Date();
      const filteredProfiles = profiles.filter((profile) => {
        const expiryDate = new Date(profile.subscriptionExpiry);
        return expiryDate >= today;
      });
      setProfiles(filteredProfiles);
    };

    // Set interval to filter expired profiles every minute
    const intervalId = setInterval(() => {
      filterValidProfiles();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [profiles]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate phone number: must be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Validate dateOfBirth and age >= 18
    if (!formData.dateOfBirth) {
      alert("Please enter your date of birth.");
      return;
    }
    const age = calculateAge(formData.dateOfBirth);
    if (age < 18) {
      alert("You must be at least 18 years old to register.");
      return;
    }

    // Validate gender
    if (!formData.gender) {
      alert("Please select your gender.");
      return;
    }

    // Calculate subscriptionExpiry based on subscriptionDuration
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(formData.subscriptionDuration, 10));

    const newProfile = {
      ...formData,
      id: profiles.length + 1,
      age: age,
      subscriptionExpiry: expiryDate.toISOString().split('T')[0], // store as YYYY-MM-DD
    };
    setProfiles([...profiles, newProfile]);
    setFormData({ name: "", dateOfBirth: "", gender: "", bio: "", phone: "", subscriptionDuration: "" });
    setShowProfiles(true);
  };

  const handleBackToRegister = () => {
    setShowProfiles(false);
  };

  if (!showProfiles) {
    return (
      <div className="p-6 md:p-12 bg-gradient-to-br from-[#f9a66c] to-[#ee672f] min-h-screen text-white flex flex-col items-center justify-center font-sans">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-center drop-shadow-lg">
          Matrimony Portal - Register
        </h1>
        <div className="bg-white text-black p-8 rounded-3xl shadow-2xl max-w-md w-full">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-[#ee672f] transition"
            />
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-[#ee672f] transition"
              max={new Date().toISOString().split("T")[0]}
            />
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  required
                />
                Male
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  required
                />
                Female
              </label>
            </div>
            <input
              type="text"
              name="bio"
              placeholder="Short Bio"
              value={formData.bio}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-[#ee672f] transition"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-[#ee672f] transition"
            />
            <input
              type="number"
              name="subscriptionDuration"
              placeholder="Subscription Duration (months)"
              value={formData.subscriptionDuration}
              onChange={handleChange}
              required
              min={1}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-[#ee672f] transition"
            />
            <button
              type="submit"
              className="bg-[#ee672f] text-white font-bold py-3 rounded-lg hover:bg-[#d95a22] shadow-lg transition"
            >
              Submit
            </button>
          </form>
          <button
            onClick={() => setShowProfiles(true)}
            className="mt-6 w-full bg-white text-[#ee672f] font-bold py-3 rounded-lg hover:bg-gray-100 shadow-lg transition"
          >
            View Registered People
          </button>
        </div>
      </div>
    );
  }

  // Show all profiles without filtering by gender
  return (
    <div className="p-6 md:p-12 bg-gradient-to-br from-[#f9a66c] to-[#ee672f] min-h-screen text-white flex flex-col items-center font-sans">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-center drop-shadow-lg">
        Matrimony Portal - Profiles
      </h1>
      <button
        onClick={handleBackToRegister}
        className="mb-8 bg-white text-[#ee672f] font-bold py-3 px-6 rounded-lg hover:bg-gray-100 shadow-lg transition"
      >
        Back to Register
      </button>
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl w-full">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white text-black shadow-2xl rounded-3xl p-6 flex flex-col hover:scale-[1.03] transform transition"
          >
            <h2 className="text-2xl font-extrabold">{profile.name}</h2>
            <p className="text-lg">Age: {profile.age}</p>
            <p className="text-md my-4">{profile.bio}</p>
            <p className="text-lg font-semibold">Phone: {profile.phone}</p>
            <p className="text-md font-semibold">Gender: {profile.gender}</p>
            <a
              href={`tel:${profile.phone}`}
              className="inline-flex items-center gap-3 text-[#ee672f] mt-4 font-semibold hover:underline"
            >
              <PhoneCall size={20} /> Call Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatrimonySite;
