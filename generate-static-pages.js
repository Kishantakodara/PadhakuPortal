import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error("dist/index.html not found. Make sure to run this after 'vite build'.");
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// The raw HTML of the privacy policy for crawlers.
// When a real user visits, React will instantly replace this with the fully styled component!
const privacyPolicyContent = `
<div style="padding: 40px; font-family: sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">
  <h1>Privacy Policy</h1>
  <p>Last updated: May 18, 2026</p>
  <p>PadhakuPortal is an educational website for engineering students. This Privacy Policy explains what information may be collected when you use the website, submit a contact form, contribute study material, use the AI Tutor, or interact with analytics and advertising technologies.</p>
  
  <h2>Information We Collect</h2>
  <p>We may collect the following information depending on how you use the site:</p>
  <ul>
    <li>Contact details you submit, such as name, email address, and message content.</li>
    <li>Contribution details, such as uploaded PDF files, note titles, author names, branch, semester, and related metadata.</li>
    <li>Technical data such as browser type, device type, referring pages, approximate region, pages visited, and performance events.</li>
    <li>Cookies or similar identifiers used for preferences, analytics, site security, and advertising where applicable.</li>
  </ul>

  <h2>Google Advertising and Third-Party Vendors</h2>
  <p>If Google AdSense or other Google advertising products are enabled, third-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to PadhakuPortal or other websites. Google's use of advertising cookies enables Google and its partners to serve ads based on visits to this site and other sites on the internet.</p>
  <p>Users may opt out of personalized advertising by visiting Google Ads Settings.</p>

  <h2>Contact</h2>
  <p>For privacy questions, content removal requests, or data-related concerns, contact the PadhakuPortal team at padhakuportal@gmail.com.</p>
</div>
`;

// Inject the content into the root div
const modifiedHtml = indexHtml.replace(
  '<div id="root"></div>',
  `<div id="root">${privacyPolicyContent}</div>`
);

// Create the privacypolicy directory and write the file
const privacyPolicyDir = path.join(distDir, 'privacypolicy');
if (!fs.existsSync(privacyPolicyDir)) {
  fs.mkdirSync(privacyPolicyDir, { recursive: true });
}

fs.writeFileSync(path.join(privacyPolicyDir, 'index.html'), modifiedHtml);

console.log('✅ Successfully generated static HTML for /privacypolicy (Google AdSense Crawler fix).');
