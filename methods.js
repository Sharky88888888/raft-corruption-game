let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
let allAchievements = [
  { id: "truth_exposed", name: "Truth Exposed", desc: "Expose FIFA to the world." },
  { id: "go_corrupt", name: "Corrupted", desc: "Take a bribe and retire rich." },
  { id: "hide_away", name: "In Hiding", desc: "Go off the grid and survive." },
  { id: "deep_web", name: "Master Manipulator", desc: "Play all factions against each other for maximum gain." }, // Hard to get
  { id: "double_agent", name: "Double Agent", desc: "Pretend to expose corruption while secretly helping it." } // Hard to get
];
let currentTask = generateRandomTask();

function showChoiceScreen() {
  document.getElementById("start-container").style.display = "none";
  document.getElementById("choice-container").style.display = "block";
  document.getElementById("task-display").innerText = `Your Task: Unlock achievement — ${getAchievementName(currentTask)}`;
}

function startGame(choice) {
  document.getElementById("choice-container").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  choose(choice);
}

function choose(option) {
  let story = document.getElementById("story");
  let choices = document.getElementById("choices");

  if (option === "office") {
    transitionThen(() => {
      story.innerHTML = "You find a leaked email linking officials to bribery. What next?";
      choices.innerHTML = `
        <button onclick="choose('publish')">Publish the evidence</button>
        <button onclick="choose('sell')">Sell the email to a foreign media outlet</button>
      `;
    });
  } else if (option === "whistleblower") {
    transitionThen(() => {
      story.innerHTML = "The whistleblower gives you documents, but warns you of danger.";
      choices.innerHTML = `
        <button onclick="choose('expose')">Expose everything</button>
        <button onclick="choose('double')">Fake an expose, help cover it up</button>
      `;
    });
  } else if (option === "rival") {
    transitionThen(() => {
      story.innerHTML = "You dig into your rival’s disappearance. You find files they were about to release.";
      choices.innerHTML = `
        <button onclick="choose('finish_rival_work')">Finish their work</button>
        <button onclick="choose('stay_hidden')">Stay hidden and observe</button>
      `;
    });
  }

  // Outcomes
  else if (option === "publish" || option === "expose" || option === "finish_rival_work") {
    unlockAchievement("truth_exposed");
    endGame("truth_exposed", "Your story shakes the world. FIFA is in shambles.");
  } else if (option === "sell") {
    unlockAchievement("go_corrupt");
    endGame("go_corrupt", "You sold the leak for profit. You’re rich, but the truth stays buried.");
  } else if (option === "stay_hidden") {
    unlockAchievement("hide_away");
    endGame("hide_away", "You vanish, watching as scandals unfold.");
  } else if (option === "double") {
    unlockAchievement("double_agent");
    endGame("double_agent", "You become a trusted insider, secretly steering outcomes.");
  }
}

function transitionThen(callback) {
  const transition = document.getElementById("transition-screen");
  const choices = document.getElementById("choices");
  choices.innerHTML = "";
  transition.style.display = "block";
  setTimeout(() => {
    transition.style.display = "none";
    callback();
  }, 5000);
}

function endGame(id, text) {
  const container = document.getElementById("game-container");
  container.innerHTML = `
    <h1>Ending Reached</h1>
    <p>${text}</p>
    <button onclick="location.reload()">Restart</button>
  `;
  if (id === currentTask) {
    document.getElementById("game-container").style.display = "none";
    document.getElementById("task-complete-container").style.display = "block";
  }
}

function unlockAchievement(id) {
  if (!achievements.includes(id)) {
    achievements.push(id);
    localStorage.setItem("achievements", JSON.stringify(achievements));
    renderAchievements();
  }
}

function renderAchievements() {
  const list = document.getElementById("achievement-list");
  list.innerHTML = "";
  allAchievements.forEach((ach) => {
    const unlocked = achievements.includes(ach.id);
    const li = document.createElement("li");
    li.textContent = unlocked ? `✅ ${ach.name} - ${ach.desc}` : `❌ ${ach.name} - ???`;
    list.appendChild(li);
  });
}

function getAchievementName(id) {
  const found = allAchievements.find((a) => a.id === id);
  return found ? found.name : "Unknown";
}

function generateRandomTask() {
  const allIds = allAchievements.map((a) => a.id);
  return allIds[Math.floor(Math.random() * allIds.length)];
}

function restartWithNewTask() {
  achievements = [];
  localStorage.removeItem("achievements");
  currentTask = generateRandomTask();
  location.reload();
}

window.onload = () => {
  renderAchievements();
  document.getElementById("task-display").innerText = `Your Task: Unlock achievement — ${getAchievementName(currentTask)}`;
};
