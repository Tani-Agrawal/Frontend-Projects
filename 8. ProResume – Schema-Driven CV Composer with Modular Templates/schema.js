const resumeSchema = {
  // 1️ PERSONAL INFORMATION
  personal: {
    multiple: false,
    fields: [
      { label: "Full Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Phone", key: "phone" }
    ]
  },

  // 2️ PROFESSIONAL LINKS
  links: {
    multiple: false,
    fields: [
      { label: "LinkedIn URL", key: "linkedin" },
      { label: "GitHub URL", key: "github" }
    ]
  },

  // 3️ ABOUT / SUMMARY
  about: {
    multiple: false,
    fields: [
      { label: "Professional Summary", key: "summary" }
    ]
  },

  // 4️ SKILLS
  skills: {
    multiple: true,
    fields: [
      { label: "Skill", key: "skill" }
    ]
  },

  // 5️ EXPERIENCE
  experience: {
    multiple: true,
    fields: [
      { label: "Role", key: "role" },
      { label: "Company", key: "company" },
      { label: "Duration", key: "duration" }
    ]
  },

  // 6️ EDUCATION
  education: {
    multiple: true,
    fields: [
      { label: "Degree", key: "degree" },
      { label: "University", key: "university" },
      { label: "Year", key: "year" }
    ]
  },

  // 7️ CERTIFICATIONS
  certificates: {
    multiple: true,
    fields: [
      { label: "Certificate Name", key: "name" },
      { label: "Issuer", key: "issuer" },
      { label: "Year", key: "year" }
    ]
  }
};
