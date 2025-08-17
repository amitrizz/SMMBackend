const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const PDFMerger = require('pdf-merger-js').default;
const mongoose = require('mongoose');
const Trait = require('../Models/Trait'); // Adjust the path as needed

mongoose.connect('mongodb+srv://devsmm:fullstack2565Developer@cluster0.k2ozhi4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const allCareer = ["Banking & Money Management Careers", "Technical and Scientific Careers", "Healthcare and Life Sciences Careers", "Creative and Media Careers", "Management and Corporate Careers", "Public Service & Government Careers", "Practical & Field Work Careers"]


const careerMap = {
  "Group One Careers": "Banking & Money Management Careers",
  "Group Two Careers": "Technical and Scientific Careers",
  "Group Three Careers": "Healthcare and Life Sciences Careers",
  "Group Four Careers": "Creative and Media Careers",
  "Group Five Careers": "Management and Corporate Careers",
  "Group Six Careers": "Public Service & Government Careers",
  "Group Seven Careers": "Practical & Field Work Careers"
};
function listDocFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);

    const docFiles = files.filter(file =>
      file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
    );

    console.log(`📄 .doc/.docx files in "${dirPath}":`);
    console.log(docFiles);
    return docFiles;

    // docFiles.forEach(file => console.log(file));
  } catch (err) {
    console.error('❌ Error reading directory:', err.message);
  }
}


// A4 size in points (width x height)
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

// Function to convert JPEG image to A4-sized PDF and save it to output folder
async function convertImageToPDF(inputImagePath, outputFolder = 'output') {
  try {
    const imageBytes = fs.readFileSync(inputImagePath);
    const pdfDoc = await PDFDocument.create();
    const jpgImage = await pdfDoc.embedJpg(imageBytes);
    const jpgDims = jpgImage.scale(1);

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    // Scale image to fit inside A4 while maintaining aspect ratio
    const scale = Math.min(A4_WIDTH / jpgDims.width, A4_HEIGHT / jpgDims.height);
    const imgWidth = jpgDims.width * scale;
    const imgHeight = jpgDims.height * scale;

    const x = (A4_WIDTH - imgWidth) / 2;
    const y = (A4_HEIGHT - imgHeight) / 2;

    page.drawImage(jpgImage, {
      x,
      y,
      width: imgWidth,
      height: imgHeight,
    });

    const pdfBytes = await pdfDoc.save();

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }

    const imageName = path.basename(inputImagePath, path.extname(inputImagePath));
    const outputPath = path.join(outputFolder, `${imageName}.pdf`);

    fs.writeFileSync(outputPath, pdfBytes);
    console.log(`✅ Converted to A4 PDF: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    throw err;
  }
}




function buildHtmlWithBorder(ClientName, bodyContent, headerText, pageCounter, headerLogoPath = '', headerColor) {
  const headerImage = headerLogoPath != "" ? `<img src="${headerLogoPath}" style="width:50px; height:50px; border-radius: 50%; flex:1"  alt="Chart" />` : '';
  // console.log(headerImage);

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
        .critical strong{
          color: red;
        }

        .moderate strong{
          color: blue;
        }

        .strength strong{
          color: green;
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
        .trait_category{
        font-weight:bold;
        }
    </style>
  </head>
  <body>
    <div class="page-border">
     <div class="header" style="background:${headerColor}; color: white; text-align: center;">
        <div class="header-text">
          ${headerImage}
          <div class="header-text--title" style="padding-top: 10px; margin-bottom: 0; line-height: 1.2;">
            <span style="font-size: 32px; display: block;">${headerText}</span>
            <span style="font-size: 16px; display: block; margin-top: 4px;">${careerMap[headerText] ? careerMap[headerText] : ""}</span>
          </div>
        </div>
      </div>
      <div class="content">${bodyContent}</div>
      <div class="footer">
        <div class="footer-text">Academic and Competitive Excellence Report Of ${ClientName}</div>
        <div class="page-number">${pageCounter}</div>
      </div>
    </div>
  </body>
  </html>
  `;
}


const allCareerComparition = [];
const careerPDFs = [
  "Group One Careers",
  "Group Two Careers",
  "Group Three Careers",
  "Group Four Careers",
  "Group Five Careers",
  "Group Six Careers",
  "Group Seven Careers"
];

const careerDataColors = ['red', 'blue', 'green']
let i = 0;

function replaceTraitLines(html, result) {
  // console.log(groupTraits,groupTraitsIndex);

  const $ = cheerio.load(html);

  // Step 1: Split into 3 arrays
  const arr1 = result.filter(item => parseFloat(item.difference) < 0);

  const remaining = result.filter(item => parseFloat(item.difference) >= 0);
  const arr2 = remaining.slice(0, -2); // Exclude last 2
  const arr3 = remaining.slice(-2);    // Last 2 items only

  let allCareerCriticalGap = [];

  // Create a new table element
  const table = $('<table></table>').css({
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    marginBottom: '10px',
  });

  // Add table header row
  const headerRow = $('<tr></tr>');
  headerRow.append($('<th>Sr. No.</th>').css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  headerRow.append($(`<th>${i != 7 ? "Traits" : "All Career Comparison"}</th>`).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  headerRow.append($('<th>Natal</th>').css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  headerRow.append($('<th>Present</th>').css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  headerRow.append($('<th>Required</th>').css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  headerRow.append($('<th>Difference</th>').css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  table.append(headerRow);

  // Variables to accumulate totals
  let totalNatal = 0;
  let totalPresent = 0;
  let totalRequired = 0;
  let totalDifference = 0;
  let idx = 1

  arr1.forEach((obj, index) => {
    textColor = careerDataColors[0];
    allCareerCriticalGap.push(obj.trait);
    const row = $('<tr></tr>');
    row.append($('<td></td>').text(idx++).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text("(" + obj.index + ") " + obj.trait).css({ border: '1px solid #ddd', padding: '2px', color: textColor }));
    row.append($('<td></td>').text(obj.natal).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text(obj.present).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text(obj.required).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text(obj.difference).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    // Add to totals
    totalNatal += Number(obj.natal) || 0;
    totalPresent += Number(obj.present) || 0;
    totalRequired += Number(obj.required) || 0;
    totalDifference += Number(obj.difference) || 0;
    table.append(row);
  })

  arr2.forEach((obj, index) => {
    textColor = careerDataColors[1];
    const row = $('<tr></tr>');
    row.append($('<td></td>').text(idx++).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text("(" + obj.index + ") " + obj.trait).css({ border: '1px solid #ddd', padding: '2px', color: textColor }));
    row.append($('<td></td>').text(obj.natal).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text(obj.present).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text(obj.required).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text(obj.difference).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    // Add to totals
    totalNatal += Number(obj.natal) || 0;
    totalPresent += Number(obj.present) || 0;
    totalRequired += Number(obj.required) || 0;
    totalDifference += Number(obj.difference) || 0;
    table.append(row);
  })
  arr3.forEach((obj, index) => {
    textColor = careerDataColors[2];
    const row = $('<tr></tr>');
    row.append($('<td></td>').text(idx++).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text("(" + obj.index + ") " + obj.trait).css({ border: '1px solid #ddd', padding: '2px', color: textColor }));
    row.append($('<td></td>').text(obj.natal).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text(obj.present).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text(obj.required).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    row.append($('<td></td>').text(obj.difference).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center', color: textColor }));
    // Add to totals
    totalNatal += Number(obj.natal) || 0;
    totalPresent += Number(obj.present) || 0;
    totalRequired += Number(obj.required) || 0;
    totalDifference += Number(obj.difference) || 0;
    table.append(row);
  })

  const totalRow = $('<tr></tr>').css({ fontWeight: 'bold', backgroundColor: '#f0f0f0' });
  totalRow.append($('<td colspan="2">Total</td>').css({ border: '1px solid #ddd', padding: '2px', textAlign: 'right' }));
  totalRow.append($('<td></td>').text(totalNatal.toFixed(3)).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  totalRow.append($('<td></td>').text(totalPresent.toFixed(3)).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  totalRow.append($('<td></td>').text(totalRequired.toFixed(3)).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  totalRow.append($('<td></td>').text(totalDifference.toFixed(3)).css({ border: '1px solid #ddd', padding: '2px', textAlign: 'center' }));
  table.append(totalRow);

  // console.log(allCareerCriticalGap);

  allCareerComparition.push([careerPDFs[i], totalNatal.toFixed(3), totalPresent.toFixed(3), totalRequired.toFixed(3), totalDifference.toFixed(3), allCareerCriticalGap]);
  i++;
  // Replace the first <ul> or <ol> with the new table
  const list = $('ul, ol').first();
  if (list.length) {
    list.replaceWith(table);
  } else {
    $('body').append(table);
  }

  return $.html();
}



function generateCareerComparisonPages() {
  let paragraphsPerPage = 23;
  allCareerComparition.sort((a, b) => parseFloat(b[4]) - parseFloat(a[4]));

  const paragraphs = [];

  // Add Title and Intro
  paragraphs.push(`<h3>All Career Comparison Table</h3>`);
  paragraphs.push(`<p style="margin:0px; line-height: 1.4;">This comprehensive comparison evaluates your alignment with seven major career groups based on your innate abilities, personality traits, and skill sets. The analysis reveals your current strengths and areas needing</p>`);
  paragraphs.push(`<p style="margin:0px; line-height: 1.4;">development for each career path.</p>`);

  // Table Start
  paragraphs.push(`<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">`);

  // Table Header
  paragraphs.push(`  
    <tr>
    <th style="border: 1px solid #ddd; padding: 2px; text-align: center;">Sr. No.</th>
    <th style="border: 1px solid #ddd; padding: 2px; text-align: center;">All Career Comparison</th>
    <th style="border: 1px solid #ddd; padding: 2px; text-align: center;">Natal</th>
    <th style="border: 1px solid #ddd; padding: 2px; text-align: center;">Present</th>
    <th style="border: 1px solid #ddd; padding: 2px; text-align: center;">Required</th>
    <th style="border: 1px solid #ddd; padding: 2px; text-align: center;">Difference</th>
  </tr>
  `);


  // Table Rows
  allCareerComparition.forEach((groupTrait, index) => {
    let textColor = 'red';
    if (index < 2) textColor = 'green';
    else if (index < 4) textColor = 'blue';

    const careerName = groupTrait[0];
    const careerLabel = careerMap[careerName] || "Unknown Career Group";
    const [natal, present, required, difference] = [groupTrait[1], groupTrait[2], groupTrait[3], groupTrait[4]];

    paragraphs.push(`
    <tr>
      <td style="border: 1px solid #ddd; padding: 0; height: 40px; color: ${textColor}; text-align: center;">${index + 1}</td>
      <td style="border: 1px solid #ddd; padding: 2px; color: ${textColor};">
        <div style="display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
          <div>${careerName}</div>
          <div>(${careerLabel})</div>
        </div>
      </td>
      <td style="border: 1px solid #ddd; padding: 2px; color: ${textColor}; text-align: center;">${natal}</td>
      <td style="border: 1px solid #ddd; padding: 2px; color: ${textColor}; text-align: center;">${present}</td>
      <td style="border: 1px solid #ddd; padding: 2px; color: ${textColor}; text-align: center;">${required}</td>
      <td style="border: 1px solid #ddd; padding: 2px; color: ${textColor}; text-align: center;">${difference}</td>
    </tr>
  `);
  });


  // Table End
  paragraphs.push(`</table>`);
  paragraphs.push(`<h3>Your Ideal Career Paths</h3>`);
  paragraphs.push(`<p style="margin:0px; line-height: 1.6;">The two green career fields are your most suitable paths.</p>`);
  paragraphs.push(`<p style="margin:0px; line-height: 1.6;">The two blue career fields are also suitable, but they'll require more effort and a 21-week SMM Training Program to succeed.</p>`);
  paragraphs.push(`<p style="margin:0px; line-height: 1.6;">The remaining three red career fields are least suitable. If you choose one of these, be prepared to work exceptionally hard and commit to a one-year SMM Training Program.</p>`);
  // Main Section: Career Comparison
  paragraphs.push(`<h3>Career Group Rankings (From Best to Least Fit)</h3>`);

  allCareerComparition.forEach((groupTrait, index) => {
    const careerName = careerMap[groupTrait[0]] || "Unknown Career Group";
    const diff = groupTrait[4];
    const largerGaps = groupTrait[5] || [];

    paragraphs.push(`<p><strong>${index + 1}. ${careerName}</strong></p>`);
    paragraphs.push(`<p style="padding-left:10px">i. <strong>Difference:</strong> ${diff}</p>`);
    paragraphs.push(`<p style="padding-left:10px">ii. There are larger gaps in following aspects:</p>`);

    largerGaps.forEach((gap, gapIndex) => {
      paragraphs.push(`<p style="padding-left:20px; color:red">${String.fromCharCode(97 + gapIndex)}) ${gap}</p>`);
    });
  });


  paragraphs.push(`<h2>Recommendations</h2>`);
  paragraphs.push(`<p>1. Go For any of the first two Career Groups as it will be easy for you to Achieve, with ten percent more efforts than present efforts rate.</p>`);
  paragraphs.push(`<p>2. You Also Can Achieve in the Careers in third and fourth Group Careers, if you are ready to take Extra Efforts up to 20% more than your present efforts rate.</p>`);
  paragraphs.push(`<p>3. We are pleased to recommend you for SMM's personalized training to address specific gaps in your preferred career direction in fifth, sixth and seventh Groups.</p>`);
  paragraphs.push(`<p><strong>Remember:</strong> These results indicate your natural inclinations, not limitations. With focused development, you can excel in any of these career groups.</p>`);

  const pages = [];
  let i = 0;
  let val = paragraphsPerPage;

  while (i < paragraphs.length) {

    const chunk = paragraphs.slice(i, i + val).join("\n");

    pages.push(`
    <div class="page">
      ${i === 0 ? `<h2 class="header-title">Career Group Comparison Report</h2>` : ""}
      ${chunk}
    </div>
  `);


    if (i == 0) {
      val += 4;
    }  // Increase chunk size for next page
    i += val;      // Move index forward by current chunk size
  }

  return pages;
}






function generatePaginatedContent(traits, CareerName, paragraphsPerPage = 17) {
  const categoryOrder = ["Critical Gap", "Moderate Gap", "Strength"];
  const introMap = {
    "Critical Gap": "These traits have the largest gaps, requiring urgent focus to excel in roles like Chartered Accountant or Investment Banker, where communication, data analysis, and strategic decisions are vital.",
    "Moderate Gap": "These traits need improvement to strengthen your financial expertise, supporting skills like organization and resilience in demanding roles.",
    "Strength": "These traits are close to or exceed requirements, positioning you well for financial roles. Leverage them to accelerate growth."
  };

  const endingPara = "The SMM Academic and Competitive Excellence Report identifies critical areas for growth and inherent strengths to steer your professional path. Urgent focus is needed on key skill deficiencies, while steady progress should be made on secondary attributes to bolster your capabilities. Capitalize on your standout qualities to thrive in your selected career. Employ SMM’s integrated tools and holistic approaches, combining timeless wisdom with contemporary techniques, to overcome challenges, realize your true potential, and achieve enduring success across a wide range of career options."

  const contentParagraphs = [];

  categoryOrder.forEach(category => {
    const filteredTraits = traits.filter(t => t.category === category);
    if (!filteredTraits.length) return;

    const cssClass =
      category === "Critical Gap" ? "critical" :
        category === "Moderate Gap" ? "moderate" :
          "strength";

    // Category heading and intro (only once)
    contentParagraphs.push(`
      <p class="${cssClass} trait_category">${category}</p>
    `);
    contentParagraphs.push(`
      <p class="intro">${introMap[category]}</p>
    `);

    // Each trait as paragraph
    filteredTraits.forEach((trait, index) => {
      contentParagraphs.push(`
        <p class="trait ${cssClass}">
          <strong>${index + 1}. ${trait.name} (${trait.score.toFixed(3)}):</strong> ${trait.description}
          <strong style="color:black;">Action:</strong> ${trait.action}
        </p>
      `);
    });
  });

  contentParagraphs.push(`
        <p>
          <strong>Summary:</strong> ${endingPara}<br>
        </p>
      `);
  // Split into pages

  const pages = [];
  const cate = "Critical Gap";
  for (let i = 0; i < contentParagraphs.length; i += paragraphsPerPage) {
    const chunk = contentParagraphs.slice(i, i + paragraphsPerPage).join('\n');
    pages.push(`
      <div class="page">
      ${i == 0 ? `<h2 class="header-title">${CareerName}</h2>` : ""}
        ${chunk}
      </div>
    `);
  }

  return pages;
}

async function splitHtmlIntoPages(traits, CareerName) {
  const paginated = generatePaginatedContent(traits, CareerName);
  return paginated;
}


const colorPalette = [
  "#00B4FF", "#2B5F8B", "#6A0DAD", "#FF6F61", "#009B77",
  "#9a1f2c", "#D4AF37", "#708090"
];


function getImageAsBase64(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  let mimeType = '';
  if (ext === '.jpeg' || ext === '.jpg') {
    mimeType = 'image/jpeg';
  } else if (ext === '.png') {
    mimeType = 'image/png';
  } else {
    throw new Error(`Unsupported image type: ${ext}`);
  }

  return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
}


function getImageBase64ImagePath(imageName) {
  const folderPath = path.join(__dirname, "career_doc_logo");
  const baseName = imageName;

  let imagePath = "";

  // Try both .jpeg and .png
  const jpegPath = path.join(folderPath, `${baseName}.jpeg`);
  const pngPath = path.join(folderPath, `${baseName}.png`);

  if (fs.existsSync(jpegPath)) {
    imagePath = jpegPath;
    // console.log("JPEG File exists:", jpegPath);
  }
  if (fs.existsSync(pngPath)) {
    imagePath = pngPath;
    // console.log("PNG File exists:", pngPath);
  }
  let base64Image = "";

  if (imagePath != "") {
    base64Image = getImageAsBase64(imagePath);
    // console.log("Base64 Encoded Image:", base64Image);
    // You can now use `base64Image` wherever needed
  }
  return base64Image

}



async function generatePDFsFromDocx(data, docFolderPath, outputFolderPath, pageCounter = 1, clientName, tocEntrie) {
  try {
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath, { recursive: true });
    }

    const docxFiles = fs.readdirSync(docFolderPath).filter(file => file.endsWith('.docx'));
    const browser = await puppeteer.launch();
    const merger = new PDFMerger();


    for (let i = 0; i < docxFiles.length; i++) {
      let group = data[i];
      const docxFile = docxFiles[i];
      const docxPath = path.join(docFolderPath, docxFile);
      const { value: htmlTemplate } = await mammoth.convertToHtml({ path: docxPath });
      // Wrap inside styled template
      let output = path.parse(docxFile).name.replace(/^GROUP-\d+\.\s*/i, '');
      output = output.replace(/^\d+\.\s*/, '');

      if (i == 7) {
        const allCareerPageHtmlArr = generateCareerComparisonPages();
        tocEntrie.push({ heading: "All Careers Comparison", page: pageCounter });
        // Wrap inside styled template

        for (let k = 0; k < allCareerPageHtmlArr.length; k++) {
          const secondPage = allCareerPageHtmlArr[k];

          const headercolor = colorPalette[pageCounter % colorPalette.length]
          const base64Image = getImageBase64ImagePath(output);
          const finalSecondHtml = buildHtmlWithBorder(clientName, secondPage, output, pageCounter, base64Image, headercolor);
          pageCounter++;

          const pageSecond = await browser.newPage();
          await pageSecond.setContent(finalSecondHtml, { waitUntil: 'networkidle0' });

          const pdfSecondPageName = `Second${output}_${pageCounter}.pdf`; // Prevents overwriting
          const pdfSecondPagePath = path.join(outputFolderPath, pdfSecondPageName);

          await pageSecond.pdf({ path: pdfSecondPagePath, format: 'A4', printBackground: true });
          console.log(`✅ Created: ${pdfSecondPageName}`);

          await merger.add(pdfSecondPagePath);
          await pageSecond.close();
        }
        continue;
      }


      if (!group) {
        console.warn(`No data found for file ${docxFile}, skipping...`);
        continue;
      }

      // Create objects with required structure
      const result = group[0].map((item, i) => ({
        trait: item[0],
        natal: item[1],
        present: item[2],
        required: item[3],
        difference: item[4],
        index: group[1][i]
      }));
      // Step 2: Sort by numerical value of difference
      result.sort((a, b) => parseFloat(a.difference) - parseFloat(b.difference));

      // console.log(result);

      const modifiedHtml = replaceTraitLines(htmlTemplate, result);


      // Wrap inside styled template
      tocEntrie.push({ heading: output, page: pageCounter });
      const headercolor = colorPalette[pageCounter % colorPalette.length]
      // console.log(headercolor);

      const base64Image = getImageBase64ImagePath(output);
      // console.log(output);

      const finalHtml = buildHtmlWithBorder(clientName, modifiedHtml, output, pageCounter, base64Image, headercolor);
      pageCounter++


      // Generate PDF
      const page = await browser.newPage();
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

      const pdfFilename = `${output}.pdf`;
      const pdfPath = path.join(outputFolderPath, pdfFilename);

      await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
      console.log(`✅ Created: ${pdfFilename}`);
      await merger.add(pdfPath);
      await page.close();

      let careerData = [];
      const arr1 = result.filter(item => parseFloat(item.difference) < 0);

      const remaining = result.filter(item => parseFloat(item.difference) >= 0);
      const arr2 = remaining.slice(0, -2); // Exclude last 2
      const arr3 = remaining.slice(-2);    // Last 2 items only

      for (let gap = 0; gap < arr1.length; gap++) {
        let trait = await Trait.findOne({
          career: allCareer[i],
          category: "Critical Gap",
          name: { $regex: arr1[gap].trait, $options: 'i' } // 'i' = case-insensitive
        });
        if (trait) {
          trait.score = arr1[gap].difference;
          careerData.push(trait);
        }
      }
      for (let gap = 0; gap < arr2.length; gap++) {
        let trait = await Trait.findOne({
          career: allCareer[i],
          category: "Moderate Gap",
          name: { $regex: arr2[gap].trait, $options: 'i' } // 'i' = case-insensitive
        });
        if (trait) {
          trait.score = arr2[gap].difference;;
          careerData.push(trait);
        }
      }
      for (let gap = 0; gap < arr3.length; gap++) {
        let trait = await Trait.findOne({
          career: allCareer[i],
          category: "Strength",
          name: { $regex: arr3[gap].trait, $options: 'i' } // 'i' = case-insensitive
        });
        if (trait) {
          trait.score = arr3[gap].difference;;
          careerData.push(trait);
        }
      }
      // console.log(careerData);
      const secondPageHtmlArr = await splitHtmlIntoPages(careerData, allCareer[i]);

      // console.log(secondPageHtmlArr);
      tocEntrie.push({ heading: allCareer[i], page: pageCounter });


      for (let k = 0; k < secondPageHtmlArr.length; k++) {
        const secondPage = secondPageHtmlArr[k];

        const headercolor = colorPalette[pageCounter % colorPalette.length]
        const base64Image = getImageBase64ImagePath(output);
        const finalSecondHtml = buildHtmlWithBorder(clientName, secondPage, output, pageCounter, base64Image, headercolor);
        pageCounter++;

        const pageSecond = await browser.newPage();
        await pageSecond.setContent(finalSecondHtml, { waitUntil: 'networkidle0' });

        const pdfSecondPageName = `Second${output}_${pageCounter}.pdf`; // Prevents overwriting
        const pdfSecondPagePath = path.join(outputFolderPath, pdfSecondPageName);

        await pageSecond.pdf({ path: pdfSecondPagePath, format: 'A4', printBackground: true });
        console.log(`✅ Created: ${pdfSecondPageName}`);

        await merger.add(pdfSecondPagePath);
        await pageSecond.close();
      }


    }

    const finalCareerPdfPath = path.join(outputFolderPath, 'CareerGroups.pdf')
    await merger.save(finalCareerPdfPath);
    await browser.close()
    return { finalCareerPdfPath, tocEntrie, pageCounter };

  } catch (error) {
    console.error('❌ Error:', error);
  }
}



function updateOlStartNumber(filePath, startValue) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    const $ = cheerio.load(data);
    const olElement = $('ol');

    if (olElement.length === 0) {
      console.warn('No <ol> tag found in the HTML file.');
      return;
    }

    olElement.attr('start', startValue);

    fs.writeFile(filePath, $.html(), err => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log(`✅ Successfully updated <ol> start to ${startValue} in "${filePath}".`);
    });
  });
}


module.exports = { listDocFiles, convertImageToPDF, generatePDFsFromDocx, updateOlStartNumber };

