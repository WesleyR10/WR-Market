'use client'

import { FcGoogle } from 'react-icons/fc'

import { signInWithGoogle } from '@/app/auth/actions'

import { BottomGradient } from './bottom-gradient'

export const SocialLoginButton = () => {
  return (
    <>
      <div>
        <button
          className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 
            rounded-md bg-white/90 px-4 font-medium text-emerald-950 
            shadow-[0px_0px_1px_1px_var(--emerald-200)] 
            transition-colors duration-200
            hover:bg-emerald-50
            dark:bg-white/80 dark:text-emerald-950 
            dark:shadow-[0px_0px_1px_1px_var(--emerald-200)]
            dark:hover:bg-emerald-50"
          type="button"
          onClick={() => signInWithGoogle()}
        >
          <FcGoogle className="h-4 w-4" />
          <span className="text-sm">Google</span>
          <BottomGradient />
        </button>
      </div>
    </>
  )
}
