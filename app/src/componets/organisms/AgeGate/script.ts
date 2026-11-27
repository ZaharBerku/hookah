export const ADULT_ATTRIBUTE = "data-adult";
export const AGE_GATE_ID = "age-gate";
export const LEAVE_URL = "https://www.disney.com/";

const ADULT_COOKIE = "is_adult=true";
const quote = JSON.stringify;

export const AGE_GATE_INIT_SCRIPT = `(function(){var r=document.documentElement,a=${quote(ADULT_ATTRIBUTE)};function m(){try{if(!r.hasAttribute(a)&&document.cookie.split(/;\\s*/).indexOf(${quote(ADULT_COOKIE)})!==-1)r.setAttribute(a,"")}catch(e){}}m();try{new MutationObserver(m).observe(r,{attributes:true,attributeFilter:[a]})}catch(e){}})()`;

export const AGE_GATE_ACTIONS_SCRIPT = `window.addEventListener("click",function(e){var t=e.target;if(!t||!t.closest||!t.closest(${quote(`#${AGE_GATE_ID}`)}))return;if(t.closest("[data-age-yes]")){document.cookie=${quote(`${ADULT_COOKIE}; path=/`)};document.documentElement.setAttribute(${quote(ADULT_ATTRIBUTE)},"");return}if(t.closest("[data-age-no]")||!t.closest("[role=dialog]"))window.location.href=${quote(LEAVE_URL)}},true)`;
