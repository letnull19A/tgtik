import React from 'react';
import styles from './BonusPage.module.css';
import { ReactComponent as BonusBigFriendsIcon } from '../assets/BonusBigFriendsIcon.svg';
import { getReferralUrlCurrent, getReferralsCurrent, getRateWithBalanceCurrent } from '../api/api';
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

const InviteList: React.FC<{refs: Referral[], onInvite: () => void, translations: any}> = ({refs, onInvite, translations}) =>  {
  return (
      <div className={styles.container}>
        <div className={styles.list}>
          {refs.map((ref) => (
              <div className={styles.item} key={ref.referredId}>
                <img src={'https://placehold.co/40x40'} alt="avatar" className={styles.avatar} />
                <div className={styles.text}>
                  <div className={styles.username}>{ref.username}</div>
                  <div className={styles.bonus}>+{translations.currency}{ref.bonus} {translations.bonus || 'bonus'}</div>
                </div>
              </div>
          ))}
        </div>
        <button className={styles.inviteButton} onClick={onInvite}>{translations.invite}</button>
      </div>
  );
}

const BonusPage: React.FC<{ showToast: (title: string, description: string) => void, translations: any }> = ({ showToast, translations }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [referrals, setReferrals] = React.useState<Referral[]>([]);
  const [isReloading, setIsReloading] = React.useState(false);
  const [isCopying, setIsCopying] = React.useState(false);
  const [isInvitePressed, setIsInvitePressed] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isTelegram, setIsTelegram] = React.useState(false);
  const channelUrl = useSelector((state: RootState) => state.channel.inviteLink);

  // Проверяем, что мы в Telegram Mini App
  React.useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      setIsTelegram(true);
    }
  }, []);

  const handlePromoApply = () => {
    showToast(translations.promocodeError, translations.promocodeNotFound);
  };

  const fetchReferrals = async () => {
    setIsReloading(true);
    try {
      const res = await getReferralsCurrent();
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setReferrals(data as Referral[]);
      // Получаем актуальный баланс с сервера:
      try {
        const balanceRes = await getRateWithBalanceCurrent();
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
      const res = await getReferralUrlCurrent();
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
      const res = await getReferralUrlCurrent();
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
    if (!channelUrl) return;
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
              <span className={styles.marqueeText}>{translations.referralSystemBonus}</span>
              <span className={styles.marqueeText}>{translations.referralSystemBonus}</span>
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
            <div className={styles.bonusLabel}>{translations.secretBonus}</div>
            <div className={styles.bonusActivated}>{translations.activatedCodes.replace('{count}', '0')}</div>
          </div>
          <button className={styles.bonusSubscribeBtn} onClick={openTelegramChannel}>
            <span className={styles.bonusSubscribeText}>{translations.subscribeToChannel}</span>
            <img src={require('../assets/BonusTgIcon.svg').default} alt="Telegram" className={styles.bonusTgIcon} />
          </button>
        </div>
        <div className={styles.bonusNewsText}>{translations.followNews}</div>
        <div className={styles.bonusPromoBlock}>
          <input
            className={styles.bonusPromoInput}
            type="text"
            placeholder={translations.promocode}
            value={promoCode}
            onChange={e => setPromoCode(e.target.value.toUpperCase())}
          />
          <img
            src={require('../assets/BonusApplyIcon.svg').default}
            alt={translations.apply || 'Apply'}
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
            <div className={styles.friendsListTitle}>{translations.friendsList}</div>
            <div className={styles.friendsListSubtitle}>{translations.invitedFriends.replace('{count}', referrals.length.toString())}</div>
          </div>
          <button className={styles.friendsReloadBtn} onClick={fetchReferrals}>
            <span className={styles.friendsReloadBtnBg}>
              <img
                src={require('../assets/BonusReloadIcon.svg').default}
                alt={translations.reload}
                className={styles.friendsReloadIcon + (isReloading ? ' ' + styles.friendsReloadIconActive : '')}
              />
            </span>
          </button>
          <button className={styles.copyInviteBtn} onClick={handleCopyInvite}>
            <span className={styles.copyInviteText}>{translations.copyInvitationLink}</span>
            <span className={styles.copyInviteIconBg}>
              <img
                src={require('../assets/BonusCopyIcon.svg').default}
                alt={translations.copy}
                className={styles.copyInviteIcon + (isCopying ? ' ' + styles.copyInviteIconActive : '')}
              />
            </span>
          </button>
        </div>
        <div className={styles.friendsListInfoText}>
          <span className={styles.friendsListInfoTextBold}>{translations.inviteFriendsEarn.split('!')[0]}!</span>
          <span className={styles.friendsListInfoTextNormal}>{translations.inviteFriendsEarn.split('!')[1]}</span>
        </div>
      </div>
      {referrals.length === 0 ? (
          <div className={styles.bonusFriendsList}>
            <div className={styles.bonusEmptyList}>
              <BonusBigFriendsIcon className={styles.bonusBigFriendsIcon}/>
              <div className={styles.bonusEmptyTitle}>{translations.inviteFriendsBonus}</div>
              <div className={styles.bonusEmptyDesc}>{translations.invitedFriendsAppear}</div>
            </div>
            <button
              className={styles.bonusInviteBtn + (isInvitePressed ? ' ' + styles.bonusInviteBtnActive : '')}
              onClick={handleInviteClick}
            >
              <span className={styles.bonusInviteText}>{translations.invite}</span>
            </button>
          </div>
      ) : (
        <InviteList refs={referrals} onInvite={handleInviteClick} translations={translations}/>
      )}
    </div>
  );
};

export default BonusPage; 