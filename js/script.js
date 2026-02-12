// DOM 요소
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const startBtnText = document.getElementById('startBtnText');
const startIcon = document.getElementById('startIcon');
const resetBtn = document.getElementById('resetBtn');
const resetIcon = document.getElementById('resetIcon');
const timerContainer = document.getElementById('timerContainer');

// 타이머 상태
let isRunning = false;
let intervalId = null;
let totalSeconds = 0;

// 숫자를 2자리로 포맷
function formatNumber(num) {
  return num.toString().padStart(2, '0');
}

// 입력값에서 총 초 계산
function getTotalSeconds() {
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

// 총 초에서 화면 업데이트
function updateDisplay(total) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  
  hoursInput.value = formatNumber(hours);
  minutesInput.value = formatNumber(minutes);
  secondsInput.value = formatNumber(seconds);
}

// 버튼 상태 업데이트
function updateButtonState() {
  if (isRunning) {
    // 실행 중 - Pause 버튼으로 변경
    startBtn.className = 'btn btn-pause';
    startBtnText.textContent = 'PAUSE';
    startIcon.src = 'img/icon-stop.png';
    timerContainer.classList.add('counting');
  } else {
    // 정지 - Start 버튼으로 변경
    startBtn.className = 'btn btn-start';
    startBtnText.textContent = 'START';
    startIcon.src = 'img/icon-start.png';
    timerContainer.classList.remove('counting');
  }
}

// 입력창 활성화/비활성화
function setInputsEnabled(enabled) {
  hoursInput.disabled = !enabled;
  minutesInput.disabled = !enabled;
  secondsInput.disabled = !enabled;
}

// 타이머에 값이 있는지 확인
function hasValue() {
  return getTotalSeconds() > 0;
}

// Start/Pause 버튼 클릭 핸들러
startBtn.addEventListener('click', function() {
  if (isRunning) {
    // 일시정지
    clearInterval(intervalId);
    isRunning = false;
    setInputsEnabled(true);
    updateButtonState();
  } else {
    // 시작
    totalSeconds = getTotalSeconds();
    if (totalSeconds <= 0) return; // 값이 없으면 시작 안함
    
    isRunning = true;
    setInputsEnabled(false);
    updateButtonState();
    
    intervalId = setInterval(function() {
      totalSeconds--;
      updateDisplay(totalSeconds);
      
      if (totalSeconds <= 0) {
        // 타이머 종료 - 초기화
        clearInterval(intervalId);
        isRunning = false;
        setInputsEnabled(true);
        updateButtonState();
      }
    }, 1000);
  }
});

// Reset 버튼 클릭 핸들러
resetBtn.addEventListener('click', function() {
  clearInterval(intervalId);
  isRunning = false;
  totalSeconds = 0;
  updateDisplay(0);
  setInputsEnabled(true);
  updateButtonState();
});

// 입력값 유효성 검사 및 포맷팅
const inputs = [hoursInput, minutesInput, secondsInput];

inputs.forEach(function(input) {
  // 입력 시 유효성 검사
  input.addEventListener('input', function() {
    let value = parseInt(this.value) || 0;
    const max = this === hoursInput ? 99 : 59;
    
    if (value > max) value = max;
    if (value < 0) value = 0;
    
    this.value = formatNumber(value);
  });

  // 포커스 시 전체 선택
  input.addEventListener('focus', function() {
    this.select();
  });

  // 포커스 해제 시 포맷팅
  input.addEventListener('blur', function() {
    this.value = formatNumber(parseInt(this.value) || 0);
  });
});

// 초기화
updateDisplay(0);
