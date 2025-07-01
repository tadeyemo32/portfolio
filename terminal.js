document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  let hasRunMake = false;

  function createPromptLine() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("prompt-line");

    const promptSpan = document.createElement("span");
    promptSpan.classList.add("prompt");
    promptSpan.textContent = "my@portfolio:~$";

    const input = document.createElement("input");
    input.setAttribute("autocomplete", "off");
    input.classList.add("cmd-input");

    wrapper.appendChild(promptSpan);
    wrapper.appendChild(input);
    output.appendChild(wrapper);
    input.focus();

    document.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".cmd-input");
      if (inputs.length > 0) {
        const lastInput = inputs[inputs.length - 1];
        if (!lastInput.disabled) {
          lastInput.focus();
        }
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = input.value.trim();
        input.disabled = true;

        const response = document.createElement("div");
        response.classList.add("output-line");

        if (
          cmd === "make" ||
          cmd === "make main" ||
          cmd === "gcc main.c -o main" ||
          cmd === "make main"
        ) {
          response.textContent = "Compiling project... done.";
          hasRunMake = true;
        } else if (cmd === "./main") {
          if (hasRunMake) {
            response.textContent = "Launching project...";
            output.appendChild(response);
            setTimeout(() => {
              window.location.href = "main.html";
            }, 500);
            return;
          } else {
            response.textContent =
              "Error: You must run `make` before `./main`.";
          }
        } else {
          response.textContent = `Command not found: please enter 'make' ${cmd}`;
        }

        output.appendChild(response);
        output.scrollTop = output.scrollHeight;
        createPromptLine();
      }
    });
  }

  createPromptLine();
});
