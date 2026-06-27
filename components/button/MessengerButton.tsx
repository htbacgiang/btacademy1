// components/MessengerButton.tsx

import { FC } from 'react';
import FbMess from '../../public/fbmess.png';
import Image from "next/image";
import styles from "../about/RingPhone.module.css";
import Link from 'next/link';
import Zalo from "../../public/zalo-icon.png";

const MessengerButton: FC = () => {
  const openMessenger = () => {
    window.open('https://m.me/61564432965502', '_blank');
  };

  return (

        <div className={styles.helpContainer}>

      <div className={styles.zaloRing}>
        <div className={styles.zaloRingCircle}></div>
        <div className={styles.zaloRingCircleFill}>
          <button>
            <Link href="http://zalo.me/0988027494">
              <Image src={Zalo} alt="Zalo Icon" width={60} height={60} />
            </Link>
          </button>
        </div>
      </div>
    </div>

  );
};

export default MessengerButton;
