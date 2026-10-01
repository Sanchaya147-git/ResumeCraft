import { useState } from "react";
import "./ResumeBuilder.css";

function ResumeBuilder() {

  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    summary: "",
    education: "",
    skills: "",
    projects: "",
    experience: "",
    certifications: "",
    linkedin: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResume({
      ...resume,
      [name]: value
    });
  };

  return (
    <div className="builder-page">

      {/* HEADER */}

      <header className="builder-header">

        <div className="builder-logo">
          Resume<span>Craft</span>
        </div>

        <button
          className="back-button"
          onClick={() => window.location.href = "/"}
        >
          ← Back to Home
        </button>

      </header>


      {/* MAIN BUILDER */}

      <main className="builder-container">

        {/* LEFT SIDE */}

        <section className="form-section">

          <div className="form-heading">
            <h1>Create Your Resume</h1>

            <p>
              Fill in your details and see your resume
              update instantly.
            </p>
          </div>


          {/* PERSONAL INFORMATION */}

          <div className="form-card">

            <h2>👤 Personal Information</h2>

            <div className="input-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Sanchaya C"
                value={resume.name}
                onChange={handleChange}
              />

            </div>


            <div className="input-row">

              <div className="input-group">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={resume.email}
                  onChange={handleChange}
                />

              </div>


              <div className="input-group">

                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={resume.phone}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="input-row">

              <div className="input-group">

                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  placeholder="City, Country"
                  value={resume.location}
                  onChange={handleChange}
                />

              </div>


              <div className="input-group">

                <label>Job Title</label>

                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Software Developer"
                  value={resume.role}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="input-group">

              <label>LinkedIn</label>

              <input
                type="text"
                name="linkedin"
                placeholder="linkedin.com/in/yourname"
                value={resume.linkedin}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* SUMMARY */}

          <div className="form-card">

            <h2>📋 Professional Summary</h2>

            <div className="input-group">

              <label>About You</label>

              <textarea
                name="summary"
                rows="5"
                placeholder="Write a short professional summary..."
                value={resume.summary}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* EDUCATION */}

          <div className="form-card">

            <h2>🎓 Education</h2>

            <div className="input-group">

              <label>Education Details</label>

              <textarea
                name="education"
                rows="5"
                placeholder="Example:
B.Tech Computer Science Engineering
SRM Institute of Science and Technology
2024 - 2028"
                value={resume.education}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* SKILLS */}

          <div className="form-card">

            <h2>💻 Skills</h2>

            <div className="input-group">

              <label>Your Skills</label>

              <textarea
                name="skills"
                rows="4"
                placeholder="Python, Java, C++, SQL, React, HTML, CSS..."
                value={resume.skills}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* PROJECTS */}

          <div className="form-card">

            <h2>🚀 Projects</h2>

            <div className="input-group">

              <label>Project Details</label>

              <textarea
                name="projects"
                rows="6"
                placeholder="Project Name
Technologies used
Short project description"
                value={resume.projects}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* EXPERIENCE */}

          <div className="form-card">

            <h2>💼 Experience</h2>

            <div className="input-group">

              <label>Work / Internship Experience</label>

              <textarea
                name="experience"
                rows="6"
                placeholder="Company Name
Role
Duration
Responsibilities"
                value={resume.experience}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* CERTIFICATIONS */}

          <div className="form-card">

            <h2>🏆 Certifications</h2>

            <div className="input-group">

              <label>Certifications</label>

              <textarea
                name="certifications"
                rows="4"
                placeholder="Example:
SnowPro Core Certification
AWS Cloud Practitioner"
                value={resume.certifications}
                onChange={handleChange}
              />

            </div>

          </div>

        </section>


        {/* RIGHT SIDE */}

        <section className="preview-section">

          <div className="preview-header">

            <h2>Live Preview</h2>

            <span>● Live</span>

          </div>


          {/* RESUME */}

          <div className="resume-paper">

            <div className="resume-top">

              <h1>
                {resume.name || "Your Name"}
              </h1>

              <h3>
                {resume.role || "Professional Title"}
              </h3>

              <div className="contact-info">

                {resume.email && <span>{resume.email}</span>}

                {resume.phone && <span>{resume.phone}</span>}

                {resume.location && <span>{resume.location}</span>}

              </div>

              {resume.linkedin && (
                <div className="linkedin">
                  {resume.linkedin}
                </div>
              )}

            </div>


            {/* SUMMARY */}

            {resume.summary && (

              <div className="resume-block">

                <h2>PROFILE</h2>

                <p>{resume.summary}</p>

              </div>

            )}


            {/* EDUCATION */}

            {resume.education && (

              <div className="resume-block">

                <h2>EDUCATION</h2>

                <p className="preserve">
                  {resume.education}
                </p>

              </div>

            )}


            {/* SKILLS */}

            {resume.skills && (

              <div className="resume-block">

                <h2>SKILLS</h2>

                <p>
                  {resume.skills}
                </p>

              </div>

            )}


            {/* PROJECTS */}

            {resume.projects && (

              <div className="resume-block">

                <h2>PROJECTS</h2>

                <p className="preserve">
                  {resume.projects}
                </p>

              </div>

            )}


            {/* EXPERIENCE */}

            {resume.experience && (

              <div className="resume-block">

                <h2>EXPERIENCE</h2>

                <p className="preserve">
                  {resume.experience}
                </p>

              </div>

            )}


            {/* CERTIFICATIONS */}

            {resume.certifications && (

              <div className="resume-block">

                <h2>CERTIFICATIONS</h2>

                <p className="preserve">
                  {resume.certifications}
                </p>

              </div>

            )}


            {/* EMPTY STATE */}

            {!resume.summary &&
              !resume.education &&
              !resume.skills &&
              !resume.projects &&
              !resume.experience &&
              !resume.certifications && (

              <div className="empty-resume">

                <div>📄</div>

                <p>
                  Start filling the form to build
                  your resume.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default ResumeBuilder;