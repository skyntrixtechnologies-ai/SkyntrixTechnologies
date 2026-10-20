import { useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn, FaGithub, FaEnvelope, FaXTwitter, FaDribbble, FaInstagram } from "react-icons/fa6";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
  hover: { y: -6, transition: { duration: 0.25, ease: "easeOut" } },
};

const SOCIAL_ICONS = [
  { key: "linkedin", icon: FaLinkedinIn, label: "LinkedIn" },
  { key: "github", icon: FaGithub, label: "GitHub" },
  { key: "twitter", icon: FaXTwitter, label: "X (Twitter)" },
  { key: "dribbble", icon: FaDribbble, label: "Dribbble" },
  { key: "instagram", icon: FaInstagram, label: "Instagram" },
];

function MemberBio({ bio }) {
  const [expanded, setExpanded] = useState(false);
  if (!bio) return null;
  const isLong = bio.length > 140;
  return (
    <div className="mt-4 w-full">
      <p className={`text-sm leading-relaxed text-ink/60 ${isLong && !expanded ? "line-clamp-4" : ""}`}>{bio}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-1 rounded text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function TeamCard({ member, index }) {
  const initials = member.avatar
    || (member.name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const socials = SOCIAL_ICONS.filter(({ key }) => member.social?.[key]);
  const hasSkills = Array.isArray(member.skills) && member.skills.length > 0;

  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-60px" }}
      className="group relative flex h-full flex-col items-center overflow-hidden rounded-[24px] border border-ink/10 bg-white p-7 text-center shadow-card transition-[box-shadow,border-color] duration-300 hover:border-primary/20 hover:shadow-soft md:p-8"
    >
      <div className="relative mt-1">
        <div className="absolute inset-0 -m-2 rounded-full bg-primary-gradient opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40" />
        <div className="relative rounded-full bg-gradient-to-tr from-primary via-primary to-secondary p-[3px] shadow-soft transition-transform duration-500 group-hover:scale-[1.05]">
          {member.photo ? (
            <img src={member.photo} alt={`${member.name} portrait`} loading="lazy" className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <span className="grid h-24 w-24 place-items-center rounded-full bg-primary-gradient font-display text-2xl font-bold text-white">
              {initials}
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-5 text-2xl font-bold text-ink">{member.name}</h3>
      <div className="mt-1 text-sm font-semibold text-primary">{member.role}</div>

      <MemberBio bio={member.bio} />

      

      {(socials.length > 0 || member.email) && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              aria-label={`Email ${member.name}`}
              title={`Email ${member.name}`}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white text-ink/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-primary-gradient hover:text-white hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <FaEnvelope className="h-4 w-4" />
            </a>
          )}
          {socials.map(({ key, icon: Icon, label }) => (
            <a
              key={key}
              href={member.social[key]}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white text-ink/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-primary-gradient hover:text-white hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function TeamSection({ team = [] }) {
  if (!team || !team.length) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <span className="label uppercase tracking-widest text-primary">
              <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
              Our Team
              <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
            </span>
            <h2 className="heading-lg mt-3 text-ink">The People Behind the Craft</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">
              Meet the people turning ideas into meaningful digital experiences.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {team.map((member, i) => (
              <TeamCard key={member.name || `team-${i}`} member={member} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
