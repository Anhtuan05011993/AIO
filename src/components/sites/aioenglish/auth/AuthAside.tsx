import Raccoon from "./Raccoon";
import type { RaccoonExpression } from "./Raccoon";

/* Speech-bubble + coon mascot column on the right side of the auth shell. */
export default function AuthAside({
  bubble,
  tips,
  expression,
}: {
  bubble: string;
  tips: [string, string];
  expression: RaccoonExpression;
}) {
  return (
    <aside className="aps isle nbx-r-info lpa-blk" aria-hidden="true" data-v-17d7b57d data-v-1593b0df>
      <div className="aps-cluster" data-v-1593b0df>
        <div className="aps-bubble nbx-r-ivory lpa-blk" data-v-1593b0df>
          <p className="aps-bubble-t" data-v-1593b0df>{bubble}</p>
          <ul className="aps-tips" data-v-1593b0df>
            {tips.map((tip) => (
              <li key={tip} data-v-1593b0df>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-icon" aria-hidden="true" focusable="false" data-v-1593b0df>
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <span data-v-1593b0df>{tip}</span>
              </li>
            ))}
          </ul>
          <span className="aps-tail" data-v-1593b0df></span>
        </div>
        <div className="aps-coon" data-v-1593b0df>
          <span className="aps-mound" data-v-1593b0df></span>
          <span className="aps-rig" data-v-1593b0df>
            <Raccoon expression={expression} />
          </span>
        </div>
      </div>
    </aside>
  );
}
