import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LinkOff } from 'lucide-react'
import Link from 'next/link'

export default function LinkDisabledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <LinkOff className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle>Link Disabled</CardTitle>
          <CardDescription>
            This link has been disabled by the owner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
