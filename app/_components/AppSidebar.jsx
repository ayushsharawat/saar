import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Compass, GalleryHorizontalEnd, LogIn, Search } from 'lucide-react'
import Link from 'next/link'

function AppSidebar() {
    return (
        <Sidebar className='bg-accent'>
            <SidebarHeader className='bg-accent flex items-centre py-5'>
                <Image src={'/logo.png'} alt="Saar AI Logo" width={250} height={50} />
            </SidebarHeader>
            <SidebarContent className='bg-accent'>
                <SidebarGroup>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

export default AppSidebar