var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e){t.appendChild(e)}function s(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function a(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function u(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function h(){return f(" ")}function d(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}let g;function p(t){g=t}const m=[],b=[],y=[],$=[],v=Promise.resolve();let x=!1;function _(t){y.push(t)}let A=!1;const k=new Set;function w(){if(!A){A=!0;do{for(let t=0;t<m.length;t+=1){const e=m[t];p(e),C(e.$$)}for(p(null),m.length=0;b.length;)b.pop()();for(let t=0;t<y.length;t+=1){const e=y[t];k.has(e)||(k.add(e),e())}y.length=0}while(m.length);for(;$.length;)$.pop()();x=!1,A=!1,k.clear()}}function C(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(_)}}const E=new Set;function I(t,e){-1===t.$$.dirty[0]&&(m.push(t),x||(x=!0,v.then(w)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function L(l,i,s,a,u,f,h=[-1]){const d=g;p(l);const m=i.props||{},b=l.$$={fragment:null,ctx:null,props:f,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:n(),dirty:h,skip_bound:!1};let y=!1;if(b.ctx=s?s(l,m,((t,e,...n)=>{const o=n.length?n[0]:e;return b.ctx&&u(b.ctx[t],b.ctx[t]=o)&&(!b.skip_bound&&b.bound[t]&&b.bound[t](o),y&&I(l,t)),e})):[],b.update(),y=!0,o(b.before_update),b.fragment=!!a&&a(b.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);b.fragment&&b.fragment.l(t),t.forEach(c)}else b.fragment&&b.fragment.c();i.intro&&(($=l.$$.fragment)&&$.i&&(E.delete($),$.i(v))),function(t,n,l){const{fragment:i,on_mount:s,on_destroy:c,after_update:a}=t.$$;i&&i.m(n,l),_((()=>{const n=s.map(e).filter(r);c?c.push(...n):o(n),t.$$.on_mount=[]})),a.forEach(_)}(l,i.target,i.anchor),w()}var $,v;p(d)}function M(t,e,n){const o=t.slice();return o[1]=e[n],o[3]=n,o}function N(t,e,n){const o=t.slice();return o[1]=e[n],o[5]=n,o}function S(t){let e,n,o,r,l,a=t[3]+","+t[5];return{c(){var i;e=u("div"),n=u("p"),o=f(a),r=h(),d(n,"class","svelte-uudi1h"),d(e,"class",(null==(i="cell")?"":i)+" svelte-uudi1h"),d(e,"id",l=(t[3]*t[0]+t[5]).toString()),d(e,"data-x",t[3]),d(e,"data-y",t[5])},m(t,l){s(t,e,l),i(e,n),i(n,o),i(e,r)},p(t,n){1&n&&l!==(l=(t[3]*t[0]+t[5]).toString())&&d(e,"id",l)},d(t){t&&c(e)}}}function j(t){let e,n=Array(t[0]),o=[];for(let e=0;e<n.length;e+=1)o[e]=S(N(t,n,e));return{c(){for(let t=0;t<o.length;t+=1)o[t].c();e=f("")},m(t,n){for(let e=0;e<o.length;e+=1)o[e].m(t,n);s(t,e,n)},p(t,r){if(1&r){let l;for(n=Array(t[0]),l=0;l<n.length;l+=1){const i=N(t,n,l);o[l]?o[l].p(i,r):(o[l]=S(i),o[l].c(),o[l].m(e.parentNode,e))}for(;l<o.length;l+=1)o[l].d(1);o.length=n.length}},d(t){a(o,t),t&&c(e)}}}function O(e){let n,o,r,l,f,g,p,m,b,y,$,v,x,_,A=Array(e[0]),k=[];for(let t=0;t<A.length;t+=1)k[t]=j(M(e,A,t));return{c(){n=u("main"),o=u("span"),r=h(),l=u("div");for(let t=0;t<k.length;t+=1)k[t].c();f=h(),g=u("h1"),g.textContent="Rules",p=h(),m=u("li"),m.textContent="Any live cell with fewer than two live neighbours dies, as if by underpopulation.",b=h(),y=u("li"),y.textContent="Any live cell with two or three live neighbours lives on to the next generation.",$=h(),v=u("li"),v.textContent="Any live cell with more than three live neighbours dies, as if by overpopulation.",x=h(),_=u("li"),_.textContent="Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.",d(o,"class","alive svelte-uudi1h"),d(l,"class","grid svelte-uudi1h")},m(t,e){s(t,n,e),i(n,o),i(n,r),i(n,l);for(let t=0;t<k.length;t+=1)k[t].m(l,null);i(n,f),i(n,g),i(n,p),i(n,m),i(n,b),i(n,y),i(n,$),i(n,v),i(n,x),i(n,_)},p(t,[e]){if(1&e){let n;for(A=Array(t[0]),n=0;n<A.length;n+=1){const o=M(t,A,n);k[n]?k[n].p(o,e):(k[n]=j(o),k[n].c(),k[n].m(l,null))}for(;n<k.length;n+=1)k[n].d(1);k.length=A.length}},i:t,o:t,d(t){t&&c(n),a(k,t)}}}function T(t,e,n){let{num:o}=e;return t.$$set=t=>{"num"in t&&n(0,o=t.num)},[o]}const B=10,H=new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),L(this,t,T,O,l,{num:0})}}({target:document.body,props:{num:B}}),q=Array.from(Array(B),(()=>new Array(B)));class P{constructor(t){this.alive=!1,this.neighbours=0,this.block=t,q[parseInt(t.dataset.x)][parseInt(t.dataset.y)]=this,Math.random()<.2&&(t.classList.add("alive"),this.alive=!0)}kill(){this.alive=!1,this.block.classList.remove("alive")}raise(){this.alive=!0,this.block.classList.add("alive")}setInner(t){this.block.children[0].innerHTML=t}}const R=document.getElementsByClassName("cell");function z(t,e){let n=0;for(let o=-1;o<=1;o++)for(let r=-1;r<=1;r++){const l=(t+o)%B,i=(e+r+B)%B;-1!=l&&(q[l][i].alive&&n++)}return q[t][e].alive&&n--,n}return Array.from(R).forEach((t=>{t instanceof HTMLElement&&new P(t)})),setInterval((function(){let t=0;for(let e=0;e<B;e++)for(let n=0;n<B;n++){const o=q[e][n],r=z(e,n);t+=r,o.neighbours=r,o.setInner(r.toString())}const e=Object.assign({},q);if(0===t)for(let t=0;t<B;t++)for(let e=0;e<B;e++){const n=q[t][e];Math.random()<.2&&n.raise()}else for(let t=0;t<B;t++)for(let n=0;n<B;n++){const o=e[t][n];o.alive?(o.neighbours<2||o.neighbours>3)&&o.kill():3===o.neighbours&&o.raise()}}),100),H}();
//# sourceMappingURL=bundle.js.map