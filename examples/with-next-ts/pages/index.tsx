import type { NextPage } from "next";
import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";

// By dynamically loading the <Streak /> component,
// we guarantee it doesn't get rendered on the server
// which means when it loads, `localStorage` will be available.
// See: https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const DynamicStreak = dynamic(() => import("../components/Streak"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <DynamicStreak />
    </div>
  );
};

export default Home;
