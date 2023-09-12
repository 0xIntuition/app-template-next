import { DIDSession } from 'did-session'

import { AccountFormValues } from '@/app/authenticate-card'
import { RefinementCallback } from '@/hooks/useRefinement'

export function checkDIDSessionParseable(): RefinementCallback<AccountFormValues> {
  return async (data, { signal }) => {
    let timeoutRef: ReturnType<typeof setTimeout>

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutRef)
    })
    try {
      if (!data.serializedDidSession) return false
      let didSeshString = data.serializedDidSession.startsWith('Bearer ')
        ? data.serializedDidSession.replace('Bearer ', '')
        : data.serializedDidSession
      const didSession = await DIDSession.fromSession(didSeshString)
      return !!didSession
    } catch (e) {
      return false
    }
  }
}

export function checkAPIKey(): RefinementCallback<AccountFormValues> {
  return async (data, { signal }) => {
    let timeoutRef: ReturnType<typeof setTimeout>

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutRef)
    })
    try {
      const body = {
        didSession: data.serializedDidSession,
        apikey: data.apikey,
      }
      const resp = await fetch('/api/apikey/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const { success } = await resp.json()
      return success
    } catch (e) {
      return false
    }
  }
}
