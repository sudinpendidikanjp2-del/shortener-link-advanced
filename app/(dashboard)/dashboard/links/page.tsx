'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateLinkDialog } from '@/components/dashboard/create-link-dialog'
import { LinksTable } from '@/components/dashboard/links-table'
import { Search, ArrowUpDown } from 'lucide-react'
import type { Link } from '@/lib/types'

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchLinks = useCallback(async () => {
    setIsLoading(true)
    const params = new URLSearchParams({
      search,
      sortBy,
      sortOrder,
      status,
      page: page.toString(),
      limit: '10',
    })

    try {
      const res = await fetch(`/api/links?${params}`)
      const data = await res.json()
      setLinks(data.links || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalCount(data.pagination?.totalCount || 0)
    } catch (error) {
      console.error('Failed to fetch links:', error)
    }
    setIsLoading(false)
  }, [search, sortBy, sortOrder, status, page])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  useEffect(() => {
    setPage(1)
  }, [search, status])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Links</h1>
          <p className="text-muted-foreground">Manage all your short links</p>
        </div>
        <CreateLinkDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by slug or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Created</SelectItem>
              <SelectItem value="click_count">Clicks</SelectItem>
              <SelectItem value="slug">Slug</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={toggleSortOrder}>
            <ArrowUpDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      <LinksTable
        links={links}
        isLoading={isLoading}
        onRefresh={fetchLinks}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  )
}
