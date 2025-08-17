// helpers/chartHelper.js
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');

// const { generateHindiChartImagePath } = require('../hindi-report-support/helper.js');
const fs = require('fs');
const path = require('path');
// Register datalabels globally
ChartJSNodeCanvas._chartCallback = (ChartJS) => {
  ChartJS.register(ChartDataLabels);
};

// Traits and Ranges
let AllTraits = [];
AllTraits.push(["empty", "empty", "empty", "empty"]);

const traits = [
  "Genetic Blueprint", "Health Inheritance", "Mental Influence",
  "Intellectual Legacy", "Emotional Energy", "Spiritual Guidance", "Cosmic Bond"
];

// Generate trait data
function generateTraitData(staticDate) {


  const totalRanges = [
    [19.111, 20.999],
    [15.850, 16.750],
    [12.850, 13.750],
    [12.850, 13.750],
    [12.850, 13.750],
    [12.850, 13.750],
    [12.850, 13.750],
  ];
  let rawData = [];
  const isEvenDate = staticDate.getDate() % 2 === 0;

  let success = false;
  while (!success) {
    rawData = [];
    let rawTotal = 0;
    success = true;

    for (let i = 0; i < totalRanges.length; i++) {
      const [min, max] = totalRanges[i];
      let total;

      if (i < totalRanges.length - 1) {
        total = +(Math.random() * (max - min) + min).toFixed(3);
      } else {
        total = +(100 - rawTotal).toFixed(3);
        if (total < min || total > max) {
          success = false;
          break;
        }
      }

      let motherPercent = isEvenDate
        ? Math.random() * (0.49 - 0.4) + 0.4
        : Math.random() * (0.6 - 0.51) + 0.51;

      const mother = +(total * motherPercent).toFixed(3);
      const father = +(total - mother).toFixed(3);

      if ((isEvenDate && father <= mother) || (!isEvenDate && mother <= father)) {
        success = false;
        break;
      }

      rawData.push({ trait: traits[i], mother, father, total });
      rawTotal += total;
    }
  }

  return rawData.map(({ trait, mother, father, total }) => [
    trait,
    +mother.toFixed(3),
    +father.toFixed(3),
    +total.toFixed(3),
  ]);
}




function calculateChakraActivation(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.645; // 65% of natal  
    natalPercent = 0.85
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.645; // 68% of natal
    natalPercent = 0.84
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.645; // 70% of natal
    natalPercent = 0.83
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.645; // 72% of natal  
    natalPercent = 0.82
  } else {
    agePercent = 0.645; // 75% of natal
    natalPercent = 0.81
  }


  const chakraNames = [
    'Muladhara',
    'Swadhisthana',
    'Manipura',
    'Anahata',
    'Vishudhha',
    'Ajna',
    'Sahasrara'
  ]
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < data.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * agePercent).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.735).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateAuraIllumination(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.625; // 65% of natal  
    natalPercent = 0.84
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.625; // 68% of natal
    natalPercent = 0.85
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.625; // 70% of natal
    natalPercent = 0.81
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.625; // 72% of natal  
    natalPercent = 0.82
  } else {
    agePercent = 0.625; // 75% of natal
    natalPercent = 0.83
  }


  const auraNames = [
    'Annamaya',
    'Pranamaya',
    'Manomaya',
    'Vijanmaya',
    'Anandmaya',
    'Amritmaya',
    'Shavamaya'
  ]
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < data.length; i++) {
    const aura = auraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * agePercent).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.795).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    result.push([aura, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculatePositiveKarmaAspects(chakraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.625; // 65% of natal  
    natalPercent = 0.84
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.625; // 68% of natal
    natalPercent = 0.85
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.625; // 70% of natal
    natalPercent = 0.83
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.625; // 72% of natal  
    natalPercent = 0.82
  } else {
    agePercent = 0.625; // 75% of natal
    natalPercent = 0.84
  }


  const aspectNames = [
    'Interpersonal Skills',
    'Personal Development',
    'Cognitive Skills',
    'Economic Success',
    'Spiritual Well-Being',
    'Environmental Practices',
    'Wisdom And Truth'
  ]

  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < aspectNames.length; i++) {
    const name = aspectNames[i];
    const natal = +(((chakraData[i][1]) * natalPercent).toFixed(3));
    const present = +(natal * agePercent).toFixed(3);
    const required = +(natal * 0.755).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    result.push([name, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}

function calculateNegativeKarmaAspects(auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.61
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.62
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.63
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.64
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.65
  }



  const aspectNames = [
    "Aggression And Hostility",
    "Closed-Mindedness",
    "Deception And Manipulation",
    "Economic Injustice",
    "Negativity And Mental Healt",
    "Physical Harm And Wellness",
    "Spiritual Disconnect"
  ]

  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < aspectNames.length; i++) {
    const name = aspectNames[i];
    const natal = +(((auraData[i][1]) * 0.52).toFixed(3));
    const present = +(natal * agePercent).toFixed(3);
    const required = +(natal * 0.515).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    result.push([name, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}

function calculateBalancedKarmaAspects(chakraData, auraData, age) {
  // let agePercent;
  // if (age >= 9 && age <= 11) {
  //   agePercent = 0.625;
  // } else if (age >= 12 && age <= 13) {
  //   agePercent = 0.48;
  // } else if (age >= 14 && age <= 15) {
  //   agePercent = 0.51;
  // } else if (age >= 16 && age <= 17) {
  //   agePercent = 0.54;
  // } else {
  //   agePercent = 0.57;
  // }

  const aspectNames = [
    'Self-Awareness', 'Mindfulness', 'Moderation',
    'Compassion', 'Integrity', 'Harmony', 'Equanimity'
  ]
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < aspectNames.length; i++) {
    const name = aspectNames[i];
    const natal = +(((chakraData[i][1] + auraData[i][1]) / 2).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.755).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    result.push([name, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateInnatePhysicalAbilities(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.81
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.82
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.83
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.84
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.85
  }

  const chakraNames = [
    'Strength', 'Resistance', 'Speed',
    'Flexibility', 'Agility', 'Coordination', 'Balance'
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.795).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateInnateMentalAbilities(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.79
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.78
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.80
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.81
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.82
  }


  const chakraNames = [
    "Perceptual Skills", "Memory Retention", "Selective Attention", "Logical Reasoning",
    "Creativity", "Problem-Solving", "Critical Thinking"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.795).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);
    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}

function calculateInnateEmotionalAbilities(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.80
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.81
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.82
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.83
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.84
  }



  const chakraNames = [
    "Emotional Awareness", "Emotional Empathy", "Emotional Regulation", "Emotional Social Skills",
    "Emotional Resilience", "Self-Reflection", "Emotional Expression"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.745).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateInnateIntellectualAbilities(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.78
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.77
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.79
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.80
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.76
  }


  const chakraNames = [
    "Word Knowledge", "Verbal Reasoning", "Numerical Aptitude", "Spatial Intelligence",
    "Inductive Reasoning", "Analytical Thinking", "Pattern Recognition"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.755).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}



function calculateInnateSpiritualAbilities(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.75
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.74
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.76
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.77
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.73
  }


  const chakraNames = [
    "Intuition", "Connection to Higher Self", "Compassion", "Presence and Mindfulness",
    "Spiritual Perception", "Faith and Trust", "Self-Reflection and Growth"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.715).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateOpennessToExperience(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.785
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.755
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.765
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.775
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.795
  }


  const chakraNames = [
    "Dreaming", "Appreciation", "Introspection", "Eclecticism",
    "Inquisitiveness", "Autonomy", "Precision"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.705).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateCONSCIENTIOUSNESS(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.76
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.75
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.74
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.77
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.78
  }


  const chakraNames = [
    "Organization", "Responsibility", "Self-Discipline", "Achievement",
    "Planned", "Reliability", "Neatness"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.715).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateEXTRAVERSION(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.71
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.69
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.70
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.72
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.73
  }


  const chakraNames = [
    "Sociability", "Assertiveness", "Talkativeness", "Energetic",
    "Adventurousness", "Gregariousness", "Positive Emotion"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.705).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateAGREEABLENESS(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.725
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.705
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.715
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.695
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.735
  }


  const chakraNames = [
    "Empathy", "Altruism", "Cooperation", "Frankness",
    "Modesty", "Tenderness", "Patience"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.705).toFixed(3);  // assume required is 61% of natal
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateNEUROTICISM(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.69
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1085; // 68% of natal
    natalPercent = 0.70
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.71
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.72
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.73
  }


  const chakraNames = [
    "Moodiness", "Anxiety", "Fear", "Anger",
    "Frustration", "Envy", "Loneliness"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (0.32)).toFixed(3);

    const present = +(natal * agePercent).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.555).toFixed(3);  // assume required is 61% of natal
    const difference = +(required - present).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}



function calculateVERBALLINGUISTICINTELLIGENCE(chakraData, auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.46
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.455
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.465
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.47
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.475
  }


  const chakraNames = [
    "Verbose", "Articulate", "Erudite", "Fluent",
    "Persuasive", "Argumentative", "Storytelling"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((((chakraData[i][1] + auraData[i][1]) / 2) * natalPercent).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.755).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateMATHEMATICALINTELLIGENCE(chakraData, auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.445
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.455
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.46
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.465
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.47
  }



  const chakraNames = [
    "Discerning", "Innovative", "Conceptual Thinking", "Insightful",
    "Quantitative Skills", "Methodical", "Analytic"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((((chakraData[i][1] + auraData[i][1]) / 2) * natalPercent).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.75).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateVISUALINTELLIGENCE(chakraData, auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.455
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.445
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.46
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.465
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.47
  }


  const chakraNames = [
    "Navigational", "Imaginative", "Perceptive", "Innovative",
    "Dynamic", "Aesthetic", "Mnemonic"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((((chakraData[i][1] + auraData[i][1]) / 2) * natalPercent).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.745).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}

function calculateINTERPERSONALINTELLIGENCE(chakraData, auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.435
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.44
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.445
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.455
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.455
  }


  const chakraNames = [
    "Empathetic", "Communicative", "Diplomatic", "Team-Oriented",
    "Considerate", "Influential", "Persuasive"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((((chakraData[i][1] + auraData[i][1]) / 2) * natalPercent).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.775).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);


    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}

function calculateINTRAPERSONALINTELLIGENCE(chakraData, auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.47
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.445
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.45
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.455
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.46
  }


  const chakraNames = [
    "Introspective", "Resilient", "Goal-Oriented", "Reflective",
    "Motivated", "Regulated", "Flexible"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((((chakraData[i][1] + auraData[i][1]) / 2) * natalPercent).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.73).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);


    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateBODILYINTELLIGENCE(chakraData, auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.48
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.465
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.47
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.475
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.46
  }



  const chakraNames = [
    "Accurate", "Aware", "Communicative", "Competent",
    "Spatially Aware", "Dexterity", "Athletic"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((((chakraData[i][1] + auraData[i][1]) / 2) * natalPercent).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.775).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}

function calculateMUSICALINTELLIGENCE(chakraData, auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.4575
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.4475
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.4375
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.4675
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.4775
  }



  const chakraNames = [
    "Acoustic", "Rhythmic", "Melodic", "Musical",
    "Aptitude", "Emotional", "Theoretical"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((((chakraData[i][1] + auraData[i][1]) / 2) * natalPercent).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.765).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateNATURALISITCINTELLIGENCEE(chakraData, auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.4675
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.4475
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.4375
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.4575
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.455
  }



  const chakraNames = [
    "Observational", "Classification", "Ecological", "Environmental",
    "Connection", "Floral and Fauna", "Conservation"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((((chakraData[i][1] + auraData[i][1]) / 2) * natalPercent).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.755).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateEXISTENTIALINTELLIGENCE(chakraData, auraData, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.425
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.435
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.445
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.455
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.465
  }



  const chakraNames = [
    "Contemplative", "Mortality", "Quest For", "Pondering",
    "Tolerance", "Spiritual", "Wisdom"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((((chakraData[i][1] + auraData[i][1]) / 2) * natalPercent).toFixed(3));
    const present = +(natal * 0.625).toFixed(3);
    const required = +(natal * 0.755).toFixed(3);  // Assuming 82% of natal is required
    const difference = +(present - required).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateCOGNITIVETRAITS(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.73
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.70
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.71
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.72
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.73
  }


  const chakraNames = [
    "Critical Thinking", "Problem-Solving", "Decision-Making",
    "Analytical Skills", "Strategic Planning", "Conceptualization", "Information Processing"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.735).toFixed(3);  // assume required is 61% of natal
    const difference = +(required - present).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateINTERPERSONALTRAITS(data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.82
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.80
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.79
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.81
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.83
  }

  const chakraNames = [
    "Communication", "Empathy", "Teamwork", "Leadership",
    "Negotiation", "Interpersonal Sensitivity", "Active Listening"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.735).toFixed(3);  // assume required is 61% of natal
    const difference = +(required - present).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateMOTIVATIONALTRAITS( data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.77
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.75
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.74
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.76
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.73
  }


  const chakraNames = [
    "Drive", "Perseverance", "Growth Mindset", "Resilience",
    "Self-Efficacy", "Intrinsic Motivation", "Curiosity"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.735).toFixed(3);  // assume required is 61% of natal
    const difference = +(required - present).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function calculateBEHAVIORALTRAITS( data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.83
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.79
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.80
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.81
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.82
  }


  const chakraNames = [
    "Adaptability", "Flexibility", "Time Management", "Organization",
    "Self-Discipline", "Focus", "Proactiveness"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.735).toFixed(3);  // assume required is 61% of natal
    const difference = +(required - present).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}



function calculateHARDSKILLS( data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.74
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.69
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.70
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.71
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.72
  }

  const chakraNames = [
    "Data Analysis", "Programming", "Process Optimization",
    "Numerical Reasoning", "Technical Troubleshooting", "Scientific Observation", "Design Thinking"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.735).toFixed(3);  // assume required is 61% of natal
    const difference = +(required - present).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}



function calculateSOFTSKILLS( data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.805
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.785
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.795
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.805
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.815
  }

  const chakraNames = [
    "Critical Thinking", "Creative Problem-Solving", "Teamwork",
    "Leadership", "Negotiation", "Conflict Resolution", "Active Listening"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.735).toFixed(3);  // assume required is 61% of natal
    const difference = +(required - present).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}



function calculateTRANSFERABLESKILLS( data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.70
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.69
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.71
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.70
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.72
  }

  const chakraNames = [
    "Critical Thinking", "Communication", "Teamwork",
    "Problem-Solving", "Adaptability", "Leadership", "Decision-Making"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.735).toFixed(3);  // assume required is 61% of natal
    const difference = +(required - present).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}

function calculatePERSONALDEVELOPMENTSKILLS( data, age) {
  let agePercent; // default value
  let natalPercent;
  if (age >= 9 && age <= 11) {
    agePercent = 0.1095; // 65% of natal  
    natalPercent = 0.68
  } else if (age >= 12 && age <= 13) {
    agePercent = 0.1095; // 68% of natal
    natalPercent = 0.69
  } else if (age >= 14 && age <= 15) {
    agePercent = 0.1095; // 70% of natal
    natalPercent = 0.70
  } else if (age >= 16 && age <= 17) {
    agePercent = 0.1095; // 72% of natal  
    natalPercent = 0.71
  } else {
    agePercent = 0.1095; // 75% of natal
    natalPercent = 0.72
  }

  const chakraNames = [
    "Communication", "Self-Awareness", "Emotional Intelligence",
    "Growth Mindset", "Resilience", "Time Management", "Goal Setting & Achievement"
  ];
  const result = [];
  let totalNatal = 0, totalPresent = 0, totalRequired = 0;

  for (let i = 0; i < chakraNames.length; i++) {
    const chakra = chakraNames[i];
    const natal = +((data[i][3]) * (natalPercent)).toFixed(3);

    const present = +(natal * 0.625).toFixed(3);   // assume present is 58% of natal
    const required = +(natal * 0.735).toFixed(3);  // assume required is 61% of natal
    const difference = +(required - present).toFixed(3);

    AllTraits.push([chakra, natal.toFixed(3), present.toFixed(3), required.toFixed(3), difference.toFixed(3)]);
    result.push([chakra, natal, present, required, difference]);

    totalNatal += natal;
    totalPresent += present;
    totalRequired += required;
  }

  const totalDiff = +(totalPresent - totalRequired).toFixed(3);
  result.push([
    'TOTAL',
    +totalNatal.toFixed(2),
    +totalPresent.toFixed(2),
    +totalRequired.toFixed(2),
    totalDiff
  ]);

  return result;
}


function getCareerGroupOne() {
  let groupOneCareer = [];
  let arrayOfIndex = [];

  const indices = [
    24, 11, 27, 162, 14, 136, 43, 44, 45, 83,
    138, 141, 145, 60, 42, 157, 151, 101, 78, 165
  ];

  indices.forEach(index => {
    groupOneCareer.push(AllTraits[index]);
    arrayOfIndex.push(index);
  });

  return [groupOneCareer, arrayOfIndex];
}

function getCareerGroupTwo() {
  let groupTwoCareer = [];
  let arrayOfIndex = [];

  const indices = [11, 27, 13, 163, 166, 79, 25, 84, 14, 167, 168, 155, 153, 143, 151, 45, 161, 80, 82, 42];

  indices.forEach(index => {
    groupTwoCareer.push(AllTraits[index]);
    arrayOfIndex.push(index);
  });

  return [groupTwoCareer, arrayOfIndex];
}

function getCareerGroupThree() {
  console.log(AllTraits.length);
  
  let groupThreeCareer = [];
  let arrayOfIndex = [];

  const indices = [
    120, 57, 31, 14, 136, 111, 167, 45, 63, 151,
    185, 141, 143, 42, 66, 157, 2, 6, 44, 60
  ];

  indices.forEach(index => {
    groupThreeCareer.push(AllTraits[index]);
    arrayOfIndex.push(index);
  });

  return [groupThreeCareer, arrayOfIndex];
}

// 1.	(12) Creativity
// 2.	(86) Imaginative
// 3.	(77) Storytelling
// 4.	(90) Aesthetic
// 5.	(141) Communication ✓
// 6.	(75) Persuasive
// 7.	(20) Emotional Expression
// 8.	(143) Teamwork ✓
// 9.	(155) Adaptability ✓
// 10.	(40) Inquisitiveness
// 11.	(51) Assertiveness
// 12.	(95) Team-Oriented
// 13.	(157) Time Management ✓
// 14.	(52) Talkativeness
// 15.	(39) Eclecticism
// 16.	(161) Proactiveness ✓
// 17.	(118) Artistic Sensitivity
// 18.	(115) Melodic
// 19.	(168) Design Thinking ✓
// 20.	(151) Resilience ✓
function getCareerGroupFour() {
  let groupFourCareer = [];
  let arrayOfIndex = [];

  const indices = [
    12, 86, 77, 90, 141, 75, 21, 143, 155, 40,
    51, 95, 157, 52, 39, 161, 118, 115, 168, 151
  ];

  indices.forEach(index => {
    groupFourCareer.push(AllTraits[index]);
    arrayOfIndex.push(index);
  });

  return [groupFourCareer, arrayOfIndex];
}

// 1.	(144) Leadership ✓
// 2.	(141) Communication ✓
// 3.	(138) Strategic Planning ✓
// 4.	(136) Decision-Making ✓
// 5.	(145) Negotiation ✓
// 6.	(143) Teamwork ✓
// 7.	(148) Drive ✓
// 8.	(150) Growth Mindset ✓
// 9.	(152) Self-Efficacy ✓
// 10.	(157) Time Management ✓
// 11.	(43) Organization ✓
// 12.	(101) Goal-Oriented ✓
// 13.	(60) Frankness ✓
// 14.	(59) Cooperation ✓
// 15.	(161) Proactiveness ✓
// 16.	(151) Resilience ✓
// 17.	(185) Emotional Intelligence ✓
// 18.	(27) Analytical Thinking ✓
// 19.	(14) Critical Thinking ✓
// 20.	(44) Responsibility ✓

function getCareerGroupFive() {
  let groupFiveCareer = [];
  let arrayOfIndex = [];

  const indices = [
    144, 141, 138, 136, 145, 143, 148, 150, 152, 157,
    43, 101, 60, 59, 161, 151, 185, 27, 14, 44
  ];

  indices.forEach(index => {
    groupFiveCareer.push(AllTraits[index]);
    arrayOfIndex.push(index);
  });

  return [groupFiveCareer, arrayOfIndex];
}


// 1.	(144) Leadership ✓
// 2.	(141) Communication ✓
// 3.	(136) Decision-Making ✓
// 4.	(57) Empathy ✓
// 5.	(44) Responsibility ✓
// 6.	(63) Patience ✓
// 7.	(151) Resilience ✓
// 8.	(14) Critical Thinking ✓
// 9.	(13) Problem-Solving ✓
// 10.	(60) Frankness ✓
// 11.	(143) Teamwork ✓
// 12.	(138) Strategic Planning ✓
// 13.	(185) Emotional Intelligence ✓
// 14.	(157) Time Management ✓
// 15.	(101) Goal-Oriented ✓
// 16.	(45) Self-Discipline ✓
// 17.	(1) Strength
// 18.	(5) Agility
// 19.	(7) Balance
// 20.	(31) Compassion ✓
function getCareerGroupSix() {
  let groupSixCareer = [];
  let arrayOfIndex = [];

  const indices = [
    144, 141, 136, 57, 44, 63, 151, 14, 13, 60,
    143, 138, 185, 157, 101, 45, 1, 5, 7, 31
  ];

  indices.forEach(index => {
    groupSixCareer.push(AllTraits[index]);
    arrayOfIndex.push(index);
  });

  return [groupSixCareer, arrayOfIndex];
}


// 1.	(1) Strength
// 2.	(2) Resistance
// 3.	(5) Agility
// 4.	(6) Coordination
// 5.	(7) Balance
// 6.	(112) Athletic
// 7.	(25) Spatial Intelligence ✓
// 8.	(106) Accurate ✓
// 9.	(110) Spatially Aware ✓
// 10.	(13) Problem-Solving ✓
// 11.	(155) Adaptability ✓
// 12.	(151) Resilience ✓
// 13.	(141) Communication ✓
// 14.	(143) Teamwork ✓
// 15.	(167) Scientific Observation ✓
// 16.	(111) Dexterity ✓
// 17.	(157) Time Management ✓
// 18.	(161) Proactiveness ✓
// 19.	(120) Observational ✓
// 20.	(44) Responsibility ✓

function getCareerGroupSeven() {
  let groupSevenCareer = [];
  let arrayOfIndex = [];

  const indices = [
    1, 2, 5, 6, 7, 112, 25, 106, 110, 13,
    155, 151, 141, 143, 167, 111, 157, 161, 120, 44
  ];

  indices.forEach(index => {
    groupSevenCareer.push(AllTraits[index]);
    arrayOfIndex.push(index);
  });

  return [groupSevenCareer, arrayOfIndex];
}





async function generateChartImagePath() {
  const staticDate = new Date('2025-06-10');  // static date for testing
  const width = 1000;
  const height = 500;
  const age = 9;

  const data = generateTraitData(staticDate);
  const chakraData = calculateChakraActivation(data, age);
  const auraData = calculateAuraIllumination(data, age);
  const positiveKarma = calculatePositiveKarmaAspects(chakraData, age);
  const negativeKarma = calculateNegativeKarmaAspects(auraData, age);
  const balancedKarma = calculateBalancedKarmaAspects(chakraData, auraData, age);
  const innatePhysicalAbilities = calculateInnatePhysicalAbilities(data, age);
  const innateMentalAbilities = calculateInnateMentalAbilities(data, age);
  const innateEmotionalAbilities = calculateInnateEmotionalAbilities(data, age);
  const innateIntellectualAbilities = calculateInnateIntellectualAbilities(data, age);
  const innateSpiritualAbilities = calculateInnateSpiritualAbilities(data, age);
  const opennessToExperience = calculateOpennessToExperience(data, age);
  const cONSCIENTIOUSNESS = calculateCONSCIENTIOUSNESS(data, age);
  const eXTRAVERSION = calculateEXTRAVERSION(data, age);
  const aGREEABLENESS = calculateAGREEABLENESS(data, age);
  const nEUROTICISM = calculateNEUROTICISM(data, age);
  const vERBALLINGUISTICINTELLIGENCE = calculateVERBALLINGUISTICINTELLIGENCE(chakraData,auraData, age);
  const mATHEMATICALINTELLIGENCE = calculateMATHEMATICALINTELLIGENCE(chakraData,auraData, age);
  const vISUALINTELLIGENCE = calculateVISUALINTELLIGENCE(chakraData,auraData, age);
  const iNTERPERSONALINTELLIGENCE = calculateINTERPERSONALINTELLIGENCE(chakraData,auraData, age);
  const iNTRAPERSONALINTELLIGENCE = calculateINTRAPERSONALINTELLIGENCE(chakraData,auraData, age);
  const bODILYINTELLIGENCE = calculateBODILYINTELLIGENCE(chakraData,auraData, age);
  const mUSICALINTELLIGENCE = calculateMUSICALINTELLIGENCE(chakraData,auraData, age);
  const nATURALISITCINTELLIGENCEE = calculateNATURALISITCINTELLIGENCEE(chakraData,auraData, age);
  const eXISTENTIALINTELLIGENCE = calculateEXISTENTIALINTELLIGENCE(chakraData,auraData, age);
  const cOGNITIVETRAITS = calculateCOGNITIVETRAITS(data, age);
  const iNTERPERSONALTRAITS = calculateINTERPERSONALTRAITS(data, age);
  const mOTIVATIONALTRAITS = calculateMOTIVATIONALTRAITS(data , age);
  const bEHAVIORALTRAITS = calculateBEHAVIORALTRAITS(data, age);
  const hARDSKILLS = calculateHARDSKILLS(data, age);
  const sOFTSKILLS = calculateSOFTSKILLS(data, age);
  const tRANSFERABLESKILLS = calculateTRANSFERABLESKILLS(data, age);
  const pERSONALDEVELOPMENTSKILLS = calculatePERSONALDEVELOPMENTSKILLS(data, age);

  var genrateHindiCharts = [];
  console.log('Generated Hindi Charts:', genrateHindiCharts);


  // Creating Group One Career
  const careerGroups = [
    getCareerGroupOne(),
    getCareerGroupTwo(),
    getCareerGroupThree(),
    getCareerGroupFour(),
    getCareerGroupFive(),
    getCareerGroupSix(),
    getCareerGroupSeven()
  ];

  console.log(careerGroups);



  //code ends here
  const QuickChart = require('quickchart-js');


  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    chartCallback: (ChartJS) => {
      ChartJS.register(ChartDataLabels);
    }
  });

  async function createBarChart(dataArray, labels, title, fileName, indexaxis = 'x') {
    let datasetLabels, colors;
    let chartHeight = 300;

    if (title === 'PARENTAL CONTRIBUTION') {
      datasetLabels = ['Mother', 'Father', 'Total'];
      colors = ['#00B4FF', '#D4AF37', '#6A0DAD'];
    } else {
      datasetLabels = ['Natal', 'Present', 'Required', 'Difference'];
      colors = ['#009B77', '#D4AF37', '#6A0DAD', '#9a1f2c'];
    }

    if (title !== 'PARENTAL CONTRIBUTION' && title !== 'Innate Physical Abilities') {
      chartHeight = 450;
    }

    const datasets = datasetLabels.map((label, idx) => {
      const data = dataArray.map(row => row[idx + 1]);
      return {
        label,
        data,
        backgroundColor: colors[idx],
      };
    });

    const chart = new QuickChart();
    chart.setWidth(700);
    chart.setHeight(chartHeight);
    chart.setBackgroundColor('white');

    chart.setVersion('4');

    chart.setConfig({
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: {
        indexAxis: indexaxis, // 👈 KEY CHANGE: Horizontal bars
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 24,
              weight: 'bold',
            },
            color: '#222',
          },
          legend: {
            position: 'top',
            labels: {
              color: '#222',
              font: { size: 12 },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 0,
            color: '#000',
            rotation: indexaxis == "x" ? -90 : 0,
            font: {
              weight: 'bold',
              size: 10,
            },
            formatter: function (value) {
              return Number(value).toFixed(3);
            }
          },
        },
        scales: {
          x: {
            grouped: true,
            offset: true, // Adds space between groups
          }
        },
        datasetOptions: {
          barThickness: 'flex',
          maxBarThickness: 10 // Limits maximum bar width
        },
        barPercentage: 0.4,
        categoryPercentage: 0.7,
      },
      plugins: ['datalabels'],
    });


    const imageBuffer = await chart.toBinary();

    const filePath = path.join(__dirname, `./charts/${fileName}.png`);
    fs.writeFileSync(filePath, imageBuffer);
    return filePath;
  }

  const chartsDir = path.join(__dirname, './charts');
  if (!fs.existsSync(chartsDir)) fs.mkdirSync(chartsDir);

  const chartPaths = [];

  chartPaths.push(await createBarChart(data, traits, 'PARENTAL CONTRIBUTION', 'Parental Contribution'));
  chartPaths.push(await createBarChart(chakraData.slice(0, 7), chakraData.slice(0, 7).map(row => row[0]), 'Chakra Activation', 'Chakra Activation Level'));
  chartPaths.push(await createBarChart(auraData.slice(0, 7), auraData.slice(0, 7).map(row => row[0]), 'Aura Illumination', 'Aura Illumination Level'));
  chartPaths.push(await createBarChart(positiveKarma.slice(0, 7), positiveKarma.slice(0, 7).map(row => row[0]), 'Positive Karma Aspects', 'Positive Karmas'));
  chartPaths.push(await createBarChart(negativeKarma.slice(0, 7), negativeKarma.slice(0, 7).map(row => row[0]), 'Negative Karma Aspects', 'Negative Karmas'));
  chartPaths.push(await createBarChart(balancedKarma.slice(0, 7), balancedKarma.slice(0, 7).map(row => row[0]), 'Balanced Karma Aspects', 'Balanced Karmas'));
  chartPaths.push(await createBarChart(innatePhysicalAbilities.slice(0, 7), innatePhysicalAbilities.slice(0, 7).map(row => row[0]), 'Innate Physical Abilities', 'Innate Physical Abilities'));
  chartPaths.push(await createBarChart(innateMentalAbilities.slice(0, 7), innateMentalAbilities.slice(0, 7).map(row => row[0]), 'Innate Mental Abilities', 'Innate Mental Abilities'));
  chartPaths.push(await createBarChart(innateEmotionalAbilities.slice(0, 7), innateEmotionalAbilities.slice(0, 7).map(row => row[0]), 'Innate Emotional Abilities', 'Innate Emotional Abilities'));
  chartPaths.push(await createBarChart(innateIntellectualAbilities.slice(0, 7), innateIntellectualAbilities.slice(0, 7).map(row => row[0]), 'Innate Intellectual Abilities', 'Innate Intellectual Abilities'));
  chartPaths.push(await createBarChart(innateSpiritualAbilities.slice(0, 7), innateSpiritualAbilities.slice(0, 7).map(row => row[0]), 'Innate Spiritual Abilities', 'Innate Spiritual Abilities'));
  chartPaths.push(await createBarChart(opennessToExperience.slice(0, 7), opennessToExperience.slice(0, 7).map(row => row[0]), 'Openness to Experience', 'Openness to Experience'));
  chartPaths.push(await createBarChart(cONSCIENTIOUSNESS.slice(0, 7), cONSCIENTIOUSNESS.slice(0, 7).map(row => row[0]), 'Conscientiousness', 'Conscientiousness'));
  chartPaths.push(await createBarChart(eXTRAVERSION.slice(0, 7), eXTRAVERSION.slice(0, 7).map(row => row[0]), 'Extraversion', 'Extraversion'));
  chartPaths.push(await createBarChart(aGREEABLENESS.slice(0, 7), aGREEABLENESS.slice(0, 7).map(row => row[0]), 'Agreeableness', 'Agreeableness'));
  chartPaths.push(await createBarChart(nEUROTICISM.slice(0, 7), nEUROTICISM.slice(0, 7).map(row => row[0]), 'Neuroticism', 'Neuroticism'));
  chartPaths.push(await createBarChart(vERBALLINGUISTICINTELLIGENCE.slice(0, 7), vERBALLINGUISTICINTELLIGENCE.slice(0, 7).map(row => row[0]), 'Verbal Linguistic Intelligence', 'Verbal Linguistic Intelligence'));
  chartPaths.push(await createBarChart(mATHEMATICALINTELLIGENCE.slice(0, 7), mATHEMATICALINTELLIGENCE.slice(0, 7).map(row => row[0]), 'Logical Intelligence', 'Logical Intelligence'));
  chartPaths.push(await createBarChart(vISUALINTELLIGENCE.slice(0, 7), vISUALINTELLIGENCE.slice(0, 7).map(row => row[0]), 'Visual Intelligence', 'Spatial Visual Intelligence'));
  chartPaths.push(await createBarChart(iNTERPERSONALINTELLIGENCE.slice(0, 7), iNTERPERSONALINTELLIGENCE.slice(0, 7).map(row => row[0]), 'Interpersonal Intelligence', 'Interpersonal Intelligence'));
  chartPaths.push(await createBarChart(iNTRAPERSONALINTELLIGENCE.slice(0, 7), iNTRAPERSONALINTELLIGENCE.slice(0, 7).map(row => row[0]), 'Intrapersonal Intelligence', 'Intrapersonal Intelligence'));
  chartPaths.push(await createBarChart(bODILYINTELLIGENCE.slice(0, 7), bODILYINTELLIGENCE.slice(0, 7).map(row => row[0]), 'Bodily Kinesthetics Intelligence', 'Bodily Kinesthetics Intelligence'));
  chartPaths.push(await createBarChart(mUSICALINTELLIGENCE.slice(0, 7), mUSICALINTELLIGENCE.slice(0, 7).map(row => row[0]), 'Musical Intelligence', 'Musical Intelligence'));
  chartPaths.push(await createBarChart(nATURALISITCINTELLIGENCEE.slice(0, 7), nATURALISITCINTELLIGENCEE.slice(0, 7).map(row => row[0]), 'Naturalistic Intelligence', 'Naturalistic Intelligence'));
  chartPaths.push(await createBarChart(eXISTENTIALINTELLIGENCE.slice(0, 7), eXISTENTIALINTELLIGENCE.slice(0, 7).map(row => row[0]), 'Existential Intelligence', 'Existential Intelligence'));
  chartPaths.push(await createBarChart(cOGNITIVETRAITS.slice(0, 7), cOGNITIVETRAITS.slice(0, 7).map(row => row[0]), 'Cognitive Traits', 'Cognitive Traits'));
  chartPaths.push(await createBarChart(iNTERPERSONALTRAITS.slice(0, 7), iNTERPERSONALTRAITS.slice(0, 7).map(row => row[0]), 'Interpersonal Traits', 'Interpersonal Traits'));
  chartPaths.push(await createBarChart(mOTIVATIONALTRAITS.slice(0, 7), mOTIVATIONALTRAITS.slice(0, 7).map(row => row[0]), 'Motivational Traits', 'Motivational Traits'));
  chartPaths.push(await createBarChart(bEHAVIORALTRAITS.slice(0, 7), bEHAVIORALTRAITS.slice(0, 7).map(row => row[0]), 'Behavioral Traits', 'Behavioral Traits'));
  chartPaths.push(await createBarChart(hARDSKILLS.slice(0, 7), hARDSKILLS.slice(0, 7).map(row => row[0]), 'Hard Skills', 'Hard Skills'));
  chartPaths.push(await createBarChart(sOFTSKILLS.slice(0, 7), sOFTSKILLS.slice(0, 7).map(row => row[0]), 'Soft Skills', 'Soft Skills'));
  chartPaths.push(await createBarChart(tRANSFERABLESKILLS.slice(0, 7), tRANSFERABLESKILLS.slice(0, 7).map(row => row[0]), 'Transferable Skills', 'Transferable Skills'));
  chartPaths.push(await createBarChart(pERSONALDEVELOPMENTSKILLS.slice(0, 7), pERSONALDEVELOPMENTSKILLS.slice(0, 7).map(row => row[0]), 'Personal Development Skills', 'Personal Development Skills'));
  chartPaths.push(await createBarChart(careerGroups[0].slice(0, 19), careerGroups[0].slice(0, 19).map(row => row[0]), 'Carrer Group 1', 'Carrer Group 1', 'y'));


  console.log("Charts saved at:");
  chartPaths.forEach(p => console.log(p));

  return careerGroups;
}



module.exports = { generateChartImagePath };
