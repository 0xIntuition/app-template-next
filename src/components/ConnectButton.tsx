import { ConnectButton as CB } from '@rainbow-me/rainbowkit'

import { Button } from './ui/button'

export const ConnectButton = () => {
  return (
    <CB.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={openConnectModal}
                    className="text-xs"
                  >
                    Connect Wallet
                  </Button>
                )
              }
            })()}
          </div>
        )
      }}
    </CB.Custom>
  )
}
