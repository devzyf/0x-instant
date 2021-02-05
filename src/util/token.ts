import { BigNumber, InsufficientAssetLiquidityError, SwapQuoterError } from '@0x/asset-swapper';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as _ from 'lodash';

import {  BIG_NUMBER_ZERO, DEFAULT_UNKOWN_ASSET_NAME } from '../constants';

import {  TokenInfo } from '../types';

export const tokenUtils = {
    bestNameForToken: (token?: TokenInfo, defaultName: string = DEFAULT_UNKOWN_ASSET_NAME): string => {
        if (token === undefined) {
            return defaultName;
        }
        return token.symbol.toUpperCase();
    },
    formattedSymbolForToken: (token?: TokenInfo, defaultName: string = '???'): string => {
        if (token === undefined) {
            return defaultName;
        }
        const symbol = token.symbol;
        if (symbol.length <= 5) {
            return symbol;
        }
        return `${symbol.slice(0, 3)}…`;
    },
    swapQuoterErrorMessage: (token: TokenInfo, error: Error): string | undefined => {
        if (error.message === SwapQuoterError.InsufficientAssetLiquidity) {
            const tokenName = tokenUtils.bestNameForToken(token, 'of this token');
            if (
                error instanceof InsufficientAssetLiquidityError &&
                error.amountAvailableToFill.isGreaterThan(BIG_NUMBER_ZERO)
            ) {
                const unitAmountAvailableToFill = Web3Wrapper.toUnitAmount(error.amountAvailableToFill, token.decimals)
                      
                const roundedUnitAmountAvailableToFill = unitAmountAvailableToFill.decimalPlaces(
                    2,
                    BigNumber.ROUND_DOWN,
                );

                if (roundedUnitAmountAvailableToFill.isGreaterThan(BIG_NUMBER_ZERO)) {
                    return `There are only ${roundedUnitAmountAvailableToFill} ${tokenName} available to buy`;
                }
            }

            return `Not enough ${tokenName} available`;
        } else if (
            error.message === SwapQuoterError.StandardRelayerApiError ||
            error.message.startsWith(SwapQuoterError.AssetUnavailable)
        ) {
            const tokenName = tokenUtils.bestNameForToken(token, 'This token');
            return `${tokenName} is currently unavailable`;
        }

        return undefined;
    },
};