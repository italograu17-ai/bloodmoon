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