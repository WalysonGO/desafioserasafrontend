"use client";

import { SessionProvider } from "next-auth/react";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import "./globals.css";
import { Notifications } from "@mantine/notifications";
const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head>
                <title>Gestão de Dívidas Pessoais</title>
                <ColorSchemeScript />
            </head>
            <body>
                <SessionProvider>
                    <QueryClientProvider client={queryClient}>
                        <MantineProvider forceColorScheme={"light"}>
                            <Notifications />
                            {children}
                        </MantineProvider>
                    </QueryClientProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
