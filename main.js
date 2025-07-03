const output = document.getElementById("typed-output");
const inputLine = document.getElementById("terminal-input-line");
const input = document.getElementById("terminal-input");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const navHelp = document.getElementById("nav-help");

const sectionsMap = {
  home: "home",
  about: "about",
  resume: "resume",
  portfolio: "portfolio",
  services: "services",
  contact: "contact",
};

const availableCommands = [
  "help",
  "clear",
  "ls",
  "dir",
  "history",
  ...Object.keys(sectionsMap).map((s) => `./${s}`),
  ...Object.keys(sectionsMap).map((s) => `cd ${s}`),
];

// Initial "typing" lines
const codeLines = [
  "#include <stdio.h>",
  "",
  "int main() {",
  "    printf(\"Welcome to Daniel Adeyemo's Portfolio!\\n\");",
  "    printf(\"Loading skills...\\n\");",
  "    printf(\"- C, Python, Web Dev, Raylib, Firmware\\n\");",
  "    printf(\"Loading projects...\\n\");",
  "    printf(\"- Pong, Maze Solver, Tree Visualizer\\n\");",
  "    printf(\"Launching interface...\\n\");",
  "    return 0;",
  "}",
];

let lineIndex = 0;
let charIndex = 0;
let typingSpeed = 20;
let history = [];
let historyIndex = -1;

let currentSection = "portfolio"; // default starting section for prompt

function typeLine() {
  if (lineIndex < codeLines.length) {
    const currentLine = codeLines[lineIndex];
    if (charIndex < currentLine.length) {
      output.textContent += currentLine.charAt(charIndex++);
      setTimeout(typeLine, typingSpeed);
    } else {
      output.textContent += "\n";
      charIndex = 0;
      lineIndex++;
      setTimeout(typeLine, typingSpeed * 7);
    }
    output.parentElement.scrollTop = output.parentElement.scrollHeight;
  } else {
    // Finished typing animation - show input line and focus
    inputLine.style.display = "flex";
    updatePrompt(currentSection);
    input.focus();
  }
}

function printOutput(text = "") {
  output.textContent += text + "\n";
  output.parentElement.scrollTop = output.parentElement.scrollHeight;
}

// Update the terminal prompt text and nav-help visibility
function updatePrompt(section) {
  currentSection = section;
  const promptSpan = inputLine.querySelector(".prompt");
  if (promptSpan) {
    promptSpan.textContent = `${section}  git:(master) ✗ `;
  }
  if (navHelp) {
    if (section === "home") {
      navHelp.style.display = "block";
    } else {
      navHelp.style.display = "none";
    }
  }
}

// Process user commands
function processCommand(cmdRaw) {
  const cmd = cmdRaw.trim();
  if (!cmd) return;

  printOutput(`${currentSection} git:(main) ✗ ${cmd}`);

  history.push(cmd);
  historyIndex = history.length;

  if (cmd === "help") {
    printOutput(
      "Available commands:\n" +
        availableCommands.join(", ") +
        "\n\nTry './about' or 'cd about' to navigate to About section."
    );
  } else if (cmd === "clear") {
    output.textContent = "";
  } else if (cmd === "ls" || cmd === "dir") {
    printOutput("Available sections:");
    for (const sectionName in sectionsMap) {
      printOutput(`- ${sectionName}`);
    }
  } else if (cmd === "history") {
    if (history.length === 0) printOutput("No command history.");
    else printOutput(history.join("\n"));
  } else if (cmd.startsWith("./")) {
    const sectionKey = cmd.slice(2);
    if (sectionsMap[sectionKey]) {
      const sectionId = sectionsMap[sectionKey];
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setActiveLink(document.querySelector(`nav a[href="#${sectionId}"]`));
        updatePrompt(sectionKey);
        printOutput(`Navigated to #${sectionId}`);
      } else {
        printOutput(`Error: Section #${sectionId} not found.`);
      }
    } else {
      printOutput(`Error: Unknown section '${sectionKey}'`);
    }
  } else if (cmd.startsWith("cd ")) {
    const sectionKey = cmd.slice(3).trim();
    if (sectionsMap[sectionKey]) {
      const sectionId = sectionsMap[sectionKey];
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setActiveLink(document.querySelector(`nav a[href="#${sectionId}"]`));
        updatePrompt(sectionKey);
        printOutput(`Changed directory to #${sectionId}`);
      } else {
        printOutput(`Error: Section #${sectionId} not found.`);
      }
    } else {
      printOutput(`Error: No such directory: ${sectionKey}`);
    }
  } else {
    printOutput(`Error: Command not found: ${cmd}`);
  }
}

function setActiveLink(link) {
  links.forEach((l) => l.classList.remove("active"));
  if (link) link.classList.add("active");
}

// Command history navigation
function handleHistoryNavigation(e) {
  if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      input.value = "";
    }
    e.preventDefault();
  }
}

// Tab completion
function handleTabCompletion(e) {
  if (e.key === "Tab") {
    e.preventDefault();
    const currentInput = input.value.trim();
    const matches = availableCommands.filter((cmd) =>
      cmd.startsWith(currentInput)
    );
    if (matches.length === 1) {
      input.value = matches[0] + " ";
    } else if (matches.length > 1) {
      printOutput(matches.join(" "));
    }
  }
}

// Event listeners
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    processCommand(input.value);
    input.value = "";
  } else {
    handleHistoryNavigation(e);
    handleTabCompletion(e);
  }
});

// Nav links smooth scroll and active toggle
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setActiveLink(link);
      updatePrompt(targetId);
    }
  });
});

// Intersection Observer for animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        animateSectionChildren(entry.target);
        if (entry.target.id === "about") animateSkillBars();
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => observer.observe(section));

// Highlight nav based on scroll position & update prompt/nav-help
window.addEventListener("scroll", () => {
  let index = sections.length - 1;
  for (let i = 0; i < sections.length; i++) {
    const top = sections[i].getBoundingClientRect().top;
    if (top >= 0 && top < window.innerHeight / 2) {
      index = i;
      break;
    }
  }
  const activeSectionId = sections[index].id;
  setActiveLink(links[index]);
  if (activeSectionId !== currentSection) {
    updatePrompt(activeSectionId);
  }
});

// Animate section children with stagger effect
function animateSectionChildren(section) {
  const children = Array.from(section.children);
  children.forEach((child, i) => {
    child.style.opacity = "0";
    child.style.transform = "translateY(20px)";
    setTimeout(() => {
      child.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      child.style.opacity = "1";
      child.style.transform = "translateY(0)";
    }, i * 150);
  });
}

// Animate skill bars in About section
function animateSkillBars() {
  const fills = document.querySelectorAll("#about .skill-fill");
  fills.forEach((fill) => {
    const targetWidth = fill.getAttribute("data-fill");
    fill.style.width = targetWidth;
  });
}

// Keyboard navigation (Up/Down arrows between sections)
window.addEventListener("keydown", (e) => {
  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    !["ArrowUp", "ArrowDown"].includes(e.key)
  )
    return;

  e.preventDefault();

  let currentIndex = 0;
  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
      currentIndex = i;
      break;
    }
  }

  if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
    sections[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
    setActiveLink(links[currentIndex + 1]);
    updatePrompt(sections[currentIndex + 1].id);
  } else if (e.key === "ArrowUp" && currentIndex > 0) {
    sections[currentIndex - 1].scrollIntoView({ behavior: "smooth" });
    setActiveLink(links[currentIndex - 1]);
    updatePrompt(sections[currentIndex - 1].id);
  }
});

// Typing speed adjustment with + and - keys (optional)
window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (e.key === "+") {
    typingSpeed = Math.max(5, typingSpeed - 5);
  } else if (e.key === "-") {
    typingSpeed = Math.min(100, typingSpeed + 5);
  }
});

// Sidebar toggle button functionality
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    mainContent.classList.toggle("full");
    toggleBtn.textContent = sidebar.classList.contains("hidden") ? "☰" : "-";
  });
});

// Nav Help toggle button functionality
document.addEventListener("DOMContentLoaded", () => {
  const navHelpToggle = document.getElementById("toggle-nav-help");
  const navHelpBody = document.getElementById("nav-help-body");

  if (navHelpToggle && navHelpBody) {
    navHelpToggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click from bubbling up
      const isHidden = navHelpBody.classList.toggle("hidden");
      navHelpToggle.textContent = isHidden ? "☰" : "-";
    });

    // Optional: Prevent clicks inside navHelpBody from closing or toggling
    navHelpBody.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});

// Start the initial typing animation when DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  typeLine();
});
