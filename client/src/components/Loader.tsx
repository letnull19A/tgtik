import React from 'react';
import styles from './Loader.module.css';
import { ReactComponent as CircleLoader } from '../assets/CircleLoader.svg';

const Loader = () => (
  <div className={styles.fullscreenLoader}>
    <CircleLoader className={styles.circleLoaderSvg} />
  </div>
);

export default Loader; 