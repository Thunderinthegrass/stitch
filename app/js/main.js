const inner = document.querySelector(".inner");
const createRectBtn = document.querySelector(".create-rect-btn");
const rectWrapper = document.querySelector(".rect-wrapper");
const container = document.querySelector(".container");
const field = document.querySelector(".field");

const rowInput = document.querySelector('.row-input');
const columnInput = document.querySelector('.column-input');
const rowsColumnsBtn = document.querySelector('.rows-columns-btn');

const quantity = document.querySelector('.quantity');



const createTitle = (title, wrapperr) => {//генерирует заголовок
  const appTitle = document.createElement("h1");
  appTitle.classList.add("title");
  appTitle.textContent = title;
  wrapperr.append(appTitle);
};

const createRect = (inner, elem) => {
//v1
//   let newElem = `<svg class="rect" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100">
//   <rect class="cls-1" x="0.5" y="0.5" width="99" height="99"></rect>
//   <path class="cls-2" d="M551,86.67v98H453v-98h98m1-1H452v100H552v-100Z" transform="translate(-452 -85.67)"/>
// </svg>`;
// inner.innerHTML += newElem;

// v2
  let newElem = document.createElement('div');
  newElem.classList.add('rect');
  inner.append(newElem);

// v3
// inner.innerHTML += elem;
};

createRectBtn.addEventListener("click", () => {
  createRect(rectWrapper);
  widthHeightElems();
});

const widthHeightElems = () => {
  let elems = document.querySelectorAll('.rect');

  console.log(elems);

  let width = getComputedStyle(elems[0]).width;
  console.log(width);

  elems.forEach(elem => {
    elem.style.width = `${width}`;
    elem.style.height = `${width}`;
  })
}

const createGrid = (rows, columns, wrapper, quantity) => {
  let counter = 0;
  for (let i = 0; i < rows.value; i++) {
    let gridRow = document.createElement('div');
    gridRow.classList.add('grid-row')
    wrapper.append(gridRow);

    for (let j = 0; j < columns.value; j++) {
      createRect(gridRow);

      counter += 1;
    }
  }

  quantity.innerHTML = counter;

  //добавление границ между квадратами 10 на 10
  const gridRows = document.querySelectorAll('.grid-row');
  let containerRow;

  for (let i = 0; i < gridRows.length; i++) {
    containerRow = gridRows[i].querySelectorAll('.rect');

    for (let k = 0; k < containerRow.length; k++) {
      if ((k + 1) % 10 == 0) {
        containerRow[k].style.borderRightWidth = '4px';
      }
    }

    if ((i + 1) % 10 == 0) {
      for (let j = 0; j < containerRow.length; j++) {
          containerRow[j].style.borderBottomWidth = '4px';
      }
    }
  }
}

rowsColumnsBtn.addEventListener('click', () => {
  createGrid(rowInput, columnInput, rectWrapper, quantity)
})




function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
}

let width = 100;

rectWrapper.addEventListener("wheel", (e) => {
  var delta = e.deltaY || e.detail || e.wheelDelta;

  if (delta > 0) {
    width += 10;
  } else {
    width -= 10;
  }
  rectWrapper.style.width = `${width}px`;
  rectWrapper.querySelectorAll(".rect").forEach((elem) => {
    elem.style.width = `${width}px`;
    elem.style.height = `${width}px`;
  });

  e.preventDefault();
});

rectWrapper.onmousedown = function (e) {
  let coords = getCoords(rectWrapper);
  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;

  rectWrapper.style.position = "absolute";
  document.body.appendChild(rectWrapper);
  moveAt(e);

  rectWrapper.style.zIndex = 1000; // над другими элементами

  function moveAt(e) {
    rectWrapper.style.left = e.pageX - shiftX + "px";
    rectWrapper.style.top = e.pageY - shiftY + "px";
    // console.log(getComputedStyle(rectWrapper).width);
  }

  document.onmousemove = function (e) {
    moveAt(e);
  };

  rectWrapper.onmouseup = function () {
    document.onmousemove = null;
    rectWrapper.onmouseup = null;
  };
};

rectWrapper.ondragstart = function () {
  return false;
};

document.addEventListener("DOMContentLoaded", () => {  
  createTitle("Схема", inner);
});
