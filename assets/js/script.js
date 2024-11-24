// chicken = 7x
// cow_1 = 4x
// cow_2 = 3x

function generateID() {
  return Math.floor(Math.random() * 90000) + 10000;
}

const max_possible_value = 84;
const chicken_1_value = 12;
const cow_1_value = 21;
const cow_2_value = 28;
let current_value = 0;
let days = 0;

let daily_eggs_current = 0;
let daily_milk_current = 0;

const milk_amount = document.querySelector(".milk_amount");
const egg_amount = document.querySelector(".egg_amount");
const money = document.querySelector("#money");
class Animal {
  id = generateID();
  thirst;
  hunger;
  is_alive;
  value;
  image;
  constructor() {
    this.thirst = 0;
    this.hunger = 0;
    this.is_alive = true;
  }
  getHunger() {
    if (!this.is_alive) {
      return;
    }
    this.hunger++;
    if (this.hunger >= 5) {
      this.is_alive = false;
      dying_animal(this);
    }
  }
  getThirst() {
    if (!this.is_alive) {
      return;
    }
    this.thirst++;
    if (this.thirst >= 5) {
      this.is_alive = false;
      dying_animal(this);
    }
  }
  feed() {
    if (!this.is_alive) {
      return;
    }
    this.hunger = Math.max(this.hunger - 1, 0);
  }
  water() {
    if (!this.is_alive) {
      return;
    }
    this.thirst = Math.max(this.thirst - 1, 0);
  }
}
class Cow extends Animal {
  price;
  daily_milk;
  constructor() {
    super();
  }
}
class Chicken extends Animal {
  price;
  daily_eggs;
  constructor() {
    super();
  }
}
class Cow_1 extends Cow {
  constructor() {
    super();
    this.price = 300;
    this.value = cow_1_value;
    this.image = "../../assets/imgs/cow_1.png";
  }
  subtract() {
    daily_milk_current = daily_milk_current - 3;
    current_value -= this.value;
  }
}
class Cow_2 extends Cow {
  constructor() {
    super();
    this.price = 300;
    this.value = cow_2_value;
    this.image = "../../assets/imgs/cow_2.png";
  }
  subtract() {
    daily_milk_current = daily_milk_current - 5;
    current_value -= this.value;
  }
}
class Chicken_1 extends Chicken {
  constructor() {
    super();
    this.price = 100;
    this.value = chicken_1_value;
    this.image = "../../assets/imgs/chicken_1.png";
  }
  subtract() {
    daily_eggs_current = daily_eggs_current - 1;
    current_value -= this.value;
  }
}

const animals = [];
function buy_cow() {
  const buy_cow_btn = document.querySelector(".buy_cow_btn");
  buy_cow_btn.addEventListener("click", () => {
    if (
      current_value >= max_possible_value ||
      parseInt(money.textContent) < 300
    ) {
      return;
    }
    if (Math.floor(Math.random() * 4 + 1) != 1) {
      const cow = new Cow_1();
      animals.push(cow);
      addAnimalToContainer(cow);
      current_value += cow_1_value;
      daily_milk_current += 3;
    } else {
      const cow = new Cow_2();
      animals.push(cow);
      addAnimalToContainer(cow);
      current_value += cow_2_value;
      daily_milk_current += 5;
    }
    money.textContent = parseInt(money.textContent) - 300;
  });
}
function buy_chicken() {
  const buy_chicken_btn = document.querySelector(".buy_chicken_btn");
  buy_chicken_btn.addEventListener("click", () => {
    if (
      current_value >= max_possible_value ||
      parseInt(money.textContent) < 100
    ) {
      return;
    }
    const chicken = new Chicken_1();
    animals.push(chicken);
    addAnimalToContainer(chicken);
    current_value += chicken_1_value;
    money.textContent = parseInt(money.textContent) - 100;
    daily_eggs_current += 1;
  });
}
function feed_all() {
  const feed_btn = document.querySelector(".feed_btn");
  feed_btn.addEventListener("click", () => {
    animals.forEach((x) => x.feed());
  });
  console.log("all fed");
}
function water_all() {
  const water_btn = document.querySelector(".water_btn");
  water_btn.addEventListener("click", () => {
    animals.forEach((x) => x.water());
  });
  console.log("all watared");
}
function addAnimalToContainer(animal) {
  const animals_container = document.querySelector(".animals_container");
  const element_div = document.createElement("div");
  element_div.setAttribute("id", animal.id);
  element_div.addEventListener("click", (e) => {
    remove_animal(animal);
    console.log(animals);
  });
  const element = document.createElement("img");
  element.src = animal.image;
  element_div.appendChild(element);
  animals_container.appendChild(element_div);
}
function updateDaysCount(days) {
  document.querySelector("#days").textContent = days;
}
function setDaysLength() {
  setInterval(() => {
    days++;
    updateDaysCount(days);
    animals.forEach((animal) => {
      animal.getHunger();
      animal.getThirst();
      console.log(animal);
      console.log("current value:", current_value);
      console.log("daily eggs: ", daily_eggs_current);
      console.log("daily milk: ", daily_milk_current);
    });
    add_milk_and_eggs();
  }, 2000);
}
function add_milk_and_eggs() {
  egg_amount.textContent =
  parseInt(egg_amount.textContent) + daily_eggs_current;
  milk_amount.textContent =
  parseInt(milk_amount.textContent) + daily_milk_current;
}
function remove_animal(animal) {
  money.textContent = parseInt(money.textContent) + animal.price / 2;
  const index = animals.indexOf(animal);
  animals.splice(index, 1);
  animal.subtract();
  const animals_container = document.querySelector(".animals_container");
  const animal_div = animals_container.querySelector(
    "#" + CSS.escape(animal.id)
  );
  animal_div.remove();
}
function dying_animal(animal) {
  const animal_div = document.querySelector("#" + CSS.escape(animal.id));
  animal_div.classList.add("dead");
  animal.subtract();
  setTimeout(()=>remove_animal(animal),3000)
}
function sell_items() {
  const sell_btn = document.querySelector(".sell_btn");
  sell_btn.addEventListener("click", () => {
    money.textContent =
      parseInt(money.textContent) +
      parseInt(egg_amount.textContent) * 10 +
      parseInt(milk_amount.textContent) * 20;
    egg_amount.textContent = 0;
    milk_amount.textContent = 0;
  });
}
function game_setup() {
  feed_all();
  water_all();
  buy_chicken();
  buy_cow();
  sell_items();
  setDaysLength();
}
game_setup();
