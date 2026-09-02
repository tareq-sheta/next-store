// import { Code2, Zap, ShieldCheck, MonitorSmartphone } from "react-icons/fa";
import Image from "next/image";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiTypescript,
  SiLucide,
} from "react-icons/si";
import { FaLightbulb } from "react-icons/fa";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

const originalTeam: TeamMember[] = [
  {
    name: "Abdelrahman Mohammed",
    role: "Team Leader & Full Stack Developer",
    description:
      "Team Leader and Full Stack Developer with a passion for creating innovative solutions and leading projects to success.",
    image: "/assets/images/ourTeam/abdo.jpg",
  },
  {
    name: "AlHussein Mohammed",
    role: "Frontend Developer",
    description:
      "Frontend Developer with a keen eye for design and user experience, dedicated to building responsive and engaging web applications.",
    image: "/assets/images/ourTeam/hussein.jpg",
  },
  {
    name: "Ahmed Elmessery",
    role: "Backend Developer",
    description:
      "Backend Developer with expertise in server-side technologies, ensuring robust and scalable applications that power our platform.",
    image: "/assets/images/ourTeam/elmesery.png",
  },
  {
    name: "Hossam Islam",
    role: "UI/UX Designer",
    description:
      "UI/UX Designer with a passion for creating intuitive and visually appealing interfaces that enhance user satisfaction and engagement.",
    image: "/assets/images/ourTeam/hossam.jpg",
  },
  {
    name: "Ahmed Salah",
    role: "DevOps Engineer",
    description:
      "DevOps Engineer focused on automating and optimizing our development processes, ensuring smooth deployment and operation of our applications.",
    image: "/assets/images/ourTeam/aboshendy.jpg",
  },
  {
    name: "Tareq Sheta",
    role: "QA Engineer",
    description:
      "Quality Assurance Specialist dedicated to ensuring the highest standards of quality and performance in our products through rigorous testing and feedback.",
    image: "/assets/images/ourTeam/tarek.jpg",
  },
];

export const metadata = {
  title: "About Us - Cyber Tech Store",
  description:
    "The story of Cyber Tech Store, from its vanilla JS roots to its modern Next.js evolution.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            About <span className="text-blue-600">Cyber</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Welcome to your trusted destination for the latest in technology. We
            are passionate about providing innovative gadgets, modern devices,
            and quality products. Our mission is to blend technology with
            simplicity, offering you a seamless shopping experience from start
            to finish.
          </p>
        </div>

        {/* The Rebuild / Solo Developer Highlight */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden mb-24">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6">
                <FaLightbulb className="w-4 h-4" /> Version 2.0 Evolution
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Architected & Rebuilt for the Modern Web
              </h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                While Cyber Tech Store began its life as a Vanilla JavaScript
                project, the platform required a massive leap forward to meet
                modern performance and scalability standards.
              </p>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                The entire application was completely refactored, redesigned,
                and rebuilt from the ground up into a high-performance
                architecture by our lead developer,{" "}
                <strong className="text-white font-semibold">
                  Tareq Sheta
                </strong>
                .
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium border border-slate-700">
                  <SiNextdotjs className="w-4 h-4 text-blue-400" /> Next.js
                </span>
                <span className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium border border-slate-700">
                  <SiTypescript className="w-4 h-4 text-blue-500" /> TypeScript
                </span>
                <span className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium border border-slate-700">
                  <SiTailwindcss className="w-4 h-4 text-cyan-400" /> Tailwind
                  CSS
                </span>
              </div>
            </div>

            {/* Tareq Sheta Profile Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 transform transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20">
              <div className="relative w-32 h-32 shrink-0 rounded-2xl overflow-hidden border-2 border-blue-500/30">
                <Image
                  src={"/assets/images/ourTeam/tarek.jpg"}
                  alt="Tareq Sheta"
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white mb-1">
                  Tareq Sheta
                </h3>
                <p className="text-blue-400 font-medium mb-3">
                  Lead Architect & Developer
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Solely responsible for the V2 refactoring initiative.
                  Transitioned the entire legacy codebase to a modern, type-safe
                  Next.js environment, implementing modern UI/UX principles with
                  Tailwind CSS, and ensuring enterprise-grade code quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Original Founders / V1 Team */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Original Visionaries
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Acknowledging the original team members who built the initial
              iteration, and celebrating Tareq Sheta's journey from the original
              QA Engineer to the sole developer of this upgraded V2
              architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {originalTeam.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 bg-gray-150 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-50"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 relative">
                  <h5 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h5>
                  <p className="text-sm text-blue-600 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
