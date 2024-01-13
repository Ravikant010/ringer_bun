import { icons } from 'lucide-react';

interface Props   {
name: string
color?: string
size: number | 32
}
const Icon = ({ name, color, size }: Props) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} size={size} />;
};

export default Icon;