let damageArray = [
  "power",
  "buildings",
  "medical",
  "shake_intensity",
  "sewer_and_water",
  "roads_and_bridges",
];
let powerMean = [];
let buildingsMean = [];
let medicalMean = [];
let shakeMean = [];
let sewerMean = [];
let roadsMean = [];
let powerEntropy = [];
let buildingsEntropy = [];
let medicalEntropy = [];
let shakeEntropy = [];
let sewerEntropy = [];
let roadsEntropy = [];

async function getMeanData() {
  for (let i = 0; i < damageArray.length; i++) {
    let data = await d3.json(
      "http://localhost:5000/damage/mean/" +
        damageArray[i] +
        "/'2020-04-06 00:25:00'/'2020-04-06 23:30:00'"
    );
    if (i === 0) {
      for (let j = 0; j < data.length; j++) {
        powerMean[j] = data[j][1];
      }
    } else if (i === 1) {
      for (let j = 0; j < data.length; j++) {
        buildingsMean[j] = data[j][1];
      }
    } else if (i === 2) {
      for (let j = 0; j < data.length; j++) {
        medicalMean[j] = data[j][1];
      }
    } else if (i === 3) {
      for (let j = 0; j < data.length; j++) {
        shakeMean[j] = data[j][1];
      }
    } else if (i === 4) {
      for (let j = 0; j < data.length; j++) {
        sewerMean[j] = data[j][1];
      }
    } else {
      for (let j = 0; j < data.length; j++) {
        roadsMean[j] = data[j][1];
      }
    }
  }
}

async function getEntropyData() {
  for (let i = 0; i < damageArray.length; i++) {
    let data = await d3.json(
      "http://localhost:5000/damage/entropy/" +
        damageArray[i] +
        "/'2020-04-06%2000:25:00'/'2020-04-06%2023:30:00'"
    );
    if (i === 0) {
      for (let j = 0; j < data.length; j++) {
        powerEntropy[j] = data[j][1];
      }
    } else if (i === 1) {
      for (let j = 0; j < data.length; j++) {
        buildingsEntropy[j] = data[j][1];
      }
    } else if (i === 2) {
      for (let j = 0; j < data.length; j++) {
        medicalEntropy[j] = data[j][1];
      }
    } else if (i === 3) {
      for (let j = 0; j < data.length; j++) {
        shakeEntropy[j] = data[j][1];
      }
    } else if (i === 4) {
      for (let j = 0; j < data.length; j++) {
        sewerEntropy[j] = data[j][1];
      }
    } else {
      for (let j = 0; j < data.length; j++) {
        roadsEntropy[j] = data[j][1];
      }
    }
  }
}
