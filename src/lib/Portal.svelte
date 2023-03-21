<div class="circle"></div>
<svg>
  <filter id="wavy">
    <feTurbulence x="0" y="0" baseFrequency="0.009" numOctaves="5" speed="1">
      <animate attributeName="baseFrequency" dur="60s" values="0.02; 0.05; 0.02" repeatCount="indefinite">
    </feTurbulence>
    <feDisplacementMap in="SourceGraphic" scale="10"></feDisplacementMap>
  </filter>
</svg>

<style>
    :root {
  --size: 128px;
  --s: 1px; 
  --bor: 7px;
  --boxShadow: 10px;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #141516;
  overflow:hidden;
}
.circle {
  width: var(--size);
  height: var(--size);
  filter: url(#wavy) blur(1px);
}

.circle:before,
.circle:after {
  content: "";
  position: absolute;
  top: var(--s);
  left: var(--s);
  right: var(--s);
  bottom: var(--s);
  border-radius: 50%;
  border: var(--bor) solid #fff;
}
.circle:before {
  box-shadow: 0 0 var(--boxShadow) #f00, inset 0 0 var(--boxShadow) #f00;
  animation: move 5s linear infinite;
}

.circle:after {
  box-shadow: 0 0 calc(var(--bor)/2) #fff, inset 0 0 var(--bor) #fff;
}

@keyframes move {
  0% {
    box-shadow: 0 0 var(--boxShadow) #f00, inset 0 0 var(--boxShadow) #f00;
    filter: hue-rotate(0deg); 
  }
  20% {
    box-shadow: 0 0 20px #f00, inset 0 0 30px #f00;
  }

  40% {
    box-shadow: 0 0 10px #f00, inset 0 0 10px #f00;
  }
  60% {
    box-shadow: 0 0 20px #f00, inset 0 0 20px #f00;
  }
  80% {
    box-shadow: 0 0 10px #f00, inset 0 0 30px #f00;
  }
  100% {
    box-shadow: 0 0 var(--boxShadow) #f00, inset 0 0 var(--boxShadow) #f00;
    filter: hue-rotate(10deg); 
  } 
}

svg {
  width: 0;
  height: 0;
}
</style>