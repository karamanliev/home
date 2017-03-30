/*!
    SCRIPTS
*/

var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var ff = navigator.userAgent.indexOf('Firefox') > 0;
var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
if (iOS) document.body.classList.add('iOS');

(function() {
  // Browser resize and set #lead to 100vh
  function resize() {
    var heights = window.innerHeight;
    document.getElementById("lead").style.height = heights + "px";
  }

  resize();

  window.onresize = function() {
    resize();
  };

  // Fake loading.
  setTimeout(init, 1200);

  function init() {
    document.body.classList.remove('loading');
  }
})();

(function() {

  var getFontSize = function() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };

  var canvas = document.querySelector('.particles');
  var ctx = canvas.getContext('2d');
  var animations = [];

  var setCanvasSize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  var updateCoords = function(e) {
    x = e.clientX || e.touches[0].clientX;
    y = e.clientY || e.touches[0].clientY;
  };

  var colors = ['#7f40f1', '#5f11ed', '#FFFFFF', '#486176'];

  var createCircle = function(x,y) {
    var p = {};
    p.x = x;
    p.y = y;
    p.color = colors[anime.random(0, colors.length - 1)];
    p.color = '#FFF';
    p.radius = 0;
    p.alpha = 1;
    p.lineWidth = 6;
    p.draw = function() {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
      ctx.lineWidth = p.lineWidth;
      ctx.strokeStyle = p.color;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };
    return p;
  };

  var removeAnimation = function(animation) {
    var index = animations.indexOf(animation);
    if (index > -1) animations.splice(index, 1);
  };

  var animateParticles = function(x, y) {
    setCanvasSize();
    var circle = createCircle(x, y);
    var circleAnimation = anime({
      targets: circle,
      radius: function() { return anime.random(getFontSize() * 8.75, getFontSize() * 11.25); },
      lineWidth: 0,
      alpha: {
        value: 0,
        easing: 'linear',
        duration: function() { return anime.random(400, 600); }
      },
      duration: function() { return anime.random(1200, 1800); },
      easing: 'easeOutExpo',
      complete: removeAnimation
    });
    animations.push(circleAnimation);
  };

  var mainLoop = anime({
    duration: Infinity,
    update: function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animations.forEach(function(anim) {
        anim.animatables.forEach(function(animatable) {
          animatable.target.draw();
        });
      });
    }
  });

  document.addEventListener(tap, function(e) {
    updateCoords(e);
    animateParticles(x, y);
  }, false);

  window.addEventListener('resize', setCanvasSize, false);

  return {
    boom: animateParticles
  };

})();
