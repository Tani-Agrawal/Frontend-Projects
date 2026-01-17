function renderModernTemplate(data) {
  const container = document.createElement("div");
  container.className = "resume modern-template";

  // HEADER
  if (data.personal) {
    const header = document.createElement("div");
    header.className = "modern-header";

    header.innerHTML = `
      <h1>${data.personal.name || ""}</h1>
      <p>${data.personal.email || ""} | ${data.personal.phone || ""}</p>
    `;

    container.appendChild(header);
  }

  const body = document.createElement("div");
  body.className = "modern-body";

  // ABOUT
  if (data.about?.summary) {
    body.innerHTML += `
      <h3>Summary</h3>
      <p>${data.about.summary}</p>
    `;
  }

  // SKILLS
  if (Array.isArray(data.skills)) {
    const validSkills = data.skills.filter(s => s.skill);
    if (validSkills.length) {
      body.innerHTML += `
        <h3>Skills</h3>
        <p>${validSkills.map(s => s.skill).join(" • ")}</p>
      `;
    }
  }

  // EXPERIENCE
  if (Array.isArray(data.experience)) {
    const validExp = data.experience.filter(
      e => e.role || e.company || e.duration
    );

    if (validExp.length) {
      body.innerHTML += `<h3>Experience</h3>`;
      validExp.forEach(item => {
        body.innerHTML += `
          <p><strong>${item.role || ""}</strong> — ${item.company || ""} (${item.duration || ""})</p>
        `;
      });
    }
  }

  // EDUCATION
  if (Array.isArray(data.education)) {
    const validEdu = data.education.filter(
      e => e.degree || e.university || e.year
    );

    if (validEdu.length) {
      body.innerHTML += `<h3>Education</h3>`;
      validEdu.forEach(item => {
        body.innerHTML += `
          <p>${item.degree || ""}, ${item.university || ""} (${item.year || ""})</p>
        `;
      });
    }
  }

  // CERTIFICATES
  if (Array.isArray(data.certificates)) {
    const validCerts = data.certificates.filter(
      c => c.name || c.issuer || c.year
    );

    if (validCerts.length) {
      body.innerHTML += `<h3>Certificates</h3>`;
      validCerts.forEach(item => {
        body.innerHTML += `
          <p>${item.name || ""} — ${item.issuer || ""} (${item.year || ""})</p>
        `;
      });
    }
  }

  container.appendChild(body);
  return container;
}
