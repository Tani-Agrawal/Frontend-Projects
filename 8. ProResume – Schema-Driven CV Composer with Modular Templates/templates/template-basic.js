function renderBasicTemplate(data) {
  const container = document.createElement("div");
  container.className = "resume basic-template";

  // PERSONAL
  if (data.personal) {
    const header = document.createElement("div");
    header.className = "resume-header";

    const name = document.createElement("h1");
    name.innerText = data.personal.name || "";

    const contact = document.createElement("p");
    contact.innerText = `${data.personal.email || ""} | ${data.personal.phone || ""}`;

    header.appendChild(name);
    header.appendChild(contact);
    container.appendChild(header);
  }

  // LINKS
  if (data.links?.linkedin || data.links?.github) {
    const links = document.createElement("p");
    links.innerText = `${data.links.linkedin || ""} ${data.links.github || ""}`;
    container.appendChild(links);
  }

  // ABOUT
  if (data.about?.summary) {
    const about = document.createElement("div");
    about.className = "resume-section";

    about.innerHTML = `
      <h3>Summary</h3>
      <p>${data.about.summary}</p>
    `;
    container.appendChild(about);
  }

  // SKILLS
  if (Array.isArray(data.skills)) {
    const validSkills = data.skills.filter(s => s.skill);

    if (validSkills.length) {
      const skills = document.createElement("div");
      skills.className = "resume-section";

      skills.innerHTML = `<h3>Skills</h3>
        <p>${validSkills.map(s => s.skill).join(", ")}</p>`;

      container.appendChild(skills);
    }
  }

  // EXPERIENCE
  if (Array.isArray(data.experience)) {
    const validExp = data.experience.filter(
      e => e.role || e.company || e.duration
    );

    if (validExp.length) {
      const exp = document.createElement("div");
      exp.className = "resume-section";
      exp.innerHTML = `<h3>Experience</h3>`;

      validExp.forEach(item => {
        const p = document.createElement("p");
        p.innerText = `${item.role || ""} at ${item.company || ""} (${item.duration || ""})`;
        exp.appendChild(p);
      });

      container.appendChild(exp);
    }
  }

  // EDUCATION
  if (Array.isArray(data.education)) {
    const validEdu = data.education.filter(
      e => e.degree || e.university || e.year
    );

    if (validEdu.length) {
      const edu = document.createElement("div");
      edu.className = "resume-section";
      edu.innerHTML = `<h3>Education</h3>`;

      validEdu.forEach(item => {
        const p = document.createElement("p");
        p.innerText = `${item.degree || ""} - ${item.university || ""} (${item.year || ""})`;
        edu.appendChild(p);
      });

      container.appendChild(edu);
    }
  }

  // CERTIFICATES
  if (Array.isArray(data.certificates)) {
    const validCerts = data.certificates.filter(
      c => c.name || c.issuer || c.year
    );

    if (validCerts.length) {
      const cert = document.createElement("div");
      cert.className = "resume-section";
      cert.innerHTML = `<h3>Certificates</h3>`;

      validCerts.forEach(item => {
        const p = document.createElement("p");
        p.innerText = `${item.name || ""} - ${item.issuer || ""} (${item.year || ""})`;
        cert.appendChild(p);
      });

      container.appendChild(cert);
    }
  }

  return container;
}
