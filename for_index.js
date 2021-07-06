const searchBtn = document.getElementById('search-btn');
const search = document.getElementById('query');
const tip = document.getElementById('tip');

var i = 0;
var message = "this is a demo..."
var typeSpeed = 200;


searchBtn.addEventListener('click', () => {
  search.style.width = '80%';
  search.style.paddingLeft = '60px';
  search.style.cursor = 'text';
  search.focus();

  typeWriter();
});

search.addEventListener('keydown', () => {
  tip.style.visibility = "visible";
  tip.style.opacity = 1;
});

function typeWriter() {
  if (i < message.length) {
    msg = search.getAttribute('placeholder') + message.charAt(i);
    search.setAttribute('placeholder', msg);
    i++;
    setTimeout(typeWriter, typeSpeed);
  }
}
