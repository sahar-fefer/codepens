const addCard = document.querySelector(".add-card");
const grid = document.querySelector(".grid");
let products = grid.querySelectorAll(".product");
const loginCard = grid.querySelector(".login");

addCard.addEventListener("click", () => {
    // check if login card move down line and if so - add animation
    const isCardMovedDownLine = moveCardDownLine();

    // build new card
    const lastElemId = parseInt(products[products.length - 1].dataset.id);

    const card = document.createElement("div");
    card.classList = "product card";

    // check if card move down and if so add transition delay
    if (isCardMovedDownLine) {
        card.style.transitionDelay = ".15s";
    }

    const img = document.createElement("img");
    img.src =
        "https://optimaxweb.glassesusa.com/image/upload/v1686479473/media/wysiwyg/codepen-media/card.jpg";
    card.appendChild(img);

    // add attribute "open" to able the animation
    card.setAttribute("open", "");
    ///////////

    // insert card to the grid
    //  if there is "login card", insert it before the last card
    if (loginCard) {
        grid.insertBefore(card, loginCard);
    } else {
        grid.appendChild(card);
    }

    // remove the "open" attribute to start the animation
    setTimeout(() => {
        card.removeAttribute("open");
    }, 10);

    // remove the transitionDelay from card
    setTimeout(() => {
        card.style.transitionDelay = "0s";
    }, 150);

    // add the new card and delete button to lists
    deleteCardButtons = grid.querySelectorAll(".delete-wrapper");
    products = grid.querySelectorAll(".product");
});

// on add card - check if login card move down line and if so add animation.
function moveCardDownLine() {
    const loginIndex = getCardId(loginCard);
    loginCard.style.animation = "";
    void loginCard.offsetWidth;
    if ((loginIndex + 1) % 3 === 0) {
        loginCard.style.animation = "moveLine ease .8s";
        return true;
    } else {
        loginCard.style.animation = "bounce ease .3s .2s";
        return false;
    }
}

function getCardId(card) {
    const cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
    return cards.indexOf(card);
}

const undoWrapper = document.querySelector(".undo-wrapper");
const undo = undoWrapper.querySelector(".undo");
const closeUndoPopup = undoWrapper.querySelector(".close");

let deletedElements = [];
let lastElemId;

// general function to clean grid from deleting attributes
function clearGrid(card) {
    if (!card) {
        card = deletedElements[deletedElements.length - 1].curCard;
    }
    undoWrapper.removeAttribute("visible");
    card.removeAttribute("close");
    deletedElements.pop();
}

// add event listener to close undo button
closeUndoPopup.addEventListener("click", () => {
    undoWrapper.removeAttribute("visible");
});

// add event listener to undo click
undo.addEventListener("click", () => {
    const placeholder = document.querySelector(".placeholder");
    if (placeholder) {
        placeholder.remove();
    }
    const moveLine = document.querySelector("[move-line]");
    console.log("moveLine", moveLine);
    if (moveLine) {
        moveLine.removeAttribute("move-line");
    }
    card = deletedElements[deletedElements.length - 1];
    const curCard = card.curCard;
    const id = card.id;
    const nextCard = grid.children[id + 1];
    console.log("nextCard", nextCard);
    nextCard.style.animation = "bounce ease .3s .2s";
    clearTimeout(deleteCardTimeout);
    clearGrid(curCard);
    setTimeout(() => {
        nextCard.style.animation = "";
    }, 600);
});

// delete card at the end of timeout
function deleteCard(card) {
    console.log("deleteCard");
    clearGrid(card);
    card.remove();
}

// on delete - check if some card move up line and if so add animation.
function moveCardUpLine(deletedCardId) {
    const cards = grid.querySelectorAll(".card");
    const cardsLength = cards.length;
    if (cardsLength > 3) {
        for (let i = 3; i < cards.length; i = i + 3) {
            if (deletedCardId < i) {
                // adding placeholder to handle with the jumping card.
                const placeholder = document.createElement("div");
                placeholder.classList = "placeholder";
                grid.insertBefore(placeholder, cards[i]);

                const animCard = cards[i];
                animCard.removeAttribute("move-line");
                void animCard.offsetWidth;
                animCard.setAttribute("move-line", "");
                console.log("animCard", animCard);

                setTimeout(() => {
                    placeholder.remove();
                }, 3300);
            }
        }
    }
}

function getCardId(card) {
    const cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
    return cards.indexOf(card);
}

// declare deleteCardTimeout
let deleteCardTimeout;

function deleteButtonClick(e) {
    deletedElements = [];
    const curCard = e.target.closest(".card");
    const curId = getCardId(curCard);
    curCard.setAttribute("close", "");
    undoWrapper.setAttribute("visible", "");
    deletedElements.push({
        curCard,
        id: curId
    });

    // console.log('curId', curId);
    moveCardUpLine(curId);

    deleteCardTimeout = setTimeout(() => deleteCard(curCard), 8000);
}