import React from "react";
import Image from "next/image";
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const TeacherCard = ({ teacher }) => {
  const {
    name,
    role,
    imageUrl,
    experience,
    specialties,
    achievements,
    socialLinks = {}
  } = teacher;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Teacher Image */}
      <div className="relative h-64 w-full">
        <Image
          src={imageUrl || "/images/default-teacher.jpg"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Teacher Info */}
      <div className="p-6">
        <p className="text-xl font-bold text-gray-800 mb-2">{name}</p>
        <p className="text-green-600 font-semibold mb-3">{role}</p>
        
        {experience && (
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Kinh nghiệm:</span> {experience}
          </p>
        )}

        {achievements && achievements.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800 mb-2">Kinh nghiệm:</p>
            <ul className="text-gray-700 text-sm space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">•</span>
                  <span>{achievement.replace('•', '').trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specialties */}
        {specialties && specialties.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800 mb-2">Chuyên môn:</p>
            <div className="flex flex-wrap gap-1">
              {specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}


        {/* Social Links */}
        <div className="flex justify-center space-x-4 pt-4 border-t border-gray-100">
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              className="text-gray-500 hover:text-green-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn của ${name}`}
            >
              <FaLinkedin size={20} />
            </a>
          )}
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              className="text-gray-500 hover:text-green-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Facebook của ${name}`}
            >
              <FaFacebook size={20} />
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              className="text-gray-500 hover:text-green-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram của ${name}`}
            >
              <FaInstagram size={20} />
            </a>
          )}
          {socialLinks.youtube && (
            <a
              href={socialLinks.youtube}
              className="text-gray-500 hover:text-green-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`YouTube của ${name}`}
            >
              <FaYoutube size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
