function showTime() {
  const date = new Date();
  const [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()].map(
    (num) => num.toString().padStart(2, "0")
  );
  const session = h >= 12 ? "PM" : "AM";
  const time = `${h % 12 || 12}:${m}:${s} ${session}`;
  document.getElementById("MyClockDisplay").textContent = time;
  setTimeout(showTime, 1000);
}

showTime();