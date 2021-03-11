import { AssetProxyId } from '@0x/types';
import * as React from 'react';

import PoweredByLogo from '../assets/powered_by_0x.svg';
import { ZERO_EX_SITE_URL } from '../constants';
import { AvailableERC20TokenSelector } from '../containers/available_erc20_token_selector';
import { ConnectedSwapOrderProgressOrPaymentMethod } from '../containers/connected_swap_order_progress_or_payment_method';
import { CurrentStandardSlidingPanel } from '../containers/current_standard_sliding_panel';
import { LatestSwapQuoteOrderDetails } from '../containers/latest_swap_quote_order_details';
import { LatestError } from '../containers/latest_error';
import { SelectedTokenInstantHeading } from '../containers/selected_token_instant_heading';
import { SelectedTokenSwapOrderStateButtons } from '../containers/selected_token_swap_order_state_buttons';
import { ColorOption } from '../style/theme';
import { zIndex } from '../style/z_index';
import { SlideAnimationState, TokenInfo } from '../types';
import { analytics, TokenSelectorClosedVia } from '../util/analytics';

import { CSSReset } from './css_reset';
import { SlidingPanel } from './sliding_panel';
import { Container } from './ui/container';
import { Flex } from './ui/flex';

export interface ZeroExInstantContainerProps {}
export interface ZeroExInstantContainerState {
    tokenSelectionPanelAnimationState: SlideAnimationState;
    isIn: boolean;
}

export class ZeroExInstantContainer extends React.PureComponent<
    ZeroExInstantContainerProps,
    ZeroExInstantContainerState
> {
    public state = {
        tokenSelectionPanelAnimationState: 'none' as SlideAnimationState,
        isIn: false,
    };
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <CSSReset />
                <Container
                    width={{ default: '350px', sm: '100%' }}
                    height={{ default: 'auto', sm: '100%' }}
                    position="relative"
                >
                    <Container position="relative">
                        <LatestError />
                    </Container>
                    <Container
                        zIndex={zIndex.mainContainer}
                        position="relative"
                        backgroundColor={ColorOption.white}
                        borderRadius={{ default: '3px', sm: '0px' }}
                        hasBoxShadow={true}
                        overflow="hidden"
                        height="100%"
                    >
                        <Flex direction="column" justify="flex-start" height="100%">
                            {/*<ConnectedSwapOrderProgressOrPaymentMethod />*/}
                        
                            <SelectedTokenInstantHeading onSelectTokenClick={this._handleSymbolClickIn} isIn={true} />
                            <SelectedTokenInstantHeading onSelectTokenClick={this._handleSymbolClickOut} isIn={false} />
                            <ConnectedSwapOrderProgressOrPaymentMethod />
                           {/*  <LatestSwapQuoteOrderDetails />*/}
                            <Container padding="20px" width="100%">
                                <SelectedTokenSwapOrderStateButtons />
                            </Container>
                        </Flex>
                        <SlidingPanel
                            animationState={this.state.tokenSelectionPanelAnimationState}
                            onClose={this._handlePanelCloseClickedX}
                            onAnimationEnd={this._handleSlidingPanelAnimationEnd}
                        >
                            <AvailableERC20TokenSelector onTokenSelect={this._handlePanelCloseAfterChose} isIn={this.state.isIn} />
                        </SlidingPanel>
                        <CurrentStandardSlidingPanel />
                    </Container>
                    <Container
                        display={{ sm: 'none', default: 'block' }}
                        marginTop="10px"
                        marginLeft="auto"
                        marginRight="auto"
                        width="108px"
                    >
                        <a href={ZERO_EX_SITE_URL} target="_blank">
                            <PoweredByLogo />
                        </a>
                    </Container>
                </Container>
            </React.Fragment>
        );
    }
    private readonly _handleSymbolClickIn = (): void => {
        analytics.trackTokenSelectorOpened();
        this.setState({isIn: true});
        this.setState({
                tokenSelectionPanelAnimationState: 'slidIn',
        });
    };
    private readonly _handleSymbolClickOut = (): void => {
       
        analytics.trackTokenSelectorOpened();
        this.setState({isIn: false});
        this.setState({
                tokenSelectionPanelAnimationState: 'slidIn',
        });
    };

    private readonly _handlePanelCloseClickedX = (): void => {
        this._handlePanelClose(TokenSelectorClosedVia.ClickedX);
    };
    private readonly _handlePanelCloseAfterChose = (): void => {
        this._handlePanelClose(TokenSelectorClosedVia.TokenChose);
    };
    private readonly _handlePanelClose = (closedVia: TokenSelectorClosedVia): void => {
        analytics.trackTokenSelectorClosed(closedVia);
        this.setState({
            tokenSelectionPanelAnimationState: 'slidOut',
        });
    };
    private readonly _handleSlidingPanelAnimationEnd = (): void => {
        if (this.state.tokenSelectionPanelAnimationState === 'slidOut') {
            // When the slidOut animation completes, don't keep the panel mounted.
            // Performance optimization
            this.setState({ tokenSelectionPanelAnimationState: 'none' });
        }
    };
}
