const output = document.getElementById("typed-output");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");

const codeLines = [
  "#include <stdio.h>",
  "",
  "int main() {",
  '    printf("Welcome to Daniel Adeyemo\'s Portfolio!\\n");',
  '    printf("Loading skills...\\n");',
  '    printf("- C, Python, Web Dev, Raylib, Firmware\\n");',
  '    printf("Loading projects...\\n");',
  '    printf("- Pong, Maze Solver, Tree Visualizer\\n");',
  '    printf("Launching interface...\\n");',
  "    return 0;",
  "}",
];

let lineIndex = 0;
let charIndex = 0;
let typingSpeed = 20;

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
  }
}
typeLine();

function setActiveLink(link) {
  links.forEach((l) => l.classList.remove("active"));
  if (link) link.classList.add("active");
}

// Smooth scroll and click nav handling
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setActiveLink(link);
    }
  });
});

// Intersection Observer to trigger fade-in and animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        animateSectionChildren(entry.target);

        if (entry.target.id === "about") {
          animateSkillBars();
        }
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => observer.observe(section));

// Highlight nav link based on scroll position
window.addEventListener("scroll", () => {
  let index = sections.length - 1;
  for (let i = 0; i < sections.length; i++) {
    const top = sections[i].getBoundingClientRect().top;
    if (top >= 0 && top < window.innerHeight / 2) {
      index = i;
      break;
    }
  }
  setActiveLink(links[index]);
});

// Animate child elements of section with stagger effect
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

// Keyboard navigation (Up/Down arrows) between sections
window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();

    // Find the current section index based on scroll position
    let currentIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (
        rect.top <= window.innerHeight / 2 &&
        rect.bottom > window.innerHeight / 2
      ) {
        currentIndex = i;
        break;
      }
    }

    if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
      sections[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
      setActiveLink(links[currentIndex + 1]);
    }
    if (e.key === "ArrowUp" && currentIndex > 0) {
      sections[currentIndex - 1].scrollIntoView({ behavior: "smooth" });
      setActiveLink(links[currentIndex - 1]);
    }
  }
});

// Typing speed controls (+/- keys)
window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return; // ignore inputs
  if (e.key === "+") {
    typingSpeed = Math.max(5, typingSpeed - 5);
  } else if (e.key === "-") {
    typingSpeed = Math.min(100, typingSpeed + 5);
  }
});
function animateSkillBars() {
  const fills = document.querySelectorAll("#about .skill-fill");
  fills.forEach((fill) => {
    const targetWidth = fill.getAttribute("data-fill");
    fill.style.width = targetWidth;
  });
}
