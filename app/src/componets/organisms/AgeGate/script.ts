export const ADULT_ATTRIBUTE = "data-adult";
export const AGE_GATE_ID = "age-gate";
export const LEAVE_URL = "https://www.disney.com/";

const ADULT_COOKIE = "is_adult=true";
const quote = JSON.stringify;
const compact = (source: string) => source.replace(/\n\s*/g, "");

export const AGE_GATE_NOSCRIPT_STYLE = `#${AGE_GATE_ID}{display:none}html:not([${ADULT_ATTRIBUTE}]) body[data-age-gate]{overflow:visible!important;touch-action:auto!important}`;

export const AGE_GATE_SCRIPT = compact(`
(function(){
  if(window.__ageGate){
    window.__ageGate();
    return;
  }
  var root=document.documentElement,attr=${quote(ADULT_ATTRIBUTE)},confirmed=false;
  function adult(){
    if(confirmed)return true;
    try{return document.cookie.split(/;\\s*/).indexOf(${quote(ADULT_COOKIE)})!==-1}catch(x){return false}
  }
  function mark(){
    if(!root.hasAttribute(attr)&&adult())root.setAttribute(attr,"");
  }
  window.__ageGate=mark;
  mark();
  try{new MutationObserver(mark).observe(root,{attributes:true,attributeFilter:[attr]})}catch(x){}
  window.addEventListener("click",function(e){
    var t=e.target;
    if(!t||!t.closest||!t.closest(${quote(`#${AGE_GATE_ID}`)}))return;
    if(t.closest("[data-age-yes]")){
      confirmed=true;
      try{document.cookie=${quote(`${ADULT_COOKIE}; path=/`)}}catch(x){}
      mark();
      return;
    }
    if(t.closest("[data-age-no]")||!t.closest("[role=dialog]"))window.location.href=${quote(LEAVE_URL)};
  },true);
  window.addEventListener("keydown",function(e){
    if(e.key!=="Tab"||root.hasAttribute(attr))return;
    var gate=document.getElementById(${quote(AGE_GATE_ID)}),buttons=gate?gate.querySelectorAll("button"):[],count=buttons.length;
    if(!count)return;
    var index=Array.prototype.indexOf.call(buttons,document.activeElement);
    e.preventDefault();
    buttons[index<0?(e.shiftKey?count-1:0):(index+(e.shiftKey?count-1:1))%count].focus();
  },true);
})()
`);
