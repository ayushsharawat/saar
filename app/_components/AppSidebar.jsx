'use client'
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Compass, GalleryHorizontalEnd, LogIn, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SignOutButton, SignUp, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

const MenuOptions = [
    {
        name: 'Home',
        icon: Search,
        path: '/'
    },
    {
        name: 'Discover',
        icon: Compass,
        path: '/discover'
    },
    {
        name: 'Library',
        icon: GalleryHorizontalEnd,
        path: '/library'
    }
]

function AppSidebar() {
    const path = usePathname();
    const { user } = useUser();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar className='bg-accent'>
            <SidebarHeader className='bg-accent flex items-center py-5 px-4'>
                {isCollapsed ? (
                    <Image src={'/logo.png'} alt="Saar AI Logo" width={40} height={40} />
                ) : (
                    <Image src={'/logoname.png'} alt="Saar AI Logo" width={250} height={50} />
                )}
            </SidebarHeader>
            <SidebarContent className='bg-accent'>
                <SidebarGroup>
                    <SidebarContent>
                        <SidebarMenu>
                            {MenuOptions.map((menu, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton 
                                        asChild
                                        isActive={path?.includes(menu.path)}
                                        tooltip={isCollapsed ? menu.name : undefined}
                                        className={`p-5 py-6 hover:font-bold transition-all duration-200
                                        ${isCollapsed ? 'justify-center' : ''}`}>
                                        <Link href={menu.path} className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                                            <menu.icon className={`h-8 w-8 hover:font-bold ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                            {!isCollapsed && <span className={'text-lg'}>{menu.name}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            
                            {!user && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        asChild
                                        isActive={path?.includes('/sign-in')}
                                        tooltip={isCollapsed ? 'Sign In' : undefined}
                                        className={`p-5 py-6 hover:font-bold transition-all duration-200
                                        ${isCollapsed ? 'justify-center' : ''}`}>
                                        <Link href="/sign-in" className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                                            <LogIn className={`h-8 w-8 hover:font-bold ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                            {!isCollapsed && <span className={'text-lg'}>Sign In</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>

                        {!isCollapsed && (
                            <>
                                {!user ? (
                                    <div className="px-5 mt-4">
                                        <Link href="/sign-up">
                                            <Button className={'rounded-full w-full'}>Sign Up</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="px-5 mt-4">
                                        <SignOutButton>
                                            <Button className={'rounded-full w-full'}>Log Out</Button>
                                        </SignOutButton>
                                    </div>
                                )}
                            </>
                        )}
                    </SidebarContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={'bg-accent'}>
                {!isCollapsed ? (
                    <div className={'p-3 flex flex-col'} >
                        <h2 className={'font-bold text-gray-500'}>Try Pro</h2>
                        <p className={'text-gray-400'} >Upgrade for image Upload, smarter AI, and more Copilot.</p>
                        <Button variant={'secondary'} className={'text-gray-500 mb-3'} >Learn More</Button>
                        <UserButton className={'mt-4 mb-4'} />
                    </div>
                ) : (
                    <div className={'p-3 flex flex-col items-center'} >
                        <UserButton className={'mt-4 mb-4'} />
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar