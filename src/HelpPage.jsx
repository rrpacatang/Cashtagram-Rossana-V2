import React from 'react';
import styles from './Style/HelpPage.module.css'; // Import the CSS Module

const HelpPage = () => {
  return (
    <div className={styles.container}>
      <div>
        <h2>Help Center</h2>
        <p>
          This is the content of the Help Center article. You can add any information or
          components here that you want to display for help center topics.
        </p>
      </div>
      <div>
        <h2>FAQs</h2>
        <p>
          This is the content of the FAQs article. You can add any frequently asked questions and their answers here.
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
