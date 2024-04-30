

var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};


window.addEventListener('scroll', function() {
    var nav = document.querySelector('.nav');
    if (window.scrollY > 0) {
        nav.classList.add('scroll-bg');
    } else {
        nav.classList.remove('scroll-bg');
    }
});

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};



// Verifica se estamos na página de contato antes de ativar o movimento do mouse

    var cursor = document.querySelector('.blob');

document.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
});

// Adicione isso após o final do seu script.js
document.addEventListener("DOMContentLoaded", function() {
    var dots = document.querySelectorAll('.dot');
  
    window.addEventListener('scroll', function() {
      var sections = document.querySelectorAll('section');
      var current = '';
      sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute('id');
        }
      });
  
      dots.forEach(function(dot) {
        dot.classList.remove('active');
        if (current === dot.getAttribute('data-target')) {
          dot.classList.add('active');
        }
      });
    });
  
    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        window.scrollTo({
          top: document.getElementById(dot.getAttribute('data-target')).offsetTop,
          behavior: 'smooth'
        });
      });
    });
  });

  // a throttle function
function dotsThrottle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function () {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
  };
  return function () {
      var now = Date.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
          if (timeout) {
              clearTimeout(timeout);
              timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
      }
      return result;
  };
}

// global fixed nav options
let dotFixedNavPresent = false;
let dotFixedNavId = '';
let dotFixedNavUp = false;

// scroll indicator controller
function easyScrollDots(dotfixedOptions) {
  let scrollIndi = document.querySelectorAll('.scroll-indicator');
  dotfixedOptions.fixedNav === true ? dotFixedNavPresent = true : dotFixedNavPresent;
  dotfixedOptions.fixedNavId === '' ? dotFixedNavId = false : dotFixedNavId = dotfixedOptions.fixedNavId;
  dotfixedOptions.fixedNavUpward === true ? dotFixedNavUp = true : dotFixedNavUp;

  if (scrollIndi.length) {
      const scrollIndiTemplate = '<div class="scroll-indicator-controller"><span></span></div>';
      document.querySelector('body').lastElementChild.insertAdjacentHTML('afterend', scrollIndiTemplate);
      const scrollIndiController = document.querySelector('.scroll-indicator-controller');
      if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) { scrollIndiController.classList.add('indi-mobile'); }
      const scrollIndiElems = Array.prototype.slice.call(scrollIndi);

      scrollIndiElems.forEach(function (e, i) {
          const scrollIndiId = e.getAttribute('id');
          const scrollIndiTitle = e.getAttribute('data-scroll-indicator-title');
          let firstActiveClass = '';

          if (i == 0) {
              firstActiveClass = 'active';
          }
          scrollIndiController.lastElementChild.insertAdjacentHTML('afterend', '<div class="' + firstActiveClass + '" data-indi-controller-id="' + scrollIndiId + '" onclick="scrollIndiClicked(\'' + scrollIndiId + '\');"><span>' + scrollIndiTitle + '</span><div></div></div>');
      });

      const scrollIndiControllerDots = scrollIndiController.querySelectorAll('[data-indi-controller-id]');

      var handleIndiScroll = dotsThrottle(function () {
          let indiScrollTopCollection = {};

          scrollIndiElems.forEach(function (e) {
              const scrollIndiIdScroll = e.getAttribute('id');
              const indiScrollTop = e.getBoundingClientRect().top;

              indiScrollTopCollection[scrollIndiIdScroll] = indiScrollTop;
          });

          // const indiOffsetValues = Object.values(indiScrollTopCollection); not supported in ie
          const indiOffsetValues = Object.keys(indiScrollTopCollection).map(function (itm) { return indiScrollTopCollection[itm]; });
          const indiOffsetMin = function () {
              const indiRemoveMinuses = indiOffsetValues.filter(function (x) { return x > -150; });

              return Math.min.apply(null, indiRemoveMinuses);
          }; 

          Object.keys(indiScrollTopCollection).forEach(function (e) {
              if (indiScrollTopCollection[e] == indiOffsetMin()) {
                  Array.prototype.forEach.call(scrollIndiControllerDots, function (el) {
                      if (el.classList.contains('active')) {
                          el.classList.remove('active');
                      }
                  });
                  scrollIndiController.querySelector('[data-indi-controller-id="' + e + '"]').classList.add('active');
              }
          });

      }, 300);

    window.onscroll = function() {
        handleIndiScroll();
    };
  }
}
  
function scrollIndiClicked(indiId) {
  if (window.jQuery) {
      // if jquery is availble then we can use jquery animations
      if (dotFixedNavPresent === true && dotFixedNavId.length) {
          // there is a fixed nav and its id has been defined
          const dotNavHeightElem = document.getElementById(dotFixedNavId);
          const dotNavHeight = dotNavHeightElem.clientHeight;
          const dotDocumentHtml = $('html, body');
          const indiElement = $('#' + indiId);
  
          if (dotFixedNavUp === true) {
              // fix nav on upward scroll only
              dotDocumentHtml.animate({
                  scrollTop: indiElement.offset().top
              }, 700);
              const scrollPos = document.body.getBoundingClientRect().top;
              setTimeout(function () {
                  if (document.body.getBoundingClientRect().top > scrollPos) {
                      dotDocumentHtml.animate({
                          scrollTop: indiElement.offset().top - dotNavHeight
                      }, 400);
                  }
              }, 400);
          }
          else {
              // fixed nav scroll
              dotDocumentHtml.animate({
                  scrollTop: indiElement.offset().top - dotNavHeight
              }, 700);
          }
      }
      else {
          // normal scroll
          $('html, body').animate({
              scrollTop: $('#' + indiId).offset().top
          }, 700);
      }    
  }
  else {
      // there is no jquery so we use vanilla scroll animations
      if (dotFixedNavPresent === true && dotFixedNavId.length) {
          // there is a fixed nav and its id has been defined
          const dotNavHeightElem = document.getElementById(dotFixedNavId);
          const dotNavHeight = dotNavHeightElem.clientHeight;
          const indiElement = document.getElementById(indiId);
  
          if (dotFixedNavUp === true) {
              // fix nav on upward scroll only
              window.scrollTo({
                  top: indiElement.offsetTop,
                  left: 0,
                  behavior: 'smooth'
              });
              const scrollPos = document.body.getBoundingClientRect().top;
              setTimeout(function () {
                  if (document.body.getBoundingClientRect().top > scrollPos) {
                      window.scrollTo({
                          top: indiElement.offsetTop - dotNavHeight,
                          left: 0,
                          behavior: 'smooth'
                      });
                  }
              }, 400);
          }
          else {
              // fixed nav scroll
              window.scrollTo({
                  top: indiElement.offsetTop - dotNavHeight,
                  left: 0,
                  behavior: 'smooth'
              });
          }
      }
      else {
          // normal scroll
          window.scrollTo({
              top: document.getElementById(indiId).offsetTop,
              left: 0,
              behavior: 'smooth'
          });
      }
  }
}


// Init
easyScrollDots({
'fixedNav': false,
'fixedNavId': '',
'fixedNavUpward': false
});