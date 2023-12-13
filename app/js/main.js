const inner = document.querySelector(".inner");
const createRectBtn = document.querySelector(".create-rect-btn");
const rectWrapper = document.querySelector(".rect-wrapper");
const container = document.querySelector(".container");
const field = document.querySelector(".field");

let rowInput = document.querySelector('.row-input');
let columnInput = document.querySelector('.column-input');
const rowsColumnsBtn = document.querySelector('.rows-columns-btn');

const quantity = document.querySelector('.quantity');

const colorInput = document.querySelector('.color-input');
const sidebar = document.querySelector('.sidebar');
const removeColorBtn = document.querySelector('.remove-color-btn');

rectWrapper.addEventListener('click', (e)=> {
  // console.log(e.target);
  
})
//цвета элементов

colorInput.addEventListener('click', () => {//при нажатии на выбор цвета кнопка сброса цвета становится активной, при перезагрузке она неактивна
  removeColorBtn.disabled = false;
  removeColorBtn.classList.add('active');
})

const colorElements = () => {
  const rect = rectWrapper.querySelectorAll('.rect');
  
  for (let i = 0; i < rect.length; i++) {
    if (localStorage.getItem(`color${i}`)) {
      rect[i].style.backgroundColor = localStorage.getItem(`color${i}`);
    }
  }
  rect.forEach((elem, id) => {
    elem.addEventListener("click", () => {
      let color = colorInput.value;

      if (color != '#ffffff') {
        elem.style.backgroundColor = `${color}`;
        localStorage.setItem(`color${id}`, getComputedStyle(elem).backgroundColor);
      }
    });
  });
}

const removeColorInputValue = (input) => {//отключение value инпута
  input.value = '#ffffff';
  removeColorBtn.disabled = true;//кнопка сброса цвета становится неактивной
  removeColorBtn.classList.remove('active');
}

removeColorBtn.addEventListener('click', () => {
  removeColorInputValue(colorInput);
  console.log(colorInput.value);
})

const createTitle = (title, wrapperr) => {//генерирует заголовок
  const appTitle = document.createElement("h1");
  appTitle.classList.add("title");
  appTitle.textContent = title;
  wrapperr.append(appTitle);
};

const createRect = (inner, elem) => {
  let newElem = document.createElement('div');
  newElem.classList.add('rect');
  inner.append(newElem);
};

createRectBtn.addEventListener("click", () => {
  createRect(rectWrapper);
  widthHeightElems();
});

const widthHeightElems = () => {
  let elems = document.querySelectorAll('.rect');

  // console.log(elems);

  let width = getComputedStyle(elems[0]).width;
  // console.log(width);

  elems.forEach(elem => {
    elem.style.width = `${width}`;
    elem.style.height = `${width}`;
  })
}

const createGrid = (rows, columns, wrapper, quantity) => {
  let counter = 0;
  for (let i = 0; i < rows; i++) {
    let gridRow = document.createElement('div');
    gridRow.classList.add('grid-row')
    wrapper.append(gridRow);

    for (let j = 0; j < columns; j++) {
      createRect(gridRow);

      counter += 1;
    }
  }

  quantity.innerHTML = counter;//счетчик квадратов

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

rowsColumnsBtn.addEventListener('click', () => {//запуск генерации квадратов
  rowInput = rowInput.value;//значения инпутов
  columnInput = columnInput.value;

  localStorage.setItem('rows', rowInput);//добавляем эти значения в докал сторадж
  localStorage.setItem('columns', columnInput);

  createGrid(rowInput, columnInput, rectWrapper, quantity);
})

//координаты
function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
}

let width = 100;

//приближение - отдаление путем изменения размеров квадратов
rectWrapper.addEventListener("wheel", (e) => {
  var delta = e.deltaY || e.detail || e.wheelDelta;

  if (delta > 0) {
    width -= 10;
  } else {
    width += 10;
  }
  rectWrapper.style.width = `${width}px`;
  rectWrapper.querySelectorAll(".rect").forEach((elem) => {
    elem.style.width = `${width}px`;
    elem.style.height = `${width}px`;
  });

  e.preventDefault();
});

//перемещение поля
rectWrapper.onmousedown = function (e) {
  let coords = getCoords(rectWrapper);
  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;

  rectWrapper.style.position = "absolute";
  // document.body.appendChild(rectWrapper);
  moveAt(e);

  rectWrapper.style.zIndex = 1000; // над другими элементами

  function moveAt(e) {
    rectWrapper.style.left = e.pageX - shiftX + "px";
    rectWrapper.style.top = e.pageY - shiftY + "px";
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
  createGrid(rowInput, columnInput, rectWrapper, quantity);
  createGrid(localStorage.getItem('rows'), localStorage.getItem('columns'), rectWrapper, quantity);//вызываем функцию создания квадратов, количество берем из локал стораджа
  removeColorInputValue(colorInput);
  let timeout = setTimeout(colorElements(), 2000)
});
