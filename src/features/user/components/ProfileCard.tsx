import type { User } from '../types/user.types'

interface ProfileCardProps {
  user: User
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return <div>{user.name}</div>
}
