import React, { useState } from 'react'
import { SignInForm } from '../components/Auth/SignInForm'
import { SignUpForm } from '../components/Auth/SignUpForm'

export function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignIn ? 'Accedi al tuo account' : 'Crea il tuo account'}
          </h2>
          <p className="text-gray-600">
            {isSignIn 
              ? 'Inserisci le tue credenziali per accedere' 
              : 'Compila il modulo per registrarti'
            }
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSignIn ? <SignInForm /> : <SignUpForm />}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Oppure</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                {isSignIn 
                  ? 'Non hai un account? Registrati' 
                  : 'Hai già un account? Accedi'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
