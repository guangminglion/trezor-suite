import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from '@suite-constants/routes';

import ErrorPage from '@suite-views/error';
import Index from '@dashboard-views';
import Notification from '@suite-views/notifications';
import Passwords from '@passwords-views';
import Portfolio from '@portfolio-views';

import Wallet from '@wallet-views/transactions';
import WalletReceive from '@wallet-views/receive';
import WalletDetails from '@wallet-views/details';
import WalletSend from '@wallet-views/send';
import WalletSignVerify from '@wallet-views/sign-verify';

import WalletCoinmarketBuy from '@wallet-views/coinmarket/buy';
import WalletCoinmarketBuyDetail from '@wallet-views/coinmarket/buy/detail';
import WalletCoinmarketBuyOffers from '@wallet-views/coinmarket/buy/offers';
import WalletCoinmarketExchange from '@wallet-views/coinmarket/exchange';
import WalletCoinmarketExchangeDetail from '@wallet-views/coinmarket/exchange/detail';
import WalletCoinmarketExchangeOffers from '@wallet-views/coinmarket/exchange/offers';
import WalletCoinmarketSpend from '@wallet-views/coinmarket/spend';
import WalletCoinmarketRedirect from '@wallet-views/coinmarket/redirect';

import Settings from '@settings-views';
import SettingsCoins from '@settings-views/coins';
import SettingsDebug from '@settings-views/debug';
import SettingsDevice from '@settings-views/device';

const components: { [key: string]: any } = {
    'suite-index': Index,
    'notifications-index': Notification,
    'passwords-index': Passwords,
    'portfolio-index': Portfolio,

    'wallet-index': Wallet,
    'wallet-receive': WalletReceive,
    'wallet-details': WalletDetails,
    'wallet-send': WalletSend,
    'wallet-sign-verify': WalletSignVerify,

    'wallet-coinmarket-buy': WalletCoinmarketBuy,
    'wallet-coinmarket-buy-detail': WalletCoinmarketBuyDetail,
    'wallet-coinmarket-buy-offers': WalletCoinmarketBuyOffers,
    'wallet-coinmarket-exchange': WalletCoinmarketExchange,
    'wallet-coinmarket-exchange-detail': WalletCoinmarketExchangeDetail,
    'wallet-coinmarket-exchange-offers': WalletCoinmarketExchangeOffers,
    'wallet-coinmarket-spend': WalletCoinmarketSpend,
    'wallet-coinmarket-redirect': WalletCoinmarketRedirect,

    'settings-index': Settings,
    'settings-coins': SettingsCoins,
    'settings-debug': SettingsDebug,
    'settings-device': SettingsDevice,
};

const AppRouter = () => (
    <Switch>
        {routes.map(route => (
            <Route
                key={route.name}
                path={process.env.assetPrefix + route.pattern}
                exact={route.exact}
                component={components[route.name]}
            />
        ))}
        {/* 404 */}
        <Route path="*" component={ErrorPage} />
    </Switch>
);

export default memo(AppRouter);
