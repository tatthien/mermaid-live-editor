interface ISidebarProps {
  children: JSX.Element
}

export default function Sidebar({ children }: ISidebarProps) {
  return (
    <div className='relative border-r'>
      <div>{children}</div>
    </div>
  )
}
