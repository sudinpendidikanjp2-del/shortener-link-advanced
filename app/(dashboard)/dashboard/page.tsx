'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link2, MousePointerClick, Clock, Shield } from 'lucide-react'
import { CreateLinkDialog } from '@/components/dashboard/create-link-dialog'
import { RecentLinksTable } from '@/components/dashboard/recent-links-table'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const { data: linksData } = useSWR('/api/links?limit=5', fetcher)
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
    protectedLinks: 0,
  })

  useEffect(() => {
    // Fetch stats
    fetch('/api/links?limit=1000')
      .then((res) => res.json())
      .then((data) => {
        const links = data.links || []
        setStats({
          totalLinks: data.pagination?.totalCount || links.length,
          totalClicks: links.reduce((sum: number, link: { click_count: number }) => sum + (link.click_count || 0), 0),
          activeLinks: links.filter((link: { is_active: boolean }) => link.is_active).length,
          protectedLinks: links.filter((link: { password_hash: string | null }) => link.password_hash).length,
        })
      })
  }, [])

  const statCards = [
    { title: 'Total Links', value: stats.totalLinks, icon: Link2, color: 'text-blue-500' },
    { title: 'Total Clicks', value: stats.totalClicks, icon: MousePointerClick, color: 'text-green-500' },
    { title: 'Active Links', value: stats.activeLinks, icon: Clock, color: 'text-amber-500' },
    { title: 'Protected Links', value: stats.protectedLinks, icon: Shield, color: 'text-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your short links</p>
        </div>
        <CreateLinkDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Links</CardTitle>
          <CardDescription>Your most recently created short links</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentLinksTable links={linksData?.links || []} />
        </CardContent>
      </Card>
    </div>
  )
}
