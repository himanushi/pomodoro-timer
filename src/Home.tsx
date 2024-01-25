// Scoped styles
import styles from "~/Home.module.css";

export const Home = () => {
  return (
    <div>
      <h1 className={styles.homeTitle}>Hello, world!</h1>
      <a href="/counter">Counter Link</a>
    </div>
  );
};
