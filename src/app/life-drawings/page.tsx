import { redirect } from 'next/navigation'

// Life Drawings is now a collection under /personal
export default function LifeDrawingsPage() {
  redirect('/personal')
}
