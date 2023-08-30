'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader } from './ui/card'

export default function Resources() {
  return (
    <div className="grid mb-32 text-center lg:max-w-7xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-12">
      <ResourceCard title="API Client" description="Quick description of API client goes here." href="#" />
      <ResourceCard title="Docs" description="Quick description of docs client goes here." href="#" />
      <ResourceCard title="Examples" description="Quick description of examples client goes here." href="#" />
    </div>
  )
}

export type ResourceCardProps = {
  title: string
  description: string
  href: string
}
export const ResourceCard = ({ title, description, href }: ResourceCardProps) => {
  return (
    <Link href={href} target='_blank'>
      <Card className="group h-full">
        <CardHeader className="pb-0">
          <h2 className={`mb-3 text-xl font-medium text-stone-200 group-hover:text-stone-50 tracking-wider`}>{title}</h2>
        </CardHeader>
        <CardContent>
          <p className={`transition-colors duration-75 m-0 max-w-[30ch] text-sm text-stone-400 group-hover:text-stone-200 font-light`}>{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
