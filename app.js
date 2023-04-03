    const keys = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    const gameBoard = document.getElementById("game-board");
    const speedController = document.getElementById("speed-controller");
    const speedLabel = document.getElementById("speed-label");
    const speedInput = document.getElementById("speed-input");
    const speedValue = document.getElementById("speed-value");
    const scoreDisplay = document.getElementById("scoreDisplay");
    let startTime = new Date();

    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let fallingSpeed = 5000;
    let numKeysFalling = 0;
    let fallingKeys = [];
    let numKeysKnockedOut = 0;

    setInterval(updateTime, 1000);
    setInterval(createKey, 500);

    const resetButton = document.getElementById("reset-button");

    function resetGame() {
      // Clear falling keys
      fallingKeys.forEach((key) => key.remove());
      fallingKeys = [];
      numKeysFalling = 0;
      numKeysKnockedOut = 0;

      // Reset time
      startTime = new Date();

      // Reset score display
      updateTime();
      updateKeyOrder();
    }

    resetButton.addEventListener("click", resetGame);

    function updateTime() {
      const now = new Date();
      const timeDiffInSeconds = Math.floor((now - startTime) / 1000);
      hours = Math.floor(timeDiffInSeconds / 3600);
      minutes = Math.floor((timeDiffInSeconds % 3600) / 60);
      seconds = timeDiffInSeconds % 60;
      const timeString = `${hours > 0 ? hours + " hour" + (hours > 1 ? "s" : "") + " " : ""}${minutes > 0 ? minutes + " minute" + (minutes > 1 ? "s" : "") + " " : ""}${seconds} second${seconds > 1 ? "s" : ""}`;
      scoreDisplay.innerHTML = `${numKeysKnockedOut} keys knocked out <br> within ${timeString}`;
    }

    function createKey() {
      if (numKeysFalling >= 20) return;
      numKeysFalling++;

      const key = document.createElement("div");
      key.classList.add("key");

      const isLetter = Math.floor(Math.random() * 2) === 0;
        if (isLetter) {
          key.classList.add("letter");
          key.style.backgroundColor = "#F7DC6F";
        } else {
          key.classList.add("digit");
          key.style.backgroundColor = "#D7BDE2";
        }

      key.innerHTML = keys[Math.floor(Math.random() * keys.length)];
      key.style.left = Math.floor(Math.random() * (gameBoard.offsetWidth - key.offsetWidth *2)) + "px";
      gameBoard.appendChild(key);


      const keySize = 90;
      key.style.width = `${keySize}px`;
      key.style.height = `${keySize}px`;
      key.style.lineHeight = `${keySize}px`;
      key.style.borderRadius = `${keySize / 2}px`;


      // set the maximum X position to the game board's width minus the key's width
      const maxPosX = gameBoard.offsetWidth - key.offsetWidth;

      // set a random X position within the visible area
      key.style.left = Math.floor(Math.random() * maxPosX) + "px";


      // Set random falling speed between 80% and 120% of the default value (5000ms)
      const fallingSpeed = 5000 * (Math.random() * 1.5 + 0.1);

      // add event listeners for both click and touchstart
      key.addEventListener("click", onKeyClick);
      key.addEventListener("touchstart", onKeyClick);

      setTimeout(() => {
        numKeysFalling--;
        fallingKeys = fallingKeys.filter((k) => k !== key);
        key.remove();
        updateKeyOrder();
      }, fallingSpeed);

      key.animate(
        [
          { transform: "translateY(0)" },
          { transform: `translateY(${gameBoard.offsetHeight}px)` },
        ],
        {
          duration: fallingSpeed,
          easing: "linear",
          fill: "forwards",
        }
      );

      fallingKeys.push(key);
      updateKeyOrder();
    }


    document.addEventListener("keydown", (event) => {
      if (!event.key.match(/^[a-zA-Z0-9]$/)) return;

      const lowestKey = getLowestKey();
      if (lowestKey && lowestKey.innerHTML === event.key.toUpperCase()) {
        const success = document.createElement("div");
        success.classList.add("success");
        success.innerHTML = "✔";
        success.style.top = lowestKey.offsetTop + "px";
        success.style.left = lowestKey.offsetLeft + "px";
        gameBoard.appendChild(success);
        numKeysKnockedOut++;
        

        setTimeout(() => {
          success.remove();
          lowestKey.classList.add("success-highlight", "blink");
          setTimeout(() => {
            numKeysFalling--;
            fallingKeys = fallingKeys.filter((k) => k !== lowestKey);
            lowestKey.remove();
            updateKeyOrder();
          }, 100);
        }, 200);

        lowestKey.style.backgroundColor = "#87cefa";
        setTimeout(() => {
          lowestKey.style.backgroundColor = "#ffffff";
        }, 200);
      }
    });

    function getLowestKey() {
      const sortedKeys = fallingKeys.slice().sort((a, b) => {
        return b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom;
      });
      return sortedKeys[0];
    }

    // function updateKeyOrder() {
    //   for (let i = 0; i < fallingKeys.length; i++) {
    //     const key = fallingKeys[i];
    //     key.classList.remove("closest-to-bottom");
    //   }
    //   const lowestKey = getLowestKey();
    //   if (lowestKey) {
    //   lowestKey.classList.add("closest-to-bottom");
    //   }
    // }

    function onKeyClick(event) {
      const clickedElement = document.elementFromPoint(
        event.clientX,
        event.clientY
      );
      if (clickedElement.classList.contains("key")) {
        const success = document.createElement("div");
        success.classList.add("success");
        success.innerHTML = "✔";
        success.style.top = clickedElement.offsetTop + "px";
        success.style.left = clickedElement.offsetLeft + "px";
        gameBoard.appendChild(success);
        numKeysKnockedOut++;

        setTimeout(() => {
          success.remove();
          clickedElement.classList.add("success-highlight", "blink");
          setTimeout(() => {
            numKeysFalling--;
            fallingKeys = fallingKeys.filter((k) => k !== clickedElement);
            clickedElement.remove();
            updateKeyOrder();
          }, 100);
        }, 200);

        clickedElement.style.backgroundColor = "#87cefa";
        setTimeout(() => {
        clickedElement.style.backgroundColor = "#ffffff";
        }, 200);
      }

      clickedElement.classList.add("success-highlight");
    }

    const modal = document.querySelector('.modal');
    const aboutButton = document.querySelector('#about-button');
    const closeButton = document.querySelector('.modal-close');

    // Show the modal when the About Game button is clicked
    aboutButton.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    // Hide the modal when the close button is clicked
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    // When the user taps anywhere outside of the modal, close it
    window.addEventListener('touchend', (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });

    