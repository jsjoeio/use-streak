import { useStreak } from "use-streak";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
const { currentCount } = useStreak(localStorage, new Date());

app.innerHTML = `
    <div className="App">
      <h1 style="margin-bottom: '1rem'">Current streak</h1>
      <div>
        <p style="font-size: '4rem'; margin-top: '2rem'; margin-bottom: '0'">
          <span aria-label="fire emoji" role="img">
            🔥
          </span>
        </p>
      </div>
      <p style="font-size: '2rem'">
        ${currentCount} day
        ${currentCount > 1 ? "s" : ""}
      </p>
    </div>
`;
