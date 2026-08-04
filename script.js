 const textElements = document.querySelectorAll(
      ".animated-name, .sub-heading"
  );
  const characters = "!@#$%^&*<>";
  const effectRadius = 70;
  // How long the effect runs
  // 1500 = 1.5 seconds
  const effectDuration = 1500;
  let letters = [];
  // Create individual letters
  textElements.forEach((textElement) => {
      const originalText = textElement.textContent;
      textElement.innerHTML = "";
      originalText.split("").forEach((letter) => {
          const span = document.createElement("span");
          span.className = "scramble-letter";
          // Preserve spaces
          span.textContent =
              letter === " " ? "\u00A0" : letter;
          span.dataset.original = letter;
          textElement.appendChild(span);
      });
  });
  // Track which text the mouse is currently over
  let activeElement = null;
  // Store running timers
  const timers = new Map();
  // Add hover event to each text
  textElements.forEach((textElement) => {
      // Mouse enters text
      textElement.addEventListener("mouseenter", () => {
          // If an animation is already running
          if (timers.has(textElement)) {
              return;
          }
          // Start the effect
          const startTime = Date.now();
          function scramble() {
              const elapsed =
                  Date.now() - startTime;
              // Stop after effect duration
              if (elapsed >= effectDuration) {
                  resetText(textElement);
                  timers.delete(textElement);
                  return;
              }
              // Get letters belonging to this text only
              const currentLetters =
                  textElement.querySelectorAll(
                      ".scramble-letter"
                  );
              // Get mouse position
              const mouseX =
                  window.mouseX || 0;
              const mouseY =
                  window.mouseY || 0;
              currentLetters.forEach((letter) => {
                  const rect =
                      letter.getBoundingClientRect();
                  const letterX =
                      rect.left +
                      rect.width / 2;
                  const letterY =
                      rect.top +
                      rect.height / 2;
                  const distance =
                      Math.sqrt(
                          Math.pow(
                              mouseX -
                              letterX,
                              2
                          )
                          +
                          Math.pow(
                              mouseY -
                              letterY,
                              2
                          )
                      );
                  // Only affect nearby letters
                  if (
                      distance <
                      effectRadius
                  ) {
                      if (
                          Math.random()
                          <
                          0.5
                      ) {
                          if (
                              letter.dataset.original
                              !== " "
                          ) {
                              letter.textContent =
                                  characters[
                                      Math.floor(
                                          Math.random()
                                          *
                                          characters.length
                                      )
                                  ];

                          }

                      }

                  }

              });

              // Continue animation
              const timer =
                  requestAnimationFrame(
                      scramble
                  );
              timers.set(
                  textElement,
                  timer
              );
          }
          scramble();
      });
      // Mouse leaves
      textElement.addEventListener(
          "mouseleave",
          () => {
              resetText(textElement);
          }
      );
  });
  // Reset text
  function resetText(textElement) {
      const currentLetters =
          textElement.querySelectorAll(
              ".scramble-letter"
          );
      currentLetters.forEach(
          (letter) => {
              letter.textContent =
                  letter.dataset.original === " "
                      ? "\u00A0"
                      : letter.dataset.original;
          }
      );
  }
  // Track mouse globally
  document.addEventListener(
      "mousemove",
      (event) => {
          window.mouseX =
              event.clientX;
          window.mouseY =
              event.clientY;
      }
  );
  const paragraph =
      document.querySelector(".scramble-paragraph");
  const paragraphCharacters =
      "<$%@(){}[]*>!#";
  const paragraphEffectRadius = 0;
  // const paragraphScrambleSpeed = 0.8;
  const paragraphEffectDuration = 1500;
  let paragraphLetters = [];
  let paragraphMouseX = 0;
  let paragraphMouseY = 0;
  let paragraphScrambling = false;
  // Create individual letters
  if (paragraph) {
      const originalText =
          paragraph.textContent;
      paragraph.innerHTML = "";
      originalText.split("").forEach((letter) => {
          const span =
              document.createElement("span");
          span.className =
              "paragraph-letter";
          // Keep normal spaces
          span.textContent =
              letter;
          span.dataset.original =
              letter;
          paragraph.appendChild(span);
          paragraphLetters.push(span);
      });
      // Track mouse
      document.addEventListener(
          "mousemove",
          (event) => {
              paragraphMouseX =
                  event.clientX;
              paragraphMouseY =
                  event.clientY;
          }
      );
// Mouse moves inside paragraph
paragraph.addEventListener(
    "mousemove",
    () => {
        // Reset previous effect immediately
        resetParagraph();
        // Cancel previous animation
        paragraphScrambling = false;
        // Start a new effect
        paragraphScrambling = true;
        const startTime = Date.now();
        function scrambleParagraph() {
            // Stop if a new mouse movement happened
            // and started a new effect
            if (!paragraphScrambling) {
                return;
            }
            const elapsed =
                Date.now() - startTime;
            // Stop after 1.5 seconds
            if (
                elapsed >=
                paragraphEffectDuration
            ) {
                resetParagraph();
                paragraphScrambling = false;
                return;
            }
            paragraphLetters.forEach(
                (letter) => {
                    // Don't scramble spaces
                    if (
                        letter.dataset.original === " "
                    ) {
                        return;
                    }
                    const rect =
                        letter.getBoundingClientRect();
                    const letterX =
                        rect.left +
                        rect.width / 2;
                    const letterY =
                        rect.top +
                        rect.height / 2;
                    const distance =
                        Math.sqrt(
                            Math.pow(
                                paragraphMouseX -
                                letterX,
                                2
                            )
                            +
                            Math.pow(
                                paragraphMouseY -
                                letterY,
                                2
                            )
                        );
                    if (
                        distance <
                        paragraphEffectRadius
                    ) {
                        const intensity =
                            1 -
                            (
                                distance /
                                paragraphEffectRadius
                            );
                        if (
                            Math.random() <
                            intensity
                        ) {
                            letter.textContent =
                                paragraphCharacters[
                                    Math.floor(
                                        Math.random() *
                                        paragraphCharacters.length
                                    )
                                ];

                        }

                    }

                }
            );
            setTimeout(() => {
                requestAnimationFrame(
                    scrambleParagraph
                );
            }, 50);
      }
        scrambleParagraph();
    }
);
      // Reset when mouse leaves
      paragraph.addEventListener(
          "mouseleave",
          () => {
              resetParagraph();
              paragraphScrambling =
                  false;
          }
      );
  }
  // Reset paragraph
  function resetParagraph() {
      paragraphLetters.forEach(
          (letter) => {
              letter.textContent =
                  letter.dataset.original;
          }
      );
  }
