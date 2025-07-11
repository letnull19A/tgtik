declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.mp4' {
    const value: string;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >;

    const src: string;
    export default src;
}

// Telegram WebApp types
declare global {
    interface Window {
        Telegram?: {
            WebApp?: {
                ready(): void;
                close(): void;
                expand(): void;
                MainButton: {
                    text: string;
                    color: string;
                    textColor: string;
                    isVisible: boolean;
                    isActive: boolean;
                    show(): void;
                    hide(): void;
                    enable(): void;
                    disable(): void;
                    showProgress(leaveActive?: boolean): void;
                    hideProgress(): void;
                    setText(text: string): void;
                    onClick(callback: () => void): void;
                    offClick(callback: () => void): void;
                };
                BackButton: {
                    isVisible: boolean;
                    show(): void;
                    hide(): void;
                    onClick(callback: () => void): void;
                    offClick(callback: () => void): void;
                };
                HapticFeedback: {
                    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
                    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
                    selectionChanged(): void;
                };
                initData: string;
                initDataUnsafe: {
                    query_id?: string;
                    user?: {
                        id: number;
                        is_bot?: boolean;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                        is_premium?: boolean;
                        added_to_attachment_menu?: boolean;
                        allows_write_to_pm?: boolean;
                        photo_url?: string;
                    };
                    receiver?: {
                        id: number;
                        is_bot?: boolean;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                        is_premium?: boolean;
                        added_to_attachment_menu?: boolean;
                        allows_write_to_pm?: boolean;
                        photo_url?: string;
                    };
                    chat?: {
                        id: number;
                        type: 'group' | 'supergroup' | 'channel';
                        title: string;
                        username?: string;
                        photo_url?: string;
                    };
                    chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
                    chat_instance?: string;
                    start_param?: string;
                    can_send_after?: number;
                    auth_date: number;
                    hash: string;
                };
                colorScheme: 'light' | 'dark';
                themeParams: {
                    bg_color?: string;
                    text_color?: string;
                    hint_color?: string;
                    link_color?: string;
                    button_color?: string;
                    button_text_color?: string;
                    secondary_bg_color?: string;
                };
                isExpanded: boolean;
                viewportHeight: number;
                viewportStableHeight: number;
                headerColor: string;
                backgroundColor: string;
                isClosingConfirmationEnabled: boolean;
                BackButton: {
                    isVisible: boolean;
                    show(): void;
                    hide(): void;
                    onClick(callback: () => void): void;
                    offClick(callback: () => void): void;
                };
                MainButton: {
                    text: string;
                    color: string;
                    textColor: string;
                    isVisible: boolean;
                    isActive: boolean;
                    show(): void;
                    hide(): void;
                    enable(): void;
                    disable(): void;
                    showProgress(leaveActive?: boolean): void;
                    hideProgress(): void;
                    setText(text: string): void;
                    onClick(callback: () => void): void;
                    offClick(callback: () => void): void;
                };
                HapticFeedback: {
                    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
                    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
                    selectionChanged(): void;
                };
                openTelegramLink(url: string): void;
                openLink(url: string, options?: { try_instant_view?: boolean }): void;
                switchInlineQuery(query: string, choose_chat_types?: string[]): void;
                sendData(data: string): void;
                close(): void;
                expand(): void;
                isClosingConfirmationEnabled: boolean;
                enableClosingConfirmation(): void;
                disableClosingConfirmation(): void;
            };
        };
    }
}