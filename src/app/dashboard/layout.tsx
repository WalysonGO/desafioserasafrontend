"use client";

import { AppShell } from '@mantine/core';
import Header from '../../_components/Header';
import Sidebar from '../../_components/Sidebar';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import { useDisclosure } from '@mantine/hooks';
import classes from './layout.module.css';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
interface LayoutProps {
    children: React.ReactNode;
}

function LayoutDashboard({ children }: LayoutProps) {
    const pathname = usePathname();
    const { data: session }: any = useSession();
    const [currentPath, setCurrentPath] = useState('');
    useEffect(() => {
        setCurrentPath(pathname);
    }, []);

    useEffect(() => {
        if (session?.accessToken) {
            localStorage.setItem('accessToken', session.accessToken);
        } else {
            localStorage.removeItem('accessToken');
        }  
    }, [session])

    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);

    const contentStyle = {
        display: 'flex',
        width: '100%',
    };  

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ 
                width: 300, 
                breakpoint: 'sm',
                collapsed: { mobile: mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
        >
            <AppShell.Header style={{ backgroundColor: "#ba005a", color: 'white' }}>
                <Header 
                    openedBurgerMobile={mobileOpened} 
                    openedBurgerDesktop={desktopOpened} 
                    toggleMobile={toggleMobile} 
                    toggleDesktop={toggleDesktop} />
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <AppShell.Section grow my="md" className={classes.control}>
                    <Sidebar currentPath={currentPath} setCurrentPath={setCurrentPath} />
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main style={contentStyle}>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}

export default LayoutDashboard;