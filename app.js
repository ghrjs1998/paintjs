const canvas = document.getElementById("jsCanvas"); // id를 가져올때는 getElementById, class를 가져올때는 get 
const ctx = canvas.getContext("2d"); // context 불러오기 (mdn 참고)
const colors = document.getElementsByClassName("jsColor"); // jscolor라는 class를 가진 모든 요소를 가져옴
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const resetBtn = document.getElementById("jsReset");
const eraseBtn = document.getElementById("jsErase");


const INITIAL_COLOR = "#2c2c2c"; // 아래에서 strokeStyle, fillStyle이 중복되므로, 이렇게 변수 하나를 만들어서 값을 할당한다.
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false; // 클릭중인지 여부를 나타내는 변수
let filling = false; // 채우기 상태 여부를 나타내는 변수

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

function onMouseMove(event) { // 마우스가 캔버스 위에 있는지를 나타내는 함수
  // 여기서 관심있는 부분은 캔버스 내 위치인 offset에 대한 부분!
  // client X Y는 윈도우 전체에서 마우스의 위치
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) { // painting(클릭) 상태가 아니라면
    ctx.beginPath();  // path를 만든다 (path를 현 위치로 초기화한다)
    ctx.moveTo(x, y); // path를 x,y로 옮긴다 - 클릭하면 그 path의 최종 지점이 x와 y로 남는다 (beginPath가 있기에 지워도 상관이 없다)
  } else { // painting(클릭) 상태라면
    // CanvasRenderingContext2D.lineTo()는 현재 sub-path의 마지막 점을 특정 좌표와 '직선'으로 연결한다
    ctx.lineTo(x, y); // 실시간으로 계속해서 클릭한 상태로 이동한 좌표를 따라가서 path를 만든다
    // 6,6에서 클릭한 상태로 마우스를 8,8로 가져갔다면 path는 (6,6)~(7,7), (7,7)~(8,8) 이런 식으로 만들어진다.
    ctx.stroke(); // 그렇게 생성된 path를 이어서 선을 만든다. 즉 매우 작은 직선들이 우리 눈에는 부드럽게 보이는 것이다!
  }
}

function handleColorClick(event) {  // 색상표를 클릭했을 때 어떤 반응이 나오게 할 것인지 만드는 함수
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color; // strokeStyle을 override! 여기서부터는 클릭한 color로 선이 그려진다!
  ctx.fillStyle = color; // fill모드에서도 똑같이 색이 변할 수 있도록 만든다!
}

function handleRangeChange(event) { // 조정할 때마다 그에 맞춰서 lineWidth를 변경하는 함수
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick() { // Fill 버튼이 클릭이 되었을 때 함수
  if (filling === true) { // fill 상태이면
    filling = false; // filling을 false로 만들기
    mode.innerText = "Fill"; // 버튼 글씨 Fill로 만들기 (Fill 떠있으면 Paint모드)
  } else {
    filling = true; // filling을 true로 만들기
    mode.innerText = "Paint"; // 버튼 글씨 Paint로 만들기 (Paint 떠있으면 Fill모드)
  }
}

function handleCanvasClick() { // Fill 상태일 때 클릭하면 사각형 만드는 함수
  if (filling) { // fill 상태면
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // fillRect(시작점x, 시작점y, 너비, 높이) - 사각형 생성
  }
}

function handleCM(event) { // 우클릭을 방지하는 함수!
  event.preventDefault(); // 우클릭 기본 설정 방지!
}

function handleSaveClick() { // 세이브 버튼을 눌렀을 때 동작하는 함수!
  // canvas의 데이터를 image처럼 얻어야 한다
  const image = canvas.toDataURL(); // "image/jpeg"를 매개변수로 넣으면 jpeg타입의 이미지를 URL로 변환 (기본 png)
  const link = document.createElement("a"); // 존재하지 않는 임의의 링크 생성
  link.href = image; // href를 통해 url 연결
  link.download = "PaintJS[🎨]"; // download를 받을 때의 파일 이름을 설정
  link.click(); // link를 클릭한 것과 같은 효과를 내기 위해서
}

function handleResetClick() {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleEraseClick() {
 ctx.strokeStyle = "white";
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove); // 캔버스 위 움직임 확인
  canvas.addEventListener("mousedown", startPainting); // 클릭했을 때 감지
  canvas.addEventListener("mouseup", stopPainting); // 클릭을 멈췄을때 감지
  canvas.addEventListener("mouseleave", stopPainting); // 클릭하다가 캔버스를 벗어났을때 감지
  canvas.addEventListener("click", handleCanvasClick); // 캔버스를 클릭했을 때 감지
  canvas.addEventListener("contextmenu", handleCM); 
}


// Array.from 메소드는 object로부터 array를 만든다
// array를 주면 그 array안에서 for Each로 color를 가질 수 있다
// colors의 각각에다가 eventListener를 실행하도록함
Array.from(colors).forEach(color =>
  color.addEventListener("click", handleColorClick)
);

if (range) {
  range.addEventListener("input", handleRangeChange);
}
// getElementById로 잘 받아왔는지 확인
// input에 반응해야하기 떄문

if (mode) {
  mode.addEventListener("click", handleModeClick);
}
// fill 버튼이 클릭되었을때

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}
// save 버튼이 클릭되었을때

if (resetBtn) {
	resetBtn.addEventListener("click", handleResetClick);
}
// reset 버튼이 클릭되었을 때

if(eraseBtn) {
  eraseBtn.addEventListener("click", handleEraseClick)
}
