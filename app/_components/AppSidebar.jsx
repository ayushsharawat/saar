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

const MenuOptions = [
    {
        name: 'Home',
        icon: Search,
        path: '/'
    },
    {
        name: 'Discover',
        icon: Compass,
        href: '/'
    },
    {
        name: 'Library',
        icon: GalleryHorizontalEnd,
        href: '/'
    },
    {
        name: 'Sign In',
        icon: LogIn,
        href: '/'
    }
    
]

function AppSidebar() {
    return (
        <Sidebar className='bg-accent'>
            <SidebarHeader className='bg-accent flex items-centre py-5'>
                <Image src={'/logo.png'} alt="Saar AI Logo" width={250} height={50} />
            </SidebarHeader>
            <SidebarContent className='bg-accent'>
                <SidebarGroup />
                <SidebarContent>
                    <SidebarMenu>
                        {MenuOptions.map((menu, index) => (
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <a href={menu.path}>
                                        <menu.icon/>
                                        <span>{menu.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

export default AppSidebar