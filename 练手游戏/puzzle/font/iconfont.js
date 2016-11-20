;(function(window) {

var svgSprite = '<svg>' +
  ''+
    '<symbol id="icon-xiangji2" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M830.65614 158.252982l-319.946246 0c0-52.980346-43.003528-95.983874-95.983874-95.983874l-63.989249 0c-52.980346 0-95.983874 43.003528-95.983874 95.983874L158.769024 158.252982c-52.980346 0-95.983874 43.003528-95.983874 95.983874l0 511.913993c0 52.980346 43.003528 95.983874 95.983874 95.983874l417.822274 0c9.116748 0 17.717453-3.956325 23.909961-10.664875 6.020494-6.70855 8.944734-15.825298 7.912649-24.942046-0.860071-8.428691-1.548127-16.857383-1.548127-25.458088 0-141.567613 132.106837-254.580884 279.866958-216.565765 9.63279 2.408198 19.781623 0.344028 27.522258-5.676466 7.740635-6.020494 12.385016-15.309256 12.385016-25.286074l0-299.304552C926.640013 201.256509 883.636486 158.252982 830.65614 158.252982zM478.71527 702.161599c-105.960692 0-191.967747-86.179069-191.967747-191.967747S372.754578 318.226104 478.71527 318.226104s191.967747 86.007055 191.967747 191.967747S584.503948 702.161599 478.71527 702.161599zM782.664203 382.215354c-26.490173 0-47.991937-21.501764-47.991937-47.991937s21.501764-47.991937 47.991937-47.991937c26.490173 0 47.991937 21.501764 47.991937 47.991937S809.154376 382.215354 782.664203 382.215354z"  ></path>'+
      ''+
      '<path d="M830.65614 640.064505c-88.415253 0-159.973123 71.55787-159.973123 159.973123 0 88.415253 71.55787 159.973123 159.973123 159.973123s159.973123-71.55787 159.973123-159.973123C990.629263 711.622375 919.071393 640.064505 830.65614 640.064505zM894.645389 830.140097l-31.994625 0 0 31.994625c0 17.717453-14.277171 31.994625-31.994625 31.994625s-31.994625-14.277171-31.994625-31.994625l0-31.994625-31.994625 0c-17.717453 0-31.994625-14.277171-31.994625-31.994625s14.277171-31.994625 31.994625-31.994625l31.994625 0 0-31.994625c0-17.717453 14.277171-31.994625 31.994625-31.994625s31.994625 14.277171 31.994625 31.994625l0 31.994625 31.994625 0c17.717453 0 31.994625 14.277171 31.994625 31.994625C926.640013 815.862926 912.362842 830.140097 894.645389 830.140097z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
'</svg>'
var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
var shouldInjectCss = script.getAttribute("data-injectcss")

/**
 * document ready
 */
var ready = function(fn){
  if(document.addEventListener){
      document.addEventListener("DOMContentLoaded",function(){
          document.removeEventListener("DOMContentLoaded",arguments.callee,false)
          fn()
      },false)
  }else if(document.attachEvent){
     IEContentLoaded (window, fn)
  }

  function IEContentLoaded (w, fn) {
      var d = w.document, done = false,
      // only fire once
      init = function () {
          if (!done) {
              done = true
              fn()
          }
      }
      // polling for no errors
      ;(function () {
          try {
              // throws errors until after ondocumentready
              d.documentElement.doScroll('left')
          } catch (e) {
              setTimeout(arguments.callee, 50)
              return
          }
          // no errors, fire

          init()
      })()
      // trying to always fire before onload
      d.onreadystatechange = function() {
          if (d.readyState == 'complete') {
              d.onreadystatechange = null
              init()
          }
      }
  }
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

var before = function (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

var prepend = function (el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

function appendSvg(){
  var div,svg

  div = document.createElement('div')
  div.innerHTML = svgSprite
  svg = div.getElementsByTagName('svg')[0]
  if (svg) {
    svg.setAttribute('aria-hidden', 'true')
    svg.style.position = 'absolute'
    svg.style.width = 0
    svg.style.height = 0
    svg.style.overflow = 'hidden'
    prepend(svg,document.body)
  }
}

if(shouldInjectCss && !window.__iconfont__svg__cssinject__){
  window.__iconfont__svg__cssinject__ = true
  try{
    document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
  }catch(e){
    console && console.log(e)
  }
}

ready(appendSvg)


})(window)
