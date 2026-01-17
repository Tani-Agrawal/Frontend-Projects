/* ================= DOM ELEMENTS ================= */
const formContainer = document.getElementById("formContainer");
const previewContainer = document.getElementById("previewContainer");
const switcherButtons = document.querySelectorAll(".template-switcher button");
const printBtn = document.getElementById("printBtn");

// ATS UI
const atsBtn = document.getElementById("atsBtn");
const jobDescInput = document.getElementById("jobDesc");
const atsProgressBar = document.getElementById("atsProgressBar");
const atsProgress = document.querySelector(".ats-progress");
const atsResult = document.getElementById("atsResult");

/* ================= STATE ================= */
let resumeData = {};
let activeTemplate = "basic";

/* ================= STORAGE ================= */
function saveData() {
  localStorage.setItem("resume-data", JSON.stringify(resumeData));
  localStorage.setItem("active-template", activeTemplate);
}

function loadData() {
  const savedData = localStorage.getItem("resume-data");
  const savedTemplate = localStorage.getItem("active-template");
  if (savedData) resumeData = JSON.parse(savedData);
  if (savedTemplate) activeTemplate = savedTemplate;
}

/* ================= ATS LOGIC ================= */
function buildResumeText(data) {
  let text = "";
  Object.values(data).forEach((section) => {
    if (Array.isArray(section)) {
      section.forEach((item) =>
        Object.values(item).forEach((v) => v && (text += v + " "))
      );
    } else {
      Object.values(section).forEach((v) => v && (text += v + " "));
    }
  });
  return text.toLowerCase();
}

function extractKeywords(jobDesc) {
  const stopWords = ["and","or","with","for","the","to","a","of","in","on","is"];
  return [
    ...new Set(
      jobDesc
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(" ")
        .filter((w) => w.length > 2 && !stopWords.includes(w))
    ),
  ];
}

function calculateATS(resumeData, jobDesc) {
  const resumeText = buildResumeText(resumeData);
  const keywords = extractKeywords(jobDesc);
  const matched = [];
  const missing = [];

  keywords.forEach((k) =>
    resumeText.includes(k) ? matched.push(k) : missing.push(k)
  );

  const score = keywords.length
    ? Math.round((matched.length / keywords.length) * 100)
    : 0;

  return { score, matched, missing };
}

function renderATSResult(result) {
  atsProgress.style.display = "block";
  atsResult.style.display = "block";
  atsProgressBar.style.width = result.score + "%";

  atsProgressBar.style.background =
    result.score < 40
      ? "linear-gradient(90deg,#ef4444,#f97316)"
      : result.score < 70
      ? "linear-gradient(90deg,#facc15,#f97316)"
      : "linear-gradient(90deg,#22c55e,#4ade80)";

  atsResult.innerHTML = `
    <h3>ATS Score: ${result.score}%</h3>
    <p><strong>Matched:</strong> ${result.matched.join(", ") || "None"}</p>
    <p><strong>Missing:</strong> ${result.missing.join(", ") || "None"}</p>
  `;
}

/* ================= PREVIEW EMPTY ================= */
function isResumeEmpty(data) {
  return !Object.values(data).some((section) =>
    Array.isArray(section)
      ? section.some((i) =>
          Object.values(i).some((v) => v && v.trim())
        )
      : Object.values(section).some((v) => v && v.trim())
  );
}

/* ================= FORM GENERATION ================= */
function generateForm(schema) {
  formContainer.innerHTML = "";

  Object.keys(schema).forEach((sectionName) => {
    const config = schema[sectionName];

    const section = document.createElement("div");
    section.className = "form-section";

    /* HEADER */
    const header = document.createElement("div");
    header.className = "form-section-header";

    const title = document.createElement("h3");
    title.innerText = sectionName.toUpperCase();
    header.appendChild(title);

    if (config.multiple) {
      const addBtn = document.createElement("button");
      addBtn.className = "add-section-btn";
      addBtn.innerText = "+";
      addBtn.onclick = () => {
        resumeData[sectionName].push({});
        generateForm(schema);
        renderPreview();
        saveData();
      };
      header.appendChild(addBtn);
    }

    section.appendChild(header);

    if (!resumeData[sectionName])
      resumeData[sectionName] = config.multiple ? [{}] : {};

    const entries = config.multiple
      ? resumeData[sectionName]
      : [resumeData[sectionName]];

    entries.forEach((entry, entryIndex) => {
      const block = document.createElement("div");
      block.className = "entry-block";
      block.draggable = true;

      block.addEventListener("dragstart", () =>
        block.classList.add("dragging")
      );
      block.addEventListener("dragend", () =>
        block.classList.remove("dragging")
      );

      config.fields.forEach((field) => {
        const wrapper = document.createElement("div");
        wrapper.className = "field";

        const label = document.createElement("label");
        label.innerText = field.label;

        // SKILLS
        if (sectionName === "skills") {
          const input = document.createElement("input");
          input.placeholder = "Type skill & press Enter";

          if (!entry.skills) entry.skills = [];

          const chips = document.createElement("div");
          chips.className = "skill-chips";

          function renderChips() {
            chips.innerHTML = "";
            entry.skills.forEach((s, i) => {
              const chip = document.createElement("div");
              chip.className = "skill-chip";
              chip.innerHTML = `
                ${s.name}
                <select>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <span>×</span>
              `;
              chip.querySelector("select").value = s.level;
              chip.querySelector("select").onchange = (e) => {
                s.level = e.target.value;
                renderPreview();
                saveData();
              };
              chip.querySelector("span").onclick = () => {
                entry.skills.splice(i, 1);
                renderChips();
                renderPreview();
                saveData();
              };
              chips.appendChild(chip);
            });
          }

          input.onkeydown = (e) => {
            if (e.key === "Enter" && input.value.trim()) {
              e.preventDefault();
              entry.skills.push({
                name: input.value.trim(),
                level: "Intermediate",
              });
              input.value = "";
              renderChips();
              renderPreview();
              saveData();
            }
          };

          renderChips();
          wrapper.append(label, input, chips);
          block.appendChild(wrapper);
        } else {
          const input = document.createElement("input");
          input.value = entry[field.key] || "";
          input.oninput = () => {
            entry[field.key] = input.value;
            renderPreview();
            saveData();
          };
          wrapper.append(label, input);
          block.appendChild(wrapper);
        }
      });

      // REMOVE
      if (config.multiple && entries.length > 1) {
        const remove = document.createElement("button");
        remove.className = "remove-entry-btn";
        remove.innerText = "🗑";
        remove.onclick = () => {
          resumeData[sectionName].splice(entryIndex, 1);
          generateForm(schema);
          renderPreview();
          saveData();
        };
        block.appendChild(remove);
      }

      section.appendChild(block);
    });

    section.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = section.querySelector(".dragging");
      const after = [...section.querySelectorAll(".entry-block:not(.dragging)")]
        .find((el) => e.clientY < el.getBoundingClientRect().top + el.offsetHeight / 2);
      after ? section.insertBefore(dragging, after) : section.appendChild(dragging);
    });

    formContainer.appendChild(section);
  });
}

/* ================= PREVIEW ================= */
function renderPreview() {
  previewContainer.innerHTML = "";

  if (isResumeEmpty(resumeData)) {
    previewContainer.innerHTML = `
      <div class="preview-empty">
        <h2>Your resume preview will appear here</h2>
        <p>Start filling the form to see live preview</p>
      </div>
    `;
    return;
  }

  const node =
    activeTemplate === "modern"
      ? renderModernTemplate(resumeData)
      : renderBasicTemplate(resumeData);

  previewContainer.appendChild(node);
}

/* ================= EVENTS ================= */
switcherButtons.forEach((btn) => {
  btn.onclick = () => {
    switcherButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeTemplate = btn.dataset.template;
    renderPreview();
    saveData();
  };
});

atsBtn.onclick = () => {
  const jd = jobDescInput.value.trim();
  if (!jd) return alert("Paste job description");
  renderATSResult(calculateATS(resumeData, jd));
};

printBtn.onclick = () => window.print();

/* ================= INIT ================= */
loadData();
generateForm(resumeSchema);
renderPreview();
