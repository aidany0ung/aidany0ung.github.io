const text = document.getElementById('expand-header');
let rotated = false;

document.addEventListener('DOMContentLoaded', () => {
  const background = document.querySelector('.background');
  const sections = document.querySelectorAll('.section');
  const header = document.querySelector('.header');
  const headercard = document.querySelector('.header-toexpand');

  const colors = [
    '#D9EBFF',
    '#FFE7E6',
    '#FFE3B3',
    '#BFFFDB'
  ];

  function updateBackgroundColor() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const totalScrollableDistance = document.body.clientHeight - windowHeight;
    const scrollPercentage = (scrollPosition / totalScrollableDistance) * 100;

    const colorIndex = Math.floor(scrollPercentage / 25);
    const backgroundColor = colors[colorIndex];

    background.style.backgroundColor = backgroundColor;
    header.style.transition = 'background-color 0.5s ease-in-out'; // Add transition property
    header.style.backgroundColor = hexToHSL(backgroundColor,15);
    headercard.style.transition = 'background-color 0.5s ease-in-out'; // Add transition property
    headercard.style.backgroundColor = hexToHSL(backgroundColor,15); // Apply color to header
  }

  // Apply initial background color on page load
  updateBackgroundColor();

  // Update background color on scroll
  window.addEventListener('scroll', updateBackgroundColor);

  function hexToHSL(H,inc) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return "hsl(" + h + "," + s + "%," + (l-inc) + "%)";
  }
});

  function toggleDropdown() {
    var dropdown = document.getElementById("arrow");
    var isHidden = dropdown.style.display === "none";

    if (isHidden) {
        dropdown.style.display = "block"; // Delay the maxHeight update to ensure the transition is applied
    } else {
      dropdown.style.display = "none";
    }
  }

  function toggleTwo() {
    if (rotated) {
      text.style.transform = 'rotate(0deg)';
      rotated = false;
    } else {
      text.style.transition = 'transform 0.5s';
      text.style.transform = 'rotate(180deg)';
      rotated = true;
    }
    var box = document.getElementById('contact');
    if (!box.style.display || box.style.display == "none") {
        box.style.display = "block";
    }
    else {
        box.style.display = "none";
    }
}
