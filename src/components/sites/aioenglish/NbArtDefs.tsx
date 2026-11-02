/* Paper-grain SVG filter defs shared by auth + legal pages (from the source SSR body).
   Scoped styles for .ta-gc/.tha-gc live in entry.css. */
export default function NbArtDefs() {
  return (
    <svg className="nb-frame nb-art-defs" width="0" height="0" aria-hidden="true" focusable="false" data-nb-art-defs="" data-v-dc22c2e3="">
      <defs data-v-dc22c2e3="">
        <filter id="nb-ta-grain" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB" data-v-dc22c2e3="">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" data-v-dc22c2e3=""></feTurbulence>
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0" result="a" data-v-dc22c2e3=""></feColorMatrix>
          <feFlood className="ta-gc" data-v-dc22c2e3=""></feFlood>
          <feComposite in2="a" operator="in" result="c" data-v-dc22c2e3=""></feComposite>
          <feComposite in="c" in2="SourceGraphic" operator="in" result="g" data-v-dc22c2e3=""></feComposite>
          <feMerge data-v-dc22c2e3="">
            <feMergeNode in="SourceGraphic" data-v-dc22c2e3=""></feMergeNode>
            <feMergeNode in="g" data-v-dc22c2e3=""></feMergeNode>
          </feMerge>
        </filter>
        <filter id="nb-tha-grain" x="-0.1" y="-0.1" width="1.2" height="1.2" colorInterpolationFilters="sRGB" data-v-dc22c2e3="">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" data-v-dc22c2e3=""></feTurbulence>
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0" result="a" data-v-dc22c2e3=""></feColorMatrix>
          <feFlood className="tha-gc" data-v-dc22c2e3=""></feFlood>
          <feComposite in2="a" operator="in" result="c" data-v-dc22c2e3=""></feComposite>
          <feComposite in="c" in2="SourceGraphic" operator="in" result="g" data-v-dc22c2e3=""></feComposite>
          <feMerge data-v-dc22c2e3="">
            <feMergeNode in="SourceGraphic" data-v-dc22c2e3=""></feMergeNode>
            <feMergeNode in="g" data-v-dc22c2e3=""></feMergeNode>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
