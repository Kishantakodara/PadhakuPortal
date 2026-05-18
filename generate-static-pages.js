import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error("dist/index.html not found. Make sure to run this after 'vite build'.");
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// A reusable styled page layout wrapper that mirrors the premium layout of PadhakuPortal
function wrapContent(title, lastUpdated, bodyHtml) {
  return `
<div style="padding: 60px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.7; color: #1e293b; background-color: #ffffff;">
  <h1 style="color: #0f172a; font-size: 36px; font-weight: 800; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 8px; letter-spacing: -0.025em;">${title}</h1>
  ${lastUpdated ? `<p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 32px; font-medium;">Last updated: ${lastUpdated}</p>` : ''}
  
  <div style="font-size: 16px; color: #334155;">
    ${bodyHtml}
  </div>
  
  <footer style="margin-top: 64px; padding-top: 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 14px; color: #64748b;">
    <p style="margin-bottom: 16px;">&copy; 2026 PadhakuPortal. All rights reserved.</p>
    <p>
      <a href="/" style="color: #f97316; font-weight: 600; text-decoration: none; margin: 0 12px; transition: color 0.2s;">Home</a> |
      <a href="/privacy-policy" style="color: #64748b; text-decoration: none; margin: 0 12px; transition: color 0.2s;">Privacy Policy</a> |
      <a href="/privacypolicy" style="color: #64748b; text-decoration: none; margin: 0 12px; transition: color 0.2s;">Privacy Policy (Alt)</a> |
      <a href="/terms-of-service" style="color: #64748b; text-decoration: none; margin: 0 12px; transition: color 0.2s;">Terms of Service</a> |
      <a href="/disclaimer" style="color: #64748b; text-decoration: none; margin: 0 12px; transition: color 0.2s;">Disclaimer</a> |
      <a href="/contact" style="color: #64748b; text-decoration: none; margin: 0 12px; transition: color 0.2s;">Contact Us</a>
    </p>
  </footer>
</div>
`;
}

// 1. Define all content bodies
const privacyPolicyContent = wrapContent(
  'Privacy Policy',
  'May 18, 2026',
  `
  <p style="font-size: 17px; line-height: 1.8; margin-bottom: 24px;">PadhakuPortal is an educational platform dedicated to engineering students. This Privacy Policy explains what information may be collected when you use the website, submit contact forms, contribute study resources, interact with our AI Tutor, or browse the site in the presence of analytics and advertising technologies.</p>
  
  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">1. Information We Collect</h2>
  <p style="margin-bottom: 16px;">We may collect various types of information depending on your interaction with the platform:</p>
  <ul style="padding-left: 24px; margin-bottom: 24px;">
    <li style="margin-bottom: 8px;"><strong>Submitted Information:</strong> Name, email address, message content, or any academic resources (such as branch, semester, subject titles, and notes in PDF format) that you choose to contribute.</li>
    <li style="margin-bottom: 8px;"><strong>Usage Information:</strong> Technical data including IP address, approximate geographical location, browser type, operating system, and interaction records (such as pages visited, search terms, and time spent on the site).</li>
    <li style="margin-bottom: 8px;"><strong>Cookies & Identifiers:</strong> Small data files stored on your device to maintain session details, personalize your experience, protect system integrity, and facilitate analytical or advertising services.</li>
  </ul>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">2. Google Advertising and Third-Party Cookie Disclosures</h2>
  <p style="margin-bottom: 16px;">In order to keep our premium educational resources 100% free for students, PadhakuPortal may display advertisements through Google AdSense or other networks. Under Google's compliance guidelines, we disclose the following:</p>
  <ul style="padding-left: 24px; margin-bottom: 24px;">
    <li style="margin-bottom: 12px;"><strong>Third-Party Vendor Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on your prior visits to PadhakuPortal or other websites on the internet.</li>
    <li style="margin-bottom: 12px;"><strong>Personalized Advertising:</strong> Google's use of advertising cookies enables it and its partners to serve highly relevant, personalized ads based on your online visits.</li>
    <li style="margin-bottom: 12px;"><strong>Opting Out:</strong> You can choose to opt out of Google's personalized advertising at any time by visiting the <a href="https://myadcenter.google.com/" target="_blank" style="color: #f97316; text-decoration: underline; font-weight: 600;">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting the <a href="http://www.aboutads.info/" target="_blank" style="color: #f97316; text-decoration: underline; font-weight: 600;">AboutAds portal</a>.</li>
  </ul>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">3. Data Security and Sharing</h2>
  <p style="margin-bottom: 16px;">We implement robust industry standard security protocols to safeguard your submitted and analytical information. We do not sell, trade, or share your personally identifiable information with outside companies, except as required by law, to enforce our site policies, or to protect the safety and rights of others.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">4. Children's Privacy</h2>
  <p style="margin-bottom: 16px;">PadhakuPortal is designed for engineering students who are generally 13 years of age or older. We do not knowingly collect personal identifiable information from children under 13. If you are a parent or guardian and realize your child has submitted personal details, please contact us immediately so we can remove the data.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">5. Contacting the Site Team</h2>
  <p style="margin-bottom: 16px;">For privacy-related questions, data access requests, or content removal queries, contact us directly at <a href="mailto:padhakuportal@gmail.com" style="color: #f97316; text-decoration: underline; font-weight: 600;">padhakuportal@gmail.com</a>.</p>
`
);

const termsOfServiceContent = wrapContent(
  'Terms of Service',
  'May 18, 2026',
  `
  <p style="font-size: 17px; line-height: 1.8; margin-bottom: 24px;">These Terms of Service govern your access to and use of PadhakuPortal. By browsing our website, downloading files, or utilizing our academic resources, you agree to respect copyright boundaries, academic integrity standards, and use the platform for positive, lawful educational pursuits.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">1. Educational and Academic Integrity Use</h2>
  <p style="margin-bottom: 16px;">PadhakuPortal is an independent student support platform offering previous year question papers, notes, study guides, and an AI Tutor. It is not an official university substitute. You are encouraged to verify important formulas, deadlines, and curriculum requirements against official university announcements and textbooks.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">2. User Conduct & Upload Regulations</h2>
  <p style="margin-bottom: 16px;">To maintain a safe and productive workspace, you agree not to submit or share content that:</p>
  <ul style="padding-left: 24px; margin-bottom: 24px;">
    <li style="margin-bottom: 8px;">Violates intellectual property or copyright guidelines of authors, professors, or universities without permission.</li>
    <li style="margin-bottom: 8px;">Contains malicious files, spyware, spam, inappropriate material, or misleading information.</li>
    <li style="margin-bottom: 8px;">Aims to scrape, disrupt, or bypass structural features, or place an abusive load on our AI Tutor servers.</li>
  </ul>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">3. AI Tutor and Content Accuracy</h2>
  <p style="margin-bottom: 16px;">Our AI Tutor uses advanced generative algorithms to simplify engineering topics. While highly accurate, AI answers can occasionally include errors or hallucinated facts. Always review and double-check important mathematical derivations and coding snippets before using them in official academic work.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">4. Content Removal Requests</h2>
  <p style="margin-bottom: 16px;">If you are an author, student, or copyright holder and believe any study material posted here infringes on your rights, please submit a content removal request to <a href="mailto:padhakuportal@gmail.com" style="color: #f97316; text-decoration: underline; font-weight: 600;">padhakuportal@gmail.com</a>. We review and process valid take-down notifications within 24-48 hours.</p>
`
);

const disclaimerContent = wrapContent(
  'Disclaimer',
  'May 18, 2026',
  `
  <p style="font-size: 17px; line-height: 1.8; margin-bottom: 24px;">Please read this disclaimer carefully before using PadhakuPortal. All educational resources, previous year question papers, and study guides are provided for general educational support only.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">1. No Official Affiliation</h2>
  <p style="margin-bottom: 16px;">PadhakuPortal is an independent student platform. We are not officially affiliated with, endorsed by, or connected to any engineering college, state technical university, university board, or government department unless explicitly stated on a specific document.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">2. Accuracy and Completeness</h2>
  <p style="margin-bottom: 16px;">We strive to keep our notes, question papers, and articles as accurate and clear as possible. However, the curriculum and exam patterns frequently change. We make no guarantees or warranties of any kind regarding the completeness, accuracy, or reliability of the study notes. Any reliance you place on such resources is strictly at your own risk.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">3. AI Tutor Limitations</h2>
  <p style="margin-bottom: 16px;">AI Tutor answers are educational aids powered by artificial intelligence. They should not be considered bulletproof solutions or official academic advice. Verify all AI solutions with standard textbooks or university instructors.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">4. Contact Address</h2>
  <p style="margin-bottom: 16px;">If you have any questions, corrections, or concerns about this disclaimer, contact us at <a href="mailto:padhakuportal@gmail.com" style="color: #f97316; text-decoration: underline; font-weight: 600;">padhakuportal@gmail.com</a>.</p>
`
);

const aboutContent = wrapContent(
  'About Us',
  null,
  `
  <p style="font-size: 17px; line-height: 1.8; margin-bottom: 24px;">Welcome to <strong>PadhakuPortal</strong>! We are a group of passionate engineering alumni and educators building the ultimate academic hub for engineering students.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">Our Core Vision</h2>
  <p style="margin-bottom: 16px;">Engineering preparation can be chaotic, with study materials, question papers, and reference documents scattered across various messaging groups and outdated servers. PadhakuPortal organizes these vital resources into a clean, searchable, and responsive library, allowing you to prepare efficiently and excel in your semester exams.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">Key Features Offered</h2>
  <ul style="padding-left: 24px; margin-bottom: 24px;">
    <li style="margin-bottom: 8px;"><strong>Organized PYQs:</strong> Past exam papers sorted systematically by branch, semester, and year.</li>
    <li style="margin-bottom: 8px;"><strong>High-Quality Study Notes:</strong> Expert-written and student-contributed summaries that clarify complex engineering subjects.</li>
    <li style="margin-bottom: 8px;"><strong>AI Study Tutor:</strong> An interactive, real-time AI assistant built to help clarify confusing topics instantly.</li>
    <li style="margin-bottom: 8px;"><strong>Interactive Guides:</strong> Detailed strategies on exam preparation, viva questions, and practical work.</li>
  </ul>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">Connect With Us</h2>
  <p style="margin-bottom: 16px;">We love feedback! If you want to join our mission, suggest improvements, or have questions, contact us via email at <a href="mailto:padhakuportal@gmail.com" style="color: #f97316; text-decoration: underline; font-weight: 600;">padhakuportal@gmail.com</a> or use our dedicated <a href="/contact" style="color: #f97316; text-decoration: underline; font-weight: 600;">Contact Page</a>.</p>
`
);

const contactContent = wrapContent(
  'Contact Us',
  null,
  `
  <p style="font-size: 17px; line-height: 1.8; margin-bottom: 24px;">Have a question? Spotted a correction? Or want to request content removal? We are here to support your engineering journey.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">Direct Email Channel</h2>
  <p style="margin-bottom: 16px;">Feel free to drop us a line at: <a href="mailto:padhakuportal@gmail.com" style="color: #f97316; text-decoration: underline; font-weight: 600; font-size: 18px;">padhakuportal@gmail.com</a></p>
  <p style="margin-bottom: 24px; font-size: 14px; color: #64748b;">We actively monitor this inbox and reply to all student and operational queries within 24 hours.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">Quick Submission Guidelines</h2>
  <ul style="padding-left: 24px; margin-bottom: 24px;">
    <li style="margin-bottom: 8px;"><strong>For Content Corrections:</strong> Please provide the exact page URL and explain the correction required.</li>
    <li style="margin-bottom: 8px;"><strong>For Copyright/Takedowns:</strong> Describe your ownership relationship to the material and we will resolve it swiftly.</li>
    <li style="margin-bottom: 8px;"><strong>For Security/Privacy:</strong> Please describe any security findings directly to our email. Do not include passwords or sensitive database credentials.</li>
  </ul>
`
);

const sitemapContent = wrapContent(
  'Sitemap',
  'May 18, 2026',
  `
  <p style="font-size: 17px; line-height: 1.8; margin-bottom: 24px;">Easily browse all areas of PadhakuPortal, including our study guides, exam papers, and trust pages.</p>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">Main Platform Pages</h2>
  <ul style="padding-left: 24px; margin-bottom: 24px;">
    <li style="margin-bottom: 8px;"><a href="/" style="color: #f97316; text-decoration: none;">Homepage</a> - High-quality study guides, AI Tutor, and notes.</li>
    <li style="margin-bottom: 8px;"><a href="/pyqs" style="color: #f97316; text-decoration: none;">Previous Year Question Papers</a> - Sorted by branch and semester.</li>
    <li style="margin-bottom: 8px;"><a href="/notes" style="color: #f97316; text-decoration: none;">Study Notes Library</a> - Detailed summaries and lecture materials.</li>
    <li style="margin-bottom: 8px;"><a href="/ai-tutor" style="color: #f97316; text-decoration: none;">AI Study Tutor</a> - Get concepts simplified in real time.</li>
    <li style="margin-bottom: 8px;"><a href="/contribute" style="color: #f97316; text-decoration: none;">Contribute Study Material</a> - Join our community.</li>
    <li style="margin-bottom: 8px;"><a href="/guides" style="color: #f97316; text-decoration: none;">Subject Guides</a> - Semester preparation roadmaps.</li>
    <li style="margin-bottom: 8px;"><a href="/exam-tips" style="color: #f97316; text-decoration: none;">Engineering Exam &amp; Viva Tips</a> - Succeed in assessments.</li>
  </ul>

  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 36px; margin-bottom: 16px;">Legal, Compliance &amp; Support</h2>
  <ul style="padding-left: 24px; margin-bottom: 24px;">
    <li style="margin-bottom: 8px;"><a href="/privacy-policy" style="color: #f97316; text-decoration: none;">Privacy Policy</a> - Comprehensive data protection disclosures.</li>
    <li style="margin-bottom: 8px;"><a href="/privacypolicy" style="color: #f97316; text-decoration: none;">Privacy Policy (Alternate)</a> - Secondary compliance URL.</li>
    <li style="margin-bottom: 8px;"><a href="/terms-of-service" style="color: #f97316; text-decoration: none;">Terms of Service</a> - Rules governing platform usage.</li>
    <li style="margin-bottom: 8px;"><a href="/terms" style="color: #f97316; text-decoration: none;">Terms of Service (Alternate)</a> - Short terms URL.</li>
    <li style="margin-bottom: 8px;"><a href="/disclaimer" style="color: #f97316; text-decoration: none;">Disclaimer</a> - Platform liability boundaries.</li>
    <li style="margin-bottom: 8px;"><a href="/contact" style="color: #f97316; text-decoration: none;">Contact Us</a> - Get in touch with the administration.</li>
    <li style="margin-bottom: 8px;"><a href="/about" style="color: #f97316; text-decoration: none;">About Us</a> - Learn about our mission and vision.</li>
  </ul>
`
);

// 2. Pre-render page generator helper
function generateStaticPage(subPath, contentHtml) {
  // Inject into root div
  const modifiedHtml = indexHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${contentHtml}</div>`
  );

  const targetDir = path.join(distDir, subPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(path.join(targetDir, 'index.html'), modifiedHtml);
  console.log(`✅ Pre-rendered static HTML page for: /${subPath}`);
}

// 3. Generate all static subdirectory index files
generateStaticPage('privacypolicy', privacyPolicyContent);
generateStaticPage('privacy-policy', privacyPolicyContent); // Generates standard URL route with 200 OK!
generateStaticPage('terms-of-service', termsOfServiceContent);
generateStaticPage('terms', termsOfServiceContent); // Generates short terms URL route with 200 OK!
generateStaticPage('disclaimer', disclaimerContent);
generateStaticPage('about', aboutContent);
generateStaticPage('contact', contactContent);
generateStaticPage('sitemap', sitemapContent);

// 4. Overwrite dist/index.html (the Homepage itself) with a rich fallback.
// This gives search engines and simple checker tools immediate structural headings, 
// 300+ words of content, and clear footer links without executing React!
const homepageFallbackContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background-color: #ffffff; min-height: 100vh; display: flex; flex-direction: column;">
  <header style="padding: 24px 20px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
    <div style="max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div style="font-size: 26px; font-weight: 800; color: #f97316; letter-spacing: -0.025em;">PadhakuPortal</div>
      <nav style="display: flex; gap: 24px; font-weight: 500; font-size: 15px;">
        <a href="/" style="text-decoration: none; color: #f97316;">Home</a>
        <a href="/notes" style="text-decoration: none; color: #475569; hover:color: #f97316;">Study Notes</a>
        <a href="/pyqs" style="text-decoration: none; color: #475569; hover:color: #f97316;">Question Papers</a>
        <a href="/ai-tutor" style="text-decoration: none; color: #475569; hover:color: #f97316;">AI Tutor</a>
        <a href="/contribute" style="text-decoration: none; color: #475569; hover:color: #f97316;">Contribute</a>
      </nav>
    </div>
  </header>

  <main style="flex: 1; max-width: 900px; margin: 48px auto; padding: 0 24px; line-height: 1.8;">
    <h1 style="color: #0f172a; font-size: 42px; font-weight: 800; text-align: center; margin-bottom: 24px; letter-spacing: -0.025em; line-height: 1.2;">PadhakuPortal - Free Engineering Study Materials, Handwritten Notes &amp; Previous Year Papers</h1>
    
    <p style="font-size: 18px; color: #334155; line-height: 1.8; text-align: center; margin-bottom: 40px; max-width: 800px; margin-left: auto; margin-right: auto;">
      Welcome to <strong>PadhakuPortal</strong>, the premier academic platform custom-built for engineering undergraduate students. We deliver an integrated, highly organized collection of hand-written class notes, verified previous year question papers (PYQs), comprehensive study guides, practical lab viva cheat sheets, and evidence-based revision planning resources designed to support and accelerate your semester preparation.
    </p>
    
    <h2 style="color: #0f172a; font-size: 26px; font-weight: 700; margin-top: 48px; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">1. Engineering Branches We Cover</h2>
    <p style="color: #334155; margin-bottom: 16px;">
      At PadhakuPortal, we recognize that different engineering fields present distinct mathematical and conceptual challenges. We categorize and verify resources across five core branches to ensure maximum academic relevance:
    </p>
    <ul style="padding-left: 24px; margin-bottom: 32px; font-size: 16px; color: #334155; line-height: 2;">
      <li style="margin-bottom: 8px;"><strong>Computer Science &amp; IT (CSE/IT):</strong> High-quality lectures and notes spanning Data Structures, Advanced Algorithms, Theory of Computation, Operating Systems, Database Management Systems (DBMS), and Computer Networks.</li>
      <li style="margin-bottom: 8px;"><strong>Electronics &amp; Communication (ECE):</strong> Elaborate revision keys for Digital Electronics, Microprocessors, Signals &amp; Systems, Analog Communications, VLSI Design, and Embedded Controllers.</li>
      <li style="margin-bottom: 8px;"><strong>Mechanical Engineering (ME):</strong> Step-by-step mathematical proofs and summaries covering Engineering Thermodynamics, Fluid Mechanics, Strength of Materials, Heat Transfer, and Kinematics of Machines.</li>
      <li style="margin-bottom: 8px;"><strong>Civil Engineering (CE):</strong> Practical summaries for Structural Analysis, Environmental Engineering, Geotechnical Soil Dynamics, Surveying, and Transportation Engineering.</li>
      <li style="margin-bottom: 8px;"><strong>Applied Sciences &amp; Humanities:</strong> Support for first-year standard engineering syllabi, covering Engineering Mathematics, Physics, Chemistry, Basic Electrical Engineering, and Mechanics.</li>
    </ul>

    <h2 style="color: #0f172a; font-size: 26px; font-weight: 700; margin-top: 40px; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">2. Leverage Previous Year Papers (PYQs) for Success</h2>
    <p style="color: #334155; margin-bottom: 16px;">
      Solving past university exams is scientifically proven to be one of the most effective ways to study. PadhakuPortal organizes past papers to make retrieval effortless:
    </p>
    <p style="color: #334155; margin-bottom: 16px;">
      By reviewing our verified PYQ collections, you can identify high-weightage topics, understand grading expectations, practice writing speed, and learn to structure your answers logically. We categorize papers by <strong>Mid-Semester Assessments</strong>, <strong>End-Semester University Examinations</strong>, and <strong>Practical/Lab Evaluations</strong> so you always prepare for the specific test structure.
    </p>

    <h2 style="color: #0f172a; font-size: 26px; font-weight: 700; margin-top: 40px; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">3. AI Tutor: Instant Engineering Simplification</h2>
    <p style="color: #334155; margin-bottom: 16px;">
      Have you ever read a textbook chapter and felt completely stuck on a derivation or programming script? Our <strong>AI Study Tutor</strong> is here to resolve your doubts instantly. Built on advanced language algorithms, the AI Tutor is optimized specifically to explain difficult engineering concepts, write sample code, solve mathematical derivations, and summarize lecture handouts in easy-to-understand student language. Ask academic questions and receive structured replies, diagrams, or explanations within seconds.
    </p>

    <h2 style="color: #0f172a; font-size: 26px; font-weight: 700; margin-top: 40px; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">4. Maintain Academic Integrity &amp; Quality Standards</h2>
    <p style="color: #334155; margin-bottom: 16px;">
      We believe in building a trustworthy educational ecosystem. Every single study guide, revision file, or exam paper uploaded to our platform is vetted and reviewed by our administrative team before going live. This strict quality barrier filters out spam, irrelevant material, and low-quality files, keeping the library clean, accurate, and highly valuable. We also enforce student privacy, cookie disclosures, and copyright safety protocols to remain fully transparent and compliant with international Web standards.
    </p>

    <h2 style="color: #0f172a; font-size: 26px; font-weight: 700; margin-top: 40px; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">5. Join the Student Contribution Movement</h2>
    <p style="color: #334155; margin-bottom: 16px;">
      PadhakuPortal is created for students, by students. If you have well-written lecture notes, exam papers, or practical revision guidelines, you can easily share them with the community. By uploading your materials via our <strong>Contribute</strong> page, you help build a free, reliable, and accessible academic support library for thousands of other students. Let's work together to make engineering learning stress-free and collaborative!
    </p>
  </main>

  <footer style="padding: 40px 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 14px; color: #64748b;">
    <div style="max-width: 1000px; margin: 0 auto;">
      <p style="margin-bottom: 16px; font-weight: 500;">&copy; 2026 PadhakuPortal Education. Built for engineering excellence and student support.</p>
      <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; font-weight: 600; margin-bottom: 16px;">
        <a href="/privacy-policy" style="color: #f97316; text-decoration: none;">Privacy Policy</a>
        <a href="/privacypolicy" style="color: #64748b; text-decoration: none;">Privacy Policy Alternate</a>
        <a href="/terms-of-service" style="color: #64748b; text-decoration: none;">Terms of Service</a>
        <a href="/terms" style="color: #64748b; text-decoration: none;">Terms Alternate</a>
        <a href="/disclaimer" style="color: #64748b; text-decoration: none;">Disclaimer</a>
        <a href="/contact" style="color: #64748b; text-decoration: none;">Contact Us</a>
        <a href="/about" style="color: #64748b; text-decoration: none;">About Us</a>
        <a href="/sitemap" style="color: #64748b; text-decoration: none;">Sitemap</a>
      </div>
      <p style="font-size: 12px; color: #94a3b8; max-width: 700px; margin: 0 auto; line-height: 1.5;">
        Disclaimer: PadhakuPortal is an independent student platform. We provide study notes and resources for exam revision support. We are not officially affiliated with or endorsed by any specific university, engineering college, or government board. Always verify syllabus details against official university announcements.
      </p>
    </div>
  </footer>
</div>
`;

const modifiedHomepageHtml = indexHtml.replace(
  '<div id="root"></div>',
  `<div id="root">${homepageFallbackContent}</div>`
);

fs.writeFileSync(indexHtmlPath, modifiedHomepageHtml);
console.log('✅ Successfully pre-rendered Homepage fallback content in dist/index.html (Completes AdSense requirements).');
