const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

const lunarPhases = [
  {
    name: "Lua Nova",
    description: "A Lua fica entre a Terra e o Sol. Seu lado iluminado está voltado para o Sol, e o lado escuro fica voltado para a Terra, tornando-a praticamente invisível no céu.",
    shadow: "new"
  },
  {
    name: "Crescente Inicial",
    description: "Pouco depois da Lua Nova, surge um fino arco iluminado no lado direito. A parte visível iluminada aumenta a cada noite.",
    shadow: "waxing-crescent"
  },
  {
    name: "Quarto Crescente",
    description: "Metade do disco lunar visível está iluminada, no lado direito. A Lua segue crescendo em direção à Lua Cheia.",
    shadow: "first-quarter"
  },
  {
    name: "Gibosa Crescente",
    description: "Mais da metade da Lua está iluminada, mas ela ainda não chegou à fase cheia. A porção iluminada continua aumentando.",
    shadow: "waxing-gibbous"
  },
  {
    name: "Lua Cheia",
    description: "A Terra fica aproximadamente entre o Sol e a Lua, e vemos quase todo o hemisfério lunar iluminado. É quando o disco aparece completo no céu.",
    shadow: "full"
  },
  {
    name: "Gibosa Minguante",
    description: "Depois da Lua Cheia, mais da metade do disco ainda está iluminada, agora diminuindo a cada noite.",
    shadow: "waning-gibbous"
  },
  {
    name: "Quarto Minguante",
    description: "Metade do disco lunar visível está iluminada, no lado esquerdo. A porção iluminada continua diminuindo até a Lua Nova.",
    shadow: "last-quarter"
  },
  {
    name: "Minguante Final",
    description: "Resta um fino arco iluminado no lado esquerdo. Pouco depois, a Lua retorna à fase Nova e um novo ciclo começa.",
    shadow: "waning-crescent"
  }
];

const phaseList = document.querySelector("#visualizacao-fases .phase-list");
const phaseName = document.querySelector("#visualizacao-fases [data-phase-name]");
const phaseDescription = document.querySelector("#visualizacao-fases [data-phase-description]");
const phaseIllustration = document.querySelector("#visualizacao-fases [data-phase-illustration]");

function createMoonIllustration(phase, index, instance) {
  const clipId = `moon-clip-${instance}-${index}`;
  const gradientId = `moon-light-${instance}-${index}`;
  const shadows = {
    new: "",
    "waxing-crescent": '<ellipse cx="38" cy="60" rx="43" ry="50" fill="#263144"/>',
    "first-quarter": '<path d="M60 10V110H0V10Z" fill="#263144"/>',
    "waxing-gibbous": '<ellipse cx="23" cy="60" rx="39" ry="50" fill="#263144"/>',
    full: "",
    "waning-gibbous": '<ellipse cx="97" cy="60" rx="39" ry="50" fill="#263144"/>',
    "last-quarter": '<path d="M60 10V110H120V10Z" fill="#263144"/>',
    "waning-crescent": '<ellipse cx="82" cy="60" rx="43" ry="50" fill="#263144"/>'
  };
  const light = phase.shadow === "new"
    ? ""
    : `<circle cx="60" cy="60" r="50" fill="url(#${gradientId})"/>`;

  return `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id="${clipId}"><circle cx="60" cy="60" r="50"/></clipPath>
      <radialGradient id="${gradientId}" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#fff8d8"/>
        <stop offset="100%" stop-color="#e4c878"/>
      </radialGradient>
    </defs>
    <circle cx="60" cy="60" r="50" fill="#263144"/>
    <g clip-path="url(#${clipId})">${light}${shadows[phase.shadow]}</g>
  </svg>`;
}

function selectLunarPhase(index) {
  const selectedPhase = lunarPhases[index];
  if (!selectedPhase) throw new RangeError(`Índice de fase lunar inválido: ${index}.`);

  phaseName.textContent = selectedPhase.name;
  phaseDescription.textContent = selectedPhase.description;
  phaseIllustration.innerHTML = createMoonIllustration(selectedPhase, index, "detail");

  phaseList.querySelectorAll(".phase-card").forEach((button, buttonIndex) => {
    button.setAttribute("aria-pressed", String(buttonIndex === index));
  });
}

if (!phaseList || !phaseName || !phaseDescription || !phaseIllustration) {
  throw new Error("Não foi possível inicializar a visualização das fases lunares.");
}

lunarPhases.forEach((phase, index) => {
  const button = document.createElement("button");
  button.className = "phase-card";
  button.type = "button";
  button.setAttribute("aria-pressed", "false");
  button.innerHTML = `<span class="phase-card__moon">${createMoonIllustration(phase, index, "card")}</span><span>${phase.name}</span>`;
  button.addEventListener("click", () => selectLunarPhase(index));
  phaseList.append(button);
});

selectLunarPhase(0);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (!visibleSection) return;

    navigationLinks.forEach((link) => {
      if (link.hash === `#${visibleSection.target.id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, { rootMargin: "-15% 0px -65% 0px", threshold: [0, 0.25, 0.5] });

  sections.forEach((section) => sectionObserver.observe(section));
}

const lunarMonthDays = 29.5;
const lunarPhaseDays = [0, 3.7, 7.4, 11.1, 14.75, 18.5, 22.1, 25.9];
const lunarPhaseNames = [
  "Lua Nova",
  "Crescente Inicial",
  "Quarto Crescente",
  "Gibosa Crescente",
  "Lua Cheia",
  "Gibosa Minguante",
  "Quarto Minguante",
  "Minguante Final"
];
const simulationCanvas = document.querySelector("#simulation-moon");

if (simulationCanvas) {
  const simulationContext = simulationCanvas.getContext("2d");
  const dayOutput = document.querySelector("#simulation-day");
  const phaseOutput = document.querySelector("#simulation-phase");
  const illuminationOutput = document.querySelector("#simulation-illumination");
  const progressBar = document.querySelector(".simulation-progress");
  const progressFill = document.querySelector("#simulation-progress-fill");
  const statusOutput = document.querySelector("#simulation-status");
  const startButton = document.querySelector("#simulation-start");
  const pauseButton = document.querySelector("#simulation-pause");
  const resetButton = document.querySelector("#simulation-reset");
  const speedSlider = document.querySelector("#simulation-speed-slider");
  const speedOutput = document.querySelector("#simulation-speed-value");
  const phaseMarkers = [...document.querySelectorAll("#simulation-phase-track li")];
  let simulationDay = 0;
  let simulationSpeed = Number(speedSlider.value);
  let animationFrameId = null;
  let previousFrameTime = null;
  let simulationRunning = false;

  function getPhaseIndex(day) {
    const boundaries = [1.85, 5.55, 9.25, 12.925, 16.625, 20.3, 24, 27.7];
    return boundaries.findIndex((boundary) => day < boundary) === -1
      ? 0
      : boundaries.findIndex((boundary) => day < boundary);
  }

  function drawMoon(day) {
    const context = simulationContext;
    const size = simulationCanvas.width;
    const center = size / 2;
    const radius = size * 0.36;
    const angle = (2 * Math.PI * day) / lunarMonthDays;
    const sunX = Math.sin(angle);
    const sunZ = -Math.cos(angle);
    const image = context.createImageData(size, size);

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const normalizedX = (x - center) / radius;
        const normalizedY = (y - center) / radius;
        const distanceSquared = normalizedX ** 2 + normalizedY ** 2;
        if (distanceSquared > 1) continue;

        const surfaceZ = Math.sqrt(1 - distanceSquared);
        const sunlight = normalizedX * sunX + surfaceZ * sunZ;
        const shade = sunlight > 0 ? 0.12 + sunlight * 0.88 : 0.12 + surfaceZ * 0.025;
        const texture = Math.sin(x * 12.9898 + y * 78.233) * 0.009;
        const pixel = (y * size + x) * 4;
        image.data[pixel] = 224 * (shade + texture);
        image.data[pixel + 1] = 227 * (shade + texture);
        image.data[pixel + 2] = 205 * (shade + texture);
        image.data[pixel + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);
    context.save();
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.clip();
    [
      [-0.28, -0.36, 0.09],
      [0.2, -0.27, 0.12],
      [0.4, 0.02, 0.06],
      [-0.12, 0.03, 0.16],
      [0.25, 0.28, 0.1],
      [-0.36, 0.3, 0.12]
    ].forEach(([x, y, craterRadius]) => {
      context.beginPath();
      context.ellipse(
        center + x * radius,
        center + y * radius,
        craterRadius * radius,
        craterRadius * radius * 0.75,
        -0.3,
        0,
        Math.PI * 2
      );
      context.fillStyle = "rgba(10, 19, 17, 0.16)";
      context.fill();
      context.strokeStyle = "rgba(250, 249, 226, 0.16)";
      context.lineWidth = 2;
      context.stroke();
    });
    context.restore();

    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.strokeStyle = "rgba(238, 239, 218, 0.55)";
    context.lineWidth = 2;
    context.stroke();
  }

  function renderSimulation() {
    const boundedDay = Math.min(simulationDay, lunarMonthDays);
    const phaseIndex = getPhaseIndex(boundedDay % lunarMonthDays);
    const illumination = (1 - Math.cos((2 * Math.PI * boundedDay) / lunarMonthDays)) / 2;
    const phaseName = boundedDay >= lunarMonthDays ? "Ciclo completo" : lunarPhaseNames[phaseIndex];

    dayOutput.textContent = boundedDay.toFixed(1);
    phaseOutput.textContent = phaseName;
    illuminationOutput.textContent = `Iluminação: ${Math.round(illumination * 100)}%`;
    simulationCanvas.setAttribute("aria-label", `Lua na fase ${phaseName}, dia ${boundedDay.toFixed(1)}`);
    progressBar.setAttribute("aria-valuenow", boundedDay.toFixed(1));
    progressFill.style.width = `${(boundedDay / lunarMonthDays) * 100}%`;
    phaseMarkers.forEach((marker, index) => {
      if (index === phaseIndex) {
        marker.classList.add("is-current");
        marker.setAttribute("aria-current", "step");
      } else {
        marker.classList.remove("is-current");
        marker.removeAttribute("aria-current");
      }
    });
    drawMoon(boundedDay % lunarMonthDays);
  }

  function stopSimulation(message) {
    simulationRunning = false;
    previousFrameTime = null;
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    startButton.disabled = simulationDay >= lunarMonthDays;
    pauseButton.disabled = true;
    if (message) statusOutput.textContent = message;
  }

  function animateSimulation(timestamp) {
    if (!simulationRunning) return;

    if (previousFrameTime !== null) {
      const elapsedMilliseconds = Math.min(timestamp - previousFrameTime, 250);
      simulationDay = Math.min(
        lunarMonthDays,
        simulationDay + (elapsedMilliseconds / 1000) * (lunarMonthDays / 60) * simulationSpeed
      );
      renderSimulation();
    }

    previousFrameTime = timestamp;
    if (simulationDay >= lunarMonthDays) {
      stopSimulation("Ciclo completo. Reinicie para começar novamente.");
      renderSimulation();
      return;
    }

    animationFrameId = requestAnimationFrame(animateSimulation);
  }

  startButton.addEventListener("click", () => {
    if (simulationRunning || simulationDay >= lunarMonthDays) return;
    simulationRunning = true;
    previousFrameTime = null;
    startButton.disabled = true;
    pauseButton.disabled = false;
    statusOutput.textContent = "Simulação em andamento.";
    animationFrameId = requestAnimationFrame(animateSimulation);
  });

  pauseButton.addEventListener("click", () => {
    if (!simulationRunning) return;
    stopSimulation("Simulação pausada.");
  });

  resetButton.addEventListener("click", () => {
    stopSimulation("Pronto para iniciar o ciclo.");
    simulationDay = 0;
    startButton.disabled = false;
    renderSimulation();
  });

  speedSlider.addEventListener("input", () => {
    simulationSpeed = Number(speedSlider.value);
    speedOutput.textContent = `${simulationSpeed.toLocaleString("pt-BR")}×`;
  });

  renderSimulation();
}