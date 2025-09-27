"use client"
import { store } from '@/redux/store';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux';

export default function ProvidersContainer({children}:{children: ReactNode;}) {
  return (
    <SessionProvider>
      <Provider store={store} >
        {children}
    </Provider>
    </SessionProvider>
    
  )
}
