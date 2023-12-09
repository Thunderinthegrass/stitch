const inner = document.querySelector(".inner");
const createRectBtn = document.querySelector(".create-rect-btn");
const rectWrapper = document.querySelector(".rect-wrapper");
const container = document.querySelector(".container");
const field = document.querySelector(".field");

const createTitle = (title, wrapperr) => {
  const appTitle = document.createElement("h1");
  appTitle.classList.add("title");
  appTitle.textContent = title;
  wrapperr.append(appTitle);
};

const createRect = (inner) => {
  inner.innerHTML += `<svg class="rect" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100">
  <rect class="cls-1" x="0.5" y="0.5" width="99" height="99"></rect>
  <path class="cls-2" d="M551,86.67v98H453v-98h98m1-1H452v100H552v-100Z" transform="translate(-452 -85.67)"/>
</svg>`;
};

createRectBtn.addEventListener("click", () => {
  createRect(rectWrapper);
});


function getCoords(elem) {
  // кроме IE8-
  var box = elem.getBoundingClientRect();
  // console.log(box);
  // console.log(pageYOffset);
  // console.log(scrollY);
  
  
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
}



var scale = 1;
let width = 100;
// field.addEventListener("wheel", (e) => {
//   var delta = e.deltaY || e.detail || e.wheelDelta;

//   // отмасштабируем при помощи CSS
//   if (delta > 0) scale += 0.05;
//   else scale -= 0.05;

//   rectWrapper.style.transform =
//     rectWrapper.style.WebkitTransform =
//     rectWrapper.style.MsTransform =
//       "scale(" + scale + ")";
//   e.preventDefault();
// });

rectWrapper.addEventListener("wheel", (e) => {
  // let coords = getCoords(rectWrapper);
  
  // var shiftX = e.pageX - coords.left;
  // var shiftY = e.pageY - coords.top;

  // console.log("++++++++++++++++++++++++++++++");
  

  // console.log("shiftX - " + shiftX);
  // console.log("shiftY - " + shiftY);

  // console.log("pageX - " + e.pageX);
  // console.log("pageY - " + e.pageY);

  // console.log("coords.left - " + coords.left);
  // console.log("coords.top - " + coords.top);

  // console.log("++++++++++++++++++++++++++++++");
  

  var delta = e.deltaY || e.detail || e.wheelDelta;

  // отмасштабируем при помощи CSS
  // if (delta > 0) scale += 0.05;
  // else scale -= 0.05;

  // rectWrapper.style.transform =
  //   rectWrapper.style.WebkitTransform =
  //   rectWrapper.style.MsTransform =
  //     "scale(" + scale + ")";

  if (delta > 0) {
    width += 10;
  }
  else {
    width -= 10;
  }
  rectWrapper.style.width = `${width}px`;
  rectWrapper.querySelectorAll('.rect').forEach(elem => {
    elem.style.width = `${width}px`;
    elem.style.height = `${width}px`;
  })

  e.preventDefault();
});

rectWrapper.onmousedown = function (e) {

  // console.log("++++++++");
  // console.log(e);
  // console.log("++++++++");
  
  

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
    console.log(getComputedStyle(rectWrapper).width);
    
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
