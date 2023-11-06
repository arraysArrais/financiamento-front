import { useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconFingerprint,
    IconCalendarStats,
    IconUser,
    IconSettings,
    IconLogout,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import classes from './NavbarMinimal.module.css';
import { useNavigate } from 'react-router-dom';

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconHome2, label: 'Home' , link: '/'},
    //{ icon: IconGauge, label: 'Dashboard' },
    { icon: IconDeviceDesktopAnalytics, label: 'Financiamentos', link: '/financiamentos' },
    { icon: IconCalendarStats, label: 'Releases', link: '/financiamentos' },
    { icon: IconUser, label: 'Account', link: '/financiamentos' },
    { icon: IconFingerprint, label: 'Security', link: '/financiamentos' },
    { icon: IconSettings, label: 'Settings', link: '/financiamentos' },
];

export const SimpleNavbar = () => {
    const [active, setActive] = useState(2);
    const navigate = useNavigate();
    const links = mockdata.map((e, index) => (
        <NavbarLink
            {...e}
            key={e.label}
            active={index === active}
            onClick={() => {
                setActive(index)
                navigate(e.link)
            }}
        />
    ));

    return (
        <nav className={classes.navbar}>
  {/*           <Center>
                <MantineLogo type="mark" size={30} />
            </Center> */}

            <div className={classes.navbarMain}>
                <Stack justify="center" gap={0}>
                    {links}
                </Stack>
            </div>
                <Stack justify="center" gap={0}>
                    <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
                    <NavbarLink icon={IconLogout} label="Logout" />
                </Stack>
        </nav>
    );
}

