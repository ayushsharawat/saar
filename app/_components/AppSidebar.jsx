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
    const { user } =  useUser();
    return (
        <Sidebar className='bg-accent'>
            <SidebarHeader className='bg-accent flex items-centre py-5'>
                <Image src={'/logo.png'} alt="Saar AI Logo" width={250} height={50} />
            </SidebarHeader>
            <SidebarContent className='bg-accent'>
                <SidebarGroup>
                    <SidebarContent>
                        <SidebarMenu>
                            {MenuOptions.map((menu, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild
                                        className={`p-5 py-6 hover:font-bold
                                        ${path?.includes(menu.path) && 'font-bold'}`}>
                                        <Link href={menu.path} className={''}>
                                            <menu.icon className={'h-8 w-8 hover:font-bold'} />
                                            <span className={'text-lg'}>{menu.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            
                            {!user && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild
                                        className={`p-5 py-6 hover:font-bold
                                        ${path?.includes('/sign-in') && 'font-bold'}`}>
                                        <Link href="/sign-in" className={''}>
                                            <LogIn className={'h-8 w-8 hover:font-bold'} />
                                            <span className={'text-lg'}>Sign In</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>

                        {!user? (
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
                    </SidebarContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={'bg-accent'}>
                <div className={'p-3 flex flex-col'} >
                    <h2 className={'font-bold text-gray-500'}>Try Pro</h2>
                    <p className={'text-gray-400'} >Upgrade for image Upload, smarter AI, and more Copilot.</p>
                    <Button variant={'secondary'} className={'text-gray-500 mb-3'} >Learn More</Button>
                    <UserButton className={'mt-4 mb-4'} />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar