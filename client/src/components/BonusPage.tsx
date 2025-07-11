import React from 'react';
import styles from './BonusPage.module.css';
import { ReactComponent as BonusBigFriendsIcon } from '../assets/BonusBigFriendsIcon.svg';
import { getReferralUrl, BOT_ID, USER_ID, getReferrals, getRateWithBalance } from '../api/api';
import GiftToast from './GiftToast';
import { useSelector, useDispatch } from 'react-redux';
import { incrementBalance, setBalance } from '../store';
import type { RootState, AppDispatch } from '../store';

// Add this at the very top of the file
declare global {
  interface Window {
    Telegram?: any;
  }
}

type Referral = { referredId: string; username: string; bonus: number };

const InviteList: React.FC<{refs: Referral[], onInvite: () => void}> = ({refs, onInvite}) =>  {
  return (
      <div className={styles.container}>
        <div className={styles.list}>
          {refs.map((ref) => (
              <div className={styles.item} key={ref.referredId}>
                <img src={'https://placehold.co/40x40'} alt="avatar" className={styles.avatar} />
                <div className={styles.text}>
                  <div className={styles.username}>{ref.username}</div>
                  <div className={styles.bonus}>+${ref.bonus} bonus</div>
                </div>
              </div>
          ))}
        </div>
        <button className={styles.inviteButton} onClick={onInvite}>Invite</button>
      </div>
  );
}

const BonusPage: React.FC<{ showToast: (title: string, description: string) => void }> = ({ showToast }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [referrals, setReferrals] = React.useState<Referral[]>([]);
  const [isReloading, setIsReloading] = React.useState(false);
  const [isCopying, setIsCopying] = React.useState(false);
  const [isInvitePressed, setIsInvitePressed] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isTelegram, setIsTelegram] = React.useState(false);

  // Проверяем, что мы в Telegram Mini App
  React.useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      setIsTelegram(true);
    }
  }, []);

  const handlePromoApply = () => {
    showToast('Promocode error', 'Promocode is not found!');
  };

  const fetchReferrals = async () => {
    setIsReloading(true);
    try {
      const res = await getReferrals(BOT_ID, USER_ID);
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setReferrals(data as Referral[]);
      // Получаем актуальный баланс с сервера:
      try {
        const balanceRes = await getRateWithBalance(BOT_ID, USER_ID);
        dispatch(setBalance(balanceRes.data.balance));
      } catch (e) {}
    } catch (e) {
      console.log('Ошибка при получении рефералов:', e);
    }
    setIsReloading(false);
  };

  React.useEffect(() => {
    fetchReferrals();
  }, []);

  const handleCopyInvite = async () => {
    setIsCopying(true);
    try {
      const res = await getReferralUrl(BOT_ID, USER_ID);
      const link = res.data?.referralLink;
      if (link) {
        await navigator.clipboard.writeText(link);
      }
    } catch (e) {
      console.log('Ошибка при получении ссылки');
    }
    setTimeout(() => setIsCopying(false), 400);
  };

  // Функция для обработки клика по кнопке "Поделиться"
  const handleShare = async () => {
    try {
      const res = await getReferralUrl(BOT_ID, USER_ID);
      const shareUrl = res.data?.referralLink || window.location.href;
      const shareText = '';

      console.log('isTelegram:', isTelegram);
      console.log('window.Telegram:', window.Telegram);
      console.log('window.Telegram.WebApp:', window.Telegram?.WebApp);

      if (isTelegram && window.Telegram?.WebApp && typeof window.Telegram.WebApp.openTelegramLink === 'function') {
        const tgLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        console.log('Opening Telegram link:', tgLink);
        window.Telegram.WebApp.openTelegramLink(tgLink);
        setMessage('Меню шаринга открыто!');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setMessage('Ссылка скопирована в буфер обмена!');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage('Ошибка при копировании или отправке ссылки.');
    }
  };

  // handleInviteClick теперь вызывает handleShare если isTelegram, иначе handleCopyInvite
  const handleInviteClick = () => {
    setIsInvitePressed(true);
    setTimeout(() => setIsInvitePressed(false), 300);
    if (isTelegram) {
      handleShare();
    } else {
      handleCopyInvite();
    }
  };

  const openTelegramChannel = () => {
    const channelUrl = 'https://t.me/test_tik_tok1_bot_channel';
    if (isTelegram && window.Telegram?.WebApp && typeof window.Telegram.WebApp.openTelegramLink === 'function') {
      window.Telegram.WebApp.openTelegramLink(channelUrl);
    } else {
      window.open(channelUrl, '_blank');
    }
  };

  return (
    <div className={styles.bonusContainer}>
      <div className={styles.bonusHeader}>
        <div className={styles.bonusHeaderRow}>
          <div className={styles.bonusLine}></div>
          <img
            src={require('../assets/BonusSocialIcons.svg').default}
            alt="Social icons"
            className={styles.bonusSocialIcons}
          />
          <div className={styles.bonusLine}></div>
        </div>
        <div className={styles.bonusTitle} style={{ textAlign: 'center' }}>
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeTrack}>
              <span className={styles.marqueeText}>
                REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS
              </span>
              <span className={styles.marqueeText}>
                REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS REFERAL SYSTEM BONUS
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bonusContent} style={{ backgroundImage: `url(${require('../assets/BonusBlueBackground.png')})` }}>
        <div className={styles.bonusTopRow}>
          <div className={styles.bonusCupBg}>
            <img src={require('../assets/BonusPrizeIcon.svg').default} alt="Cup" className={styles.bonusCupIcon} />
          </div>
          <div className={styles.bonusTextBlock}>
            <div className={styles.bonusLabel}>Secret bonus</div>
            <div className={styles.bonusActivated}>Activated codes: 0</div>
          </div>
          <button className={styles.bonusSubscribeBtn} onClick={openTelegramChannel}>
            <span className={styles.bonusSubscribeText}>Subscribe to the channel</span>
            <img src={require('../assets/BonusTgIcon.svg').default} alt="Telegram" className={styles.bonusTgIcon} />
          </button>
        </div>
        <div className={styles.bonusNewsText}>
          Follow the news in the channel and get bonuses to your balance
        </div>
        <div className={styles.bonusPromoBlock}>
          <input
            className={styles.bonusPromoInput}
            type="text"
            placeholder="Promo code | ..."
            value={promoCode}
            onChange={e => setPromoCode(e.target.value.toUpperCase())}
          />
          <img
            src={require('../assets/BonusApplyIcon.svg').default}
            alt="Apply"
            className={styles.bonusPromoIcon}
            style={{ cursor: 'pointer' }}
            onClick={handlePromoApply}
          />
        </div>
      </div>
      {/* Friends List Block */}
      <div className={styles.friendsListBlock}>
        <div className={styles.friendsListHeaderRow}>
          <div className={styles.friendsListIconBg}>
            <img src={require('../assets/BonusFriendsIcon.svg').default} alt="Friends" className={styles.friendsListIcon} />
          </div>
          <div className={styles.friendsListTextBlock}>
            <div className={styles.friendsListTitle}>Friends list</div>
            <div className={styles.friendsListSubtitle}>Invited friends: {referrals.length}</div>
          </div>
          <button className={styles.friendsReloadBtn} onClick={fetchReferrals}>
            <span className={styles.friendsReloadBtnBg}>
              <img
                src={require('../assets/BonusReloadIcon.svg').default}
                alt="Reload"
                className={styles.friendsReloadIcon + (isReloading ? ' ' + styles.friendsReloadIconActive : '')}
              />
            </span>
          </button>
          <button className={styles.copyInviteBtn} onClick={handleCopyInvite}>
            <span className={styles.copyInviteText}>Copy invitation link</span>
            <span className={styles.copyInviteIconBg}>
              <img
                src={require('../assets/BonusCopyIcon.svg').default}
                alt="Copy"
                className={styles.copyInviteIcon + (isCopying ? ' ' + styles.copyInviteIconActive : '')}
              />
            </span>
          </button>
        </div>
        <div className={styles.friendsListInfoText}>
          <span className={styles.friendsListInfoTextBold}>Invite your friends</span>
          <span className={styles.friendsListInfoTextNormal}> and start earning! Share your link or send a direct invitation —</span>
          <span className={styles.friendsListInfoTextBold}> get $100</span>
          <span className={styles.friendsListInfoTextNormal}> for each friend you bring. Start earning today!</span>
        </div>
      </div>
      {referrals.length === 0 ? (
          <div className={styles.bonusFriendsList}>
            <div className={styles.bonusEmptyList}>
              <BonusBigFriendsIcon className={styles.bonusBigFriendsIcon}/>
              <div className={styles.bonusEmptyTitle}>Invite friends to receive a bonus</div>
              <div className={styles.bonusEmptyDesc}>All invited friends will appear in this list</div>
            </div>
            <button
              className={styles.bonusInviteBtn + (isInvitePressed ? ' ' + styles.bonusInviteBtnActive : '')}
              onClick={handleInviteClick}
            >
              <span className={styles.bonusInviteText}>Invite</span>
            </button>
          </div>
      ) : (
          <InviteList refs={referrals} onInvite={handleInviteClick}/>
      )}
    </div>
  );
};

export default BonusPage; 