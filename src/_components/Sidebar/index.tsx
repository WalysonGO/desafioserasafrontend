"use client";

import { useState, useEffect } from 'react';
import { Box, Text } from '@mantine/core';
import Link from 'next/link';
import { IconHome, IconTipJar } from '@tabler/icons-react';

function Sidebar({currentPath, setCurrentPath}: any) {
    const navLinks = [
        { label: 'Home', path: '/dashboard', icon: IconHome },
        { label: 'Dívidas', path: '/dashboard/debt', icon: IconTipJar },
    ];

    return (
        <Box p="md">
            {navLinks.map(link => (
                <Link key={link.label}
                    onClick={() => setCurrentPath(link.path)}
                    href={link.path}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 12,
                        height: 50,
                        backgroundColor: currentPath === link.path ? '#ba005a' : 'transparent',
                        borderRadius: '8px',
                        padding: '0 12px',
                    }}
                >
                    <link.icon size={24} color={currentPath === link.path ? 'white' : 'black'} />
                    <Text style={{
                        textDecoration: 'none',
                        color: currentPath === link.path ? 'white' : 'black',
                    }}>
                            {link.label}
                    </Text>
                </Link>
            ))}
        </Box>
    );
}

export default Sidebar;