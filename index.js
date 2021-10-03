
var variantFormTemplate;
var templates;
var variantContainer;
var combinationTemplate;
var combinationContainer;


window.onload = () => {
  templates = document.querySelector("#templates");
  variantContainer = document.querySelector(".variantContainer");
  variantFormTemplate = templates.querySelector("#variantFormTemplate");
  combinationTemplate = document.querySelector("#combinationTemplate");
  combinationContainer = document.querySelector("#combinationcontainer");

  console.log({ variantContainer });
  console.log(variantContainer.innerHTML);
  reloadUI();

  addVariantForm();
};

const data = {
  variants: [],
  combinations: [],
  addVariant: function (key, values) {
    found = this.variants.find((v) => v.key === key);
    if (found) {
      found.values = values;
      return;
    }
    this.variants.push({ key, values });
    reloadUI();
  },
};



function reloadUI() {
  variantContainer.innerHTML = "";
  combinationContainer.innerHTML = "";
  for (let v of data.variants) {
    console.log({ v });
    const formDiv = variantFormTemplate.cloneNode(true);
    const { key, values } = formDiv.querySelector("form").elements;
    key.value = v.key;
    values.value = v.values.join(", ");

    console.log(key.value);
    console.log(values.value);

    variantContainer.append(formDiv);
  }

  console.log(data.combinations);
  console.log(data.variants);

  let index = 0;
  for (let v of data.combinations) {
    const combination = combinationTemplate.cloneNode(true);
    let content = "";
    for (let key in v) {
      content += `${key}: ${v[key]} `;
    }

    combination.querySelector("#removeButton").addEventListener("click", () => {
      console.log(data.combinations.splice(index++, 1));
      reloadUI();
    });
    const para = combination.querySelector("#combination");

    para.innerHTML = content;
    combinationContainer.append(combination);
  }
}

function addVariantForm() {
  const form = variantFormTemplate.cloneNode(true);
  const { key, values } = form.querySelector("form").elements;

  key.value = "";
  values.value = "";
  console.log(form);
  variantContainer.append(form);
}

function saveVariant(event) {
  event.preventDefault();

  const {
    target: {
      elements: {
        key: { value: key },
        values: { value: values },
      },
    },
  } = event;

  const valueArray = values
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value);

  data.addVariant(key, valueArray);
  console.log(data);
}

function createMoreVariantForm() {
  console.log("Create Form");
  addVariantForm();
}

function createCombinations() {
  const keys = data.variants.map((e) => e.key);
  const values = data.variants.map((e) => [...e.values]);
  const combinations = cartesianProductOf(...values);
  data.combinations = combinations.map((e) => {
    const obj = {};
    for (let i = 0; i < e.length; i++) {
      obj[keys[i]] = e[i];
    }
    return obj;
  });

  reloadUI();
}

function cartesianProductOf() {
  return _.reduce(
    arguments,
    function (a, b) {
      return _.flatten(
        _.map(a, function (x) {
          return _.map(b, function (y) {
            return x.concat([y]);
          });
        }),
        true
      );
    },
    [[]]
  );
}
