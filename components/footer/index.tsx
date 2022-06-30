import styles from "../../styles/Home.module.css";
import React from "react";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a href="https://winpeed.com" target="_blank" rel="noopener noreferrer">
        Built with love by <span className={styles.logo}>winpeed</span>
      </a>
    </footer>
  );
};

export default Footer;
