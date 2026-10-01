import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Builder() {
  const location = useLocation();

  const selectedTemplate =
  location.state?.template ||
  new URLSearchParams(location.search).get("template") ||
  "modern";

  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: "",

    education: [
      {
        degree: "",
        college: "",
        year: "",
        cgpa: ""
      }
    ],

    experience: [
      {
        role: "",
        company: "",
        duration: "",
        description: ""
      }
    ],

    projects: [
      {
        name: "",
        technologies: "",
        description: ""
      }
    ],

    certifications: [
      {
        name: "",
        issuer: "",
        year: ""
      }
    ],

    achievements: [
      {
        title: "",
        description: ""
      }
    ]
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  /* =========================
     SIMPLE INPUT CHANGE
  ========================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* =========================
     AI IMPROVE SUMMARY
  ========================= */

  const improveSummary = async () => {
    console.log("AI BUTTON CLICKED");

    if (!form.summary.trim()) {
      alert("Please enter your professional summary first.");
      return;
    }

    setAiLoading(true);
    setAiSuggestion("");

    try {
      console.log("SENDING REQUEST TO BACKEND...");

      const response = await fetch(
        "http://localhost:5000/api/improve-summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            summary: form.summary
          })
        }
      );

      console.log(
        "BACKEND RESPONSE STATUS:",
        response.status
      );

      const data = await response.json();

      console.log(
        "BACKEND RESPONSE DATA:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message || "AI request failed"
        );
      }

      const improved =
        data.improvedSummary || "";

      setAiSuggestion(improved);

      /* Put improved text directly into summary */
      if (improved) {
        setForm((prev) => ({
          ...prev,
          summary: improved
        }));
      }

    } catch (error) {
      console.error(
        "AI REQUEST ERROR:",
        error
      );

      alert(
        "Unable to connect to the AI server. Make sure your backend is running on port 5000."
      );

    } finally {
      setAiLoading(false);
    }
  };

  /* =========================
     SAVE RESUME
  ========================= */

const handleSaveResume = async () => {
  const requiredFields = [
  { value: form.name, label: "Full Name" },
  { value: form.role, label: "Professional Title" },
  { value: form.email, label: "Email" },
  { value: form.phone, label: "Phone Number" },
  { value: form.location, label: "Location" },
  { value: form.summary, label: "Professional Summary" },
  { value: form.skills, label: "Skills" }
];

const emptyField = requiredFields.find(
  (field) => !field.value || !field.value.trim()
);

if (emptyField) {
  alert(`Please fill in ${emptyField.label} before saving your resume.`);
  return;
}
  try {
    console.log("SAVING RESUME...");

    const response = await fetch("http://localhost:5000/api/resumes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    console.log("SAVE RESPONSE STATUS:", response.status);

    const data = await response.json();

    console.log("SAVE RESPONSE DATA:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to save resume");
    }

    alert("Resume saved successfully! 🎉");

  } catch (error) {
    console.error("SAVE ERROR:", error);

    alert("Unable to save resume. Please check the server.");
  }
};

  /* =========================
     DOWNLOAD RESUME PDF
  ========================= */

  const handleDownloadPDF = async () => {
    const resumeElement = document.getElementById("resume-preview");

    if (!resumeElement) {
      alert("Resume preview not found.");
      return;
    }

    try {
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const usableWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * usableWidth) / canvas.width;

      let heightLeft = imageHeight;
      let position = margin;

      pdf.addImage(
        imgData,
        "PNG",
        margin,
        position,
        usableWidth,
        imageHeight
      );

      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position = margin - (imageHeight - heightLeft);
        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          margin,
          position,
          usableWidth,
          imageHeight
        );

        heightLeft -= pageHeight - margin * 2;
      }

      const fileName =
        `${form.name || "My"}_Resume`.replace(/\s+/g, "_") + ".pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("PDF DOWNLOAD ERROR:", error);
      alert("Unable to download the resume PDF.");
    }
  };

  /* =========================
     ARRAY FIELD CHANGE
  ========================= */

  const handleArrayChange = (
    section,
    index,
    field,
    value
  ) => {
    const updatedSection = [...form[section]];

    updatedSection[index] = {
      ...updatedSection[index],
      [field]: value
    };

    setForm({
      ...form,
      [section]: updatedSection
    });
  };

  /* =========================
     ADD ITEM
  ========================= */

  const addItem = (section, emptyItem) => {
    setForm({
      ...form,
      [section]: [
        ...form[section],
        { ...emptyItem }
      ]
    });
  };

  /* =========================
     REMOVE ITEM
  ========================= */

  const removeItem = (section, index) => {
    if (form[section].length === 1) {
      return;
    }

    setForm({
      ...form,
      [section]: form[section].filter(
        (_, i) => i !== index
      )
    });
  };

  return (
    <div className="builder-page">

      {/* =========================
          HEADER
      ========================== */}

      <div className="builder-header">

        <div>
          <div className="small-label">
            RESUME BUILDER
          </div>

          <h1>
            Create your <span>resume.</span>
          </h1>

          <p>
            Enter your information and see your resume
            update instantly.
          </p>
        </div>

        <Link
          to="/templates"
          className="outline-button"
        >
          Change Template
        </Link>

      </div>


      {/* =========================
          MAIN LAYOUT
      ========================== */}

      <div className="builder-layout">

        {/* =========================
            FORM
        ========================== */}

        <div className="builder-form">

          {/* PERSONAL INFORMATION */}

          <div className="form-card">

            <h2>Personal Information</h2>

            <div className="form-grid">

              <div className="input-group">
                <label>Full Name</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>


              <div className="input-group">
                <label>Professional Title</label>

                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="Computer Science Student"
                />
              </div>


              <div className="input-group">
                <label>Email</label>

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>


              <div className="input-group">
                <label>Phone</label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>


              <div className="input-group full">
                <label>Location</label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>

            </div>
          </div>


          {/* PROFILE */}

          <div className="form-card">

            <h2>Profile</h2>

            <div className="input-group">

              <div className="ai-label-row">

                <label>
                  Professional Summary
                </label>

                <button
                  type="button"
                  className="ai-button"
                  onClick={improveSummary}
                  disabled={aiLoading}
                >
                  {aiLoading
                    ? "✨ Improving..."
                    : "✨ Improve with AI"}
                </button>

              </div>


              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                placeholder="Write a short professional summary..."
                rows="5"
              />


              {/* AI RESULT */}

              {aiSuggestion && (
                <div className="ai-suggestion">
                  <strong>
                    ✨ AI Improved Summary
                  </strong>

                  <p>
                    {aiSuggestion}
                  </p>
                </div>
              )}

            </div>

          </div>


          {/* EDUCATION */}

          <div className="form-card">

            <div className="section-heading-row">

              <h2>Education</h2>

              <button
                type="button"
                className="add-button"
                onClick={() =>
                  addItem("education", {
                    degree: "",
                    college: "",
                    year: "",
                    cgpa: ""
                  })
                }
              >
                + Add Education
              </button>

            </div>


            {form.education.map(
              (item, index) => (

                <div
                  className="dynamic-item"
                  key={index}
                >

                  <div className="dynamic-item-header">

                    <strong>
                      Education {index + 1}
                    </strong>

                    {form.education.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          removeItem(
                            "education",
                            index
                          )
                        }
                      >
                        Remove
                      </button>
                    )}

                  </div>


                  <div className="form-grid">

                    <div className="input-group">
                      <label>Degree</label>

                      <input
                        value={item.degree}
                        onChange={(e) =>
                          handleArrayChange(
                            "education",
                            index,
                            "degree",
                            e.target.value
                          )
                        }
                        placeholder="B.Tech Computer Science"
                      />
                    </div>


                    <div className="input-group">
                      <label>
                        College / University
                      </label>

                      <input
                        value={item.college}
                        onChange={(e) =>
                          handleArrayChange(
                            "education",
                            index,
                            "college",
                            e.target.value
                          )
                        }
                        placeholder="Your college"
                      />
                    </div>


                    <div className="input-group">
                      <label>Year</label>

                      <input
                        value={item.year}
                        onChange={(e) =>
                          handleArrayChange(
                            "education",
                            index,
                            "year",
                            e.target.value
                          )
                        }
                        placeholder="2024 - 2028"
                      />
                    </div>


                    <div className="input-group">
                      <label>
                        CGPA / Percentage
                      </label>

                      <input
                        value={item.cgpa}
                        onChange={(e) =>
                          handleArrayChange(
                            "education",
                            index,
                            "cgpa",
                            e.target.value
                          )
                        }
                        placeholder="8.5 CGPA"
                      />
                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          {/* SKILLS */}

          <div className="form-card">

            <h2>Skills</h2>

            <div className="input-group">

              <label>Skills</label>

              <textarea
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Python, Java, SQL, React..."
                rows="4"
              />

            </div>

          </div>


          {/* EXPERIENCE */}

          <div className="form-card">

            <div className="section-heading-row">

              <h2>Experience</h2>

              <button
                type="button"
                className="add-button"
                onClick={() =>
                  addItem("experience", {
                    role: "",
                    company: "",
                    duration: "",
                    description: ""
                  })
                }
              >
                + Add Experience
              </button>

            </div>


            {form.experience.map(
              (item, index) => (

                <div
                  className="dynamic-item"
                  key={index}
                >

                  <div className="dynamic-item-header">

                    <strong>
                      Experience {index + 1}
                    </strong>

                    {form.experience.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          removeItem(
                            "experience",
                            index
                          )
                        }
                      >
                        Remove
                      </button>
                    )}

                  </div>


                  <div className="form-grid">

                    <div className="input-group">
                      <label>
                        Job / Internship Title
                      </label>

                      <input
                        value={item.role}
                        onChange={(e) =>
                          handleArrayChange(
                            "experience",
                            index,
                            "role",
                            e.target.value
                          )
                        }
                        placeholder="Software Developer Intern"
                      />
                    </div>


                    <div className="input-group">
                      <label>Company</label>

                      <input
                        value={item.company}
                        onChange={(e) =>
                          handleArrayChange(
                            "experience",
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        placeholder="Company name"
                      />
                    </div>


                    <div className="input-group full">
                      <label>Duration</label>

                      <input
                        value={item.duration}
                        onChange={(e) =>
                          handleArrayChange(
                            "experience",
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="June 2026 - August 2026"
                      />
                    </div>


                    <div className="input-group full">

                      <label>Description</label>

                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleArrayChange(
                            "experience",
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe your responsibilities and achievements..."
                        rows="4"
                      />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          {/* PROJECTS */}

          <div className="form-card">

            <div className="section-heading-row">

              <h2>Projects</h2>

              <button
                type="button"
                className="add-button"
                onClick={() =>
                  addItem("projects", {
                    name: "",
                    technologies: "",
                    description: ""
                  })
                }
              >
                + Add Project
              </button>

            </div>


            {form.projects.map(
              (item, index) => (

                <div
                  className="dynamic-item"
                  key={index}
                >

                  <div className="dynamic-item-header">

                    <strong>
                      Project {index + 1}
                    </strong>

                    {form.projects.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          removeItem(
                            "projects",
                            index
                          )
                        }
                      >
                        Remove
                      </button>
                    )}

                  </div>


                  <div className="form-grid">

                    <div className="input-group full">

                      <label>Project Name</label>

                      <input
                        value={item.name}
                        onChange={(e) =>
                          handleArrayChange(
                            "projects",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Hunger-Free Connect"
                      />

                    </div>


                    <div className="input-group full">

                      <label>Technologies</label>

                      <input
                        value={item.technologies}
                        onChange={(e) =>
                          handleArrayChange(
                            "projects",
                            index,
                            "technologies",
                            e.target.value
                          )
                        }
                        placeholder="React, Node.js, MongoDB"
                      />

                    </div>


                    <div className="input-group full">

                      <label>Description</label>

                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleArrayChange(
                            "projects",
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe your project..."
                        rows="4"
                      />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          {/* CERTIFICATIONS */}

          <div className="form-card">

            <div className="section-heading-row">

              <h2>Certifications</h2>

              <button
                type="button"
                className="add-button"
                onClick={() =>
                  addItem("certifications", {
                    name: "",
                    issuer: "",
                    year: ""
                  })
                }
              >
                + Add Certification
              </button>

            </div>


            {form.certifications.map(
              (item, index) => (

                <div
                  className="dynamic-item"
                  key={index}
                >

                  <div className="dynamic-item-header">

                    <strong>
                      Certification {index + 1}
                    </strong>

                    {form.certifications.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          removeItem(
                            "certifications",
                            index
                          )
                        }
                      >
                        Remove
                      </button>
                    )}

                  </div>


                  <div className="form-grid">

                    <div className="input-group">

                      <label>
                        Certification
                      </label>

                      <input
                        value={item.name}
                        onChange={(e) =>
                          handleArrayChange(
                            "certifications",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="AWS Certified Cloud Practitioner"
                      />

                    </div>


                    <div className="input-group">

                      <label>
                        Issuing Organization
                      </label>

                      <input
                        value={item.issuer}
                        onChange={(e) =>
                          handleArrayChange(
                            "certifications",
                            index,
                            "issuer",
                            e.target.value
                          )
                        }
                        placeholder="Amazon Web Services"
                      />

                    </div>


                    <div className="input-group full">

                      <label>Year</label>

                      <input
                        value={item.year}
                        onChange={(e) =>
                          handleArrayChange(
                            "certifications",
                            index,
                            "year",
                            e.target.value
                          )
                        }
                        placeholder="2026"
                      />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          {/* ACHIEVEMENTS */}

          <div className="form-card">

            <div className="section-heading-row">

              <h2>Achievements</h2>

              <button
                type="button"
                className="add-button"
                onClick={() =>
                  addItem("achievements", {
                    title: "",
                    description: ""
                  })
                }
              >
                + Add Achievement
              </button>

            </div>


            {form.achievements.map(
              (item, index) => (

                <div
                  className="dynamic-item"
                  key={index}
                >

                  <div className="dynamic-item-header">

                    <strong>
                      Achievement {index + 1}
                    </strong>

                    {form.achievements.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          removeItem(
                            "achievements",
                            index
                          )
                        }
                      >
                        Remove
                      </button>
                    )}

                  </div>


                  <div className="form-grid">

                    <div className="input-group full">

                      <label>
                        Achievement Title
                      </label>

                      <input
                        value={item.title}
                        onChange={(e) =>
                          handleArrayChange(
                            "achievements",
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Hackathon Finalist"
                      />

                    </div>


                    <div className="input-group full">

                      <label>Description</label>

                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleArrayChange(
                            "achievements",
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe your achievement..."
                        rows="3"
                      />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          {/* SAVE BUTTON */}

          <div className="save-resume-container">

            <button
              type="button"
              className="save-button"
              onClick={handleSaveResume}
            >
              💾 Save Resume
            </button>

          </div>

        </div>


        {/* =========================
            LIVE PREVIEW
        ========================== */}

        <div className="preview-container">

<div className="preview-title">

  <div className="preview-heading">

    <div className="live-preview-label">
      <span className="live-green-dot"></span>
      LIVE PREVIEW
    </div>

    <h2>Your Resume</h2>

  </div>

  <button
    type="button"
    className="download-pdf-button"
    onClick={handleDownloadPDF}
  >
    ↓ Download PDF
  </button>

</div>


          <div
            id="resume-preview"
            className={`resume-paper template-${selectedTemplate}`}
          >

            {/* RESUME HEADER */}

            <div className="resume-top">

              <div>

                <h1>
                  {form.name || "Your Name"}
                </h1>

                <h3>
                  {form.role || "Professional Title"}
                </h3>

              </div>


              <div className="resume-contact">

                {form.email && (
                  <div>{form.email}</div>
                )}

                {form.phone && (
                  <div>{form.phone}</div>
                )}

                {form.location && (
                  <div>{form.location}</div>
                )}

              </div>

            </div>


            <div className="resume-divider"></div>


            {/* PROFILE */}

            <ResumeSection
              title="PROFILE"
              value={
                form.summary ||
                "Your professional summary will appear here."
              }
            />


            {/* EDUCATION */}

            <div className="resume-section">

              <h4>EDUCATION</h4>

              {form.education.map(
                (item, index) => {

                  const hasContent =
                    item.degree ||
                    item.college ||
                    item.year ||
                    item.cgpa;

                  if (!hasContent) {
                    return (
                      <p key={index}>
                        Your education details will appear here.
                      </p>
                    );
                  }

                  return (
                    <div
                      className="preview-entry"
                      key={index}
                    >

                      <strong>
                        {item.degree}
                      </strong>

                      {item.college && (
                        <div>
                          {item.college}
                        </div>
                      )}

                      {item.year && (
                        <div>
                          {item.year}
                        </div>
                      )}

                      {item.cgpa && (
                        <div>
                          {item.cgpa}
                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>


            {/* SKILLS */}

            <ResumeSection
              title="SKILLS"
              value={
                form.skills ||
                "Your skills will appear here."
              }
            />


            {/* EXPERIENCE */}

            <div className="resume-section">

              <h4>EXPERIENCE</h4>

              {form.experience.map(
                (item, index) => {

                  const hasContent =
                    item.role ||
                    item.company ||
                    item.duration ||
                    item.description;

                  if (!hasContent) {
                    return (
                      <p key={index}>
                        Your experience will appear here.
                      </p>
                    );
                  }

                  return (
                    <div
                      className="preview-entry"
                      key={index}
                    >

                      <strong>
                        {item.role}
                      </strong>

                      {item.company && (
                        <div>
                          {item.company}
                        </div>
                      )}

                      {item.duration && (
                        <div>
                          {item.duration}
                        </div>
                      )}

                      {item.description && (
                        <p>
                          {item.description}
                        </p>
                      )}

                    </div>
                  );
                }
              )}

            </div>


            {/* PROJECTS */}

            <div className="resume-section">

              <h4>PROJECTS</h4>

              {form.projects.map(
                (item, index) => {

                  const hasContent =
                    item.name ||
                    item.technologies ||
                    item.description;

                  if (!hasContent) {
                    return (
                      <p key={index}>
                        Your projects will appear here.
                      </p>
                    );
                  }

                  return (
                    <div
                      className="preview-entry"
                      key={index}
                    >

                      <strong>
                        {item.name}
                      </strong>

                      {item.technologies && (
                        <div>
                          <strong>
                            Technologies:
                          </strong>{" "}
                          {item.technologies}
                        </div>
                      )}

                      {item.description && (
                        <p>
                          {item.description}
                        </p>
                      )}

                    </div>
                  );
                }
              )}

            </div>


            {/* CERTIFICATIONS */}

            <div className="resume-section">

              <h4>CERTIFICATIONS</h4>

              {form.certifications.map(
                (item, index) => {

                  const hasContent =
                    item.name ||
                    item.issuer ||
                    item.year;

                  if (!hasContent) {
                    return (
                      <p key={index}>
                        Your certifications will appear here.
                      </p>
                    );
                  }

                  return (
                    <div
                      className="preview-entry"
                      key={index}
                    >

                      <strong>
                        {item.name}
                      </strong>

                      {item.issuer && (
                        <div>
                          {item.issuer}
                        </div>
                      )}

                      {item.year && (
                        <div>
                          {item.year}
                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>


            {/* ACHIEVEMENTS */}

            <div className="resume-section">

              <h4>ACHIEVEMENTS</h4>

              {form.achievements.map(
                (item, index) => {

                  const hasContent =
                    item.title ||
                    item.description;

                  if (!hasContent) {
                    return (
                      <p key={index}>
                        Your achievements will appear here.
                      </p>
                    );
                  }

                  return (
                    <div
                      className="preview-entry"
                      key={index}
                    >

                      <strong>
                        {item.title}
                      </strong>

                      {item.description && (
                        <p>
                          {item.description}
                        </p>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================
   RESUME SECTION COMPONENT
========================= */

function ResumeSection({ title, value }) {
  return (
    <div className="resume-section">

      <h4>{title}</h4>

      <p>{value}</p>

    </div>
  );
}


export default Builder;