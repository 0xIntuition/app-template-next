import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, HelpCircleIcon } from 'lucide-react'
import { Session } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useWalletClient } from 'wagmi'
import { z } from 'zod'

import { newDIDSessionFromWalletClient } from '@/lib/ceramic'
import { checkAPIKey, checkDIDSessionParseable } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Copy } from '@/components/Copy'

import useRefinement from '@/hooks/useRefinement'
import { Label } from '@/components/ui/label'

const accountFormSchema = z.object({
  serializedDidSession: z.string({
    required_error: 'A Serialized DID Session string is required.',
  }),
  apikey: z.string({
    required_error: 'An API Key is required.',
  }),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>

export type AuthenticateCardProps = {}

export default function AuthenticateCard({}: AuthenticateCardProps) {
  const { data: session } = useSession()
  const { data: walletClient } = useWalletClient()

  const defaultSession = useMemo(() => {
    let serializedDidSession, apikey
    if (session) {
      const customSession = session as Session & {
        didSession: string
        apikey: string
      }
      if (customSession.didSession) {
        serializedDidSession = customSession.didSession
      }
      if (customSession.apikey) {
        apikey = customSession.apikey
      }
    }
    return { serializedDidSession, apikey }
  }, [session])

  const defaultValues: Partial<AccountFormValues> = {}
  const validDIDSession = useRefinement(checkDIDSessionParseable(), {
    debounce: 500,
  })
  const validAPIKey = useRefinement(checkAPIKey(), {
    debounce: 200,
  })
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(
      accountFormSchema
        .refine(validDIDSession, {
          message: 'DID Session is not parseable.',
          path: ['serializedDidSession'],
        })
        .refine(validAPIKey, {
          message: 'API Key is not valid.',
          path: ['apikey'],
        }),
    ),
    mode: 'all',
    defaultValues,
  })
  const didSessionString = form.watch('serializedDidSession')
  const apikeyString = form.watch('apikey')

  useEffect(() => {
    async function fetchAPIKey() {
      const body = {
        didSession: didSessionString.replace('Bearer ', ''),
      }
      try {
        const response = await fetch('/api/apikey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        const { apikey: key } = await response.json()
        if (key !== apikeyString && key) {
          form.setValue('apikey', key, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      } catch (e) {
        console.error(e)
      }
    }

    if (
      form.getFieldState('serializedDidSession')?.isDirty &&
      didSessionString
    ) {
      fetchAPIKey()
    }
  }, [apikeyString, didSessionString, form])

  useEffect(() => {
    if (defaultSession.serializedDidSession && defaultSession.apikey) {
      form.setValue(
        'serializedDidSession',
        `Bearer ${defaultSession.serializedDidSession}`,
        {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        },
      )
      form.setValue('apikey', defaultSession.apikey, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }, [defaultSession, form])

  async function signMessage() {
    try {
      const didSesh = await newDIDSessionFromWalletClient({
        account: walletClient?.account!,
        signMessage: walletClient?.signMessage!,
      })
      form.setValue('serializedDidSession', `Bearer ${didSesh.serialize()}`, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      })
    } catch (e) {
      window.alert(e)
    }
  }

  function onSubmit(data: AccountFormValues) {
    const cleanedUpDidSession = data.serializedDidSession.replace('Bearer ', '')
    signIn('credentials', {
      didSession: cleanedUpDidSession,
      apikey: data.apikey,
      wallet: walletClient?.account.address,
      redirect: true,
      callbackUrl: '/',
    })
  }

  return (
    <div>
      <Card className="pt-4 pb-8 px-6 max-w-xs bg-gray-900">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="serializedDidSession"
              render={({ field }) => (
                <FormItem onChange={validDIDSession.invalidate}>
                  <FormLabel className="text-foreground">
                    authorization
                  </FormLabel>
                  <Button
                    data-hidden={!!didSessionString}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={signMessage}
                    className="block data-[hidden=true]:hidden w-full"
                  >
                    Authenticate DID Session
                  </Button>
                  <FormControl>
                    <Input
                      data-hidden={!didSessionString}
                      readOnly={!!didSessionString}
                      placeholder="Your Serialized DID Session String"
                      {...field}
                      className={`${!didSessionString && 'hidden'}`}
                      endAdornment={
                        didSessionString && (
                          <>
                            <CheckCircle2
                              className="w-4 h-4 fill-success-600"
                              color="black"
                            />
                          </>
                        )
                      }
                      startAdornment={
                        <>
                          <div className="mx-1">
                            <Copy text={didSessionString} className="py-1" />
                          </div>
                        </>
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    {!form.formState.errors.serializedDidSession &&
                      'Your DID Session is used to verify your identity for data creation and attestations.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apikey"
              render={({ field, fieldState }) => (
                <FormItem onChange={validAPIKey.invalidate}>
                  <FormLabel className="text-foreground">x-api-key</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        !didSessionString &&
                        !form.formState.errors.serializedDidSession
                      }
                      endAdornment={
                        !apikeyString || fieldState.error ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircleIcon className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-background text-foreground">
                                <p>Your API Key is in your welcome email.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <>
                            <CheckCircle2
                              className="w-4 h-4 fill-success-600"
                              color="black"
                            />
                          </>
                        )
                      }
                      startAdornment={
                        !apikeyString || fieldState.error ? null : (
                          <>
                            <div className="mx-1">
                              <Copy text={didSessionString} className="py-1" />
                            </div>
                          </>
                        )
                      }
                      placeholder="00000000-0000-0000-0000-000000000000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    {!form.formState.errors.apikey &&
                      'Your key is in your welcome email.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.isValid && (
              <div className="flex flex-col gap-4 items-start">
                <Label className="text-gray-600">Sign in with next-auth</Label>
                <Button
                  type="submit"
                  className="w-fit"
                  variant="outline"
                  size="sm"
                >
                  Sign In
                </Button>
              </div>
            )}
          </form>
        </Form>
      </Card>
    </div>
  )
}
