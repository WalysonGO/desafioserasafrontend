"use client";

import { Title, Box, Button, Burger, Tooltip } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';

function Header({ 
    openedBurgerMobile, 
    openedBurgerDesktop, 
    toggleMobile, 
    toggleDesktop }: 
    { 
        openedBurgerMobile: boolean, 
        openedBurgerDesktop: boolean, 
        toggleMobile: () => void, 
        toggleDesktop: () => void
    }) {
    return (
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', flexDirection: 'row', padding: '0 20px' }}>
            <Burger color='white' opened={openedBurgerDesktop} onClick={toggleDesktop} visibleFrom="sm" />
            <Burger color='white' opened={openedBurgerMobile} onClick={toggleMobile} hiddenFrom="sm" />

            <Title order={2}>Gestão de Dívidas</Title>
            <Button
                onClick={() => {
                    signOut({ callbackUrl: '/' });
                }}
                color="white"
                variant='transparent'
            >
                <Tooltip label="Sair da conta">
                    <IconLogout size={32} />
                </Tooltip>
            </Button>
        </Box>
    );
}

export default Header;