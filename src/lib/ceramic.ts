import { randomBytes } from 'crypto'
import type { RuntimeCompositeDefinition } from '@composedb/types'
import { Cacao, SiweMessage } from '@didtools/cacao'
import { createDIDKey, DIDSession } from 'did-session'
import { polygonMumbai } from 'wagmi/chains'

// Export this from the client package
export const definition: RuntimeCompositeDefinition = {
  models: {
    AtomCreation: {
      id: 'kjzl6hvfrbw6cb28t1477pp3w1w1lrogvitkksqra4mj6tak7wmcalwihlk1rrk',
      accountRelation: { type: 'list' },
    },
    TripleCreation: {
      id: 'kjzl6hvfrbw6c91e0ehhg566qp6siivajonwqfxwpk5rzt5irug1dq0s4eu4ejk',
      accountRelation: { type: 'list' },
    },
    AtomMetadata: {
      id: 'kjzl6hvfrbw6c6wg0a5ale41scvzjw8e3t6gf6w8j9a192eijp7r68phuais9de',
      accountRelation: { type: 'list' },
    },
  },
  objects: {
    AtomCreation: {
      atomID: { type: 'string', required: true },
      creator: { type: 'string', required: true },
      vaultID: { type: 'string', required: true },
      atomIDHash: { type: 'string', required: true },
      atomWallet: { type: 'string', required: true },
    },
    TripleCreation: {
      object: { type: 'string', required: true },
      creator: { type: 'string', required: true },
      subject: { type: 'string', required: true },
      vaultID: { type: 'string', required: true },
      predicate: { type: 'string', required: true },
      tripleHash: { type: 'string', required: true },
    },
    AtomMetadataImageMetadata: {
      src: { type: 'string', required: true },
      size: { type: 'integer', required: false },
      width: { type: 'integer', required: true },
      height: { type: 'integer', required: true },
      mimeType: { type: 'string', required: true },
    },
    AtomMetadataImageSources: {
      original: {
        type: 'reference',
        refType: 'object',
        refName: 'AtomMetadataImageMetadata',
        required: true,
      },
      alternatives: {
        type: 'list',
        required: false,
        item: {
          type: 'reference',
          refType: 'object',
          refName: 'AtomMetadataImageMetadata',
          required: false,
        },
      },
    },
    AtomMetadata: {
      image: {
        type: 'reference',
        refType: 'object',
        refName: 'AtomMetadataImageSources',
        required: false,
      },
      atomID: { type: 'string', required: false },
      semantic: { type: 'string', required: false },
      corporaID: { type: 'string', required: false },
      description: { type: 'string', required: true },
      displayName: { type: 'string', required: true },
      thumbnailImage: { type: 'string', required: false },
      tripleCreation: { type: 'string', required: false },
      externalReference: { type: 'string', required: false },
    },
  },
  enums: {},
  accountData: {
    atomCreationList: { type: 'connection', name: 'AtomCreation' },
    tripleCreationList: { type: 'connection', name: 'TripleCreation' },
    atomMetadataList: { type: 'connection', name: 'AtomMetadata' },
  },
}

//TODO: Export this to client package
export async function newDIDSessionFromWalletClient(walletClient: {
  account: { address: string }
  signMessage: (message: { message: string }) => Promise<string>
}) {
  if (!walletClient.account.address) throw new Error('No wallet client')
  // keys
  const keySeed = randomBytes(32)
  const didKey = await createDIDKey(keySeed)

  const base = new SiweMessage({
    version: '0.0.1',
    domain: 'intuition.systems',
    statement: 'I authorize my DID to be used by intuition.systems',
    issuedAt: new Date().toISOString(),
    resources: Object.entries(definition.models).map(
      ([_, v]) => `ceramic://*?model=${v.id}`,
    ),
  })
  const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // expire in 1 week

  // sign message
  const message = new SiweMessage({
    ...base,
    address: walletClient.account.address as string,
    chainId: polygonMumbai.id.toString(),
    expirationTime: expiration.toISOString(),
    uri: didKey.id,
  })
  const signature = await walletClient?.signMessage({
    message: message.signMessage(),
  })
  message.signature = signature
  const cacao = Cacao.fromSiweMessage(message)
  const did = await DIDSession.initDID(didKey, cacao)
  return new DIDSession({ did, cacao, keySeed })
}
