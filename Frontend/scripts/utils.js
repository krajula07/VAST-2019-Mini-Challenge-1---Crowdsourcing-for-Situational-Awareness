export function convertDateToTimeStamp(date) {
  date = new Date(date.getTime());
  var date_format_str =
    date.getFullYear().toString() +
    "-" +
    ((date.getMonth() + 1).toString().length == 2
      ? (date.getMonth() + 1).toString()
      : "0" + (date.getMonth() + 1).toString()) +
    "-" +
    (date.getDate().toString().length == 2
      ? date.getDate().toString()
      : "0" + date.getDate().toString()) +
    " " +
    (date.getHours().toString().length == 2
      ? date.getHours().toString()
      : "0" + date.getHours().toString()) +
    ":" +
    ((parseInt(date.getMinutes() / 5) * 5).toString().length == 2
      ? (parseInt(date.getMinutes() / 5) * 5).toString()
      : "0" + (parseInt(date.getMinutes() / 5) * 5).toString()) +
    ":00";
  return date_format_str;
}

export async function getDataForAllCategories(timestamp1, timestamp2) {
  let response = await fetch(
    `http://localhost:5000/damage/mean/allcategories/${timestamp1}/${timestamp2}`
  );
  let data = await response.json();
  let res = data.reduce((ans, val) => {
    return { ...ans, [val["0"]]: {} };
  }, {});
  data.forEach((val) => {
    res[val[0]][val[1]] = val[2];
  });
  return res;
}
/*
export var globalDimension='power';
export function setGlobalDimension(dimension){
  globalDimension = dimension;
  console.log("global dim set to", dimension)
  drawMap()
}
*/
export async function getMeanForGivenCategory(
  timestamp1,
  timestamp2,
  category
) {
  let response = await fetch(
    `http://localhost:5000/damage/mean/${category}/${timestamp1}/${timestamp2}`
  );
  let data = await response.json();
  let resArray = [];
  data.forEach((val) => {
    resArray[val[0]] = val[1];
  });
  return resArray;
}
export async function getEntropyForGivenCategory(
  timestamp1,
  timestamp2,
  category
) {
  let response = await fetch(
    `http://localhost:5000/damage/entropy/${category}/${timestamp1}/${timestamp2}`
  );
  let data = await response.json();

  let resArray = [];
  data.forEach((val) => {
    resArray[val[0]] = val[1];
  });
  return resArray;
}
export async function getEntropyDataForAllCategories(timestamp1, timestamp2) {
  let response = await fetch(
    `http://localhost:5000/damage/entropy/allcategories/${timestamp1}/${timestamp2}`
  );
  let data = await response.json();
  let res = data.reduce((ans, val) => {
    return { ...ans, [val["0"]]: {} };
  }, {});
  data.forEach((val) => {
    res[val[0]][val[1]] = val[2];
  });
  return res;
}
