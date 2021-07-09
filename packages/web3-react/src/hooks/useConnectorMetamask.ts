import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected } from '../helpers';

type Connector = {
  connect: () => void;
};

/*
 * TODO: add onboarding
 * https://docs.metamask.io/guide/onboarding-library.html
 */

const METAMASK_URL = 'https://metamask.app.link/dapp/';

export const useConnectorMetamask = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();

  const openInWallet = useCallback(() => {
    try {
      const { host, pathname, search } = window.location;
      const pageUrlWithoutProtocol = encodeURIComponent(
        host + pathname + search,
      );
      openWindow(`${METAMASK_URL}${pageUrlWithoutProtocol}`);
    } catch (error) {
      warning(false, 'Failed to open the link');
    }
  }, []);

  const connect = useCallback(() => {
    invariant(injected, 'Connector is required');

    if (hasInjected()) {
      activate(injected);
    } else {
      openInWallet();
    }
  }, [activate, openInWallet, injected]);

  return { connect };
};
