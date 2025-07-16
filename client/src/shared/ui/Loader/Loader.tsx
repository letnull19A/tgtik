import React from 'react';
import styles from './Loader.module.css';
import { ReactComponent as CircleLoader } from '../assets/CircleLoader.svg';

const Loader = ({ type = 'fullscreen' }: { type?: 'fullscreen' | 'player' }) => (
  <div className={type === 'player' ? styles.playerLoader : styles.fullscreenLoader}>
    <CircleLoader className={styles.circleLoaderSvg} />
  </div>
);

export default Loader; 