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
    },
    {
        name: 'Sign In',
        icon: LogIn,
        path: '#'
    }

]

function AppSidebar() {
    const path=usePathname();
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
                                        <a href={menu.path} className={''}>
                                            <menu.icon className={'h-8 w-8 hover:font-bold'} />
                                            <span className={'text-lg'}>{menu.name}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        <Button className={'rounded-full mx-5 mt-4'}>Sign Up</Button>
                    </SidebarContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={'bg-accent'}>
                <div className={'p-3'} >
                    <h2 className={'font-bold text-gray-500'}>Try Pro</h2>
                    <p className={'text-gray-400'} >Upgrade for image Upload, smarter AI, and more Copilot.</p>
                    <Button variant={'secondary'} className={'text-gray-500'} >Learn More</Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar