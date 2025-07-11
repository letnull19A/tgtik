import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Пример глобального state
interface AppState {
  isLoading: boolean;
  isRegistered: boolean;
}

const initialState: AppState = {
  isLoading: false,
  isRegistered: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setRegistered(state, action: PayloadAction<boolean>) {
      state.isRegistered = action.payload;
    },
  },
});

// --- Like/Dislike Timer Slice ---
export type TimerStatus = 'not_started' | 'running' | 'paused' | 'finished';

interface TimerState {
  status: TimerStatus;
  startedAt: number | null; // timestamp
  pausedAt: number | null; // timestamp
  elapsedBeforePause: number; // ms
}

const initialTimerState: TimerState = {
  status: 'not_started',
  startedAt: null,
  pausedAt: null,
  elapsedBeforePause: 0,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState: initialTimerState,
  reducers: {
    startTimer(state) {
      state.status = 'running';
      state.startedAt = Date.now();
      state.pausedAt = null;
      if (state.elapsedBeforePause === 0) {
        state.elapsedBeforePause = 0;
      }
    },
    pauseTimer(state) {
      if (state.status === 'running' && state.startedAt) {
        state.status = 'paused';
        state.pausedAt = Date.now();
        state.elapsedBeforePause += Date.now() - state.startedAt;
        state.startedAt = null;
      }
    },
    resumeTimer(state) {
      if (state.status === 'paused') {
        state.status = 'running';
        state.startedAt = Date.now();
        state.pausedAt = null;
        // elapsedBeforePause не трогаем
      }
    },
    resetTimer(state) {
      state.status = 'not_started';
      state.startedAt = null;
      state.pausedAt = null;
      state.elapsedBeforePause = 0;
    },
    finishTimer(state) {
      state.status = 'finished';
      state.pausedAt = null;
      state.startedAt = null;
      state.elapsedBeforePause = 3000;
    },
  },
});

// --- Balance Slice ---
interface BalanceState {
  value: number;
}

const initialBalanceState: BalanceState = {
  value: 0,
};

const balanceSlice = createSlice({
  name: 'balance',
  initialState: initialBalanceState,
  reducers: {
    setBalance(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
    incrementBalance(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
    decrementBalance(state, action: PayloadAction<number>) {
      state.value -= action.payload;
    },
  },
});

// --- Channel Slice ---
interface ChannelState {
  inviteLink: string;
  botLink: string;
  isLoading: boolean;
}

const initialChannelState: ChannelState = {
  inviteLink: '',
  botLink: '',
  isLoading: false,
};

const channelSlice = createSlice({
  name: 'channel',
  initialState: initialChannelState,
  reducers: {
    setChannelInviteLink(state, action: PayloadAction<string>) {
      state.inviteLink = action.payload;
    },
    setBotLink(state, action: PayloadAction<string>) {
      state.botLink = action.payload;
    },
    setChannelLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading, setRegistered } = appSlice.actions;
export const { startTimer, pauseTimer, resumeTimer, resetTimer, finishTimer } = timerSlice.actions;
export const { setBalance, incrementBalance, decrementBalance } = balanceSlice.actions;
export const { setChannelInviteLink, setChannelLoading, setBotLink } = channelSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    timer: timerSlice.reducer,
    balance: balanceSlice.reducer,
    channel: channelSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 