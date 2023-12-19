const inner = document.querySelector(".inner");
const createRectBtn = document.querySelector(".create-rect-btn");
const rectWrapper = document.querySelector(".rect-wrapper");
const container = document.querySelector(".container");
const field = document.querySelector(".field");

let rowInput = document.querySelector(".row-input");
let columnInput = document.querySelector(".column-input");
const rowsColumnsBtn = document.querySelector(".rows-columns-btn");

const quantity = document.querySelector(".quantity");
const sidebar = document.querySelector(".sidebar");

const icons = document.querySelectorAll('.icons-item');
const selectedIcon = document.querySelector('.selected-icon');

const eraseBtn = document.querySelector('.erase-btn');
const rects = rectWrapper.querySelectorAll(".rect");


const colorSelectBtn = document.querySelector('.color-select-btn');



icons.forEach((elem) => {//показывает выбранную иконку в окошку выбранной иконки
  selectedIcon.classList.remove('erase-active');
  elem.addEventListener('click', (e) => {
    selectedIcon.style.backgroundColor = `${getComputedStyle(elem).backgroundColor}`;
    selectedIcon.style.backgroundImage = `url(${e.target.getAttribute('data-path')})`;
  })
})

let rect;

colorSelectBtn.addEventListener('click', (e) => {//добавление цвета и иконки выделенной области
  rect = rectWrapper.querySelectorAll(".rect");

  rect.forEach((elem, id) => {
    if (elem.classList.contains('selected')) {
      let color = getComputedStyle(selectedIcon).backgroundColor;//берется цвет окошка выбранного цвета
      let path = getComputedStyle(selectedIcon).backgroundImage;//и путь фоновой картинки окошка выбранного элемента
      
      if (color != "rgb(255, 255, 255)" && !e.altKey) {//если цвет окошка выбранного элемента не белый и не нажата кнопка alt,
        elem.style.backgroundColor = `${color}`;//то квадратик окрашивается в цвет окошка выбранного элемента,
        elem.style.backgroundImage = `${path}`;//и ему прописывается путь до картинки, такой же, как у окошка выбранного элемента

        localStorage.setItem(`color${id}`, getComputedStyle(elem).backgroundColor);//в локал сторадж закидывается цвет и путь к картинке
        localStorage.setItem(`path${id}`, getComputedStyle(elem).backgroundImage);
      }
      // elem.style.backgroundColor = '#ffff00';
    }
  })
})

//цвета элементов
const colorElementsInLocalStorage = () => {//берет из  localStogage цвета и окрашивает соответствующие элементы в те цвета

  rect = rectWrapper.querySelectorAll(".rect");

  for (let i = 0; i < rect.length; i++) {
    if (localStorage.getItem(`color${i}`)) {
      rect[i].style.backgroundColor = localStorage.getItem(`color${i}`);
      rect[i].style.backgroundImage = localStorage.getItem(`path${i}`);
    }
  }
}

const colorElements = () => {//окрашивает элементы при нажатии, ставит им на фон картинку, закидывает это всё в локал сторадж
  rect = rectWrapper.querySelectorAll(".rect");

  rect.forEach((elem, id) => {
    elem.addEventListener("click", (e) => {//по клику на квадратик
      let color = getComputedStyle(selectedIcon).backgroundColor;//берется цвет окошка выбранного цвета
      let path = getComputedStyle(selectedIcon).backgroundImage;//и путь фоновой картинки окошка выбранного элемента
      
      if (color != "rgb(255, 255, 255)" && !e.altKey) {//если цвет окошка выбранного элемента не белый и не нажата кнопка alt,
        elem.style.backgroundColor = `${color}`;//то квадратик окрашивается в цвет окошка выбранного элемента,
        elem.style.backgroundImage = `${path}`;//и ему прописывается путь до картинки, такой же, как у окошка выбранного элемента

        localStorage.setItem(`color${id}`, getComputedStyle(elem).backgroundColor);//в локал сторадж закидывается цвет и путь к картинке
        localStorage.setItem(`path${id}`, getComputedStyle(elem).backgroundImage);
      }
    });
  });
};

const eraseIcons = (selectedIcon) => {//функция стирания квадратика
  selectedIcon.style.backgroundColor = 'rgb(253, 255, 255)';
  selectedIcon.style.backgroundImage = 'none';
}

eraseBtn.addEventListener('click', () => {//по клику на кнопку стирания вызываем функцию стирания
  eraseIcons(selectedIcon);
})

const createTitle = (title, wrapperr) => {
  //генерирует заголовок
  const appTitle = document.createElement("h1");
  appTitle.classList.add("title");
  appTitle.textContent = title;
  wrapperr.append(appTitle);
};

const createRect = (inner, elem) => {
  let newElem = document.createElement("div");
  newElem.classList.add("rect");
  inner.append(newElem);
};

createRectBtn.addEventListener("click", () => {
  createRect(rectWrapper);
  widthHeightElems();
});

const widthHeightElems = () => {
  let elems = document.querySelectorAll(".rect");

  let width = getComputedStyle(elems[0]).width;

  elems.forEach((elem) => {
    elem.style.width = `${width}`;
    elem.style.height = `${width}`;
  });
};

const createGrid = (rows, columns, wrapper, quantity) => {
  let counter = 0;
  for (let i = 0; i < rows; i++) {
    let gridRow = document.createElement("div");
    gridRow.classList.add("grid-row");
    wrapper.append(gridRow);

    for (let j = 0; j < columns; j++) {
      createRect(gridRow);

      counter += 1;
    }
  }

  quantity.innerHTML = counter; //счетчик квадратов

  //добавление границ между квадратами 10 на 10
  const gridRows = document.querySelectorAll(".grid-row");
  let containerRow;

  for (let i = 0; i < gridRows.length; i++) {
    containerRow = gridRows[i].querySelectorAll(".rect");

    for (let k = 0; k < containerRow.length; k++) {
      if ((k + 1) % 10 == 0) {
        containerRow[k].style.borderRightWidth = "4px";
      }
    }

    if ((i + 1) % 10 == 0) {
      for (let j = 0; j < containerRow.length; j++) {
        containerRow[j].style.borderBottomWidth = "4px";
      }
    }
  }
};

rowsColumnsBtn.addEventListener("click", () => {
  //запуск генерации квадратов
  rowInput = rowInput.value; //значения инпутов
  columnInput = columnInput.value;

  localStorage.setItem("rows", rowInput); //добавляем эти значения в локал сторадж
  localStorage.setItem("columns", columnInput);

  createGrid(rowInput, columnInput, rectWrapper, quantity);
});

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
  // rectWrapper.style.width = `${width}px`;
  rectWrapper.querySelectorAll(".rect").forEach((elem) => {
    elem.style.width = `${width}px`;
    elem.style.height = `${width}px`;
  });

  e.preventDefault();
});

//перемещение поля и блокировка при этом покраски квадратов
rectWrapper.onmousedown = function (e) {
  if (e.altKey) {
    // let color = colorInput.value;//при нажатой кнопке alt значение цвета запоминается и выставляется вместо него белый, а если значение белый, то квадрат не красится
    // colorInput.value = '#ffffff';

    let coords = getCoords(rectWrapper);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;

    rectWrapper.style.position = "absolute";
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
      
      // setTimeout(() => {//после того, как передвинули поле, отпускаем кнопку мыши, и через 100 миллисекунд значение цвета становится тем же, что и было до нажатия кнопки, можно снова красить
      //   colorInput.value = color;
      // }, 100)
    };
  }
};

rectWrapper.ondragstart = function () {
  return false;
};

const selectElements = () => {//select elements выделение элементов

  const container = document.querySelector(".field");
  const items = document.querySelectorAll(".rect");

  let selectRect;

  let startX;
  let endX;
  let startY;
  let endY;

  document.body.addEventListener("mousedown", (e) => {
    if (e.shiftKey) {
      startX = e.pageX;
      startY = e.pageY;

      if (document.querySelector(".select-rect")) {
        //удаляем при нажатии прямоугольник выбора, если он есть
        let rect = document.querySelector(".select-rect");
        rect.remove();
      }

      items.forEach((elem) => {
        elem.classList.remove("selected");
      });

      selectRect = document.createElement("div"); //создаем прямоугольник выбора
      selectRect.classList.add("select-rect"); //присваиваем ему класс
      container.append(selectRect); //засовываем его внутрь контейнера
      selectRect.style.left = `${startX}px`; //позиционируем лево
      selectRect.style.top = `${startY}px`; //позиционируем верх
    }
  });

  document.body.addEventListener("mousemove", (e) => {
    let color;
    if (e.shiftKey) {
      endX = e.pageX;
      endY = e.pageY;

      let widthSelectRect = endX - startX;
      let heightSelectRect = endY - startY;

      if (selectRect) {
        selectRect.style.width = `${widthSelectRect}px`; //устанавливаем его ширину
        selectRect.style.height = `${heightSelectRect}px`; //устанавливаем его высоту
      }
    }
  });

  document.body.addEventListener("mouseup", (e) => {
    if (selectRect && e.shiftKey) {
      items.forEach((elem) => {
        if (
          (//внутренние квадраты
            selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().right 
            &&
            selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().top 
            &&
            selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().bottom
          )
          ||
          (//одиночный квадрат
            selectRect.getBoundingClientRect().left > elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().right < elem.getBoundingClientRect().right 
            &&
            selectRect.getBoundingClientRect().top > elem.getBoundingClientRect().top 
            &&
            selectRect.getBoundingClientRect().bottom < elem.getBoundingClientRect().bottom
            &&
            getComputedStyle(selectRect).width != '2.22222px'//при клике без протяжки квадрат не выделяется
          )
          ||
          (//левый верхний угловой неполностью захваченный квадрат
            selectRect.getBoundingClientRect().left > elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().right
            &&
            selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().right 
            &&
            selectRect.getBoundingClientRect().top > elem.getBoundingClientRect().top 
            &&
            selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().bottom 
            &&
            selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().bottom
          )
          ||
          (//правый верхний угловой неполностью захваченный квадрат
            selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().right < elem.getBoundingClientRect().right 
            &&
            selectRect.getBoundingClientRect().top > elem.getBoundingClientRect().top 
            &&
            selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().bottom 
            &&
            selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().bottom
          )
          ||
          (//правый нижний угловой неполностью захваченный квадрат
            selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().right < elem.getBoundingClientRect().right 
            &&
            selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().top 
            &&
            selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().bottom 
            &&
            selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().top
          )
          ||
          (//левый нижний угловой неполностью захваченный квадрат
            selectRect.getBoundingClientRect().left > elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().right
            &&
            selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().right 
            &&
            selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().top 
            &&
            selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().bottom 
            &&
            selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().top
          )
          ||
          (//верхние неполностью захваченные квадраты между угловыми верхними неполностью захваченными
            selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().right
            &&
            selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().right 
            &&
            selectRect.getBoundingClientRect().top > elem.getBoundingClientRect().top 
            &&
            selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().bottom 
            &&
            selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().bottom
          )
          ||
          (//нижние неполностью захваченные квадраты между угловыми верхними неполностью захваченными
            selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().left
            &&
            selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().right
            &&
            selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().right 
            &&
            selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().top 
            &&
            selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().top
            &&
            selectRect.getBoundingClientRect().bottom < elem.getBoundingClientRect().bottom
          )
          ||
          (//два и более неполностью захваченных горизонтальных квадрата
            (
              (
                selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().left
                &&
                selectRect.getBoundingClientRect().right < elem.getBoundingClientRect().right 
                &&
                selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().left 
                &&
                selectRect.getBoundingClientRect().top > elem.getBoundingClientRect().top 
                &&
                selectRect.getBoundingClientRect().bottom < elem.getBoundingClientRect().bottom
                &&
                getComputedStyle(selectRect).width != '2.22222px'//при клике без протяжки квадрат не выделяется
              )
              ||
              (
                selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().left
                &&
                selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().right 
                &&
                selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().left 
                &&
                selectRect.getBoundingClientRect().top > elem.getBoundingClientRect().top 
                &&
                selectRect.getBoundingClientRect().bottom < elem.getBoundingClientRect().bottom
                &&
                getComputedStyle(selectRect).width != '2.22222px'//при клике без протяжки квадрат не выделяется
              )
              ||
              (
                selectRect.getBoundingClientRect().left > elem.getBoundingClientRect().left
                &&
                selectRect.getBoundingClientRect().right > elem.getBoundingClientRect().right 
                &&
                selectRect.getBoundingClientRect().left < elem.getBoundingClientRect().right
                &&
                selectRect.getBoundingClientRect().top > elem.getBoundingClientRect().top 
                &&
                selectRect.getBoundingClientRect().bottom < elem.getBoundingClientRect().bottom
                &&
                getComputedStyle(selectRect).width != '2.22222px'//при клике без протяжки квадрат не выделяется
              )
            )
          )
          ||
          (//два и более неполностью захваченных вертикальных квадрата
            (
              (
                selectRect.getBoundingClientRect().left > elem.getBoundingClientRect().left
                &&
                selectRect.getBoundingClientRect().right < elem.getBoundingClientRect().right
                &&
                selectRect.getBoundingClientRect().top > elem.getBoundingClientRect().top 
                &&
                selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().bottom
                &&
                getComputedStyle(selectRect).width != '2.22222px'//при клике без протяжки квадрат не выделяется
              )
              ||
              (
                selectRect.getBoundingClientRect().left > elem.getBoundingClientRect().left
                &&
                selectRect.getBoundingClientRect().right < elem.getBoundingClientRect().right
                &&
                selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().top 
                &&
                selectRect.getBoundingClientRect().bottom < elem.getBoundingClientRect().bottom
                &&
                selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().top
                &&
                getComputedStyle(selectRect).width != '2.22222px'//при клике без протяжки квадрат не выделяется
              )
              ||
              (
                selectRect.getBoundingClientRect().left > elem.getBoundingClientRect().left
                &&
                selectRect.getBoundingClientRect().right < elem.getBoundingClientRect().right
                &&
                selectRect.getBoundingClientRect().top < elem.getBoundingClientRect().top 
                &&
                selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().bottom
                &&
                selectRect.getBoundingClientRect().bottom > elem.getBoundingClientRect().top
                &&
                getComputedStyle(selectRect).width != '2.22222px'//при клике без протяжки квадрат не выделяется
              )
            )
          )
        ) {
          elem.classList.add("selected");
        }
      })
    }

    if (selectRect) {
      selectRect.remove();
    }
    
  });
};

setTimeout(selectElements, 2000);


//выбор цвета и окрашивание квадратов выбранным цветом
// const colorInput = document.querySelector(".color-input");
// const removeColorBtn = document.querySelector(".remove-color-btn");

// const colorElements = () => {//окрашивает элементы при нажатии, закидывает эти цвета в локал сторадж
//   rect = rectWrapper.querySelectorAll(".rect");

//   rect.forEach((elem, id) => {
//     elem.addEventListener("click", () => {
//       let color = colorInput.value;

//       if (color != "#ffffff") {
//         elem.style.backgroundColor = `${color}`;
//         localStorage.setItem(`color${id}`, getComputedStyle(elem).backgroundColor);
//       }
//     });
//   });
// };

// const removeColorInputValue = (input) => {
//   //отключение value инпута
//   input.value = "#ffffff";
//   removeColorBtn.disabled = true; //кнопка сброса цвета становится неактивной
//   removeColorBtn.classList.remove("active");
// };

// removeColorBtn.addEventListener("click", () => {
//   removeColorInputValue(colorInput);
//   console.log(colorInput.value);
// });

// colorInput.addEventListener("click", () => {
//   //при нажатии на выбор цвета кнопка сброса цвета становится активной, при перезагрузке она неактивна
//   removeColorBtn.disabled = false;
//   removeColorBtn.classList.add("active");
// });

document.addEventListener("DOMContentLoaded", () => {
  // createTitle("Схема", inner);//генерация заголовка
  createGrid(rowInput, columnInput, rectWrapper, quantity);
  createGrid(
    localStorage.getItem("rows"),
    localStorage.getItem("columns"),
    rectWrapper,
    quantity
  ); //вызываем функцию создания квадратов, количество берем из локал стораджа
  // removeColorInputValue(colorInput);
  setTimeout(colorElements(), 1000);
  setTimeout(colorElementsInLocalStorage(), 1000)
});

document.body.onclick = (e) => {
  // console.log("номер кнопки" + JSON.stringify(e));
};
