import React from "react";
import { useNavigate } from "react-router-dom";
import "./Templates.css";

const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and polished for professional applications.",
    className: "professional",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Creative and stylish with a contemporary layout.",
    className: "modern",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, elegant and ATS-friendly.",
    className: "minimal",
  },
];

function ResumePreview({ type }) {
  return (
    <div className={`resume-preview ${type}`}>
      <div className="preview-header">
        <div>
          <div className="preview-name">Your Name</div>
          <div className="preview-title">Professional Title</div>
        </div>

        <div className="preview-contact">
          email@example.com
          <br />
          +91 98765 43210
        </div>
      </div>

      <div className="preview-divider" />

      <section>
        <h4>PROFILE</h4>
        <p>
          Professional summary and career objective will appear here.
        </p>
      </section>

      <section>
        <h4>EDUCATION</h4>
        <div className="preview-item">
          <strong>Degree / Course</strong>
          <small>University / Institution</small>
        </div>
      </section>

      <section>
        <h4>SKILLS</h4>
        <div className="preview-skills">
          <span>Python</span>
          <span>SQL</span>
          <span>JavaScript</span>
          <span>React</span>
        </div>
      </section>

      <section>
        <h4>PROJECTS</h4>
        <div className="preview-item">
          <strong>Project Name</strong>
          <small>Project description goes here.</small>
        </div>
      </section>

      <section>
        <h4>EXPERIENCE</h4>
        <div className="preview-item">
          <strong>Job / Internship</strong>
          <small>Company Name</small>
        </div>
      </section>
    </div>
  );
}

export default function Templates() {
  const navigate = useNavigate();

  const handleUseTemplate = (template) => {
    navigate(`/builder?template=${template}`);
  };

  return (
    <main>
    <section className="templates-hero">

  <div className="hero-label">
    <span className="hero-dot"></span>
    <span>RESUME TEMPLATES</span>
  </div>

  <div className="hero-title">
    <h1>
      Choose Your <span>Template</span>
    </h1>
  </div>

  <p className="hero-description">
    Start with a beautiful design and customize it with your own information.
  </p>

</section>

      {/* TEMPLATES */}
      <section className="templates-grid">
        {templates.map((template) => (
          <article className="template-card" key={template.id}>

            <div className="template-preview">
              <ResumePreview type={template.className} />
            </div>

            <div className="template-bottom">
              <div>
                <h2>{template.name}</h2>
                <p>{template.description}</p>
              </div>

              <button
                className="use-template-btn"
                onClick={() => handleUseTemplate(template.id)}
              >
                Use Template
                <span>→</span>
              </button>
            </div>

          </article>
        ))}
      </section>

    </main>
  );
}