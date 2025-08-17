const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const PDFMerger = require('pdf-merger-js').default;
const chromium  = require('playwright').chromium;
const cheerio = require('cheerio');
const { generateChartImagePath } = require('./english-report-support/helper.js');
const { listDocFiles, convertImageToPDF, generatePDFsFromDocx, updateOlStartNumber } = require('./english-report-support/fileList.js');
// const { convertImageToPDF } = require('./convertImageToPdf');
const mammoth = require('mammoth');

const supportFilesPath = path.join(__dirname, "english-report-support");

const docDir = path.join(supportFilesPath, '/doc');
const headerLogosDir = path.join(supportFilesPath, 'headerLogos');
const outputDir = path.join(supportFilesPath, '/output');
const finalPdfPath = path.join(outputDir, 'Scan Report.pdf');
let colorIndex = 0;

function buildTOCHtml(clientName, tocEntries, startingPage) {
  const entriesPerPage = 58;
  let pages = '';
  let pageCounter = startingPage;

  for (let i = 0; i < tocEntries.length; i += entriesPerPage) {
    const chunk = tocEntries.slice(i, i + entriesPerPage);

    pages += `
      <div class="page-border">
      <div class="header">TABLE OF CONTENT</div>
      <div class="toc-content">
        ${[0, 1].map(colIndex => `
          <table class="toc-table">
            <thead>
              <tr>
                <th>SR</th>
                <th>CONTENT DETAILS</th>
                <th>PAGE</th>
              </tr>
            </thead>
            <tbody>
              ${chunk
        .filter((_, i) => i % 2 === colIndex)
        .map((entry, j) => `
                  <tr>
                    <td>${colIndex + 1 + j * 2}</td>
                    <td>${entry.heading}</td>
                    <td>${entry.page}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        `).join('')}
      </div>

      <div class="footer">
        <div class="footer-text">Academic and Competitive Excellence Report Of ${clientName}</div>
        <div class="page-number">${pageCounter}</div>
      </div>
    </div>

    `;

    pageCounter++;
  }

  return `
  <html>
  <head>
   <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap" rel="stylesheet">
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: Calibri, sans-serif;
        font-size: 15px;
        line-height: 1.6;
        color: #222;
        -webkit-print-color-adjust: exact;
      }
      .page-border {
        height: 297mm;
        border: 3mm solid #e9bc25;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        page-break-after: always;
        padding: 0;
      }
      .header {
        height: 20mm;
        background: #009e49;
        color: white;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .toc-container {
        border: 6px solid gold;
        font-family: 'Algerian', serif;
        background-color: #ffffff;
        width: 90%;
        margin: auto;
       
      }

      .toc-header {
        background-color: #3a3a3a;
        color: white;
        text-align: center;
        font-size: 28px;
        padding: 10px;
        letter-spacing: 1px;
      }

      .toc-content {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        padding: 15px;
        justify-content: space-around;
         height: 90vh;
      }

      .toc-table {
        width: 45%;
        border-collapse: collapse;
      }

      .toc-table th {
        background-color: #1e73be;
        color: white;
        padding: 8px;
        font-size: 16px;
      }

      .toc-table td {
        padding: 2px 10px;
        border: 1px solid #ccc;
        
      }

      .toc-table tr:nth-child(even) {
        background-color: #e3effc;
        height:16px;
        font-size:12px;
      }

      .toc-table tr:nth-child(odd) {
        background-color: #ffffff;
        height:14px; !important;
        font-size:12px;
      }

      .footer {
        height: 10mm;
        background: #009e49;
        color: white;
        font-size: 15px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10mm;
      }
      .footer-text {
        flex: 1;
        text-align: center;
      }
      .page-number {
        border-radius: 50%;
        border: 1mm solid #e9bc25;
        color: white;
        font-size: 14px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        background: #009e49;
      }
    </style>
  </head>
  <body>
    ${pages}
  </body>
  </html>
  `;
}

function convertDocxToHtml(docxFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(docxFile, (err, data) => {
      if (err) return reject(err);

      mammoth.convertToHtml({ buffer: data })
        .then(result => {
          const htmlContent = result.value; // HTML string
          const outputFile = path.basename(docxFile, '.docx') + '.html';
          const outputPath = path.join(supportFilesPath, '/output', outputFile);

          fs.writeFile(outputPath, htmlContent, (err) => {
            if (err) return reject(err);
            resolve(outputPath); // Return the saved HTML file path
          });
        })
        .catch(reject);
    });
  });
}

function getImageAsBase64(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const mimeType = 'image/png'; // or image/jpeg
  return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
}


function buildHtmlWithBorder(clientName, bodyContent, headerText, headerLogoPath, pageCounter, chartPath, headerColor) {
  // console.log(chartPath);

  const chartImage = chartPath != "" ? `<div style="width:100%; text-align: center;"><img src="${chartPath}" alt="Chart" /></div>` : '';
  const headerImage = headerLogoPath != "" ? `<img src="${headerLogoPath}" style="width:50px; height:50px; border-radius: 50%; flex:1"  alt="Chart" />` : '';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
   <meta charset="UTF-8">
   <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap" rel="stylesheet">
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: Calibri, sans-serif;
        font-size: 15px;
        line-height: 1.4;
        color: #222;
        -webkit-print-color-adjust: exact;
      }
      .page-border {
        height: 297mm;
        border: 3mm solid #e9bc25;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        page-break-after: always;
      }
      .header {
      margin: 0;
      padding: 0;
      background: ${headerColor};
      background-size: cover;
      height: 20mm;
      display: flex;
      justify-content: center;
      align-items: center;
      }
      .header-text {
        font-family: 'Algerian', serif;
        font-size: 32px;
        color: white;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10mm;
        width: 100%;
        letter-spacing: 2px;
        // text-shadow: 2px 2px 1px #000;
      }
      .footer {
        height: 10mm;
        font-family: Calibri, sans-serif;
        background: ${headerColor};
        color: white;
        font-size: 15px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10mm;
      }
      .footer-text {
        flex: 1;
        text-align: center;
      }
      .page-number {
        border-radius: 50%;
        border: 1mm solid #e9bc25;
        color: white;
        font-size: 14px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        background: ${headerColor};
      }
      .content {
        padding-left: 10mm;
        padding-right: 10mm;
        flex-grow: 1;
        overflow: hidden;
      }
      img {
        max-width: 100%;
        height: auto;
        page-break-inside: avoid;
      }
        .header-text--title{
        flex:14;
        text-align: center;

}
    </style>
  </head>
  <body>
    <div class="page-border">

      <div class="header"><div class="header-text">${headerImage}<div class="header-text--title"> ${headerText}</div> </div></div>
      <div class="content">${bodyContent}${chartImage}</div>
      <div class="footer">
        <div class="footer-text">Academic and Competitive Excellence Report Of ${clientName}</div>
        <div class="page-number">${pageCounter}</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

function buildHtmlClientDetails(clientName, headerText, pageCounter, clientImgPath) {
  // console.log(chartPath);

  const chartImage = clientImgPath != "" ? `<div style="width:100%; text-align: center;"><img src="${clientImgPath}" alt="Chart" /></div>` : '';

  const selectedColor = colorPalette[colorIndex % colorPalette.length];
  colorIndex++;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
   <meta charset="UTF-8">
   <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap" rel="stylesheet">
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: Calibri, sans-serif;
        font-size: 15px;
        line-height: 1.4;
        color: #222;
        -webkit-print-color-adjust: exact;
      }
      .page-border {
        height: 297mm;
        border: 3mm solid #e9bc25;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        page-break-after: always;
      }
      .header {
      margin: 0;
      padding: 0;
      background: ${selectedColor};
      background-size: cover;
      height: 20mm;
      display: flex;
      justify-content: center;
      align-items: center;
      }
      .header-text {
        font-family: 'Algerian', serif;
        font-size: 32px;
        color: white;
        text-transform: uppercase;
        letter-spacing: 2px;
        // text-shadow: 2px 2px 1px #000;
      }
      .footer {
        height: 10mm;
        font-family: Calibri, sans-serif;
        background: ${selectedColor};
        color: white;
        font-size: 15px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10mm;
      }
      .footer-text {
        flex: 1;
        text-align: center;
      }
      .page-number {
        border-radius: 50%;
        border: 1mm solid #e9bc25;
        color: white;
        font-size: 14px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        background: ${selectedColor};
      }
      .content {
        padding-left: 10mm;
        padding-right: 10mm;
        flex-grow: 1;
        overflow: hidden;
      }
      img {
        max-width: 100%;
        height: auto;
        page-break-inside: avoid;
      }
    </style>
  </head>
  <body>
    <div class="page-border">

      <div class="header"><div class="header-text">${headerText}</div></div>

      <div class="content">
      <p style="text-align: justify; font-size: 20px;">
        This SMM Academic and Competitive Excellence Scan Report is 
        meticulously crafted to be your exclusive property of
        <strong> ${clientName}</strong>.
      </p>
      </div>
      ${chartImage}

       <div class="content">
      <p style="text-align: justify; font-size: 18px;">

      This SMM Academic and Competitive Excellence Scan Report 
      is a bespoke masterpiece, crafted exclusively for <strong> ${clientName}</strong>. Born 
      from your thoughtful responses to 27 meticulously designed 
      questions, it weaves astrological insights from your birth 
      details with cognitive revelations to illuminate your unique
       strengths, latent potential, and pathways for growth. 
      <br>
      Rooted in the Seven Core Principles and powered by SMM’s AI-driven
       analytics, this report is your personalized compass, guiding you
        toward an optimal career aligned with your aspirations. Embrace
         it as a sacred tool, blending Vedic wisdom and modern science,
          to unlock your fullest potential and conquer your professional 
          dreams.
      </p>
      </div>
      <div class="footer">
        <div class="footer-text">Academic and Competitive Excellence Report Of ${clientName}</div>
        <div class="page-number">${pageCounter}</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

const colorPalette = [
  "#00B4FF", "#2B5F8B", "#6A0DAD", "#FF6F61", "#009B77",
  "#9a1f2c", "#D4AF37", "#708090"
];


async function convertHtmlToPdf(htmlContent, outputPdfPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set HTML content
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  // Generate PDF
  await page.pdf({
    path: outputPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });

  await browser.close();
}



function splitHtmlByAllPageBreaks(html) {
  const $ = cheerio.load(html);
  const parts = [];
  let currentPart = '';

  $('body').children().each((i, elem) => {
    const $elem = $(elem);
    if ($elem.hasClass('page-break') || $elem.find('.page-break').length > 0) {
      if (currentPart.trim()) {
        parts.push(currentPart);
      }
      currentPart = $.html(elem); // include the page-break element
    } else {
      currentPart += $.html(elem);
    }
  });

  if (currentPart.trim()) {
    parts.push(currentPart);
  }
  return parts;
}

const staticFirstScanHtml = ` <h2>The Transformative Power of the SMM Scan Report</h2>
  <p>
    The SMM Scan Report stands out as a groundbreaking tool for personal and professional development, uniquely blending ancient Indian spiritual wisdom with modern scientific insights to create a personalized roadmap for career success and self-fulfillment. Unlike conventional career assessments that rely solely on psychological tests or aptitude evaluations, this report integrates astrological insights, 27 carefully crafted questions, and a proprietary algorithm to assess an individual’s innate abilities, personality traits, intelligences, and skills. It empowers users to align their natural strengths with their aspirations of aiming to become an IAS officer, Doctor, Engineer, or Artist by offering a holistic, tailored guide to unlock their fullest potential.
  </p>

  <h2>Positive Aspects of the SMM Scan Report</h2>
  <p>
    The SMM Scan Report offers a wealth of benefits, making it an invaluable resource for students, parents, and individuals seeking clarity in their educational and career journeys. Here are its key positive aspects:
  </p>

  <ol>
    <li>
      <h3>Holistic and Comprehensive Analysis</h3>
      <ul>
        <li><strong>Multi-Dimensional Framework:</strong> This Report Evaluates five core areas of patron’s personality i.e. Innate Abilities (Physical, Mental, Emotional, Intellectual, Spiritual), Five Personality Factors (OCEAN model), Nine Intelligences (Howard Gardner’s theory), Personality Traits (Cognitive, Interpersonal, etc.), and Skill Sets (Hard, Soft, Transferable, Personal Development).</li>
        <li><strong>Personalized Insights:</strong> Combines astrological data (birth details) with responses to 27 questions, ensuring a bespoke analysis tailored to the individual’s unique profile.</li>
        <li><strong>Wide Scope:</strong> Covers 35 diverse career paths across seven groups, from technical fields like engineering to creative pursuits like arts and spiritual domains like environmental sciences.</li>
      </ul>
    </li>

    <li>
      <h3>Fusion of Spirituality and Science</h3>
      <ul>
        <li><strong>Ancient Wisdom:</strong> Incorporates timeless teachings from Sai Baba (faith, patience, resilience) and Indian spiritual principles (e.g., Chakras, Karma, Name Trigonometry) for a deeper understanding of purpose and potential.</li>
        <li><strong>Modern Research:</strong> Integrates cutting-edge concepts from Dr. Bruce Lipton’s epigenetics, cognitive psychology, and personality theories, grounding spiritual insights in scientific credibility.</li>
        <li><strong>Innovative Approach:</strong> Bridges the gap between traditional philosophy and contemporary tools, appealing to those who value both heritage and progress.</li>
      </ul>
    </li>

    <li>
      <h3>Actionable Career Guidance</h3>
      <ul>
        <li><strong>Career Alignment:</strong> Matches individual strengths to specific career paths (e.g., Conscientiousness for engineering, Openness for arts), helping users pursue fields where they’re most likely to thrive.</li>
        <li><strong>Exam Preparation:</strong> Highlights “Most Critical Factors” and key exams (e.g., JEE, NEET, UPSC) for each career group, offering a focused strategy for success.</li>
        <li><strong>Skill Development:</strong> Identifies gaps between “Present” and “Required” levels across abilities, traits, and skills, providing a clear growth plan with actionable steps.</li>
      </ul>
    </li>
     </ol>
<div class="section page-break">
</div>
<ol style="padding-left: 20px;" start=4>

    <li>
      <h3>Empowering Self-Awareness and Growth</h3>
      <ul>
        <li><strong>Strength Identification:</strong> Illuminates innate talents (e.g., linguistic intelligence, emotional resilience) and personality strengths, boosting confidence and self-esteem.</li>
        <li><strong>Growth Opportunities:</strong> Pinpoints areas for improvement (e.g., technical skills, adaptability), encouraging proactive development through training or mentorship.</li>
        <li><strong>Chart-Based Insights:</strong> Easy-to-read charts (Natal, Present, Required, Difference) offer a visual, intuitive way to track progress and set goals.</li>
      </ul>
    </li>

    <li>
      <h3>Benefits for Students and Parents</h3>
      <ul>
        <li><strong>For Students:</strong> Provides clarity on career choices, reduces stress by aligning paths with natural abilities, and fosters informed decision-making for a fulfilling future.</li>
        <li><strong>For Parents:</strong> Offers a deeper understanding of their child’s potential, reduces anxiety with data-driven insights, and strengthens parent-child communication about goals.</li>
      </ul>
    </li>

    <li>
      <h3>Practical and Versatile Tools</h3>
      <ul>
        <li><strong>Detailed Breakdown:</strong> Spans 189 factors (abilities, traits, skills) across 60 plus pages, offering granular insights into every facet of personal development.</li>
        <li><strong>Career Classification:</strong> Organizes careers into seven strategic groups, making it easy to explore options and prepare for competitive fields.</li>
        <li><strong>Training Support:</strong> Backed by Sai Miracle Mind’s complete training programs to bridge identified gaps, ensuring users have resources to succeed.</li>
      </ul>
    </li>

    <li>
      <h3>Emphasis on Resilience and Fulfillment</h3>
      <ul>
        <li><strong>Mind-Body Connection:</strong> Draws from Dr. Bruce Lipton’s research to emphasize how positive beliefs can enhance resilience, health, and success.</li>
        <li><strong>Spiritual Alignment:</strong> Encourages living with purpose, harmony, and mindfulness, fostering not just career success but lifelong fulfillment.</li>
        <li><strong>Motivational Boost:</strong> Inspires users to “Visualize-Believe-Become-Conquer-Celebrate,” instilling a proactive, optimistic mindset.</li>
      </ul>
    </li>

    <li>
      <h3>User-Friendly and Transparent</h3>
      <ul>
        <li><strong>Chart Reading Guides:</strong> Includes step-by-step instructions to interpret results, empowering users to take charge of their journey.</li>
        <li><strong>Honest Disclaimer:</strong> Clearly outlines limitations, building trust by acknowledging its probabilistic nature and encouraging complementary professional advice.</li>
      </ul>
    </li>

    <li>
      <h3>Cultural Resonance and Global Appeal</h3>
      <ul>
        <li><strong>Rooted in Indian Philosophy:</strong> Appeals to individuals who resonate with spiritual traditions, offering a culturally rich perspective on personal growth.</li>
        <li><strong>Universal Relevance:</strong> Combines globally recognized frameworks (e.g., Big Five traits, Gardner’s intelligences) with unique spiritual insights, making it accessible and valuable worldwide.</li>
      </ul>
    </li>
  </ol>`;

const legalDisclaimer = ` <div style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.35; margin: 15px; padding: 0;">

  <h1 style="font-size: 12px; margin: 4px 0;">Legal Disclaimer for the SMM Education and Competitive Excellence Scan Report</h1>
  <p style="margin: 2px 0;"><strong>Visualize-Believe-Become-Conquer-Celebrate</strong></p>
  <p style="margin: 2px 0;">www.MM99.in</p>
  <p style="margin: 2px 0;"><strong>Effective Date:</strong> May 16, 2025</p>

  <p style="margin: 2px 0;">
    The SMM Education and Competitive Excellence Scan Report is a unique, personalized tool designed to guide students toward academic and career success through a hybrid methodology that harmonizes Ancient Indian Spiritual Principles with contemporary scientific approaches. Developed under the esteemed guidance of Nilkanth Kesari, this report integrates spiritual insights from his family’s revered lineage of texts, mainly pertaining to the Aitareya Upanishad, Shiva Samhita, and Bhagavad Gita—with modern research in psychology, brain development, and epigenetics.
  </p>

  <p style="margin: 2px 0;">
    By blending Name Trigonometry, Astrological Analysis, and Chakra Alignment with the innovative 27 Questions Input Method, statistical modeling, and data analytics, the report offers a holistic analysis of an individual’s strengths, challenges, and potential. Rooted in the Seven Core Principles (Faith, Patience, Continuity, Diligence, Adaptation, Resilience, and Harmony), it serves as a roadmap for students aspiring to excel in competitive exams like NEET, JEE, UPSC, CA, Banking and State Services, aligning with SMM’s mission to empower every student across the India.
  </p>

  <p style="margin: 2px 0;">
    The 27 Questions Input Method is a foundational component, capturing user responses to assess personality traits, life challenges, and karmic patterns. These responses are contextualized through proprietary spiritual-scientific frameworks, augmented by statistical models and psychological insights, to provide tailored career recommendations. However, Sai Miracle Mind (SMM) explicitly disclaims any guarantee, warranty, or assurance regarding the accuracy, completeness, or reliability of the report’s findings or outcomes. The analysis is inherently probabilistic, not deterministic, and its effectiveness may be influenced by factors such as software limitations, subjective interpretations, incomplete user inputs, or external variables beyond SMM’s control. Users are advised to approach the report as a supplementary guide, not a definitive predictor of academic or professional success.
  </p>

  <h2 style="font-size: 10px; margin: 6px 0 2px;">Key Disclaimers</h2>

  <ol style="padding-left: 16px; margin: 0;">
    <li>
      <h3 style="font-size: 9px; margin: 4px 0 1px;">No Guarantee of Outcomes</h3>
      <p style="margin: 2px 0;">
        The Scan Report’s conclusions are derived from algorithmic interpretations of spiritual principles and user-provided data. While designed to illuminate potential career paths, results may vary significantly among individuals. The report is not a substitute for professional medical, psychological, legal, or educational advice. Users are encouraged to consult qualified professionals for critical life decisions, such as career planning or mental health concerns, and should not rely solely on the report’s recommendations.
      </p>
    </li>

    <li>
      <h3 style="font-size: 9px; margin: 4px 0 1px;">Data and Methodological Limitations</h3>
      <p style="margin: 2px 0;">
        The 27 Questions Input Method, while innovative, is not a clinically validated psychological or diagnostic tool. It relies on self-reported responses, which may be subject to bias or inconsistency. The proprietary spiritual-scientific frameworks prioritize Ancient Indian Philosophy that emphasizes concepts like Chakras, Karma, and Astrological Influences, over Western scientific paradigms. Users must acknowledge this philosophical bias and understand that the report’s insights reflect a unique blend of spiritual and analytical perspectives, which may not align with conventional assessment methods.
      </p>
    </li>

    <li>
      <h3 style="font-size: 9px; margin: 4px 0 1px;">Technical Risks and Limitations</h3>
      <p style="margin: 2px 0;">
        The software powering the Scan Report may be subject to errors, vulnerabilities, or compatibility issues inherent in digital platforms. SMM disclaims liability for any data loss, misinterpretation, or damages resulting from the use of the report, including technical failures or inaccuracies in the AI-driven analysis. Users assume responsibility for ensuring their devices meet compatibility requirements and for safeguarding their data during report access.
      </p>
    </li>

    <li>
      <h3 style="font-size: 9px; margin: 4px 0 1px;">Spiritual Foundations and Accessibility</h3>
      <p style="margin: 2px 0;">
        The report’s reliance on Ancient Indian Spiritual Principles, including restricted texts accessible only to Nilkanth Kesari’s disciples, underscores its cultural and philosophical roots. It is recommended exclusively for individuals who resonate with Indian Spiritual Philosophy and are open to its interpretive frameworks. Users unfamiliar with these principles should approach the report with an understanding of its spiritual context.
      </p>
    </li>

    <li>
      <h3 style="font-size: 9px; margin: 4px 0 1px;">Third-Party Content</h3>
      <p style="margin: 2px 0;">
        The report or its associated platforms may include advertisements or external links for user convenience. SMM does not vet or endorse the accuracy, reliability, or safety of such third-party content and disclaims liability for any issues arising from its use.
      </p>
    </li>

    <li>
      <h3 style="font-size: 9px; margin: 4px 0 1px;">Confidentiality and Intellectual Property</h3>
      <p style="margin: 2px 0;">
        Certain source texts and methodologies remain proprietary to Nilkanth Kesari and his disciples, protected under intellectual property laws. Unauthorized reproduction or distribution of the report’s content is strictly prohibited.
      </p>
    </li>
  </ol>


  <h2 style="font-size: 10px; margin: 6px 0 2px;">User Responsibility and Legal Jurisdiction</h2>
  <p style="margin: 2px 0;">
    By accessing or using the SMM Education and Competitive Excellence Scan Report, users acknowledge and accept that SMM, its affiliates, and Nilkanth Kesari (contact: <a href="mailto:nilkanthkesari@gmail.com" style="color: black; text-decoration: none;">nilkanthkesari@gmail.com</a>, WhatsApp +91 7977693348) bear no liability for any consequences, decisions, or actions taken based on the report’s insights.
  </p>

  <p style="margin: 2px 0;">
    The report is provided “as is,” and users assume full responsibility for its interpretation and application. Any disputes arising from the use of the report shall be governed exclusively by the laws of India, with jurisdiction limited to the courts of Mumbai, Maharashtra, India.
  </p>

  <p style="margin: 2px 0;">
    SMM encourages users to embrace the report as a valuable tool within the “Visualize-Believe-Become-Conquer-Celebrate” journey, using it to complement, not replace, professional guidance.
  </p>

  <p style="margin: 2px 0;">
    For inquiries or clarification, contact SMM at <a href="mailto:mm99.sai@gmail.com" style="color: black; text-decoration: none;">mm99.sai@gmail.com</a> or +91 7977693348.
  </p>

  <p style="margin: 4px 0;"><strong>Academic and Competitive Excellence Report, Copyright © 2025 Sai Miracle Mind. All Rights Reserved.</strong></p>

</div>

`;

const generatePDFWithTOC = async (userName = "Nilakanth Kesari") => {
  try {
    await fs.ensureDir(outputDir);
    await fs.emptyDir(outputDir);

    const docxFiles = (await fs.readdir(docDir)).filter(f => f.endsWith('.docx'));
    const merger = new PDFMerger();
    // const userName = "Nilakanth Kesari";

    let tocEntries = [];
    let documentPageCounter = 3; // TOC is page 2
    tocEntries.push({ heading: "Client Details", page: documentPageCounter });
    documentPageCounter++;
    const careerGroups = await generateChartImagePath();

    const directoryToSearch = path.join(supportFilesPath, '/charts');
    const docsList = listDocFiles(directoryToSearch);
    const inputPath = path.join(supportFilesPath, '/charts/00_FrontPage.jpeg');
    const outputFolder = path.join(supportFilesPath, '/output');

    await convertImageToPDF(inputPath, outputFolder);

    const contentPages = splitHtmlByAllPageBreaks(staticFirstScanHtml);
    for (const pageChunk of contentPages) {
      const headerColor = colorPalette[documentPageCounter % colorPalette.length]
      let base64Image = "";
      let base64ImageLogo = "";


      const basename = "Transformative Power of the SMM";
      const docxFilePath = path.join(directoryToSearch, basename + '.png');
      const logoFilePath = path.join(directoryToSearch, basename + '.jpeg');

      if (docsList.includes(basename + '.jpeg')) {
        base64ImageLogo = getImageAsBase64(logoFilePath);
        console.log("this is png file have Chart", logoFilePath);
      } else {
        console.log("this is docx file Don't have logo", docxFilePath);
      }

      if (docsList.includes(basename + '.png')) {
        base64Image = getImageAsBase64(docxFilePath);
        console.log("this is png file have Chart", docxFilePath);
      } else {
        console.log("this is docx file Don't have chart", docxFilePath);
      }

      const htmlPage = buildHtmlWithBorder(userName, pageChunk, basename, base64ImageLogo, documentPageCounter, base64Image, headerColor);
      const pdfPath = path.join(outputDir, `Transformative Power of the SMM_${documentPageCounter}.pdf`);
      await convertHtmlToPdf(htmlPage, pdfPath);
      await merger.add(pdfPath);
      documentPageCounter++;
    }
    // Save final merged PDF
    const finalPathFirstPage = path.join(outputDir, 'Transformative_Power_of_the_SMM_FULL.pdf');
    await merger.save(finalPathFirstPage);


    // documentPageCounter--;
    for (const file of docxFiles) {
      let baseName = path.basename(file, '.docx');
      const docxPath = path.join(docDir, file);
      const htmlPath = path.join(outputDir, `${baseName}.html`);
      const pdfPath = path.join(outputDir, `${baseName}.pdf`);

      console.log(`📄 Converting ${file} to HTML...`);
      await convertDocxToHtml(docxPath);

      const rawHtml = await fs.readFile(htmlPath, 'utf8');
      const cleanedHtml = rawHtml
        .replace(/<meta[^>]+>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/class="Mso[^"]*"/gi, '');

      const bodyMatch = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      let bodyContent = bodyMatch ? bodyMatch[1].trim() : cleanedHtml;
      console.log("this is base url", baseName);
      baseName = baseName.replace(/^\d+\.\s*/, '');


      let base64Image = "";
      let base64ImageLogo = "";


      const docxFilePath = path.join(directoryToSearch, baseName + '.png');
      const logoFilePath = path.join(directoryToSearch, baseName + '.jpeg');

      if (docsList.includes(baseName + '.jpeg')) {
        base64ImageLogo = getImageAsBase64(logoFilePath);
        console.log("this is png file have Chart", logoFilePath);
      } else {
        console.log("this is docx file Don't have logo", docxFilePath);
      }

      if (docsList.includes(baseName + '.png')) {
        base64Image = getImageAsBase64(docxFilePath);
        console.log("this is png file have Chart", docxFilePath);
      } else {
        console.log("this is docx file Don't have chart", docxFilePath);
      }

      const headerColor = colorPalette[documentPageCounter % colorPalette.length]

      const finalHtml = buildHtmlWithBorder(userName, bodyContent, baseName, base64ImageLogo, documentPageCounter, base64Image, headerColor);
      console.log(`🖨️ Generating PDF for: ${baseName}`);
      await convertHtmlToPdf(finalHtml, pdfPath);

      const cleanHeading = baseName.replace(/^\d+\.\s*/, '');
      if (fs.existsSync(pdfPath)) {
        tocEntries.push({ heading: cleanHeading, page: documentPageCounter });
        console.log(`✅ Adding PDF for: ${cleanHeading}`);
        await merger.add(pdfPath);
        documentPageCounter++;
      } else {
        console.warn(`❌ PDF not created for: ${cleanHeading}`);
      }
    }

    const careerDocDir = path.join(supportFilesPath, 'career_doc');
    const { finalCareerPdfPath, tocEntrie, pageCounter } = await generatePDFsFromDocx(careerGroups, careerDocDir, outputDir, documentPageCounter + 1, "Nilakanth Kesari", tocEntries);

    console.log(finalCareerPdfPath, tocEntrie, pageCounter);

    tocEntries = tocEntrie;
    documentPageCounter = pageCounter;
    const tocHtml = buildTOCHtml(userName, tocEntrie, 2); // TOC is page 1
    const tocPdfPath = path.join(outputDir, 'toc.pdf');
    console.log("📘 Generating Table of Contents...");
    await convertHtmlToPdf(tocHtml, tocPdfPath);

    const clientImgPath = path.join(supportFilesPath, 'clientImg', 'client.png');
    const clientBase64Image = getImageAsBase64(clientImgPath);
    const clientPageHtml = buildHtmlClientDetails(userName, "Client Details", 3, clientBase64Image);

    const clientPdfPath = path.join(outputDir, 'clientDetails.pdf');
    await convertHtmlToPdf(clientPageHtml, clientPdfPath);

    const finalMerger = new PDFMerger();
    await finalMerger.add(path.join(outputDir, '00_FrontPage.pdf')); // Add front page
    await finalMerger.add(tocPdfPath); // Add TOC
    await finalMerger.add(clientPdfPath); // Add client details
    await finalMerger.add(finalPathFirstPage); // Add client details

    for (const file of docxFiles) {
      const baseName = path.basename(file, '.docx');
      const pdfPath = path.join(outputDir, `${baseName}.pdf`);
      if (fs.existsSync(pdfPath)) {
        await finalMerger.add(pdfPath);
      }
    }

    //career groups
    if (fs.existsSync(finalCareerPdfPath)) {
      console.log(`✅ finalCareerPdfPath created: ${finalPdfPath}`);
      await finalMerger.add(finalCareerPdfPath);
    }
    //adding legal disclaimer 
    const headerColor = colorPalette[documentPageCounter % colorPalette.length]
    const legalHtmlPage = buildHtmlWithBorder(userName, legalDisclaimer, "Legal Disclaimer", "", documentPageCounter, "", headerColor);
    const legalPdfPath = path.join(outputDir, `legalDisclaimer_${documentPageCounter}.pdf`);
    await convertHtmlToPdf(legalHtmlPage, legalPdfPath);
    await finalMerger.add(legalPdfPath);

    await finalMerger.save(finalPdfPath);
    console.log(`✅ Final PDF with TOC created: ${finalPdfPath}`);
    return finalPdfPath; // Return the final PDF path

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

module.exports = {
  generatePDFWithTOC,
  // other functions
};
