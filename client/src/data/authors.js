export const authors = [
  {
    id: "arjun-skyntrix",
    name: "Arjun Skyntrix",
    role: "Founder & CEO",
    bio: "Product strategist with 10+ years leading digital growth for global brands. Passionate about building digital solutions that drive real business outcomes.",
    expertise: ["Product Strategy", "Business Growth", "Digital Transformation", "Leadership"],
    avatar: "AS",
    social: {
      linkedin: "https://www.linkedin.com/in/skyntrix",
      twitter: "https://x.com/skyntrix"
    }
  },
  {
    id: "vikram-singh",
    name: "Vikram Singh",
    role: "Head of Engineering",
    bio: "Full-stack architect building scalable, secure web platforms. Specializes in React, Next.js, Node.js and cloud infrastructure.",
    expertise: ["React", "Next.js", "Node.js", "MongoDB", "AWS", "System Architecture"],
    avatar: "VS",
    social: {
      linkedin: "https://www.linkedin.com/in/skyntrix",
      github: "https://github.com/skyntrix"
    }
  },
  {
    id: "meera-nair",
    name: "Meera Nair",
    role: "VP of Design",
    bio: "Award-winning designer obsessed with beautiful, usable interfaces. Creates design systems that scale across products and brands.",
    expertise: ["UI/UX Design", "Design Systems", "Figma", "Brand Identity", "Prototyping"],
    avatar: "MN",
    social: {
      linkedin: "https://www.linkedin.com/in/skyntrix",
      dribbble: "https://dribbble.com/skyntrix"
    }
  },
  {
    id: "ishita-patel",
    name: "Ishita Patel",
    role: "Marketing Lead",
    bio: "Growth marketer driving measurable ROI across SEO, social media and content strategy. Data-driven approach to digital marketing.",
    expertise: ["SEO", "Content Strategy", "Social Media Marketing", "Analytics", "Growth Marketing"],
    avatar: "IP",
    social: {
      linkedin: "https://www.linkedin.com/in/skyntrix",
      instagram: "https://instagram.com/skyntrix"
    }
  }
];

export function getAuthorById(id) {
  return authors.find((a) => a.id === id);
}

export function getAuthorByName(name) {
  return authors.find((a) => a.name === name);
}

export function getAuthorArticles(authorId, allPosts) {
  return allPosts.filter((p) => p.authorId === authorId);
}
